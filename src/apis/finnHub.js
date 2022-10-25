import axios from 'axios';

const TOKEN = "cd99d0aad3i97v8iq6t0cd99d0aad3i97v8iq6tg"

export default axios.create({
    baseURL:"https://finnHub.io/api/v1",
    params: {
        token: TOKEN
    }
})