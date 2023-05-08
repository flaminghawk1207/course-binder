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
import { Channel, ChannelRole, User } from "~/types";
import { apiReq } from "~/utils";

const ChannelsList = ({selectedUser}: { selectedUser: User | null }) => {
    const [suggestedChannels, setSuggestedChannels] = useState<Channel[]>([]);
    const [open, setOpen] = useState(false);
    const loading = open && suggestedChannels.length === 0;

    const [userChannels, setUserChannels] = useState<Channel[]>([]);
    const [userChannelsRoles, setUserChannelsRoles] = useState<ChannelRole[]>([]);

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
        <div id='course-users-list' className="relative w-1/3 h-full bg-purple-600 items-center">
            <h1 className="w-full">Users</h1>

            <div className="flex flex-row">
                <h3 className="w-2/4 text-center">Name</h3>
                <h3 className="w-1/4 text-center">Role</h3>
            </div>
            {
                userChannels.map((channel, index) => {
                    return (
                        <div key={channel.channel_code} className="flex flex-row">
                            <p className="w-2/4 text-center">{channel.channel_code}</p>
                            <p className="w-1/4 text-center">{userChannelsRoles[index]}</p>
                            <Button onClick={() => removeUserFromChannel(channel)} className="w-1/4">
                                <DeleteIcon className="bg-white text-red-700"/>
                            </Button>
                        </div>
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
                renderOption={(props, option: Channel) => {
                    return (
                        <div key={option.channel_code} className="flex flex-row w-full">
                            <p className="w-3/4">{option.channel_name}</p>
                            <Button key={option.channel_code} onClick={() => addUserToChannel(option)} className="w-1/4">
                                +
                            </Button>
                        </div>
                    )
                }}
            />
        </div>
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
            data: data
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
        <Button variant="contained" className="w-full h-full bg-slate-700" onClick={handleClickOpen}>Create Channel</Button>
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <label>First Name:</label>
                <input 
                    {...register("firstName", { 
                        required: "This field is required", 
                    })}
                    type="text"/>
                <br/>
                {errors.firstName && 
                <><span className='text-red-700'>{errors.firstName.message}</span><br /></>}

                <label>Last Name:</label>
                <input 
                    {...register("lastName", { 
                        required: "This field is required", 
                    })}
                    type="text"/>
                <br/>
                {errors.lastName && errors.lastName.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}

                <label>Email:</label>
                <input 
                    {...register("email", { 
                        required: "This field is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                            message: "Invalid email address", }
                    })}
                    type="text"/>
                <br/>
                {errors.email && errors.email.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}
                {errors.email && errors.email.type == "pattern" && 
                <><span className='text-red-700'>{errors.email.message}</span><br /></>}
                {errors.email && errors.email.type == "used" && 
                <><span className='text-red-700'>{errors.email.message}</span><br /></>}

                <label>Password:</label>
                <input 
                    {...register("password", { 
                        required: "This field is required",
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
                        }
                    })}
                    type="text"/>
                <br/>
                {errors.password && errors.password.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}
                {errors.password && errors.password.type == "pattern" && 
                <><span className='text-red-700'>{errors.password.message}</span><br /></>}

                <label>Role:</label>
                <select 
                    {...register("role", { 
                        required: "This field is required", 
                    })}>
                    <option value="admin">Admin</option>
                    <option value="hod">HOD</option>
                    <option value="faculty">Faculty</option>
                </select>
                <br/>
                {errors.role && 
                <><span className='text-red-700'>This field is required</span><br /></>}
            </DialogContent>
            <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit(createUserandClose)}>Create</Button>
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
                                                label="Search Channel"
                                                variant="outlined"/>}
                    onChange={(event, value) => {setSelectedUser(value)}}
                    defaultValue={null}
                    className="m-auto ml-10 w-2/5"
                    isOptionEqualToValue={(option: User, value: User) => option.firstName === value.firstName}
                />
                <CreateUserButtonDialog refreshUsers={refreshUsers}/>
            </div>
            {
                selectedUser ?
                    <div id="course-info-view" className="h-4/5 w-full bg-blue-300 flex flex-row">
                        <div id="course-info" className="w-2/3 h-full bg-yellow-300">
                            Current selected User: {selectedUser? selectedUser.firstName : "None"}<br/>
                            Last Name: {selectedUser? selectedUser.lastName : "None"}<br/>
                            Email: {selectedUser? selectedUser.email : "None"}
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