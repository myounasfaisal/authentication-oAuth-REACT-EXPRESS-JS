import React from 'react';
import Container from '../components/Container/Container';
import Form from '../components/Form/Form';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { signup } from '../api/auth/auth';

function Signup() {
    
    
    async function handleSubmit(formData) {
    const { name, password, email } = formData;

    if (!name.trim() || !password.trim() || !email.trim()) {
      console.log("Credentials Missing: Please fill in all fields.");
      return;
    }

    const {data}=await signup(formData);

    if(data){
       await login(data);
    }

  }

  return (
    <Container>
      <h2 className="text-xl font-semibold mb-4">Signup Form</h2>
      <Form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <Input
            type="text"
            name="name" // Ensure this matches the key in the form data
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <Input
            type="email"
            name="email" // Ensure this matches the key in the form data
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <Input
            type="password"
            name="password" // Ensure this matches the key in the form data
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter password"
          />
        </div>
        <Button type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default Signup;