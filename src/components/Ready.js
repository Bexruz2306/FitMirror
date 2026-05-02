import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'
import { message } from 'antd'

export default function Ready() {
  const token=Cookies.get("fitmirror_token")
    var clas_token='/'
    token?(clas_token='/uploade'):(clas_token='/') 
     const warningbutton=()=>{
        if(!token){
            message.warning(t('auth.login_required'))   
        }
    }
  
    const { t } = useTranslation()
    return (
      <div className='ready'>
        <div className='ready_box'>
        <h1>{t('ready.title')}</h1>
        <p>{t('ready.description')}</p>
        <Link onClick={warningbutton} to={clas_token}>{t('ready.get_started')}</Link></div>
      </div>
    )
}
