import { Dispatch, SetStateAction } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    role: string;
}

export type userSetter = Dispatch<SetStateAction<User | null>>