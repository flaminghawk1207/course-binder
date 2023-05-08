import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firebase_app, firestore_db } from "./firebase";
import { Channel, ChannelRole, CourseBinderError, ErrorType, User } from "~/types";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const getUserInfo = async (email: string) => {
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    );

    if(!userInfoSnapshot || userInfoSnapshot.empty) {
        return {
            type: ErrorType.USER_NOT_FOUND,
            message: "User not found"
        } as CourseBinderError;
    }
    
    const userInfo = userInfoSnapshot.docs[0]?.data();

    return userInfo;
}

export const getfacultyInfo = async (email:string) => {
    const channelCodesSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

    if(!channelCodesSnapshot) {
        throw new Error("Firestore error when retrieving channel codes");
    }

    const channelCodes = channelCodesSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    const channelsInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "in", channelCodes)
        )
    );

    if(!channelsInfoSnapshot) {
        throw new Error("Firestore error when retrieving channel info");
    }

    const channelsInfo = channelsInfoSnapshot.docs.map(doc => doc.data()) as Channel[];
    
    return channelsInfo;
}

export const getAllChannels = async () => {
    const channelsSnapshot = await getDocs(
        collection(firestore_db, "channels")
    );

    if(!channelsSnapshot) {
        throw new Error("Firestore error when retrieving channels");
    }

    const channels = channelsSnapshot.docs.map(doc => doc.data()) as Channel[];

    return channels;
}

export const getAllUsers = async () => {
    const usersSnapshot = await getDocs(
        collection(firestore_db, "users")
    );

    if(!usersSnapshot) {
        throw new Error("Firestore error when retrieving users");
    }

    const users = usersSnapshot.docs.map(doc => doc.data()) as User[];

    return users;
}

export const getUsersRolesInChannel = async (channel_code: string) => {
    const userInChannelEmailsSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("channel_code", "==", channel_code)
        )
    );

    if(!userInChannelEmailsSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const userInChannelEmails = userInChannelEmailsSnapshot.docs.map(doc => doc.data().email) as string[];

    if(userInChannelEmails.length == 0) {
        return {channel_users: [], channel_roles: []};
    }

    const userInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "in", userInChannelEmails)
        )
    );

    if(!userInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const userInfos = userInfosSnapshot.docs.map(doc => doc.data()) as User[];

    const channel_roles = userInfos.map(userInfo => {
        const channelMemberRelationship = userInChannelEmailsSnapshot.docs.find(doc => doc.data().email == userInfo.email);
        return channelMemberRelationship?.data().channel_role;
    }) as ChannelRole[];
    return {channel_users: userInfos, channel_roles};
}

export const getChannelsRolesWithUser = async (email: string) => {
    console.log(email)
    const channelsWithUserSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

    console.log("Here")

    if(!channelsWithUserSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const channelCodesWithUser = channelsWithUserSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    if(channelCodesWithUser.length == 0) {
        return {user_channels: [], channel_roles: []};
    }

    const channelInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "in", channelCodesWithUser)
        )
    );

    if(!channelInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const channelInfos = channelInfosSnapshot.docs.map(doc => doc.data()) as Channel[];

    const channel_roles = channelInfos.map(channel => {
        const channelMemberRelationship = channelsWithUserSnapshot.docs.find(doc => doc.data().channel_code == channel.channel_code);
        return channelMemberRelationship?.data().channel_role;
    }) as ChannelRole[];
    return {user_channels: channelInfos, channel_roles};
}

export const getUsersNotInChannel = async (channel_code: string) => {
    const userInChannelEmailsSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("channel_code", "==", channel_code)
        )
    );

    if(!userInChannelEmailsSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const userInChannelEmails = userInChannelEmailsSnapshot.docs.map(doc => doc.data().email) as string[];

    if(userInChannelEmails.length == 0) {
        return getAllUsers();
    }
    
    const userInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "not-in", userInChannelEmails)
        )
    );

    if(!userInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const userInfos = userInfosSnapshot.docs.map(doc => doc.data()) as User[];
    return userInfos;
}

export const getChannelsWithoutUser = async (email: string) => {
    const channelsWithUserSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

    if(!channelsWithUserSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const channelsCodesWithUser = channelsWithUserSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    if(channelsCodesWithUser.length == 0) {
        return getAllChannels();
    }
    
    const channelInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "not-in", channelsCodesWithUser)
        )
    );

    if(!channelInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const channelInfos = channelInfosSnapshot.docs.map(doc => doc.data()) as Channel[];
    return channelInfos;
}

export const addUserToChannel = async (channel_code: string, email: string, channel_role: string) => {
    const status = await addDoc(collection(firestore_db, "channelMemberRelationship"), {
        channel_code,
        email,
        channel_role
    });

    if(!status) {
        return false;
    }
    return true;
}

export const removeUserFromChannel = async (channel_code: string, email: string) => {
    const channelDocsSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("channel_code", "==", channel_code),
            where("email", "==", email)
        )
    );

    if(!channelDocsSnapshot) {
        throw new Error("Firestore error when retrieving channel docs");
    }

    const channelDocRef = channelDocsSnapshot.docs[0]?.ref;

    if(!channelDocRef) {
        throw new Error("Channel Ref not found");
    }

    await deleteDoc(channelDocRef);
    return true;
}

export const createChannel = async (channel: Channel) => {
    const status = await addDoc(collection(firestore_db, "channels"), channel);

    if(!status) {
        return false;
    }
    return true;
}

export const createUser = async (user: User, password: string) => {
    const authUser = await createUserWithEmailAndPassword(getAuth(firebase_app), user.email, password)
                            .then((userCredential) => {
                                return userCredential.user;
                            })
                            .catch((error) => {
                                throw new Error(error.message);
                            });

    if(!authUser) {
        throw new Error("Auth user not created");
    }

    const status = await addDoc(collection(firestore_db, "users"), user);

    if(!status) {
        return false;
    }
    return true;
}