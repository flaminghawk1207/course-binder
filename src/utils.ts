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