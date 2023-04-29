import { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebase_app, firestore_db } from "~/server/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { firstName, lastName, email, password, role } = req.body

    const user = await createUserWithEmailAndPassword(getAuth(firebase_app), email, password)
                        .then((userCredential) => userCredential.user)
                        .catch((err) => {
                            console.log(err);
                            res.json({ error: err });
                            return null;
                        });
        
    if (!user) {
        return
    }

    const createdUser = await addDoc(
                                collection(firestore_db, "users"),
                                {
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    role: role,
                                }        
                            ).then((docRef) => true)
                            .catch((err) => {
                                console.log(err);
                                res.json({ error: err });
                                return false;
                            });
    
    if (!createdUser) {
        return
    }

    res.json({}) // No need to send anything back here. The client knows something is wrong if response has error field.
}