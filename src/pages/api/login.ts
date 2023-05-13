import { NextApiRequest, NextApiResponse } from "next";
import {signInWithEmailAndPassword} from "firebase/auth";
import { firebase_app } from "~/server/firebase";
import {getAuth} from "firebase/auth";
import { getUserInfo } from "~/server/db";
import { CourseBinderError, User } from "~/types";

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
                            if(err.code === "auth/user-not-found") {
                                res.json({
                                    error: true,
                                    errorType: "USER_NOT_FOUND",
                                    message: "No account found with the given email"
                                })
                            } else if(err.code === "auth/wrong-password") {
                                res.json({
                                    error: true,
                                    errorType: "PASSWORD_INCORRECT",
                                    message: "Incorrect password"
                                });
                            } else {
                                res.json({
                                    error: true,
                                    errorType: "UNKNOWN",
                                    message: "An unknown error occurred"
                                });
                            }
                            return null;
                        });
    
    if (!user) {
        return
    }
    
    const userInfo = await getUserInfo(email)
        .catch((err: CourseBinderError) => {
            console.log(err);
            res.json(err);
            return null;
        });

    if (!userInfo) {
        return
    }

    res.json(userInfo as User);
}