import { useState, useEffect } from "react";
import api from "../api";


function Profile() {
    const [userData, setUserData] = useState({}); 

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        api
        .get("/user/me/")
        .then((response) => {
            setUserData(response.data);
            console.log("User data:", response.data);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    return (
    <div className="container">
        <h2 className="mt-5">This is Profile Page. You are successfully Logged In.</h2>
        <h3 className="mt-5">User Email: {userData.email}</h3>
    </div>
    );
}

export default Profile