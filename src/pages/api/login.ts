import { NextApiRequest, NextApiResponse } from "next";
import {signInWithEmailAndPassword} from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import {getAuth} from "firebase/auth";
import { getUserInfo } from "~/server/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { email, password } = req.body

    // Retrieve user with the given email and password
    const user = await signInWithEmailAndPassword(getAuth(firebase_app), email, password)
                        .then((userCredential) => userCredential.user)
                        .catch((err) => {
                            console.log(err);
                            res.json({ error: err });
                            return null;
                        });
    
    if (!user) {
        return
    }
    
    const userInfo = await getUserInfo(email)
        .catch((err) => {
            console.log(err);
            res.json({ error: err });
            return null;
        });

    if (!userInfo) {
        return
    }

    res.json({
        name: userInfo?.firstName,
        email: userInfo?.email,
        role: userInfo?.role,
    })
}