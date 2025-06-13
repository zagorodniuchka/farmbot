import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("farmbotToken");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (tokenData) => {
        localStorage.setItem("farmbotToken", JSON.stringify(tokenData));
        setAuth(tokenData);
    };

    const logout = () => {
        localStorage.removeItem("farmbotToken");
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
