import { NextApiRequest, NextApiResponse } from "next";
import { addUserToChannel, createChannel, resetFile, getAllChannels, getAllFiles, getChannelsRolesWithUser, getChannelsWithoutUser, getUserRole, removeUserFromChannel, setNewTemplate, uploadFileString } from "~/server/db";
import { Channel } from "~/types";

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
    } else if (req.body.type == "UPLOAD_FILE") {
        const status = await uploadFileString(req.body.fileContent, req.body.fileName);
        res.json(status);
    } else if (req.body.type == "GET_USER_ROLE") {
        const role = await getUserRole(req.body.channel_code, req.body.user_email);
        res.json(role);
    } else if(req.body.type == "SET_NEW_TEMPLATE") {
        const status = await setNewTemplate(req.body.channel, req.body.new_template);
        res.json(status);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}