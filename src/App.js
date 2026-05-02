import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Route, Routes, useLocation} from 'react-router-dom';
import Main from './components/UplodePage/Main.js';
import Footer from './components/Footer/Footer.js';
import UplodePage from './components/UplodePage/UplodePage.js';
import Result from './components/Result.js';
import { useStore } from './store/store.js';
import Login2 from './login/Login2.js';
import Profile from './login/profile/Profile.js';
import Price from './components/pricing/Price.js';
import Settings from './components/Settings.js';

export default function App() {
  const { theme, loadUserFromStorage } = useStore();
  const location=useLocation();  

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);
  const islogin=location.pathname==='/login2'

  // hello git

  return (


    <div className='box'>
      {!islogin && <Navbar/>} 
      <Routes>
        <Route path='/login2' element={<Login2/>}/>
        {/* <Route path='/login' element={<Login/>}/>        */}
       <Route path='/' element={<Main/>}/>
       <Route path='/uploade' element={<UplodePage/>}/>
       <Route path='/uploade/result' element={<Result/>}/>
       <Route path='/profile' element={<Profile/>}/>
       <Route path='/pricing' element={<Price/>}/>
       <Route path='/settings' element={<Settings/>}/>  

       
      </Routes>
      {!islogin && <Footer/>}

    </div>
  )
}
