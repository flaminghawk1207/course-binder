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
import { Typography, InputLabel, Input, Box, Select, MenuItem, IconButton, FormHelperText, FormControl } from "@mui/material";
// import { FormControl } from '@angular/forms';

const ChannelsList = ({selectedUser}: { selectedUser: User | null }) => {
    const [suggestedChannels, setSuggestedChannels] = useState<Channel[]>([]);
    const [open, setOpen] = useState(false);
    const loading = open && suggestedChannels.length === 0;

    const [userChannels, setUserChannels] = useState<Channel[]>([]);
    const [userChannelsRoles, setUserChannelsRoles] = useState<CHANNEL_ROLE[]>([]);

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
        if(open && !suggestedChannels.length){
            (async () => {
                await refreshSuggestedChannels();
            })();
        }
    }, [open]);

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

    const addUserToChannel = async (channel: Channel) => {
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
                role: "faculty" // TODO: add role selection
            });
            if(!status){
                alert("Failed to add user to channel");
                return;
            }
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
            }
            await refreshUserChannels();
            await refreshSuggestedChannels();
        }
    }

    return (
        <Box id='course-users-list' className="relative w-1/3 h-full bg-purple-600 items-center">
            <Typography variant="h5" sx={{textAlign:"center",mt:1}} className="w-full">Users</Typography>

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
            <Autocomplete
                options={suggestedChannels}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={loading}
                getOptionLabel={(option: Channel) => option.channel_name}
                onChange={(event, value) => {console.log(value)}}
                defaultValue={null}
                className="absolute m-auto ml-10 w-4/5 bottom-10"
                renderInput={(params) => <TextField
                    {...params}
                    label="Add to Channels"
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
                renderOption={(props, option: Channel) => {
                    return (
                        <div key={option.channel_code} className="flex flex-row w-full">
                            <Typography className="w-3/4" sx={{p:2}}>{option.channel_name}</Typography>
                            <Button size="small" sx={{borderRadius:300}} key={option.channel_code} onClick={() => addUserToChannel(option)} className="w-1/4">
                                +
                            </Button>
                        </div>
                    )
                }}
            />
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
    }
    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            role: ""
        },
    });
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createUserandClose = async (data: FormValues) => {
        const status = await apiReq("users", {
            type: "CREATE_USER",
            data: data,
            password: data.password
        });
        if(status) {
            alert("User created successfully")
        } else {
            alert("User creation failed")
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
        <Button id="createUserDialogButton" variant="contained" className="w-full h-full bg-slate-700" onClick={handleClickOpen}>Create User</Button>
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>
                <Typography align="center">
                    Create User
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>First Name:</InputLabel>
                    <TextField  sx={{ml:1}} size="small"
                        {...register("firstName", { 
                            required: "First Name is required", 
                        })}
                        error={errors.firstName !== undefined}
                        helperText={errors.firstName?.message}
                        />
                </Box>

                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Last Name:</InputLabel>
                    <TextField sx={{ml:1}} size="small"
                        {...register("lastName", { 
                            required: "Last Name is required", 
                        })}
                        error={errors.lastName !== undefined}
                        helperText={errors.lastName?.message}
                        type="text"/>
                    <br/>
                </Box>

                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Email:</InputLabel>
                    <TextField sx={{ml:5.6, align:"right"}} size="small"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                                message: "Invalid email address", }
                        })}
                        error={errors.email !== undefined}
                        helperText={errors.email?.message}
                    />
                    <br/>
                </Box>

                <Box display="flex" sx={{mt:1}}>
                    <InputLabel>Password:</InputLabel>
                    <TextField sx={{ml:1.7}} size="small"
                        {...register("password", { 
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
                            }
                        })}
                    error={errors.password !== undefined}
                    helperText={errors.password?.message}
                    />
                    <br/>
                </Box>

                <Box display="flex">
                    <InputLabel>Role:</InputLabel>
                    {/* <FormControl> */}
                        <Select sx={{ml:6, mt:1}} size="small" required style={{ width: "72%" }}
                            error={errors.role !== undefined}
                            // helperText={errors.role?.message}
                            {...register("role", { 
                                required: "This field is required", 
                        })}>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="hod">HOD </MenuItem>
                            <MenuItem value="faculty">Faculty</MenuItem>
                        </Select>
                        <br/>
                    {/* </FormControl> */}
                </Box>

            </DialogContent>
            <DialogActions>
            <Button id="createUserCancelButton" onClick={closeDialog}>Cancel</Button>
            <Button id="createUserButton" onClick={handleSubmit(createUserandClose)}>Create</Button>
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
        <div id="main-view" className="flex flex-col h-screen w-full bg-black">
            <div id="search-adduser" className="h-1/5 flex flex-row w-full bg-red-400">
                <Autocomplete
                    options={users}
                    getOptionLabel={(option: User) => option.firstName}
                    renderInput={(params) => <TextField {...params} 
                                                label="Search Users"
                                                variant="outlined"/>}
                    onChange={(event, value) => {setSelectedUser(value)}}
                    defaultValue={null}
                    className="m-auto ml-10 w-2/5"
                    isOptionEqualToValue={(option: User, value: User) => option.email === value.email}
                />
                <CreateUserButtonDialog refreshUsers={refreshUsers}/>
            </div>
            {
                selectedUser ?
                    <div id="course-info-view" className="h-4/5 w-full bg-blue-300 flex flex-row">
                        <div id="course-info" className="w-2/3 h-full bg-yellow-300">
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
                    <div className="w-full h-4/5 text-center bg-blue-300">Select a User</div>
            }
        </div>
    );
}

export default AdminManageUser;