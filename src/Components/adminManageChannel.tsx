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
import { Channel, User } from "~/types";
import { apiReq } from "~/utils";

const UsersList = ({
    channelMembers, 
    selectedChannel, 
    setSelectedChannel, 
    refreshChannels
}: { 
    channelMembers: User[], 
    selectedChannel: Channel | null, 
    setSelectedChannel: Dispatch<SetStateAction<Channel | null>>,
    refreshChannels: () => Promise<void>
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const loading = open && users.length === 0;

    useEffect(() => {
        if(!selectedChannel) setUsers([]);
        else refreshUsers();
    }, [selectedChannel]);

    useEffect(() => {
        if(open && !users.length){
            (async () => {
                await refreshUsers();
            })();
        }
    }, [open]);

    const refreshUsers = async () => {
        const allUsers = await apiReq("users", {
            type: "USERS_NOT_IN_EMAIL_LIST",
            email_list: selectedChannel?.member_emails,
        });
        setUsers(allUsers);
    }

    const addUserToChannel = async (user: User) => {
        if(selectedChannel){
            if(!window.confirm(
                `Add ${user.firstName} to ${selectedChannel?.channel_name}?`
            )) {
                return;
            }

            const newChannel = await apiReq("channels", {
                type: "ADD_USER_TO_CHANNEL",
                channel_code: selectedChannel.channel_code,
                email: user.email
            });
            setSelectedChannel(newChannel as Channel);
            await refreshChannels();
        }
    }

    const removeUserFromChannel = async (user: User) => {
        if(selectedChannel){
            if(!window.confirm(
                `Remove ${user.firstName} from ${selectedChannel?.channel_name}?`
            )) {
                return;
            }

            const newChannel = await apiReq("channels", {
                type: "REMOVE_USER_FROM_CHANNEL",
                channel_code: selectedChannel.channel_code,
                email: user.email
            });
            setSelectedChannel(newChannel as Channel);
            await refreshChannels();
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
                channelMembers.map((user) => {
                    return (
                        <div key={user.email} className="flex flex-row">
                            <p className="w-2/4 text-center">{user.firstName}</p>
                            <p className="w-1/4 text-center">{user.role}</p>
                            <Button onClick={() => removeUserFromChannel(user)} className="w-1/4">
                                <DeleteIcon className="bg-white text-red-700"/>
                            </Button>
                        </div>
                    )
                })
            }
            <Autocomplete
                options={users}
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
                        <div className="flex flex-row w-full">
                            <p className="w-3/4">{option.firstName}</p>
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

const AddChannelButtonDialog = () => {
    type FormValues = {
        channelName: string;
        channelCode: string;
        department: string;
    }
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            channelName: "",
            channelCode: "",
            department: "",
        },
    });
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createChannelandClose = async (data: FormValues) => {
        const status = await apiReq("channels", {
            type: "CREATE_CHANNEL",
            data: data
        });
        if(status) {
            alert("Channel created successfully")
        } else {
            alert("Channel creation failed")
        }
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
            <DialogTitle>Create Channel</DialogTitle>
            <DialogContent>
                <label>Channel Name:</label>
                <input 
                    {...register("channelName", { 
                        required: "This field is required"
                    })}
                    type="text"/>
                <br/>
                {errors.channelName && errors.channelName.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}
                <label>Channel Code:</label>
                <input 
                    {...register("channelCode", { 
                        required: "This field is required",
                    })}
                    type="text"/>
                <br/>
                {errors.channelCode && errors.channelCode.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}
                <label>Department:</label>
                <input 
                    {...register("department", { 
                        required: "This field is required",
                    })}
                    type="text"/>
                <br/>
                {errors.department && errors.department.type == "required" && 
                <><span className='text-red-700'>This field is required</span><br /></>}
                <br/>
            </DialogContent>
            <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit(createChannelandClose)}>Create</Button>
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
                const allChannels = await apiReq("channels", {type: "ALL_CHANNELS"});
                setChannels(allChannels);
            }
        })();
    }, []);

    const refreshChannels = async () => {
        const allChannels = await apiReq("channels", {type: "ALL_CHANNELS"});
        setChannels(allChannels);
    }

    const [channelMembers, setChannelMembers] = useState<User[]>([]); 
    useEffect(() => {
        (async () => {
            if(selectedChannel){
                console.log(selectedChannel)
                const members = await apiReq("users", { 
                    type: "USERS_FROM_EMAIL_LIST", 
                    email_list: selectedChannel.member_emails
                });
                setChannelMembers(members);
            } else {
                setChannelMembers([]);
            }
        })();
    }, [selectedChannel]);

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
                />
                <AddChannelButtonDialog/>
            </div>
            {
                selectedChannel ?
                    <div id="course-info-view" className="h-4/5 w-full bg-blue-300 flex flex-row">
                        <div id="course-info" className="w-2/3 h-full bg-yellow-300">
                            Current selected Channel: {selectedChannel? selectedChannel.channel_name : "None"}<br/>
                            Current course code: {selectedChannel? selectedChannel.channel_code : "None"}
                        </div>
                        <UsersList 
                            channelMembers={channelMembers}
                            selectedChannel={selectedChannel}
                            setSelectedChannel={setSelectedChannel}
                            refreshChannels={refreshChannels}/>
                    </div>
                :
                    <div className="w-full h-4/5 text-center bg-blue-300">Select a Channel</div>
            }
        </div>
    );
}

export default AdminManageChannel;