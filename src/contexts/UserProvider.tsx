import React, { useEffect } from "react";
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

    useEffect(() => {
        const userFromLocalStorage = window.localStorage.getItem("user");
        if (userFromLocalStorage) {
            setUser(JSON.parse(userFromLocalStorage));
        }
    }, []);
    
    const login = (user: User) => {
        setUser(user);
        window.localStorage.setItem("user", JSON.stringify(user));
    };
    
    const logout = () => {
        setUser(null);
        window.localStorage.removeItem("user");
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