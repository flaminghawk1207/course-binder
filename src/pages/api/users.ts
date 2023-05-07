import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import { getAllUsers, getUsersInEmailList, getUsersNotInEmailList } from "~/server/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if(req.body.type == "USERS_FROM_EMAIL_LIST") {
        const users = await getUsersInEmailList(req.body.email_list);
        res.json(users);
    } else if(req.body.type == "ALL_USERS") {
        const users = await getAllUsers();
        res.json(users);
    } else if (req.body.type == "USERS_NOT_IN_EMAIL_LIST") {
        const users = await getUsersNotInEmailList(req.body.email_list);
        res.json(users);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}