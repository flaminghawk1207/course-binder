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
import { Dispatch, Fragment, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Channel, CHANNEL_ROLE, User } from "~/types";
import { apiReq } from "~/utils";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";


const ChannelsList = ({selectedUser}: { selectedUser: User | null }) => {
    type ChannelFormValues = {
        channel : Channel | null,
        role : string
    }

    const [suggestedChannels, setSuggestedChannels] = useState<Channel[]|null>(null);
    const [open, setOpen] = useState(false);
    const loading = open && suggestedChannels === null;

    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
    const [userChannels, setUserChannels] = useState<Channel[]>([]);
    const [userChannelsRoles, setUserChannelsRoles] = useState<CHANNEL_ROLE[]>([]);

    const {
        register,
        setValue,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<ChannelFormValues>({
        defaultValues: {
            channel: null,
            role: ""
        },
    });

    useEffect(() => {
        if(!selectedUser) {
            setUserChannels([]);
            setSuggestedChannels([]);
        } else {
            refreshUserChannels();
            refreshSuggestedChannels();
        }
    }, [selectedUser]);

    useEffect(() => {
        if(open && suggestedChannels === null){
            (async () => {
                await refreshSuggestedChannels();
            })();
        }
    }, [open]);
    
    const closeDialog = () => {
        reset();
        clearErrors();
        setOpen(false);
    }

    const refreshUserChannels = async () => {
        if(!selectedUser) return;
        const { user_channels, channel_roles } = await apiReq("channels", { 
            type: "CHANNELS_WITH_USER", 
            email: selectedUser?.email
        });
        console.log(user_channels, channel_roles)
        setUserChannels(user_channels);
        setUserChannelsRoles(channel_roles);
    }

    const refreshSuggestedChannels = async () => {
        if(!selectedUser) return;
        const suggested_users = await apiReq("channels", {
            type: "CHANNELS_WITHOUT_USER",
            email: selectedUser?.email
        });
        setSuggestedChannels(suggested_users);
    }

    const addUserToChannel = async (channel: Channel, role: string) => {
        if(selectedUser){
            if(!window.confirm(
                `Add ${selectedUser.firstName} to ${channel?.channel_name}?`
            )) {
                return;
            }

            const status = await apiReq("channels", {
                type: "ADD_USER_TO_CHANNEL",
                channel_code: channel.channel_code,
                email: selectedUser.email,
                role: role
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
                channel_code: channel.channel_code,
                message: `${selectedUser.firstName} has been added to the channel`
            });

            await refreshUserChannels();
            await refreshSuggestedChannels();
        }
    }

    const removeUserFromChannel = async (channel: Channel) => {
        if(selectedUser){
            if(!window.confirm(
                `Remove ${selectedUser.firstName} from ${channel?.channel_name}?`
            )) {
                return;
            }

            const status = await apiReq("channels", {
                type: "REMOVE_USER_FROM_CHANNEL",
                channel_code: channel.channel_code,
                email: selectedUser.email
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
                channel_code: channel.channel_code,
                message: `${selectedUser.firstName} has been removed from the channel`
            });

            await refreshUserChannels();
            await refreshSuggestedChannels();
        }
    }

    return (
        <Box id='course-users-list' className="relative w-1/3 h-full bg-secondary-color items-center">
            <Typography variant="h5" sx={{textAlign:"center",mt:1}} className="w-full">Channels</Typography>

            <Box className="flex flex-row" sx={{mt:1}}>
                <h3 className="w-2/4 text-center">Name</h3>
                <h3 className="w-1/4 text-center">Role</h3>
            </Box>
            {
                userChannels.map((channel, index) => {
                    return (
                        <Box sx={{mt:1}} key={channel.channel_code} className="flex flex-row" >
                            <p className="w-2/4 text-center">{channel.channel_code}</p>
                            <p className="w-1/4 text-center">{userChannelsRoles[index]}</p>
                            <IconButton onClick={() => removeUserFromChannel(channel)} aria-label="delete" size="small" className="w-1/4">
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                    )
                })
            }
            
            <Box>
                <div className="flex flex justify-center">
                    <Button className="bg-primary-color text-primary-txt hover:bg-hovercolor w-4/5 absolute bottom-0 mb-10" id="addUserChannel" variant="contained" onClick={() => setOpen(true)}>Add Channel</Button>
                    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
                    <DialogTitle className="bg-tertiary-color">
                        <Typography align="center">
                            Add Channel
                        </Typography>
                    </DialogTitle>
                    <DialogContent className="bg-tertiary-color">
                    <Box> 
                        <Autocomplete
                            id="channelNameAutoComplete"
                            key={suggestedChannels?.length || 0}
                            options={suggestedChannels || []}
                            open={autoCompleteOpen}
                            onOpen={() => {
                                setAutoCompleteOpen(true);
                            }}
                            onClose={() => {
                                setAutoCompleteOpen(false);
                            }}
                            loading={loading}
                            getOptionLabel={(option: Channel) => option.channel_name}
                            onChange={(event, value) => setValue("channel", value as Channel)}
                            defaultValue={null}
                            aria-required
                            renderInput={(params) => <TextField
                                {...params}
                                label="Add Channel"
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
                                defaultValue={""}
                                error = {errors.role !== undefined}
                                {...register("role", { 
                                    required: "Channel Role is required", 
                                })}
                            >
                                <MenuItem value="faculty">Faculty</MenuItem>
                                <MenuItem value="course_mentor">Course Mentor</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> 
                <DialogActions className="w-full">
                    <Button variant="outlined" onClick={closeDialog} className="w-1/2 bg-secondary-color text-primary-txt hover:bg-hovercolor" sx={{mt:4}}>Close</Button>
                    <Button id="submitAddChannel" variant="outlined" onClick={handleSubmit((data) => addUserToChannel(data.channel as Channel, data.role))} className="w-1/2 bg-secondary-color text-primary-txt hover:bg-hovercolor" sx={{mt:4}}>Add Channel</Button>
                </DialogActions>
                </DialogContent>
            </Dialog>
            </div>
        </Box>
        </Box>
    
    )
}

const CreateUserButtonDialog = ({refreshUsers}: {refreshUsers: () => void}) => {
    type FormValues = {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        role: string;
        department: string,
    }
    const {
        register,
        handleSubmit,
        clearErrors,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            role: "",
            department: "",
        },
    });
    const [open, setOpen] = useState(false);

    const hasDepartment = watch("role") === "hod" || watch("role") === "faculty";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createUserandClose = async (data: FormValues) => {
        const res = await apiReq("users", {
            type: "CREATE_USER",
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                department: data.department,
            },
            password: data.password
        });
        if(!res.error) {
            alert("User created successfully")
        } else {
            alert(res.message)
            return;
        }
        refreshUsers();
        closeDialog();
    };

    const closeDialog = () => {
        reset();
        clearErrors();
        setOpen(false);
    }
    
    return (
        <div className="w-1/5 h-2/5 m-auto mr-10">
        <Button id="createUserDialogButton" variant="contained" className="w-full h-full bg-secondary-color text-primary-txt hover:bg-primary-color" onClick={handleClickOpen}>Create User</Button>
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle className="bg-tertiary-color" >
                <Typography align="center">
                    Create User
                </Typography>
            </DialogTitle>
            <DialogContent className="bg-tertiary-color text-primary-txt">
                <Box display="flex" sx={{mt:1}}> 
                    <TextField id="firstName" size="small"
                        {...register("firstName", { 
                            required: "First Name is required", 
                        })}
                        error={errors.firstName !== undefined}
                        placeholder="First Name"
                        helperText={errors.firstName?.message}
                        />
                </Box>

                <Box  display="flex" sx={{mt:1}}>
                    <TextField id="lastName" size="small"
                        {...register("lastName", { 
                            required: "Last Name is required", 
                        })}
                        error={errors.lastName !== undefined}
                        helperText={errors.lastName?.message}
                        placeholder="Last name"
                        type="text"/>
                    <br/>
                </Box>

                <Box display="flex" sx={{mt:1}}>
                    <TextField id="emailTextField" size="small"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                                message: "Invalid email address", }
                        })}
                        error={errors.email !== undefined}
                        helperText={errors.email?.message}
                        placeholder="Email"
                    />
                    <br/>
                </Box>

                <Box display="flex" sx={{mt:1}}>
                    <TextField id="passwordTextField" size="small"
                        {...register("password", { 
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "Password must be at least 8 characters long and must be a combination of uppercase letters, lowercase letters, special characters and numbers",
                            }
                        })}
                    error={errors.password !== undefined}
                    helperText={errors.password?.message}
                    placeholder="Password"
                    />
                    <br/>
                </Box>

                <Box display="flex">
                    <FormControl>
                        <InputLabel>User Role</InputLabel>
                        <Select id="roleSelect" sx={{mt:1, width: 120}} size="small" required
                            error={errors.role !== undefined}
                            placeholder="User Role"
                            // helperText={errors.role?.message}
                            {...register("role", { 
                                required: "This field is required", 
                        })}>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="principal">Principal </MenuItem>
                            <MenuItem value="hod">HOD </MenuItem>
                            <MenuItem value="faculty">Faculty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {
                    hasDepartment &&
                    <Box display="flex">
                        <TextField id="departmentTextField" size="small"
                            sx={{mt:1}}
                            {...register("department", {
                                required: "Department is required",
                            })}
                            error={errors.department !== undefined}
                            helperText={errors.department?.message}
                            placeholder="Department"
                        />
                        <br/>
                    </Box>
                }

            </DialogContent>
            <DialogActions className="bg-tertiary-color" >
            <Button className="bg-secondary-color text-primary-txt hover:bg-hovercolor" id="createUserCancelButton" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-secondary-color text-primary-txt hover:bg-hovercolor" id="createUserButton" onClick={handleSubmit(createUserandClose)}>Create</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

const AdminManageUser: NextPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            if(!users.length) {
                await refreshUsers();
            }
        })();
    }, []);

    const refreshUsers = async () => {
        const allUsers = await apiReq("users", {type: "ALL_USERS"});
        setUsers(allUsers);
    }

    return (
        <div id="main-view" className="flex flex-col h-screen w-full">
            <div id="search-adduser" className="h-1/5 flex flex-row w-full bg-tertiary-color">
                <Autocomplete
                    options={users}
                    id = "searchUsersAutoComplete"
                    getOptionLabel={(option: User) => option.firstName}
                    renderInput={(params) => <TextField {...params} 
                                                label="Search Users"
                                                variant="outlined" 
                                                required/>}
                    onChange={(event, value) => {setSelectedUser(value)}}
                    defaultValue={null}
                    className="m-auto ml-10 w-2/5"
                    isOptionEqualToValue={(option: User, value: User) => option.email === value.email}
                />
                <CreateUserButtonDialog refreshUsers={refreshUsers}/>
            </div>
            {
                selectedUser ?
                    <div id="course-info-view" className="h-4/5 w-full bg-white flex flex-row">
                        <div id="course-info" className="w-2/3 h-full bg-primary-color flex items-center justify-center text-lg">
                            <Typography>
                                Current selected User: {selectedUser? selectedUser.firstName : "None"}<br/>
                                Last Name: {selectedUser? selectedUser.lastName : "None"}<br/>
                                Email: {selectedUser? selectedUser.email : "None"}
                            </Typography>
                        </div>
                        <ChannelsList 
                            selectedUser={selectedUser}/>
                    </div>
                :
                    <div className="w-full h-4/5 text-center bg-primary-color">Select a User</div>
            }
        </div>
    );
}

export default AdminManageUser;