import axios from "axios"
import { BASE_URL } from "../constants"

export const apiRequest = (url: string, payload: any, type: string) => {
    const headers = {
        'Content-Type': type === 'general' ? 'application/json;charset=UTF-8' : 'multipart/form-data',
        'Authorization': localStorage.getItem('access_token') ? `Bearer ${localStorage.getItem('access_token')}` : '',
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    }
    return axios.post(`${BASE_URL}/${url}`, payload,
        { headers: headers },
    )
        .then(((res: any) => {
            return res.data 
        }))
        .catch((err: any) => {
            throw err
        })
} 