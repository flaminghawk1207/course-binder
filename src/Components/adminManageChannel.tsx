import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { getAllChannels } from "~/server/db";
import { Channel, User } from "~/types";
import { apiReq } from "~/utils";

const AdminManageChannel: NextPage = () => {

    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    useEffect(() => {
        (async () => {
            if(!channels.length) {
                const allChannels = await apiReq("channels", {all: true});
                setChannels(allChannels);
            }
        })();
    }, []);

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
        <div id="main-container" className="flex">
            <div id="left-navbuttons" className="w-1/5 bg-red-800"></div>
            <div id="main-view" className="flex flex-col h-screen w-4/5 bg-black">
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
                    <Button variant="contained" className="w-1/5 h-2/5 m-auto mr-10 bg-slate-700">Add Channel</Button>
                </div>
                <div id="course-info-view" className="h-4/5 w-full bg-blue-300 flex flex-row">
                    <div id="course-info" className="w-2/3 h-full bg-yellow-300">
                        Current selected Channel: {selectedChannel? selectedChannel.channel_name : "None"}<br/>
                        Current course code: {selectedChannel? selectedChannel.channel_code : "None"}
                    </div>
                    <div id='course-users-list' className="w-1/3 h-full bg-purple-600">
                        <h1 className="w-full">Users</h1>

                        <div className="flex flex-row">
                            <h3 className="w-2/4 text-center">Name</h3>
                            <h3 className="w-1/4 text-center">Role</h3>
                        </div>
                        {
                            channelMembers.map((user) => {
                                return (
                                    <div className="flex flex-row">
                                        <p className="w-2/4 text-center">{user.firstName}</p>
                                        <p className="w-1/4 text-center">{user.role}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminManageChannel;