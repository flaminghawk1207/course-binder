import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import { getAllUsers, getUsersRolesInChannel, getChannelsWithoutUser, createUser } from "~/server/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if(req.body.type == "USERS_IN_CHANNEL") {
        const { channel_users, channel_roles } = await getUsersRolesInChannel(req.body.channel_code);
        res.json({ channel_users, channel_roles });
    } else if(req.body.type == "ALL_USERS") {
        const users = await getAllUsers();
        res.json(users);
    } else if (req.body.type == "USERS_NOT_IN_CHANNEL") {
        const users = await getChannelsWithoutUser(req.body.channel_code);
        res.json(users);
    } else if (req.body.type == "CREATE_USER") {
        const user = await createUser(req.body.data, req.body.password);
        res.json(user);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}