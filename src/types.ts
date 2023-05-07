import { ReactNode } from 'react';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

export enum Role {
    ADMIN = "admin",
    PRINCIPAL = "principal",
    HOD = "hod",
    FACULTY = "faculty"
}

export interface Channel {
    channel_code: string,
    channel_name: string,
    channel_department: string,
}

export interface ChannelMemberRelationship {
    email: string,
    channel_role: ChannelRole,
    channel_code: string,
}

export enum ChannelRole {
    COURSE_MENTOR = "course_mentor",
    FACULTY = "faculty"
}

export interface NavItem {
    label: string;
    component: ReactNode;
}

export interface CourseBinderError {
    type: ErrorType;
    message: string;
}

export enum ErrorType {
    USER_NOT_FOUND,
}