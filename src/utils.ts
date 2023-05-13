import { PercentageDict } from "./types"

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