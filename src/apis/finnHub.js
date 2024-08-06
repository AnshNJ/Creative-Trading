import axios from 'axios';

const TOKEN = "cqouka1r01qqj5dmgb60cqouka1r01qqj5dmgb6g"

export default axios.create({
    baseURL:"https://finnHub.io/api/v1",
    params: {
        token: TOKEN
    }
})