import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "~/server/firebase";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { email } = req.body

    const result = await sendPasswordResetEmail(getAuth(firebase_app), email)
                        .then(() => {
                            console.log("Password reset email is sent")
                            res.json({
                                status: "PWD_RESET_EMAIL_SENT"
                            })
                        })
                        .catch((err) => {
                            console.log("Password reset email not sent")
                            res.json({
                                error: err
                            })
                        })
}