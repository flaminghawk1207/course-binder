import { NextApiRequest, NextApiResponse } from "next";
import { addUserToChannel, createChannel, resetFile, getAllChannels, getAllFiles, getChannelsRolesWithUser, getChannelsWithoutUser, getUserRole, removeUserFromChannel, setNewTemplate, uploadFile, uploadMessage, getPrevmessages, getUserTaskList, getAllTaskList, addTaskToUser, removeTaskFromList, updateTask } from "~/server/db";
import { Channel, task } from "~/types";
import { constructPercentageDict } from "~/utils";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if(req.body.type == "ALL_CHANNELS") {
        const channels = await getAllChannels();
        res.json(channels);
    } else if (req.body.type == "ADD_USER_TO_CHANNEL") {
        const status = await addUserToChannel(req.body.channel_code, req.body.email, req.body.role);
        res.json(status);
    } else if (req.body.type == "REMOVE_USER_FROM_CHANNEL") {
        const status = await removeUserFromChannel(req.body.channel_code, req.body.email);
        res.json(status);
    } else if (req.body.type =="CREATE_CHANNEL") {
        const status = await createChannel(req.body.data as Channel);
        res.json(status);
    } else if(req.body.type == "CHANNELS_WITH_USER") {
        const { user_channels, channel_roles } = await getChannelsRolesWithUser(req.body.email);
        res.json({ user_channels, channel_roles });
    } else if (req.body.type == "CHANNELS_WITHOUT_USER") {
        const channels = await getChannelsWithoutUser(req.body.email);
        res.json(channels);
    } else if (req.body.type == "ALL_FILES") {
        const files = await getAllFiles(req.body.channel);
        res.json(files);
    } else if (req.body.type == "DELETE_FILE") {
        const status = await resetFile(req.body.fullPath);
        res.json(status);
    } else if (req.body.type == "GET_USER_ROLE") {
        const role = await getUserRole(req.body.channel_code, req.body.user_email);
        res.json(role);
    } else if(req.body.type == "SET_NEW_TEMPLATE") {
        const status = await setNewTemplate(req.body.channel, req.body.new_template);
        res.json(status);
    } else if(req.body.type == "GET_PERCENTAGE_DICT") {
        const percentageDict = await constructPercentageDict(req.body.level, req.body.maxDepth, req.body.dept);
        res.json(percentageDict);
    }
    //anish's part
    else if(req.body.type=="SEND_MESSAGE"){
        const sendMessage=await uploadMessage(req.body.email,req.body.message,req.body.channel);
        res.json(sendMessage);
    }
    else if(req.body.type=="PRINT_MESSAGES"){
        const recieveMessages=await getPrevmessages(req.body.channel);
        res.json(recieveMessages);
    }

    //task list 
    else if(req.body.type == "USER_TASKS"){
        const userTaskList = await getUserTaskList(req.body.user_email, req.body.channel_code)
        res.json(userTaskList)
    }

    else if(req.body.type =="ALL_TASKS"){
        const allTaskList = await getAllTaskList(req.body.channel_code)
        res.json(allTaskList)
    }

    else if(req.body.type == "ADD_TASK"){
        const status = await addTaskToUser(req.body.channelCode, req.body.assignedBy, req.body.assignedTo, req.body.dueTime, req.body.taskMessage, req.body.taskStatus)
        res.json(status) 
    }
    else if(req.body.type == "REMOVE_TASK"){
        const status = await removeTaskFromList(req.body.channelCode, req.body.assignedBy, req.body.assignedTo, req.body.dueTime, req.body.taskMessage, req.body.taskStatus)
        res.json(status) 
    }
    else if(req.body.type == "UPDATE_TASK"){
        const status = await updateTask(req.body.data as task)
        res.json(status)
    }
    else {
        res.json({
            error: "Invalid request"
        })
    }
}