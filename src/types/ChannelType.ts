import { ReactNode } from 'react';

export interface ChannelType {
    ChannelComponent: ReactNode;
    channel_code : string;
    channel_department : string;
    channel_name : string;
    member_emails : Array<string>;
}