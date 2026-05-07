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
import { httpGetRequisets } from './host/Requiests.js';
import Cookies from 'js-cookie';


export default function App() {
  const { theme, loadUserFromStorage,setUserimg,token } = useStore();
  const location=useLocation(); 
    console.log("App render bo'ldi");
  

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    
    loadUserFromStorage();
    if(token){
  userImg()
    }
  
  }, [loadUserFromStorage,token]);
  const islogin=location.pathname==='/login2'

  const userImg=async()=>{
    try{
      let result=[]
       const res = await httpGetRequisets("/users/sessions");
                      // Faqat result mavjud bo'lgan ma'lumotlarni saqlaymiz
            res.data.data.filter(item => item && item.result).map((item,key)=>{
                return result.push(item.result.fileUrl)
            })
          

                      setUserimg(result)
                    

    }
    catch(err){

    }
  }

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
