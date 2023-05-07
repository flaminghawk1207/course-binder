import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore_db } from "./firebase";
import { Channel } from "~/types";

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

export const getAllChannels = async () => {
    const channelsSnapshot = await getDocs(
        collection(firestore_db, "channels")
    );

    console.log(channelsSnapshot);

    if(!channelsSnapshot || channelsSnapshot.empty) {
        throw new Error("Channels not found");
    }

    const channels = channelsSnapshot.docs.map(doc => doc.data()) as Channel[];

    return channels;
}

export const getUsersInEmailList = async (email_list: string[]) => {
    const usersSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "in", email_list)
        )
    );

    if(!usersSnapshot || usersSnapshot.empty) {
        throw new Error("Users not found");
    }

    const users = usersSnapshot.docs.map(doc => doc.data());

    return users;
}