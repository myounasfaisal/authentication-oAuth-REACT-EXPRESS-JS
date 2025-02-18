import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize user as null

    
    const value = {
        user,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContextProvider;