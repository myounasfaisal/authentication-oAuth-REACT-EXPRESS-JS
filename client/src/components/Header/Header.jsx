import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import { useAuth } from "../../Context/Auth/AuthContextProvider";
import { logout } from "../../api/auth/auth";
function Header() {
  const { user,setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout =async () => {
    const response=await logout();

    // if(response){
        setUser(null);
    // }
  };

  return (
    <header className="w-full border-t-0 border-b-2 p-4">
      <nav className="w-full flex justify-between items-center">
        <Logo />
        <h1 className="text-2xl font-bold">Auth System</h1>
        <div className="h-full p-0 flex items-center">
          {user ? (
        
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.name}!</span>
              <Button onClick={handleLogout} color="white" aria-label="Logout">
                Logout
              </Button>
            </div>
          ) : (
        
            <>
              <NavLink to="/login">
                <Button aria-label="Login">Login</Button>
              </NavLink>
              <NavLink to="/signup" className="ml-4">
                <Button color="white" aria-label="Signup">
                  Signup
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;