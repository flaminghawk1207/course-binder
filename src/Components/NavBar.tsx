import React, { use, useEffect, useState } from 'react';
import { NavItem } from '~/types';
import { groupElements } from '~/utils';
import { Button, Typography } from '@mui/material';
import { LogOut } from './LogOut';
import { AppNotifications } from './AppNotifications';

const groupColors = [
    'bg-primary-color',
    'bg-[#fdba74]',
    'bg-primary-color',
    'bg-red-200'
]

const groupColorsSelected = [
    'bg-[#EFAE89]',
    'bg-[#EFAE89]',
    'bg-[#EFAE89]',
    'bg-green-300'
    
]

const NavBar = ({items, items_differentiator } : {items : Array<NavItem>, items_differentiator?: any}) => {
    const [CurrentItem, setCurrentItem] = useState<NavItem>();
    const [groupedItems, setGroupedItems] = useState<any[]>([]);

    if(!items_differentiator) items_differentiator = (item: NavItem) => true;

    useEffect(() => {
        setGroupedItems(groupElements(items, items_differentiator));
    }, [items])

    return (
        <div className = "flex h-screen">
            <div className="w-1/6 h-full bg-secondary-color relative text-center">
                {
                    groupedItems?.map((group: any, group_index: number) =>
                        group.map((item: NavItem) => 
                            <Button 
                                id={item.label}
                                key={item.label} 
                                variant="contained"
                                sx={{mt: 2}} 
                                className= {`w-4/5 text-primary-txt hover:bg-hovercolor inline-block
                                    ${CurrentItem?.label === item.label ? groupColorsSelected[group_index]: groupColors[group_index]}`
                                }
                                onClick={() => setCurrentItem(item)}
                                aria-selected={CurrentItem?.label === item.label}
                            >
                                {item.label}
                            </Button>
                        )
                    ).flat()
                }
                <div className="absolute bottom-0 w-full flex flex-col text-center">
                    <AppNotifications/>

                    <LogOut/>
                </div>
            </div>

            <div className='w-full h-full bg-primary-color'>
                {CurrentItem?.component} 
            </div>
        </div>
    );
}

export default NavBar;