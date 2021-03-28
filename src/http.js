import axios from 'axios'
// http://192.168.142.128:8080
// http://localhost:8090
const http = axios.create({
    baseURL: 'http://192.168.142.128:8080'
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
