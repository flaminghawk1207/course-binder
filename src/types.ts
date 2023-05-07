import { ReactNode } from 'react';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface Channel {
    channel_code: string,
    channel_name: string,
    channel_department: string,
    member_emails: string[],
}

export interface ChannelType {
    ChannelComponent: ReactNode;
    channel: Channel;
}

export interface NavItem {
    label: string;
    component: ReactNode;
}