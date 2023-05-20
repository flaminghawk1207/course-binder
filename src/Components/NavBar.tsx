import React, { use, useEffect, useState } from 'react';
import { NavItem } from '~/types';
import { groupElements } from '~/utils';
import { Button, Typography } from '@mui/material';
import { LogOut } from './LogOut';

const groupColors = [
    'bg-[#EDC3AB]',
    'bg-[#fdba74]',
    'bg-[#EDC3AB]',
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
        <div className = "flex bg-black-100 h-screen bg-white">
            <div className="w-64 h-full m-1 bg-primary-color relative">
                {
                    groupedItems?.map((group: any, group_index: number) =>
                        group.map((item: NavItem) => 
                            <Button 
                                id={item.label}
                                key={item.label} 
                                variant="contained"
                                sx={{mt: 2}} 
                                className= {`w-48 text-[#0c0a09] hover:bg-[#EFAE89] ml-3
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
                <Button className='absolute bottom-0 left-0 w-48'>
                    <LogOut/>
                </Button>
            </div>

            <div className='w-full h-full bg-[#EDC3AB] '>
                {CurrentItem?.component} 
            </div>
        </div>
    );
}

export default NavBar;