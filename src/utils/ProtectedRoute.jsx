import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds
const BACKGROUND_REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes in milliseconds

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))

        // Background token refresh every 25 minutes
        const intervalId = setInterval(() => {
            
            console.log("Refreshing token...");
            refreshToken().catch(() => setIsAuthorized(false));

        }, BACKGROUND_REFRESH_INTERVAL);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        
        try {
            const response = await api.post("/auth/refresh/", {
                refresh: refreshToken, 
            });

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000 // in seconds

        if (tokenExpiration - now < TOKEN_REFRESH_THRESHOLD) {
            console.log("Token is close to expiration, refreshing...")
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    if (isAuthorized) {
        return children
    } else {
        logout()
        return <Navigate to="/login" />
    }

}

export default ProtectedRoute