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

export const getfacultyInfo = async (email:string) => {
    const facultyInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("member_emails", 'array-contains', email)
        )
    );

    if(!facultyInfoSnapshot || facultyInfoSnapshot.empty) {
        throw new Error("Faculty does not belong to any channels");
    }
    
    // const userInfo = userInfoSnapshot.docs[0]?.data();
    const facultyCourseInfoLength = facultyInfoSnapshot.docs.length;
    var facultyCourseInfoArray = [];
    for (let i = 0; i < facultyCourseInfoLength; i++) {
        facultyCourseInfoArray.push(facultyInfoSnapshot.docs[i]?.data())
    }

    return facultyCourseInfoArray;
}