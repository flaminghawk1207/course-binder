import React from "react";
import { createContext, useState } from "react";
import { User } from "~/types";

type UserContextType = {
    user: User | null,                  // User object
    login: (user: User) => void,        // Login function (sets user)
    logout: () => void                  // Logout function
}

const nullUserContext: UserContextType = {
    user: null,
    login: () => {},
    logout: () => {},
}

export const UserContext = createContext<UserContextType>(nullUserContext);

export const UserProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    
    const login = (user: User) => {
        setUser(user);
    };
    
    const logout = () => {
        setUser(null);
    };

    const userContextValue = {
        user: user,
        login: login,
        logout: logout
    }
    
    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    )
};