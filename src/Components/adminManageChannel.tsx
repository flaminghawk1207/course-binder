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
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Channel, CHANNEL_ROLE, User } from "~/types";
import { DEF_LAB_TEMPLATE, DEF_TEMPLATE, apiReq } from "~/utils";
import { Typography, InputLabel, Input, Box, Select, MenuItem, IconButton, FormControl } from "@mui/material";

const UsersList = ({selectedChannel}: { selectedChannel: Channel | null }) => {
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const loading = open && suggestedUsers.length === 0;

    const [channelUsers, setChannelUsers] = useState<User[]>([]);
    const [channelUsersRoles, setChannelUsersRoles] = useState<CHANNEL_ROLE[]>([]);

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
        if(open && !suggestedUsers.length){
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

    const addUserToChannel = async (user: User) => {
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
                role: "faculty" // TODO: add role selection
            });
            if(!status){
                alert("Failed to add user to channel");
                return;
            }
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
            }
            await refreshChannelUsers();
            await refreshSuggestedUsers();
        }
    }

    return (
        <div id='course-users-list' className="relative w-1/3 h-full bg-purple-600 items-center">
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
            <Autocomplete
                options={suggestedUsers}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={loading}
                getOptionLabel={(option: User) => option.firstName}
                onChange={(event, value) => {console.log(value)}}
                defaultValue={null}
                className="absolute m-auto ml-10 w-4/5 bottom-10"
                renderInput={(params) => <TextField
                    {...params}
                    label="Add Users"
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
                renderOption={(props, option: User) => {
                    return (
                        <div key={option.email} className="flex flex-row w-full">
                            <Typography sx={{p:2}} className="w-3/4">{option.firstName}</Typography>
                            <Button key={option.email} onClick={() => addUserToChannel(option)} className="w-1/4">
                                +
                            </Button>
                        </div>
                    )
                }}
            />
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
        <div className="w-1/5 h-2/5 m-auto mr-10">
        <Button id="createChannelDialogButton" variant="contained" className="w-full h-full bg-slate-700" onClick={handleClickOpen}>Create Channel</Button>
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle><Typography textAlign={"center"}>Create Channel</Typography></DialogTitle>
            <DialogContent>
                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Channel Name:</InputLabel>
                    <TextField id="channelName" sx={{ml:1.8}} size="small" required
                        {...register("channel_name", { 
                            required: "Channel Name is required"
                        })}
                        error={errors.channel_name !== undefined}
                        helperText={errors.channel_name?.message}
                    />
                </Box>
                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Channel Code:</InputLabel>
                    <TextField id="channelCode" sx={{ml:2.3}} required size="small" 
                        {...register("channel_code", { 
                            required: "Channel Code is required",
                        })}
                        error={errors.channel_code !== undefined}
                        helperText={errors.channel_code?.message}
                    />
                </Box>
                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Department:</InputLabel>
                    <TextField id="departmentName" sx={{ml:4.5}} size="small"  required
                        {...register("channel_department", { 
                            required: "Department Name is required",
                        })}
                        error={errors.channel_department !== undefined}
                        helperText={errors.channel_department?.message}
                        />
                </Box>
                <Box display="flex">
                    <InputLabel>Type:</InputLabel>
                    {/* <FormControl> */}
                        <Select id="channelTypeSelect" sx={{ml:6, mt:1}} size="small" required
                            error={errors.channel_type !== undefined}
                            {...register("channel_type", { 
                                required: "Type field is required", 
                        })}>
                            
                            <MenuItem value="course">Course</MenuItem>
                            <MenuItem value="lab">Lab</MenuItem>
                        </Select>
                    {/* </FormControl> */}
                </Box>
                {/* Renders year input only if course */}
                { courseCheck && 
                    <Box display="flex">
                        <InputLabel>Year:</InputLabel>
                        <FormControl>
                            <Select 
                                id="channelYearSelect" 
                                sx={{ml:6, mt:1}} size="small"
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
            <DialogActions>
            <Button id="createChannelCancelButton" onClick={closeDialog}>Cancel</Button>
            <Button id="createChannelButton" onClick={handleSubmit(createChannelandClose)}>Create</Button>
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
        <div id="main-view" className="flex flex-col h-screen w-full bg-black">
            <div id="search-adduser" className="h-1/5 flex flex-row w-full bg-red-400">
                <Autocomplete
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
                    <div id="course-info-view" className="h-4/5 w-full bg-blue-300 flex flex-row">
                        <div id="course-info" className="w-2/3 h-full bg-yellow-300">
                            Current selected Channel: {selectedChannel? selectedChannel.channel_name : "None"}<br/>
                            Current course code: {selectedChannel? selectedChannel.channel_code : "None"}
                        </div>
                        <UsersList 
                            selectedChannel={selectedChannel}/>
                    </div>
                :
                    <div className="w-full h-4/5 text-center bg-blue-300">Select a Channel</div>
            }
        </div>
    );
}

export default AdminManageChannel;