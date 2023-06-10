import { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers, getUsersRolesInChannel, createUser, getUsersNotInChannel, getNotifications, markNotificationsViewed, notifyAllUsers } from "~/server/db";

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
        const users = await getUsersNotInChannel(req.body.channel_code);
        res.json(users);
    } else if (req.body.type == "CREATE_USER") {
        const user = await createUser(req.body.data, req.body.password);
        res.json(user);
    } else if (req.body.type == "GET_NOTIFICATIONS") {
        const notifications = await getNotifications(req.body.email, req.body.limit);
        res.json(notifications);
    } else if (req.body.type == "MARK_NOTIFICATIONS_VIEWED") {
        const status = await markNotificationsViewed(req.body.email);
        res.json(status);
    } else if (req.body.type == "NOTIFY_ALL_USERS") {
        const status = await notifyAllUsers(req.body.message);
        res.json(status);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}