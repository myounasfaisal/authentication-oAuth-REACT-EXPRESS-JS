import React from 'react'
import Container from '../components/Container/Container'
import { useAuth } from '../Context/Auth/AuthContextProvider';

function Main() {

    const {user}=useAuth();


  return (
    <Container>
{user ? (
    
    <h3 className='text-3xl'>
        Hello ! {user.name}
    </h3>
    

): (<div className='text-3xl'>
    Please Login ! 
</div>)}
    </Container>
  )
}

export default Main