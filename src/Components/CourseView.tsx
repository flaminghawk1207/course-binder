// takes in channel_name, channel_code, channel_department
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Channel, FirebaseFile, FirebaseFolder } from "~/types";
import { apiReq } from "~/utils";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

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

    const setFilesAndClose = () => {
        setUploadFile(null);
        closeDialog();
    }
    
    const closeDialog = () => {
        setUploadFile(null);
        setOpen(false);
    }

    const handleDrop = (acceptedFiles: any) => {
        setUploadFile(acceptedFiles[0])
    }

    const clearFiles = () => {
        setUploadFile(null)
    }

    const uploadFileToFirebase = async () => {

        // const formData = new FormData();
        // formData.append("file", uploadFile as Blob);

        console.log("Uploaded", uploadFile);
        const txt = await uploadFile?.text();
        await apiReq("channels", {
            type: "UPLOAD_FILE",
            fileContent: txt,
            fileName: fullPath,
        });

        // fetch('/api/uploadFile', {
        //     method: 'POST',
        //     body: formData,
        //   })
        //   .then(response => response.json())
        //   .then(data => console.log(data))
        //   .catch(error => console.error(error));

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
                <Button onClick={setFilesAndClose}>Ok</Button>
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

const CourseView = ({channel}: {channel: Channel}) => {
    const [completeDir, setCompleteDir] = useState<FirebaseFolder>({} as FirebaseFolder);
    const [currDir, setCurrDir] = useState<string[]>([]);

    const currDirObject = getCurrDirObject(completeDir, currDir);

    useEffect(() => {
        (async () => {
            refreshCompleteDir();
            setCurrDir([]);
        })()
    }, [channel])

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

    if(!completeDir) return (<h1>Loading...</h1>)
    
    return (
        <div>
            <div>
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
                    currDirObject?.children?.map((child) => {
                        if(child.type === "folder") {
                            return <FolderComponent folder={child} moveIntoFolder={moveIntoFolder} />
                        } else {
                            return <FileComponent file={child} refreshCompleteDir={refreshCompleteDir}/>
                        }
                    })
                }
            </div>
        </div>
    );
}

export default CourseView;