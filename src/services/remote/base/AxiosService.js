import axios from "axios";

let cachedUser = {};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    responseType: 'json',
    responseEncoding: 'utf8'
});

axiosInstance.interceptors.request.use((config) => {
    if (cachedUser.token)
        config.headers.authorization = "Bearer " + cachedUser.token;
    return config;
}, function (error) {
    return Promise.reject(error);
});

function get(url) {
    return axiosInstance.get(url)
}

function post(url, data) {
    return axiosInstance.post(url, data);
}

function put(url, data) {
    return axiosInstance.put(url, data);
}

function _delete(url) {
    return axiosInstance.delete(url);
}

function setUser(user) {
    cachedUser = user;
}


export const AxiosService = {
    axiosInstance,
    get,
    setUser,
    post,
    put,
    delete: _delete
};
