import { useAuth } from "../../Context/Auth/AuthContextProvider";


export const login = async (credentials) => {
  const loginData = {
    email: credentials.email,
    password: credentials.password,
  };

  const options = {
    method: "POST",
    credentials: 'include', 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  };

  try {
    const response = await fetch("http://localhost:3000/api/v1/users/auth/login", options);

    if (response.ok) {
      const Response = await response.json();
      console.log("data auth : ");
      console.log(Response);

      const { data } = Response;


      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
      return data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

export const signup = async (credentials) => {
  const signupData = {
    name: credentials.name,
    password: credentials.password,
    email: credentials.email,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupData),
  };

  try {
    const response = await fetch("http://localhost:3000/api/v1/users/auth/signup", options);

    if (response.ok) {
      const Response = await response.json();
      return Response;
    } else {
      throw new Error("Signup failed");
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
