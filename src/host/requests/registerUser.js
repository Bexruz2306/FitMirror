import { httpPostRequisets } from "../Requiests"

export const registerUser=(data)=>{
    return (httpPostRequisets('/users/register',data))
}
export const loginUser=(data)=>{
    return (httpPostRequisets('/users/login',data))
}