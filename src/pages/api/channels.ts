import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import { getAllChannels } from "~/server/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if(req.body.all) {
        const channels = await getAllChannels();
        res.json(channels);
    } else {
        res.json({
            error: "Invalid request"
        })
    }
}