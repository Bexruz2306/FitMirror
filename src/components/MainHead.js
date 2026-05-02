import React, { useEffect } from 'react'
import './mainhead.scss'
import { Link } from 'react-router-dom'
import star from '../images/icons/navbar1.svg'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie' 

import { Carousel, message } from 'antd'
import { httpGetRequisets } from '../host/Requiests'
import { useStore } from '../store/store'
import img1 from '../img/img1.jpg'
import img2 from '../img/img2.jpg'
import img3 from '../img/img3.jpg'

export default function MainHead() {
    const images = [img1, img2, img3];


    const {setUserMe}=useStore()
   
    const token=Cookies.get("fitmirror_token")
    const clas_token = token ? '/uploade' : '/';
     const warningbutton=()=>{
        if(!token){
            message.warning(t('auth.login_required'))   
        }
    }
    useEffect(()=>{
                const getME=async()=>{
                    if (!token) return;
                    try{
                        const resdata=await httpGetRequisets("/users/me");
                        setUserMe(resdata.data.data);
                        
                    }
                    catch(err){
                        // Error handled quietly to not disturb UI
                    }

                }
                getME();

    },[token]) // eslint-disable-line react-hooks/exhaustive-deps
  const { t } = useTranslation()
  return (
    <div className='mainhead'>
        <div className='mainhead_box'>
            <div className='mainhead_box_top'> {t('main_head.top')} </div>
            <h1>{t('main_head.title')}</h1>
<p>{t('main_head.description')}</p>
<div className='mainhead_box_bottom'>
    
    <Link onClick={warningbutton} className='button_uploade' to={clas_token}> <span>{t('main_head.start_trying_on')}</span> <img src={star} alt=""/></Link>

</div>
        </div>
        <div className='mainhead_img'>
            <Carousel autoplay autoplaySpeed={3000} effect="fade" dots={false}>
  {images.map((src, i) => (
    <div className='mainhead_img_carusel' key={i}>
      <img src={src} alt="" style={{
       
      }}/>
    </div>
  ))}
</Carousel>
             </div>
    </div>
  )
}
