import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firebase_app, firebase_file_storage, firestore_db } from "./firebase";
import { Channel, CHANNEL_ROLE, CourseBinderError, ERROR_TYPE, FirebaseFile, FirebaseFolder, User } from "~/types";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { StorageReference, deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytes, uploadString } from "firebase/storage";

export const getUserInfo = async (email: string) => {
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    );

    if(!userInfoSnapshot || userInfoSnapshot.empty) {
        return {
            type: ERROR_TYPE.USER_NOT_FOUND,
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

    if(channelCodes.length == 0) {
        return [];
    }

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
    }) as CHANNEL_ROLE[];
    return {channel_users: userInfos, channel_roles};
}

export const getChannelsRolesWithUser = async (email: string) => {
    const channelsWithUserSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

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
    }) as CHANNEL_ROLE[];
    return {user_channels: channelInfos, channel_roles};
}

export const getUserRole = async (channel_code: string, user_email: string) => {
    // get user role from channel
    const channelMemberRelationshipSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("channel_code", "==", channel_code),
            where("email", "==", user_email)
        )
    );

    if(!channelMemberRelationshipSnapshot) {
        throw new Error("Firestore error when retrieving user role");
    }
    
    const channelMemberRelationship = channelMemberRelationshipSnapshot.docs[0]?.data();

    return channelMemberRelationship?.channel_role;
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

export const createDir = async (dirName: string) => {
    // Adding an empty file inside the directory
    // Till we figure out some way to create empty directories in firebase storage
    const storageRef = ref(firebase_file_storage, `${dirName}/_ghostfile`);
    await uploadBytes(storageRef, new Uint8Array())
            .then((val) => console.log("DIR created: ", val.ref.name))
}

export const createEmptyFile = async (pathName: string) => {
    // Adding an empty file inside the directory
    // Till we figure out some way to create empty directories in firebase storage
    const storageRef = ref(firebase_file_storage, pathName);
    await uploadBytes(storageRef, new Uint8Array())
            .then((val) => console.log("FILE created: ", val.ref.name))
}

export const getDirName = (channel: Channel) => {
    let dirName;
    if(channel.channel_type == "course") {
        dirName = `${channel.channel_department}/${channel.channel_year}/${channel.channel_code}`
    } else {
        dirName = `${channel.channel_type}/Labs/${channel.channel_code}`
    }
    return dirName;
}

export const createChannel = async (channel: Channel) => {
    const status = await addDoc(collection(firestore_db, "channels"), channel);

    const dirName = getDirName(channel);

    await createDir(dirName);
    await createFolderStructureFromTemplate(dirName, channel.channel_template);
    
    if(!status) {
        return false;
    }
    return true;
}

// TODO: Check if email already exists
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

export const getAllFiles = async (channel: Channel) => {
    const dirName = getDirName(channel);
    const storageRef = ref(firebase_file_storage, dirName);

    const files = await getAllFilesRecursive(storageRef);
    return files;
}

export async function getAllFilesRecursive (folderRef: StorageReference): Promise<FirebaseFolder> {
    const list = await listAll(folderRef);

    let files = await Promise.all(list.items.map(async (fileRef) => {
        const fileSize = await getMetadata(fileRef).then((metadata) => metadata.size);
        const fileUrl = await getDownloadURL(fileRef);

        return { 
            name: fileRef.name,
            fullPath: fileRef.fullPath,
            type: "file",
            empty: fileSize == 0,
            downloadURL: fileUrl
        } as FirebaseFile
    }))
    
    files = files.filter((file) => file.name != "_ghostfile")

    const folders = await Promise.all(list.prefixes.map(async (folderRef) => {
        const nested_folders = await getAllFilesRecursive(folderRef);
        return nested_folders;
    }));

    const children = (files as (FirebaseFile|FirebaseFolder)[]).concat(folders as (FirebaseFile|FirebaseFolder)[]);

    return { name: folderRef.name, fullPath: folderRef.fullPath, children: children, type: "folder" } as FirebaseFolder;
}

export const resetFile = async (fullPath: string) => {
    const fileRef = ref(firebase_file_storage, fullPath);
    await deleteObject(fileRef);
    createEmptyFile(fullPath);
    return true;
}

// TODO: Make proper file upload
export const uploadFileString = async (fileContent: string, fileName: string) => {
    const storageRef = ref(firebase_file_storage, fileName);
    await uploadString(storageRef, fileContent)
                        .then((val) => console.log("File uploaded: ", val.ref.name))
                        .catch((error) => {
                            throw new Error(error.message);
                        });
    return true;
}

const createFolderStructureFromTemplate = async (path: string, template: string) => {
    let template_obj = JSON.parse(template);

    template_obj.contents.forEach(async (item: any) => {
        let newPath = path + "/" + item.name;
        if(item.type == "folder") {
            await createFolderStructureFromTemplate(newPath, JSON.stringify(item));
        } else {
            await createEmptyFile(newPath);
        }
    });
}

export const deleteFolder = async (path: string) => {
    const folderRef = ref(firebase_file_storage, path);
    const firebase_folder = await getAllFilesRecursive(folderRef);
    await deleteAllFilesRecursive(firebase_folder);
    return true;
}

export const deleteAllFilesRecursive = async (firebase_folder: FirebaseFolder | FirebaseFile) => {
    if(firebase_folder.type == "file") {
        const fileRef = ref(firebase_file_storage, firebase_folder.fullPath);
        await deleteObject(fileRef);
    } else {
        await Promise.all(firebase_folder.children.map(async (child) => {
            await deleteAllFilesRecursive(child);
        }));
    }
}

export const setNewTemplate = async (channel: Channel, newTemplate: string) => {
    const dirName = getDirName(channel);


    // Find channel using channel_code
    const channelDocsSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "==", channel.channel_code)
        )
    );
    // Update the channel_template field
    const channelDocRef = channelDocsSnapshot.docs[0]?.ref;
    if(!channelDocRef) {
        throw new Error("Channel Ref not found");
    }
    await updateDoc(channelDocRef, {
        channel_template: newTemplate
    });
    await deleteFolder(dirName);
    await createFolderStructureFromTemplate(dirName, newTemplate);
    return true;
}