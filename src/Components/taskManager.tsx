import { Channel, task, CHANNEL_ROLE } from "~/types"
import { apiReq } from "~/utils"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/contexts/UserProvider";


const TaskItem = ({ task }: { task: task }) => {
    return (
        <div>
            {task.assignedByName}
            <br></br>
            {task.assignedToName}
            <br></br>
            {task.dueTime}
            <br></br>
            {task.taskStatus}
            <br></br>
            {task.taskName}
            <br></br>
        </div>
    )
}

export const TaskManager = ({ channel }: { channel: Channel }) => {
    const { user } = useContext(UserContext);
    const [usertaskList, setUserTaskList] = useState<Array<task>>([])
    const [allTaskList, setAllTaskList] = useState<Array<task>>([])
    const [channelRole, setChannelRole] = useState<string>("")

    const getChannelRole = async () => {
        const role = await apiReq("channels", {
            type: "GET_USER_ROLE",
            channel_code: channel.channel_code,
            user_email: user?.email
        })
        console.log("Get channel role function", role, typeof (role));
        setChannelRole(role);
        console.log("Channel role(get channel): ", channelRole);
    }

    useEffect(() => {
        (async () => {
            await getChannelRole();
        })()
    }, [])

    useEffect(() => {
        if (channelRole == "") {
            return
        }

        (async () => {

            console.log("channel role: ", channelRole)
            if (channelRole as string == CHANNEL_ROLE.COURSE_MENTOR) {
                await getAllTaskList();
            }
            console.log(allTaskList)
            await getUserTaskList();

            // const task : task  = {assignedBy: "Kishore", assignedTo: "Kishore", channelCode: "19CSE212", dueTime: 2, status: "Pending", taskName: "UI for task page"};
            // await updateTask(task);
        })()
    }, [channelRole]);


    const getUserTaskList = async () => {
        const userTaskList = await apiReq("channels", {
            type: "USER_TASKS",
            user_email: user?.email,//"Ashwath", //to be changed
            channel_code: channel.channel_code//"19CSE212" //to be changed
        })
        setUserTaskList(userTaskList)
    }

    const getAllTaskList = async () => {
        const allTaskList = await apiReq("channels", {
            type: "ALL_TASKS",
            channel_code: channel.channel_code //"19CSE212" //to be changed
        })
        console.log("getALlTask", allTaskList);
        setAllTaskList(allTaskList);
    }
    // console.log("All task list: ", allTaskList)
    // console.log("User task list: ", usertaskList)


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
        <div>
            {
                allTaskList.map((task: task) =>
                    <TaskItem task={task} />
                )
            }
        </div>
        // <div>Hello world!1</div>

    )
}
