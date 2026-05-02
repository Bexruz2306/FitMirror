import axios from "axios"
import Cookies from "js-cookie"

export const api='https://fitmirror-backend.onrender.com/api'
 

export const htttpRequistes=(link,method,data,params)=>{
    let token=Cookies.get("fitmirror_token")
    let a=window.location.href
    if(!token && link.indexOf('login2')==-1 && a.indexOf('login2')==-1 ){
        window.location.href='/'
    }
    return ( axios(
        {
        url:api+link,
        method:method,
        data:data,
       params:params,
       headers:{
        Authorization: `Bearer ${token}`
       }
    }))

}