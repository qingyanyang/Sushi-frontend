import axios from 'axios'
import { message } from 'antd'


console.log('console.log(process.env.REACT_APP_BASE_URL),',process.env.REACT_APP_BASE_URL)

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        if (type === 'GET') {
            promise = instance.get(url, {
                params: data
            })
        } else {
            promise = instance.post(url, data)
        }
        promise.then(response => {
            resolve(response)
        }).catch(error => {
            message.error('something wrong:' + error.message)
        })
    })

}
