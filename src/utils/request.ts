import router from "@/router";
import axios from "axios";
import { ElMessage } from 'element-plus'

const env = import.meta.env
let baseUrl = '' as any;
if (env.MODE === 'development') {
    baseUrl = env.VITE_REQUEST_BASE_URL
}else if(env.MODE === 'production'){
    baseUrl = env.VITE_REQUEST_BASE_URL
}
axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 600000;
axios.interceptors.request.use(config => {
    // 发起请求时最后的地址配置 - 需根据后台配置
    const httpToken = localStorage.getItem('userToken')
    if (httpToken) {
        if (config.headers)
            config.headers['Authorization'] = 'Bearer ' + JSON.parse(httpToken) ;
    }
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    let res = response.data;
    // let _code = response.code;
    if (res.status) {
        return response
    } else {
        // 配置请求状态拦截 - 需根据后台配置
        return response
    }
}, error => {
    const errCode = error.response.status;
    const errMsg = error.response.data.msg;
    if (errCode === 400) {
        ElMessage({
            type: 'error',
            message: errMsg?errMsg:'数据错误',
            duration: 2000,
        })
    } else if(errCode === 401){
        ElMessage({
            type: 'error',
            message: errMsg,
            duration: 2000,
        })
        localStorage.removeItem("userToken");
        router.push('/login')
  } else if (errCode === 403) {
      ElMessage({
        type: 'error',
        message: errMsg ? errMsg : "用户没有此权限",
        duration: 2000,
      })
    } else if (errCode === 500) {
      ElMessage({
        type: 'error',
        message: errMsg ? errMsg : "服务器错误",
        duration: 2000,
      })
    } else {
      ElMessage({
        type: 'error',
        message: errMsg ? errMsg : "数据错误",
        duration: 2000,
      })
    }
    return Promise.reject(error.response)
})


const request = (method: any, url: any, data?: any) => {
    // 除了GET 和 POST  其他请求方式待封装
    return new Promise((resolve, reject) => {
        if (method === 'get') {
            axios.get(url, { params: data }).then(res => {
                resolve(res)
            }).catch((err) => {
                reject(err);
            })
        } else if (method === 'post') {
            axios.post(url, data).then(res => {
                resolve(res)
            }).catch((err) => {
                reject(err);
            })
        } else if (method === 'patch') {
            axios.patch(url, data).then(res => {
                resolve(res)
            }).catch((err) => {
                reject(err);
            })
        } else if (method === 'delete') {
            axios.delete(url, data).then(res => {
                resolve(res)
            }).catch((err) => {
                reject(err);
            })
        }
    })
}

export { request }
