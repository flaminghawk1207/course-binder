import React, { useState } from 'react';
import { NavItem } from '~/types';
import { Button, Typography } from '@mui/material';

const NavBar = ({items} : {items : Array<NavItem>}) => {
    const [CurrentItem, setCurrentItem] = useState<NavItem>();

    return (
        <div className = "flex bg-black-100 h-screen">
            <div className="w-1/5 h-full bg-red-100">
                {items?.map((item: NavItem) => 
                    <Button 
                        key={item.label} 
                        variant="outlined" 
                        sx={{mt: 2}} 
                        className="w-full" 
                        onClick={() => setCurrentItem(item)}
                    >
                        {item.label}
                    </Button>
                )}
            </div>

            <div className='w-4/5 h-full bg-yellow-100'>
                {CurrentItem?.component} 
            </div>
        </div>
    );
}

export default NavBar;