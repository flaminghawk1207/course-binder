import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { type NextPage } from "next";
import { Fragment, use } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Channel, CHANNEL_ROLE, User } from "~/types";
import { DEF_LAB_TEMPLATE, DEF_TEMPLATE, apiReq } from "~/utils";
import  Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";

const UsersList = ({selectedChannel}: { selectedChannel: Channel | null }) => {
    type AddUserValues = {
        name : User | null;
        channelRole: string;
    }

    const [suggestedUsers, setSuggestedUsers] = useState<User[] | null>(null);
    const [open, setOpen] = useState(false);
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
    const loading = open && suggestedUsers === null;
    const [channelUsers, setChannelUsers] = useState<User[]>([]);
    const [channelUsersRoles, setChannelUsersRoles] = useState<CHANNEL_ROLE[]>([]);
    
    const {
        register,
        setValue,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<AddUserValues>({
        defaultValues: {
            name: null,
            channelRole: ""
        },
    });
    
    const closeDialog = () => {
        reset();
        clearErrors();
        setOpen(false);
    }
    
    useEffect(() => {
        if(!selectedChannel) {
            setChannelUsers([]);
            setSuggestedUsers([]);
        } else {
            refreshChannelUsers();
            refreshSuggestedUsers();
        }
    }, [selectedChannel]);

    useEffect(() => {
        if(open && suggestedUsers === null){
            (async () => {
                await refreshSuggestedUsers();
            })();
        }
    }, [open]);

    const refreshChannelUsers = async () => {
        if(!selectedChannel) return;
        const { channel_users, channel_roles } = await apiReq("users", { 
            type: "USERS_IN_CHANNEL", 
            channel_code: selectedChannel?.channel_code
        });
        setChannelUsers(channel_users);
        setChannelUsersRoles(channel_roles);
    }

    const refreshSuggestedUsers = async () => {
        if(!selectedChannel) return;
        const suggested_users = await apiReq("users", {
            type: "USERS_NOT_IN_CHANNEL",
            channel_code: selectedChannel?.channel_code
        });
        setSuggestedUsers(suggested_users);
    }

    const addUserToChannel = async (user: User, user_channel_role : string) => {
        if(selectedChannel){
            if(!window.confirm(
                `Add ${user.firstName} to ${selectedChannel?.channel_name}?`
            )) {
                return;
            }

            const status = await apiReq("channels", {
                type: "ADD_USER_TO_CHANNEL",
                channel_code: selectedChannel.channel_code,
                email: user.email,
                role: user_channel_role
            });
            if(!status){
                alert("Failed to add user to channel");
                return;
            } else {
                alert("User added to channel successfully");
            }

            // Notify channel members about new addition
            apiReq("channels", {
                type: "NOTIFY_CHANNEL",
                channel_code: selectedChannel.channel_code,
                message: `${user.firstName} has been added to the channel`,
            })

            await refreshChannelUsers();
            await refreshSuggestedUsers();
        }
    }

    const removeUserFromChannel = async (user: User) => {
        if(selectedChannel){
            if(!window.confirm(
                `Remove ${user.firstName} from ${selectedChannel?.channel_name}?`
            )) {
                return;
            }

            const status = await apiReq("channels", {
                type: "REMOVE_USER_FROM_CHANNEL",
                channel_code: selectedChannel.channel_code,
                email: user.email
            });
            if(!status){
                alert("Failed to remove user from channel");
                return;
            } else {
                alert("User removed from channel successfully");
            }

            // Notify channel members about removal
            apiReq("channels", {
                type: "NOTIFY_CHANNEL",
                channel_code: selectedChannel.channel_code,
                message: `${user.firstName} has been removed from the channel`,
            })

            await refreshChannelUsers();
            await refreshSuggestedUsers();
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div id='course-users-list' className="relative w-1/3 h-full bg-secondary-color items-center">
            <Typography variant="h5" sx={{textAlign:"center",mt:1}} className="w-full">Users</Typography>

            <Box className="flex flex-row" sx={{mt:1}}>
                <h3 className="w-2/4 text-center">Name</h3>
                <h3 className="w-1/4 text-center">Role</h3>
            </Box>
            {
                channelUsers.map((user, index) => {
                    return (
                        <Box sx={{mt:1}}  key={user.email} className="flex flex-row">
                            <p className="w-2/4 text-center">{user.firstName}</p>
                            <p className="w-1/4 text-center">{channelUsersRoles[index]}</p>
                            <IconButton onClick={() => removeUserFromChannel(user)} className="w-1/4" size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )
                })
            }

            <div className="flex flex justify-center">
            <Button  className="bg-primary-color text-primary-txt hover:bg-hovercolor w-4/5 absolute bottom-0 mb-10" id="addUserChannel" variant="contained" onClick={handleClickOpen}>Add User</Button>
            <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle className="bg-tertiary-color">
                    <Typography align="center">
                        Add Users
                    </Typography>
                </DialogTitle>
                <DialogContent className="bg-tertiary-color">
                    <Box> 
                        <Autocomplete
                            id="userNameAutoComplete"
                            key={suggestedUsers?.length || 0}
                            options={suggestedUsers || []}
                            open={autoCompleteOpen}
                            onOpen={() => {
                                setAutoCompleteOpen(true);
                            }}
                            onClose={() => {
                                setAutoCompleteOpen(false);
                            }}
                            loading={loading}
                            getOptionLabel={(option: User) => option.firstName}
                            onChange={(event, value) => setValue("name", value as User)}
                            defaultValue={null}
                            isOptionEqualToValue={(option, value) => option.email === value.email}
                            aria-required
                            renderInput={(params) => <TextField
                                {...params}
                                label="User Name"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                    <Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                    ),
                                }}
                            />}
                        />
                    </Box>
                    <Box sx={{mt:3}}>
                        <FormControl fullWidth>
                            <InputLabel>Channel Role</InputLabel>
                            <Select id="channelRoleSelect" 
                                error = {errors.channelRole !== undefined}
                                defaultValue={""}
                                {...register("channelRole", { 
                                    required: "Channel Role is required", 
                                })}
                            >
                                <MenuItem value="faculty">Faculty</MenuItem>
                                <MenuItem value="course_mentor">Course Mentor</MenuItem>
                            </Select>

                        </FormControl>
                    </Box> 
                <DialogActions className="w-full">
                    <Button variant="outlined" onClick={closeDialog} className="w-1/2 bg-secondary-color hover:bg-hovercolor text-primary-txt" sx={{mt:4}}>Close</Button>
                    <Button id="submitAddUser" variant="outlined" onClick={handleSubmit((data) => addUserToChannel(data.name as User, data.channelRole))} className="w-1/2 bg-secondary-color hover:bg-hovercolor text-primary-txt" sx={{mt:4}}>Add User</Button>
                </DialogActions>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    )
}

const CreateChannelButtonDialog = ({refreshChannels}: {refreshChannels: () => void}) => {
    const {
        register,
        getValues,
        handleSubmit,
        clearErrors,
        reset,
        watch,
        formState: { errors },
    } = useForm<Channel>({
        defaultValues: {
            channel_name: "",
            channel_code: "",
            channel_department: "",
            channel_type: "",
            channel_year: "",
            channel_template: JSON.stringify(DEF_TEMPLATE),
        },
    });

    const courseCheck = watch("channel_type") === "course";
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createChannelandClose = async (data: Channel) => {
        if(data.channel_type === "lab") {
            data.channel_template = JSON.stringify(DEF_LAB_TEMPLATE);
        }

        const status = await apiReq("channels", {
            type: "CREATE_CHANNEL",
            data: data
        });
        if(status) {
            alert("Channel created successfully")
        } else {
            alert("Channel creation failed")
        }
        refreshChannels();
        closeDialog();
    };

    const closeDialog = () => {
        reset();
        clearErrors();
        setOpen(false);
    }

    return (
        <div className="w-1/5 h-2/5 m-auto mr-10 ">
        <Button id="createChannelDialogButton" variant="contained" className="w-full h-full bg-secondary-color text-primary-txt hover:bg-hovercolor" onClick={handleClickOpen}>Create Channel</Button>
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle className="bg-tertiary-color font-bold"><Typography textAlign={"center"}>Create Channel</Typography></DialogTitle>
            <DialogContent className="bg-tertiary-color text-primary-txt font-bold content-center">
                <Box display="flex" sx={{mt:1}}>
                    <TextField id="channelName" size="small" required
                        {...register("channel_name", { 
                            required: "Channel Name is required"
                        })}
                        error={errors.channel_name !== undefined}
                        helperText={errors.channel_name?.message}
                        placeholder="Channel Name"
                    />
                </Box>
                <Box display="flex" sx={{mt:1}}>
                    <TextField id="channelCode" required size="small" 
                        {...register("channel_code", { 
                            required: "Channel Code is required",
                        })}
                        error={errors.channel_code !== undefined}
                        helperText={errors.channel_code?.message}
                        placeholder="Channel Code"
                    />
                </Box>
                <Box display="flex" sx={{mt:1}}>
                    <TextField id="departmentName" size="small"  required
                        {...register("channel_department", { 
                            required: "Department Name is required",
                        })}
                        error={errors.channel_department !== undefined}
                        helperText={errors.channel_department?.message}
                        placeholder="Department"
                        />
                </Box>
                <Box display="flex">
                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select id="channelTypeSelect" sx={{mt:1, width: 80}} size="small" required
                            error={errors.channel_type !== undefined}
                            {...register("channel_type", { 
                                required: "Type field is required", 
                        })}>
                            
                            <MenuItem value="course">Course</MenuItem>
                            <MenuItem value="lab">Lab</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {/* Renders year input only if course */}
                { courseCheck && 
                    <Box display="flex">
                        <FormControl>
                        <InputLabel>Year</InputLabel>
                            <Select 
                                id="channelYearSelect" 
                                placeholder="Year"
                                sx={{mt:1, width: 80}} size="small"
                                error={errors.channel_year !== undefined}
                                {...register("channel_year", { 
                                    required: courseCheck ? "This field is required": undefined, 
                            })}>
                                
                                <MenuItem value="I">I</MenuItem>
                                <MenuItem value="II">II</MenuItem>
                                <MenuItem value="III">III</MenuItem>
                                <MenuItem value="IV">IV</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                }
            </DialogContent>
            <DialogActions className="bg-tertiary-color">
            <Button className="bg-secondary-color text-primary-txt hover:bg-hovercolor" id="createChannelCancelButton" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-secondary-color text-primary-txt hover:bg-hovercolor" id="createChannelButton" onClick={handleSubmit(createChannelandClose)}>Create</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

const AdminManageChannel: NextPage = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    useEffect(() => {
        (async () => {
            if(!channels.length) {
                await refreshChannels();
            }
        })();
    }, []);

    const refreshChannels = async () => {
        const allChannels = await apiReq("channels", {type: "ALL_CHANNELS"});
        setChannels(allChannels);
    }

    return (
        <div id="main-view" className="flex flex-col h-screen w-full">
            <div id="search-adduser" className="h-1/5 flex flex-row w-full bg-tertiary-color">
                <Autocomplete
                    id = "searchChannelAutoComplete"
                    options={channels}
                    getOptionLabel={(option: Channel) => option.channel_name}
                    renderInput={(params) => <TextField {...params} 
                                                label="Search Channel"
                                                variant="outlined"/>}
                    onChange={(event, value) => {setSelectedChannel(value)}}
                    defaultValue={null}
                    className="m-auto ml-10 w-2/5"
                    isOptionEqualToValue={(option: Channel, value: Channel) => option.channel_code === value.channel_code}
                />
                <CreateChannelButtonDialog refreshChannels={refreshChannels}/>
            </div>
            {
                selectedChannel ?
                    <div id="course-info-view" className="h-4/5 w-full flex flex-row ">
                        <div id="course-info" className="w-2/3 h-full bg-primary-color flex items-center justify-center text-lg">
                            Current selected Channel: {selectedChannel? selectedChannel.channel_name : "None"}<br/>
                            Current course code: {selectedChannel? selectedChannel.channel_code : "None"}
                        </div>
                        <UsersList 
                            selectedChannel={selectedChannel}/>
                    </div>
                :
                    <div className="w-full h-4/5 text-center bg-primary-color">Select a Channel</div>
            }
        </div>
    );
}

export default AdminManageChannel;