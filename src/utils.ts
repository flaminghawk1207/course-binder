import { ref } from "@firebase/storage"
import { firebase_file_storage } from "./server/firebase"
import { PercentageDict, FirebaseFolder, FirebaseFile } from "./types"
import { getAllFilesRecursive } from "./server/db"

export const apiReq = (apiPath: string, body: any) => {
    return fetch(`/api/${apiPath}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(t => t.json())
}

export const tempObject = {
    levelElementName: "totalData",
    levelPercentage: 0,
    children: [
        {
            levelElementName: "college",
            levelPercentage: 1,
            children: [
                {
                    levelElementName: "CSE",
                    levelPercentage: 2,
                    children: [
                        {
                            levelElementName: "I",
                            levelPercentage: 3,
                            children: [
                                {
                                    levelElementName: "19CSE101",
                                    levelPercentage: 4,
                                    children : [] as PercentageDict[]
                                },
                                {
                                    levelElementName: "19CSE102",
                                    levelPercentage: 5,
                                    children : [] as PercentageDict[]
                                }
                            ] as PercentageDict[]
                        }
                    ] as PercentageDict[]
                },
                {
                    levelElementName: "ECE",
                    levelPercentage: 6,
                    children: [
                        {
                            levelElementName: "I",
                            levelPercentage: 7,
                            children: [
                                {
                                    levelElementName: "19ECE101",
                                    levelPercentage: 8,
                                    children : [] as PercentageDict[]
                                },
                                {
                                    levelElementName: "19ECE102",
                                    levelPercentage: 9,
                                    children : [] as PercentageDict[]
                                }
                            ] as PercentageDict[]
                        }
                    ] as PercentageDict[]
                }
            ] as PercentageDict[]
        }
    ] as PercentageDict[]
}

export const DEF_TEMPLATE = {
    name : "",
    type : "folder",
    contents : [
        {
            name : "quiz",
            type : "folder",
            contents : [
                {
                    name : "quiz1",
                    type : "folder",
                    contents : [
                        {
                            name : "marks_csea.xlxs",
                            type : "file",
                        },
                        {
                            name : "marks_cseb.xlxs",
                            type : "file",
                        },
                    ]
                },
                {
                    name : "quiz2",
                    type : "folder",
                    contents : [
                        {
                            name : "marks_csea.xlxs",
                            type : "file",
                        },
                        {
                            name : "marks_cseb.xlxs",
                            type : "file",
                        },
                    ]
                }
            ]
        }
    ]
}

export const DEF_TEMPLATE2 = {
    name : "",
    type : "folder",
    contents : [
        {
            name : "assignment",
            type : "folder",
            contents : [
                {
                    name : "Asgn1",
                    type : "folder",
                    contents : [
                        {
                            name : "marks_csea.xlxs",
                            type : "file",
                        },
                        {
                            name : "marks_cseb.xlxs",
                            type : "file",
                        },
                    ]
                },
                {
                    name : "Asgn2",
                    type : "folder",
                    contents : [
                        {
                            name : "marks_csea.xlxs",
                            type : "file",
                        },
                        {
                            name : "marks_cseb.xlxs",
                            type : "file",
                        },
                    ]
                }
            ]
        }
    ]
}

export const DEF_LAB_TEMPLATE = {
    name : "",
    type : "folder",
    contents : [
        {
            name : "phase1",
            type : "folder",
            contents : [                
                {
                    name : "progress_report.txt",
                    type : "file",
                },
                {
                    name : "lab_activities.txt",
                    type : "file",
                },
            ]
        },
        {
            name : "phase2",
            type : "folder",
            contents : [                
                {
                    name : "progress_report.txt",
                    type : "file",
                },
                {
                    name : "lab_activities.txt",
                    type : "file",
                },
            ]
        }
    ]
}

export const check_template = (template: any) => {
    if(!template) return false;
    if(template.type == "file") {
        if(!template.hasOwnProperty("name")) return false;
        if(!template.hasOwnProperty("contents")) return false;
    } else if (template.type == "folder") {
        if(!template.hasOwnProperty("name")) return false;
        if(!template.hasOwnProperty("contents")) return false;
        for(let i = 0; i < template.contents.length; i++) {
            if(!check_template(template.contents[i])) return false;
        }
    } else {
        return false;
    }
    return true;
}

export const constructPercentageDict = async (level: string, maxLevels: number, dept?: string) => {
    let dirName = "";
    if(level == "COLLEGE") {
        dirName = "";
    } else if (level == "DEPARTMENT") {
        dirName = dept!;
    }

    const storageRef = ref(firebase_file_storage, dirName);

    const allFiles = await getAllFilesRecursive(storageRef);

    const percentageDict = constructPercentageDictRecursive(allFiles, maxLevels);
    return percentageDict;
}

export function collapsePercentageDict(fileFolder: (FirebaseFolder | FirebaseFile)): [number, number] {
    if(fileFolder.type == "file") {
        if(fileFolder.empty) {
            return [0, 1];
        } else {
            return [1, 1];
        }
    }

    let uploaded = 0;
    let totalFiles = 0;
    fileFolder.children.forEach(child => {
        const [child_uploaded, child_totalFiles] = collapsePercentageDict(child);
        uploaded += child_uploaded;
        totalFiles += child_totalFiles;
    });

    return [uploaded, totalFiles];
}

export function constructPercentageDictRecursive(allFiles: (FirebaseFolder | FirebaseFile), depth: number): PercentageDict  {
    if(allFiles.type == "file") {
        return {
            levelElementName: allFiles.name,
            levelPercentage: allFiles.empty ? 0 : 100,
            children: [] as PercentageDict[]
        } as PercentageDict;
    } else {
        if(depth == 0) {
            const [uploaded, totalFiles] = collapsePercentageDict(allFiles);
            return {
                levelElementName: allFiles.name,
                levelPercentage: (uploaded / totalFiles) * 100,
                children: [] as PercentageDict[]
            }
        }

        const children = allFiles.children.map(child => constructPercentageDictRecursive(child, depth - 1));
        const levelPercentage = children.reduce((partialSum, child) => partialSum += child?.levelPercentage, 0) / children.length;

        return {
            levelElementName: allFiles.name,
            levelPercentage: levelPercentage,
            children: children
        } as PercentageDict;
    }
}

export const groupElements = (list: any[], keyGetter: any) => {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return [...map.values()];
}