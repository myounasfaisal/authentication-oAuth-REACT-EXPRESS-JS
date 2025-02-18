import Header from './components/Header/Header'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useAuth } from './Context/Auth/AuthContextProvider';

function App() {
  
  const {user}=useAuth();

  console.log(user);

  return (
    <>
  <Header/>
  <Outlet/>
    </>
  )
}

export default App
