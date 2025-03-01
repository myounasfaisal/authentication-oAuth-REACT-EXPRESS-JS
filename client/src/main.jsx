import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AuthContextProvider from "./Context/Auth/AuthContextProvider.jsx";
import Main from "./pages/Main.jsx";
import GoogleCallBack from "./pages/GoogleCallBack.jsx";
import GithubCallBack from "./pages/GithubCallBack.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path:"/",
        element:<Main/>
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },{
        path:"/api/v1/users/auth/google/callback",
        element:<GoogleCallBack/>
      },
      {
      path:"/api/v1/users/auth/github/callback",
      element:<GithubCallBack/>
    }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);