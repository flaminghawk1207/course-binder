// takes in channel_name, channel_code, channel_department
import { Button, Tab, Tabs, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { CHANNEL_ROLE, Channel, FirebaseFile, FirebaseFolder } from "~/types";
import { DEF_LAB_TEMPLATE, DEF_TEMPLATE, DEF_TEMPLATE2, apiReq, check_template } from "~/utils";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { UserContext } from "~/contexts/UserProvider";

const FolderComponent = ({folder, moveIntoFolder}: {folder: FirebaseFolder, moveIntoFolder: any}) => {
    return (
        <div className="bg-blue-100">
            <Button onClick={() => moveIntoFolder(folder.name)}>{folder.name}</Button>
        </div>
    );
}

const FileUploadDialog = ({fullPath, refreshCompleteDir}: {fullPath: string, refreshCompleteDir: any}) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setUploadFile(null);
        setOpen(false);
    }

    const handleDrop = (acceptedFiles: any) => {
        setUploadFile(acceptedFiles[0])
    }

    const uploadFileToFirebase = async () => {

        console.log(uploadFile);
        const formData = new FormData();
        formData.append("file", uploadFile as Blob, uploadFile?.name as string);
        formData.append("fullPath", fullPath);
        const status = await fetch(`/api/uploadFile`, {
            method: "POST",
            body: formData,
        }).then(t => t.json())

        alert("File uploaded successfully");
        refreshCompleteDir();
        closeDialog();
    }
        
    
    return (
        <>
            <Button variant="contained" className="bg-slate-700" onClick={handleClickOpen}>Upload File</Button>
            <Dialog open={open} onClose={closeDialog}>
                <DialogContent>
                    <Dropzone onDrop={handleDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag a file here, or click to select a file</p>
                            </div>
                            </section>
                        )}
                    </Dropzone>
                    <p>{uploadFile?.name}</p>
                </DialogContent>
                <DialogActions>
                <Button onClick={uploadFileToFirebase} disabled={uploadFile === null}>Upload</Button>
                <Button onClick={closeDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const FileComponent = ({file, refreshCompleteDir}: {file: FirebaseFile, refreshCompleteDir: any}) => {
    const deleteFile = async () => {
        await apiReq("channels", {
            type: "DELETE_FILE",
            fullPath: file.fullPath,
        });
        refreshCompleteDir();
    }

    return (
        <div className="bg-red-100 flex">
            <p>{file.name}</p>
            <div className="bg-white flex-1 items-end">
                {
                    file.empty
                    ? <FileUploadDialog fullPath={file.fullPath} refreshCompleteDir={refreshCompleteDir}/>

                    : [<a className="mx-10" href={file.downloadURL} target="_blank">Download</a>,
                        <button className="mx-10" onClick={deleteFile}>Delete</button>]
                }
            </div>
        </div>
    );
}

const getCurrDirObject = (completeDir: FirebaseFolder, path: string[]) => {
    if(!completeDir) return null;

    let currDir = completeDir;
    path.forEach((folder) => {
        currDir = currDir.children?.find((child) => child.name === folder) as FirebaseFolder;
    });
    return currDir;
}

const TemplateDialog = ({channel, refreshFileSys}: {channel: Channel, refreshFileSys: any}) => {
    const [customTemplate, setCustomTemplate] = useState<string>(""); // If using custom template
    const [tabIndex, setTabIndex] = useState<number>(0); // 0: Default Template 1, 1: Default Template 2, 2: Custom Template

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const closeDialog = () => {
        setOpen(false);
    }

    const setTemplateAndClose = async () => {
        let new_template;
        if(tabIndex == 0) {
            new_template = JSON.stringify(DEF_TEMPLATE);
        } else if (tabIndex == 1) {
            new_template = JSON.stringify(DEF_TEMPLATE2);
        } else if (tabIndex == 2) {
            new_template = JSON.stringify(DEF_LAB_TEMPLATE);
        } else {
            let new_temp_obj;
            try {
                new_temp_obj = JSON.parse(customTemplate);
            } catch (e) {
                alert("Invalid template: Invalid JSON");
                return;
            }

            if(!check_template(new_temp_obj)) {
                alert("Invalid template: Format not correct");
                return;
            }            
            new_template = customTemplate
        }

        if (channel.channel_template == new_template) {
            closeDialog();
            return;
        }
                        
        const ans = window.confirm(
            "Changing template will remove all existing files related to the channel. This action is not reversible. Are you sure you want to continue?"
        )

        if(!ans) return;
        console.log("Template Changed", new_template);
        await apiReq("channels", {
            type: "SET_NEW_TEMPLATE",
            channel: channel,
            new_template: new_template,
        });
        await refreshFileSys();
        // await refreshChannels();
        channel.channel_template = new_template;
        alert("Template changed successfully")
        closeDialog();
    }

    return (
        <>
            <Button variant="contained" className="bg-[#F68888] text-black" onClick={handleClickOpen}>Template Settings</Button>
            <Dialog open={open} onClose={closeDialog}>
                <DialogContent>
                    <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} aria-label="basic tabs example">
                        <Tab label="Template 1"/>
                        <Tab label="Template 2"/>
                        <Tab label="Lab Template 1"/>
                        <Tab label="Custom Template"/>
                    </Tabs>

                    {tabIndex == 0 && <TextField 
                                        className = "h-full w-full"
                                        value={JSON.stringify(DEF_TEMPLATE)}
                                        contentEditable={false}
                                        />
                    }
                    {tabIndex == 1 && <TextField 
                                        className = "h-full w-full"
                                        value={JSON.stringify(DEF_TEMPLATE2)}
                                        contentEditable={false}
                                        />
                    }
                    {tabIndex == 2 && <TextField 
                                        className = "h-full w-full"
                                        value={JSON.stringify(DEF_LAB_TEMPLATE)}
                                        contentEditable={false}
                                        />
                    }
                    {tabIndex == 3 && <TextField 
                                        className = "h-full w-full"
                                        value={customTemplate} 
                                        onChange={(e) => setCustomTemplate(e.target.value)}
                                        />
                    }
                </DialogContent>
                <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={setTemplateAndClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const CourseView = ({channel}: {channel: Channel}) => {
    const {user} = useContext(UserContext);
    const [channelUserRole, setChannelUserRole] = useState<string>("faculty");

    const [completeDir, setCompleteDir] = useState<FirebaseFolder>({} as FirebaseFolder);
    const [currDir, setCurrDir] = useState<string[]>([]);

    const currDirObject = getCurrDirObject(completeDir, currDir);

    const [fsLoading, setFSLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await refreshFileSys();
        })()
    }, []);

    const refreshFileSys = async () => {
        setFSLoading(true);
        console.log("Refreshing File System");
        await refreshCompleteDir();
        setCurrDir([]);
        setFSLoading(false);
    }

    useEffect(() => {
        (async () => {
            const role = await apiReq("channels", {
                type: "GET_USER_ROLE",
                channel_code: channel.channel_code,
                user_email: user?.email,
            }) as string;
            console.log(role);
            setChannelUserRole(role);
        })()
    }, [user])

    const refreshCompleteDir = async () => {
        const all_files = await apiReq("channels", {
            type: "ALL_FILES",
            channel: channel,
        }) as FirebaseFolder;
        setCompleteDir(all_files)
    }

    const moveIntoFolder = (folder: string) => {
        setCurrDir([...currDir, folder]);
    }

    const moveOutOfFolder = () => {
        setCurrDir(currDir.slice(0, currDir.length - 1));
    }

    return (
        <div className="bg-[#D9C9B1] m-1">
            <div className="text-lg">
                    <p>Course Code: {channel.channel_code}</p>
                    <p>Course Name: {channel.channel_name}</p>
                    <p>Course Deparment: {channel.channel_department}</p>
            </div>
            <div>
                <h1 className="font-bold font-9xl">Current Directory: {currDir[currDir.length - 1]}</h1>
                <button onClick={moveOutOfFolder}>Back</button>
            </div>
            <div>
                {
                    fsLoading ? <h1>Loading files...</h1> :
                    currDirObject?.children?.map((child) => {
                        if(child.type === "folder") {
                            return <FolderComponent key={child.fullPath} folder={child} moveIntoFolder={moveIntoFolder} />
                        } else {
                            return <FileComponent key={child.fullPath} file={child} refreshCompleteDir={refreshCompleteDir}/>
                        }
                    })
                }
            </div>
            {
                channelUserRole == CHANNEL_ROLE.COURSE_MENTOR 
                ? <TemplateDialog channel={channel} refreshFileSys={refreshFileSys}/>
                : null
            }
        </div>
    );
}

export default CourseView;