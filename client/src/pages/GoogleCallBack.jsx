import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContextProvider";
import { fetchUserWithAccessToken } from "../api/auth/auth";

function GoogleCallBack() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const hasFetched = useRef(false); 

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const authenticateUser = async () => {
            const searchParams = new URLSearchParams(location.search);
            const accessToken = searchParams.get("accessToken");
            const refreshToken = searchParams.get("refreshToken");


            if (!accessToken || !refreshToken) {
                console.error("Google authentication failed");
                navigate("/login");
                return;
            }

           const userData=  await fetchUserWithAccessToken()
             if(userData){ 
             setUser(userData);
               navigate("/");
             }
             else{
                console.error("Error while logging the User");
                navigate("/login")
             }
        };

     authenticateUser();
    }, [location, navigate, setUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Logging in with Google...</h2>
                <div className="mt-4 flex justify-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                </div>
                <p className="mt-2 text-gray-600">Please wait while we authenticate your account.</p>
            </div>
        </div>
    ); 
}

export default GoogleCallBack;
