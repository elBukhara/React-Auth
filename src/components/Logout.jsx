import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    // TODO: Implement logout connecting to backend

    useEffect(() => {
        const handleLogout = async () => {
            localStorage.clear();
            navigate("/login");
        };

        handleLogout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
