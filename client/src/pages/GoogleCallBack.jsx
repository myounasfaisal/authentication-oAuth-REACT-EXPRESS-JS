import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContextProvider";

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
            const name = searchParams.get("name");

            if (!accessToken || !refreshToken) {
                console.error("Google authentication failed");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/v1/users/auth/getinfo", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Required if using cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const userData = await response.json();
                console.log("User Info:", userData);

                // Store tokens only after successful authentication
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                setUser(userData.data);

                console.log("Google login successful!", { accessToken, refreshToken, name });
                navigate("/");

            } catch (error) {
                console.error("Error fetching user info:", error);
                navigate("/login"); // Redirect to login if authentication fails
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
