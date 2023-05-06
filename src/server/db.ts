import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore_db } from "./firebase";

export const getUserInfo = async (email: string) => {
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    );

    if(!userInfoSnapshot || userInfoSnapshot.empty) {
        throw new Error("User not found");
    }
    
    const userInfo = userInfoSnapshot.docs[0]?.data();

    return userInfo;
}