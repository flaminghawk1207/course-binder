import { Channel, task, CHANNEL_ROLE } from "~/types"
import { apiReq } from "~/utils"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/contexts/UserProvider";


const taskItem = () => {

}

export const TaskManager = ({channel} : {channel: Channel}) => { 
    const { user } = useContext(UserContext);
    const [usertaskList, setUserTaskList] = useState<Array<task>>([])
    const [allTaskList, setAllTaskList] = useState<Array<task>>([])

    useEffect(() => {
        (async () => {
            if (user?.role as string == CHANNEL_ROLE.COURSE_MENTOR) {
            await getAllTaskList();
            }
            await getUserTaskList();
            const task : task  = {assignedBy: "Kishore", assignedTo: "Kishore", channelCode: "19CSE212", dueTime: 2, status: "Pending", taskName: "UI for task page"};
            await updateTask(task);
        })()
    }, []);

    const getUserTaskList = async () => {
        const userTaskList = await apiReq("channels", {
            type: "USER_TASKS",
            user_email:  user?.email,//"Ashwath", //to be changed
            channel_code: channel.channel_code//"19CSE212" //to be changed
        })
        setUserTaskList(userTaskList)
    }

    const getAllTaskList = async () => {
        const allTaskList = await apiReq("channels", {
            type: "ALL_TASKS",
            channel_code: "19CSE212" //to be changed
        })
        setAllTaskList(allTaskList)
    }
    console.log("All task list: ", allTaskList)
    console.log("User task list: ", usertaskList)


    const addTasksToList = async (assignedBy: string, assignedTo: string, dueTime: number, channelCode: string, taskMessage: string, taskStatus: string) => {
        const status = await apiReq("channels", {
            type: "ADD_TASK",
            channelCode: "19CSE212",//channel.channel_code
            assignedBy: assignedBy,
            assignedTo: assignedTo,
            dueTime: dueTime,
            taskMessage: taskMessage,
            taskStatus: taskStatus
        })
        console.log(status)
    }

    const removeTasksFromList = async (assignedBy: string, assignedTo: string, dueTime: number, channelCode: string, taskMessage: string, taskStatus: string) => {
        const status = await apiReq("channels", {
            type: "REMOVE_TASK",
            channelCode: "19CSE212",
            assignedBy: assignedBy,
            assignedTo: assignedTo,
            dueTime: dueTime,
            taskMessage: taskMessage,
            taskStatus: taskStatus
        })
        console.log(status)
    }

    const updateTask = async (task: task) => {

        const status = await apiReq("channels", {
            type: "UPDATE_TASK",
            data: task
        })

        console.log(status)
    }

    return (
        <div>Hello world!!</div>
    )
}
