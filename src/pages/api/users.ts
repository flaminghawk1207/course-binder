import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import { getUsersInEmailList } from "~/server/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if(req.body.type == "USERS_FROM_EMAIL_LIST") {
        const channels = await getUsersInEmailList(req.body.email_list);
        res.json(channels);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}