import axios from 'axios'
const appDev = 'http://localhost:8090';
const appCompany = 'http://192.168.0.134:9999'
const appRemote = 'http://36.97.142.107:9999'
const appPrd = 'http://aspnc.com.cn:9999'
const http = axios.create({
    baseURL: appPrd
})

//让请求自带token
let token = localStorage.getItem('Authorization');
http.defaults.headers.common['token'] = token;

// 添加请求拦截器，在请求头中加token
http.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
            config.headers.token = localStorage.getItem('Authorization');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

export default http
