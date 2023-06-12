import { addDoc, collection, deleteDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { firebase_app, firebase_file_storage, firestore_db } from "./firebase";
import { Channel, CHANNEL_ROLE, CourseBinderError, ERROR_TYPE, FirebaseFile, FirebaseFolder, User, task } from "~/types";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { StorageReference, deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytes, uploadString } from "firebase/storage";
import { Task } from "@mui/icons-material";

export const getUserInfo = async (email: string) => {
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    );

    if (!userInfoSnapshot || userInfoSnapshot.empty) {
        return {
            type: ERROR_TYPE.USER_NOT_FOUND,
            message: "User not found"
        } as CourseBinderError;
    }

    const userInfo = userInfoSnapshot.docs[0]?.data();

    return userInfo;
}

export const getfacultyInfo = async (email: string) => {
    const channelCodesSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

    if (!channelCodesSnapshot) {
        throw new Error("Firestore error when retrieving channel codes");
    }

    const channelCodes = channelCodesSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    if (channelCodes.length == 0) {
        return [];
    }

    const channelsInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "in", channelCodes)
        )
    );

    if (!channelsInfoSnapshot) {
        throw new Error("Firestore error when retrieving channel info");
    }

    const channelsInfo = channelsInfoSnapshot.docs.map(doc => doc.data()) as Channel[];

    return channelsInfo;
}

export const getAllChannels = async () => {
    const channelsSnapshot = await getDocs(
        collection(firestore_db, "channels")
    );

    if (!channelsSnapshot) {
        throw new Error("Firestore error when retrieving channels");
    }

    const channels = channelsSnapshot.docs.map(doc => doc.data()) as Channel[];

    return channels;
}

export const getAllUsers = async () => {
    const usersSnapshot = await getDocs(
        collection(firestore_db, "users")
    );

    if (!usersSnapshot) {
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

    if (!userInChannelEmailsSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const userInChannelEmails = userInChannelEmailsSnapshot.docs.map(doc => doc.data().email) as string[];

    if (userInChannelEmails.length == 0) {
        return { channel_users: [], channel_roles: [] };
    }

    const userInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "in", userInChannelEmails)
        )
    );

    if (!userInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const userInfos = userInfosSnapshot.docs.map(doc => doc.data()) as User[];

    const channel_roles = userInfos.map(userInfo => {
        const channelMemberRelationship = userInChannelEmailsSnapshot.docs.find(doc => doc.data().email == userInfo.email);
        return channelMemberRelationship?.data().channel_role;
    }) as CHANNEL_ROLE[];
    return { channel_users: userInfos, channel_roles };
}

export const getChannelsRolesWithUser = async (email: string) => {
    const channelsWithUserSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("email", "==", email)
        )
    );

    if (!channelsWithUserSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const channelCodesWithUser = channelsWithUserSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    if (channelCodesWithUser.length == 0) {
        return { user_channels: [], channel_roles: [] };
    }

    const channelInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "in", channelCodesWithUser)
        )
    );

    if (!channelInfosSnapshot) {
        throw new Error("Firestore error when retrieving user info");
    }

    const channelInfos = channelInfosSnapshot.docs.map(doc => doc.data()) as Channel[];

    const channel_roles = channelInfos.map(channel => {
        const channelMemberRelationship = channelsWithUserSnapshot.docs.find(doc => doc.data().channel_code == channel.channel_code);
        return channelMemberRelationship?.data().channel_role;
    }) as CHANNEL_ROLE[];
    return { user_channels: channelInfos, channel_roles };
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

    if (!channelMemberRelationshipSnapshot) {
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

    if (!userInChannelEmailsSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const userInChannelEmails = userInChannelEmailsSnapshot.docs.map(doc => doc.data().email) as string[];

    if (userInChannelEmails.length == 0) {
        return getAllUsers();
    }

    const userInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "not-in", userInChannelEmails)
        )
    );

    if (!userInfosSnapshot) {
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

    if (!channelsWithUserSnapshot) {
        throw new Error("Firestore error when retrieving user emails");
    }

    const channelsCodesWithUser = channelsWithUserSnapshot.docs.map(doc => doc.data().channel_code) as string[];

    if (channelsCodesWithUser.length == 0) {
        return getAllChannels();
    }

    const channelInfosSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "not-in", channelsCodesWithUser)
        )
    );

    if (!channelInfosSnapshot) {
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

    if (!status) {
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

    if (!channelDocsSnapshot) {
        throw new Error("Firestore error when retrieving channel docs");
    }

    const channelDocRef = channelDocsSnapshot.docs[0]?.ref;

    if (!channelDocRef) {
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
    if (channel.channel_type == "course") {
        dirName = `${channel.channel_department}/${channel.channel_year}/${channel.channel_code}`
    } else {
        dirName = `${channel.channel_department}/Labs/${channel.channel_code}`
    }
    return dirName;
}

export const createChannel = async (channel: Channel) => {
    const status = await addDoc(collection(firestore_db, "channels"), channel);

    const dirName = getDirName(channel);

    await createDir(dirName);
    await createFolderStructureFromTemplate(dirName, channel.channel_template);

    if (!status) {
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
            return {
                error: true,
                message: error.message
            }
        });

    if (authUser.hasOwnProperty("error")) {
        return authUser;
    }

    const status = await addDoc(collection(firestore_db, "users"), user);

    if (!status) {
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

export async function getAllFilesRecursive(folderRef: StorageReference): Promise<FirebaseFolder> {
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

    const children = (files as (FirebaseFile | FirebaseFolder)[]).concat(folders as (FirebaseFile | FirebaseFolder)[]);

    return { name: folderRef.name, fullPath: folderRef.fullPath, children: children, type: "folder" } as FirebaseFolder;
}

export const resetFile = async (fullPath: string) => {
    const fileRef = ref(firebase_file_storage, fullPath);
    await deleteObject(fileRef);
    createEmptyFile(fullPath);
    return true;
}

export const uploadFile = async (fileContent: Uint8Array, fileName: string) => {
    const storageRef = ref(firebase_file_storage, fileName);
    await uploadBytes(storageRef, fileContent)
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
        if (item.type == "folder") {
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
    if (firebase_folder.type == "file") {
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
    if (!channelDocRef) {
        throw new Error("Channel Ref not found");
    }
    await updateDoc(channelDocRef, {
        channel_template: newTemplate
    });
    await deleteFolder(dirName);
    await createFolderStructureFromTemplate(dirName, newTemplate);
    return true;
}
//anish's part 
export const uploadMessage = async (email: string, message: string, channel: Channel) => {
    const currentTime = serverTimestamp();
    const status = await addDoc(collection(firestore_db, "chats"), {
        channel: channel,
        email: email,
        message: message,
        timestamp: currentTime,
    });

    if (!status) {
        return false;
    }
    return true;
}

export const getNotifications = async (email: string, limit_count: number) => {
    const notificationsSnapshot = await getDocs(
        query(
            collection(firestore_db, "notifications"),
            where("email", "==", email),
            orderBy("time", "desc"),
            limit(limit_count)
        )
    );

    if (!notificationsSnapshot) {
        throw new Error("Firestore error when retrieving notifications");
    }

    const notifications = notificationsSnapshot.docs.map(doc => doc.data()) as any[];

    return notifications;
}

export const markNotificationsViewed = async (email: string) => {
    const notificationsSnapshot = await getDocs(
        query(
            collection(firestore_db, "notifications"),
            where("email", "==", email),
            where("viewed", "==", false)
        )
    );

    if (!notificationsSnapshot) {
        throw new Error("Firestore error when retrieving notifications");
    }

    notificationsSnapshot.docs.forEach(async (doc) => {
        const docRef = doc.ref;
        await updateDoc(docRef, {
            viewed: true
        });
    });

    return true;
}

export const sendNotifications = async (email_list: string[], channel_code: string, message: string) => {
    const notifications = email_list.map((email) => {
        return {
            email,
            channel_code,
            message,
            time: new Date(),
            viewed: false
        }
    });

    const status = await Promise.all(notifications.map(async (notification) => {
        const status = await addDoc(collection(firestore_db, "notifications"), notification);
        return status;
    }));

    if (!status) {
        return false;
    }
    return true;
}
export const getPrevmessages = async (channel: Channel) => {

    const filesSnapshot = await getDocs(
        query(
            collection(firestore_db, "chats"),
            where("channel", "==", channel)
        )
    );

    const fileNames: { email: string, message: string, timestamp: number }[] = [];
    filesSnapshot.forEach((doc) => {
        const { channel, email, message, timestamp } = doc.data();
        fileNames.push({ email, message, timestamp });
    });
    fileNames.sort((a, b) => a.timestamp - b.timestamp);
    const sortedEmailsAndMessages = fileNames.map(({ email, message }) => ({ email, message }));
    return sortedEmailsAndMessages;
};

export const getUserTaskList = async (email: string, channel_code: string) => {
    const taskFromDB = await getDocs(
        query(
            collection(firestore_db, "task"),
            where("assignedToEmail", "==", email), 
            where("channelCode", "==", channel_code)
        )
    );

    const userTaskList = taskFromDB.docs.map(doc => doc.data()) as task[];
    return userTaskList;
}

export const getAllTaskList = async (channel_code: string) => {
    const taskFromDB = await getDocs(
        query(
            collection(firestore_db, "task"),
            where("channelCode", "==", channel_code)
        )
    );
    const allTaskList = taskFromDB.docs.map(doc => doc.data()) as task[];
    return allTaskList;
}

export const addTaskToUser = async (task : task) => {
    const status = await addDoc(collection(firestore_db, "task"), task);

    if (!status) {
        return false;
    }
    return true;
}

export const removeTaskFromList = async (task: task) => {
    const taskToBeRemoved = await getDocs(
        query(
            collection(firestore_db, "task"),
            where("channelCode", "==", task.channelCode),
            where("assignedByEmail", "==", task.assignedByEmail),
            where("assignedToEmail", "==", task.assignedToEmail),
            where("dueTime", "==", task.dueTime),
            where("taskName", "==", task.taskName),
            where("taskStatus", "==", task.taskStatus)
        )
    );

    if (!taskToBeRemoved) {
        throw new Error("Firestore error when retrieving channel docs");
    }

    const taskToBeRemovedRef = taskToBeRemoved.docs[0]?.ref;

    if (!taskToBeRemovedRef) {
        throw new Error("Task Ref not found");
    }

    await deleteDoc(taskToBeRemovedRef);
    return true;
}

export const completeTask = async (task: task) => {
    const taskToBeCompleted = await getDocs(
        query(
            collection(firestore_db, "task"),
            where("channelCode", "==", task.channelCode),
            where("assignedByEmail", "==", task.assignedByEmail),
            where("assignedToEmail", "==", task.assignedToEmail),
            where("dueTime", "==", task.dueTime),
            where("taskName", "==", task.taskName),
            where("taskStatus", "==", task.taskStatus)
        )
    );

    if (!taskToBeCompleted) {
        throw new Error("Firestore error when retrieving channel docs");
    }

    const taskToBeCompletedRef = taskToBeCompleted.docs[0]?.ref;

    if (!taskToBeCompletedRef) {
        throw new Error("Task Ref not found");
    }

    await updateDoc(taskToBeCompletedRef, {
        taskStatus: "Completed"
    });
    return true;
}

export const notifyChannel = async (channel_code: string, message: string) => {
    const channelMembersSnapshot = await getDocs(
        query(
            collection(firestore_db, "channelMemberRelationship"),
            where("channel_code", "==", channel_code)
        )
    );

    if (!channelMembersSnapshot) {
        throw new Error("Firestore error when retrieving channel members");
    }

    const channelMembers = channelMembersSnapshot.docs.map(doc => doc.data()) as User[];
    const email_list = channelMembers.map((channelMember) => channelMember.email);
    const status = await sendNotifications(email_list, channel_code, message);
    return status;
}

export const notifyAllUsers = async (message: string) => {
    const usersSnapshot = await getDocs(
        collection(firestore_db, "users")
    );

    if (!usersSnapshot) {
        throw new Error("Firestore error when retrieving users");
    }
    const users = usersSnapshot.docs.map(doc => doc.data()) as User[];
    const email_list = users.map((user) => user.email);
    const status = await sendNotifications(email_list, "General", message);
    return status;
}