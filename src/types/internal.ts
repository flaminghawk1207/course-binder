import { Dispatch, SetStateAction } from "react";
import { User } from "./User";

export type userSetter = Dispatch<SetStateAction<User | null>>