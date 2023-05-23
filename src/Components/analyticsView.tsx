import { NextPage } from "next";
import { useEffect, useState } from "react";
import { PercentageDict } from "~/types";
import { apiReq, tempObject } from "~/utils"

import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Options } from 'highcharts';
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const DisplayPieChart = ({ child, updateLevelPointer }: { child: PercentageDict, updateLevelPointer: any }) => {
    const HighChart = ({ title }: { title: string }) => {

        const initialOptions: Highcharts.Options = {
            title: {
                text: title,
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            name: 'Uploaded',
                            y: child.levelPercentage,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y}',
                            },
                        },
                        {
                            name: 'Pending',
                            y: 100 - child.levelPercentage,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}: {point.y}',
                            },
                        },
                    ],
                },
            ],
            credits: {
                enabled: false, // Disable the credits
            },
            plotOptions: {
                pie: {
                    colors: ['#00FF00', '#FF0000'],
                },

                series: {
                    point: {
                        events: {
                            click: (e: any) => {
                                if (child.children.length > 0) {
                                    updateLevelPointer(child)
                                }
                            }
                        }
                    }
                }
            }
        };
        const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

        const [options, setOptions] = useState<Options>(initialOptions);

        return (
            <HighchartsReact className="justify-start"
                        highcharts={Highcharts}
                        options={options}
                        ref={chartComponentRef}
                    // {...props}
                    />
            // <div className="relative">
            //     {isLoading ? (
            //         <div role="status" className="fixed inset-0 flex items-center justify-center scale-200">
            //             <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-tertiary-color" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            //                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            //             </svg>
            //             <span className="sr-only">Loading...</span>
            //         </div>
            //     ) : (
                    
            //     )}
            // </div>

        );
    };
    return (
        <div>
            <HighChart title={child.levelElementName}></HighChart>
        </div>

    )
}

const AnalyticsView = ({ level, maxDepth, dept }: { level: string, maxDepth: number, dept?: string }) => {
    const [levelPointerArray, setLevelPointerArray] = useState<PercentageDict[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setIsLoading(true); // Set loading state to true before making the API request
            try {
                const percentage_dict = await apiReq("channels", {
                    type: "GET_PERCENTAGE_DICT",
                    level: level,
                    maxDepth: maxDepth,
                    dept: dept,
                });
                console.log(percentage_dict)
                setLevelPointerArray([percentage_dict]);
            } catch (error) {
                // Handle error
            } finally {
                setIsLoading(false); // Set loading state to false after the API request is completed
            }
        })();
    }, []);

    const updateLevelPointer = (child: PercentageDict) => {
        setLevelPointerArray(levelPointerArray.concat([child]));

    }

    const ReduceLevelPointer = () => {
        setLevelPointerArray(levelPointerArray.slice(0, levelPointerArray.length - 1));
    }
    return (
        <>
            <div className="flex bg-red-300 p-5">
                <div className="flex flex-grow">
                    <Button
                        variant="outlined"
                        className="bg-primary-color border-primary-color text-primary-txt rounded my-4"
                        startIcon={<ArrowBackIcon />}
                        onClick={ReduceLevelPointer}
                        disabled={levelPointerArray.length <= 1}
                    >
                        Previous
                    </Button>
                </div>
                <div className="flex flex-grow "><h1 className="text-4xl"><b>FILE SUBMISSION PROGRESS PIECHART</b></h1></div>
            </div>
            <div className="relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div role="status" className="fixed inset-0 flex items-center justify-center scale-200">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-tertiary-color" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-wrap overflow-auto max-h-[calc(100vh-80px)]">
                            {
                                levelPointerArray[levelPointerArray.length - 1]?.children.map((child) => {
                                    return (
                                        <div className="w-1/2 p-4 pb-0">
                                            <DisplayPieChart child={child} updateLevelPointer={updateLevelPointer}></DisplayPieChart>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}
            </div>

        </>

    )
}

export default AnalyticsView;