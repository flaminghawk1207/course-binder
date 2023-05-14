import React, { use, useEffect, useState } from 'react';
import { NavItem } from '~/types';
import { Button } from '@mui/material';
import { groupElements } from '~/utils';

const groupColors = [
    'bg-red-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
]

const groupColorsSelected = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
]

const NavBar = ({items, items_differentiator } : {items : Array<NavItem>, items_differentiator?: any}) => {
    const [CurrentItem, setCurrentItem] = useState<NavItem>();
    const [groupedItems, setGroupedItems] = useState<any[]>([]);

    if(!items_differentiator) items_differentiator = (item: NavItem) => true;

    useEffect(() => {
        setGroupedItems(groupElements(items, items_differentiator));
    }, [items])

    return (
        <div className = "flex bg-black-100 h-screen">
            <div className="w-1/5 h-full bg-red-100">
                {
                    groupedItems?.map((group: any, group_index: number) =>
                        group.map((item: NavItem) => 
                            <Button 
                                key={item.label} 
                                variant="contained"
                                sx={{mt: 2}} 
                                className= {`w-full 
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
            </div>

            <div className='w-4/5 h-full bg-yellow-100'>
                {CurrentItem?.component} 
            </div>
        </div>
    );
}

export default NavBar;