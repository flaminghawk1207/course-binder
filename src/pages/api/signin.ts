import { NextApiRequest, NextApiResponse } from "next";
import {signInWithEmailAndPassword} from "firebase/auth";
import { firebase_app, firestore_db } from "~/server/firebase";
import {getAuth} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

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
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    ).then((snapshot) => snapshot)
    .catch((err) => {
        console.log(err);
        res.json({ error: err });
        return null;
    });

    if(!userInfoSnapshot || userInfoSnapshot.empty) {
        return
    }
    
    const userInfo = userInfoSnapshot.docs[0]?.data();

    res.json({
        name: userInfo?.firstName,
        email: userInfo?.email,
    })
}