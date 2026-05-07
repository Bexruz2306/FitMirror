
import { htttpRequistes } from "./Host"


export const httpGetRequisets=(link,params)=>{
    return (htttpRequistes(link,'GET',null,params))
}
export const httpPostRequisets=(link,data)=>{
    return (htttpRequistes(link,'POST',data))
}
export const httpPutRequisets=(link,data)=>{
    return (htttpRequistes(link,'PUT',data))
}

export const httpDeleteRequisets=(link)=>{
    return (htttpRequistes(link,'DELETE'))}