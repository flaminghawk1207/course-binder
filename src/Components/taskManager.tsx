import { Channel, task, CHANNEL_ROLE, User } from "~/types"
import { apiReq } from "~/utils"
import { Fragment, useContext, useEffect, useState } from "react";
import { UserContext } from "~/contexts/UserProvider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Autocomplete, Button, CircularProgress, Dialog, IconButton, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TaskItem = ({ task, updateTaskLists, mentor_view }: { task: task, updateTaskLists: any, mentor_view: boolean }) => {
    
    const removeTasksFromList = async (task: task) => {
        const status = await apiReq("channels", {
            type: "REMOVE_TASK",
            data: task
        })
        updateTaskLists();
    }

    const completeTask = async (task: task) => {
        const status = await apiReq("channels", {
            type: "COMPLETE_TASK",
            data: task
        })
        updateTaskLists();
    }
    return (
        <div className="flex w-full border-hovercolor border-2">
            <p className="h-full w-3/4 inline-block align-middle">{task.taskName}</p>
            <div className="h-full w-1/4">
            {
                mentor_view ?
                    <IconButton onClick={() => { removeTasksFromList(task) }}>
                        <DeleteIcon />
                    </IconButton>
                    :
                    task.taskStatus == "Pending" &&
                    <IconButton onClick={() => { completeTask(task) }}>
                        <CheckIcon />
                    </IconButton>
            }
            </div>
        </div>
    )
}

export const TaskManager = ({ channel }: { channel: Channel }) => {
    const { user } = useContext(UserContext);
    const [usertaskList, setUserTaskList] = useState<Array<task>>([])
    const [allTaskList, setAllTaskList] = useState<Array<task>>([])
    const [channelRole, setChannelRole] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [users, setUsers] = useState<Array<User>>([]);
    const [autoCompleteOpen, setAutoCompleteOpen] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<task>({
        defaultValues: {
            channelCode: channel.channel_code,
            assignedByEmail: user?.email,
            assignedByName: user?.firstName,
            assignedToEmail: "",
            assignedToName: "",
            taskName: "",
            dueTime: new Date().getTime(),
            taskStatus: "Pending",
        }
    });

    const getChannelRole = async () => {
        const role = await apiReq("channels", {
            type: "GET_USER_ROLE",
            channel_code: channel.channel_code,
            user_email: user?.email
        })
        setChannelRole(role);
    }

    useEffect(() => {
        (async () => {
            await getChannelRole();
        })()
    }, [])

    const loadUsers = async () => {
        const { channel_users, channel_roles } = await apiReq("users", { 
            type: "USERS_IN_CHANNEL", 
            channel_code: channel?.channel_code
        });
        setUsers(channel_users);
    }

    useEffect(() => {
        if (channelRole == "") {
            return
        }
        (async () => {
            if (channelRole as string == CHANNEL_ROLE.COURSE_MENTOR) {
                await getAllTaskList();
                await loadUsers();
            }
            await getUserTaskList();
        })()
    }, [channelRole]);


    const getUserTaskList = async () => {
        const userTaskList = await apiReq("channels", {
            type: "USER_TASKS",
            user_email: user?.email,
            channel_code: channel.channel_code
        })
        setUserTaskList(userTaskList)
    }

    const getAllTaskList = async () => {
        const allTaskList = await apiReq("channels", {
            type: "ALL_TASKS",
            channel_code: channel.channel_code 
        })
        setAllTaskList(allTaskList);
    }

    const addTasksToList = async (task: task) => {
        const status = await apiReq("channels", {
            type: "ADD_TASK",
            channelCode: channel.channel_code,
            data: task
        })

        apiReq("users", {
            type: "NOTIFY_USERS",
            channel_code: channel.channel_code,
            message: `${task.assignedByName} has assigned you a new task: ${task.taskName}`,
            user_emails: [task.assignedToEmail],
        })
    }

    const updateTaskLists = async () => {
        await getUserTaskList();
        if(channelRole == CHANNEL_ROLE.COURSE_MENTOR) {
            await getAllTaskList();
        }
    }

    return (
        <div>
            <Button
                variant="contained"
                className="bg-[#F68888] text-black"
                onClick={() => setOpen(true)}
                startIcon={<AssignmentIcon />}
            >
                Tasks
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
                    <Tab label="My Tasks" className={`${channelRole == CHANNEL_ROLE.COURSE_MENTOR ? "w-1/3" : "w-full"}`} />
                    {channelRole == CHANNEL_ROLE.COURSE_MENTOR && <Tab label="Manage All Tasks" className="w-1/3" />}
                    {channelRole == CHANNEL_ROLE.COURSE_MENTOR && <Tab label="Add Task" className="w-1/3" />}
                </Tabs>
                {
                    tabIndex == 0 &&
                    <div className="w-96 h-96 no-scrollbar overflow-auto">
                        {usertaskList.map((task) => {
                            return <TaskItem task={task} mentor_view={false} updateTaskLists={updateTaskLists} />
                        })}
                    </div>
                }
                {tabIndex == 1 && channelRole == CHANNEL_ROLE.COURSE_MENTOR &&
                    <div className="w-96 h-96 no-scrollbar overflow-auto">
                        {allTaskList.map((task) => {
                            return <TaskItem task={task} mentor_view={true} updateTaskLists={updateTaskLists} />
                        })}
                    </div>
                }

                {tabIndex == 2 && channelRole == CHANNEL_ROLE.COURSE_MENTOR &&
                    <div className="w-96 h-96">
                        <TextField label="Task Name" {...register("taskName", { required: true })} />
                        <Autocomplete
                            id="userNameAutoComplete"
                            key={users?.length || 0}
                            options={users || []}
                            open={autoCompleteOpen}
                            onOpen={() => {
                                setAutoCompleteOpen(true);
                            }}
                            onClose={() => {
                                setAutoCompleteOpen(false);
                            }}
                            getOptionLabel={(option: User) => option.firstName}
                            onChange={(event, value) => {
                                setValue("assignedToEmail", value?.email as string)
                                setValue("assignedToName", value?.firstName as string)
                            }}
                            defaultValue={null}
                            isOptionEqualToValue={(option, value) => option.email === value.email}
                            renderInput={(params) => <TextField
                                {...params}
                                label="User Name"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                    <Fragment>
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                    ),
                                }}
                            />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Due date and time"
                                onChange={(newValue) => setValue("dueTime", newValue as number)}
                            />
                        </LocalizationProvider>
                        <Button onClick={handleSubmit(async (data) => {
                            await addTasksToList(data);
                            await updateTaskLists();
                            reset();
                        })}>Add Task</Button>
                    </div>
                }
            </Dialog>
        </div>
    )
}
