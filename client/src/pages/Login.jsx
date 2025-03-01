import React, { useEffect } from 'react';
import Container from '../components/Container/Container';
import Form from '../components/Form/Form';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { login } from '../api/auth/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Auth/AuthContextProvider';

function Login() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleButton = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/api/v1/users/auth/google";
  };

  const handleGitHubButton = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/api/v1/users/auth/github";
  };

  async function handleSubmit(formData) {
    const { password, email } = formData;

    if (!password.trim() || !email.trim()) {
      console.log("Credentials Missing: Please fill in all fields.");
      return;
    }

    console.log("Form Data Submitted:", formData);

    const data = await login(formData);
    setUser(data);
    console.log(data);

    navigate("/");
  }

  return (
    <Container>
      <h2 className="text-xl font-semibold mb-4">Login Form</h2>
      <Form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <Input type="email" name="email" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter email" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <Input type="password" name="password" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter password" />
        </div>
        <Button color="white" type="submit">Login</Button>
        <br />
        <br />
        <div className='flex w-full justify-center items-center gap-4 flex-wrap'>
        <Button onClick={handleGoogleButton}>Log In With Google</Button>
        
        <Button onClick={handleGitHubButton} style={{backgroundColor:'black',color:"white"}}>Log In With GitHub</Button>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
