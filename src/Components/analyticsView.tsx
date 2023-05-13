import { updatePhoneNumber } from "firebase/auth";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { PercentageDict } from "~/types";
import { tempObject } from "~/utils"

import React, { useRef } from 'react';

// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Options } from 'highcharts';


const DisplayPieChart = ({ child, updateLevelPointer, levelPointerArray }: { child: PercentageDict, updateLevelPointer: any, levelPointerArray: PercentageDict[] }) => {

    // const data = {
    //   label: ['Uploaded', 'Not Uploaded'],
    //   datasets: [
    //     {
    //       label: ['File Uploads'],
    //       data: [child.levelPercentage, 100 - child.levelPercentage]
    //     }

    //   ]
    // }

    const HighChart = (props: HighchartsReact.Props) => {

        const initialOptions: Highcharts.Options = {
            title: {
                text: 'My chart',
            },
            series: [
                {
                    type: 'pie',
                    data: [child.levelPercentage, 100 - child.levelPercentage],
                },
            ],
            plotOptions: {
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
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                {...props}
            />
        );
    };
    // console.log("Printing level pointer array",levelPointerArray)
    return (
        <div>
            <button onClick={() => updateLevelPointer(child)}>{child?.levelElementName}</button>
            <h6>{child.levelPercentage}</h6>
            <HighChart></HighChart>
        </div>

    )
}

const AnalyticsView: NextPage = () => {
    const [percentageDict, setPercentageDict] = useState<PercentageDict>();
    const [levelPointerArray, setLevelPointerArray] = useState<PercentageDict[]>([tempObject]);


    console.log(tempObject)

    const updateLevelPointer = (child: PercentageDict) => {
        setLevelPointerArray(levelPointerArray.concat([child]));

    }

    const ReduceLevelPointer = () => {
        setLevelPointerArray(levelPointerArray.slice(0, levelPointerArray.length - 1));
    }
    return (
        <>
            <>
                <button onClick={ReduceLevelPointer} disabled={levelPointerArray.length == 1} >Go previous</button>
                {
                    levelPointerArray[levelPointerArray.length - 1]?.children.map((child) => {
                        return (
                            <div>
                                <DisplayPieChart child={child} updateLevelPointer={updateLevelPointer} levelPointerArray={levelPointerArray}></DisplayPieChart>
                            </div>

                        )

                    })
                }
            </>

        </>

    )
}

export default AnalyticsView;