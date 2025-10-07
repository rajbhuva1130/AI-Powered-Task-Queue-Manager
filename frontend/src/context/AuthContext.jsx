import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    })()
  );

  const login = (jwtResponse) => {
    localStorage.setItem("token", jwtResponse.access_token);
    localStorage.setItem("user", JSON.stringify(jwtResponse.user));
    setToken(jwtResponse.access_token);
    setUser(jwtResponse.user);
    navigate("/dashboard");
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser({});
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
