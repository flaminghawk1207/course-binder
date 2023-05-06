import React, { useState } from 'react';
import { ChannelType } from '~/types/ChannelType';
import { Button, Typography } from '@mui/material';

const NavBar = ({items} : {items : Array<ChannelType>}) => {

    console.log("items");
    console.log(items);
    const [CurrentChannel, setCurrentChannel] = useState<ChannelType>();
    // change empty function to default admin page view
    const CurrentComponent = CurrentChannel? CurrentChannel.ChannelComponent : null;

    return (
        <div className = "flex bg-black-100 h-screen">
            <div className="w-1/5 h-full bg-red-100">
                {items?.map((channelInfo : ChannelType) => 
                    <Button key={channelInfo.channel_code} variant="outlined" sx={{mt: 2}} className="w-full" onClick={() => setCurrentChannel(channelInfo)}>
                        {channelInfo.channel_code}
                        <br />
                    </Button>
                )}
            </div>

            <div className='w-4/5 h-full bg-yellow-100'>
                {CurrentComponent} 
            </div>
        </div>
    );
}

export default NavBar;