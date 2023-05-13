import { NextPage } from "next";
import { useEffect, useState } from "react";
import { PercentageDict } from "~/types";
import { apiReq, tempObject } from "~/utils"

import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Options } from 'highcharts';


const DisplayPieChart = ({ child, updateLevelPointer }: { child: PercentageDict, updateLevelPointer: any }) => {
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
    return (
        <div>
            <button onClick={() => updateLevelPointer(child)}>{child?.levelElementName}</button>
            <h6>{child.levelPercentage}</h6>
            <HighChart></HighChart>
        </div>

    )
}

const AnalyticsView: NextPage = () => {
    const [levelPointerArray, setLevelPointerArray] = useState<PercentageDict[]>([]);

    useEffect(() => {
        (async () => {
            const percentage_dict = await apiReq("channels", {
                type: "GET_PERCENTAGE_DICT",
                level: "COLLEGE",
                maxDepth: 3,
                dept: null,
            });
            console.log(percentage_dict)
            setLevelPointerArray([percentage_dict]);
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
            <button onClick={ReduceLevelPointer} disabled={levelPointerArray.length <= 1} >Go previous</button>
            {
                levelPointerArray[levelPointerArray.length - 1]?.children.map((child) => {
                    return (
                        <div>
                            <DisplayPieChart child={child} updateLevelPointer={updateLevelPointer}></DisplayPieChart>
                        </div>
                    )
                })
            }
        </>

    )
}

export default AnalyticsView;