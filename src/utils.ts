export const apiReq = (apiPath: string, body: any) => {
    return fetch(`/api/${apiPath}`, {
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(t => t.json())
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