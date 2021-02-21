import axios from 'axios'
const http = axios.create({
    baseURL: 'http://localhost:8090'
})



// 添加请求拦截器，在请求头中加token
http.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    });

export default http
