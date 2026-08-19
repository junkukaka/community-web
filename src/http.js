import axios from 'axios'
import conf from './conf.js'
import router from './router.js'
import { clearAuthStorage, getAuthToken, savePreviousUrl } from './auth.js'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || conf.url.prod
})

// 添加请求拦截器，在请求头中加token
http.interceptors.request.use(
    config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = token;
            config.headers.token = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

http.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const currentPath = router.currentRoute.value.fullPath;
            savePreviousUrl(currentPath);
            clearAuthStorage();

            if (router.currentRoute.value.path !== '/signIn') {
                router.replace('/signIn');
            }
        }

        return Promise.reject(error);
    });

export default http
