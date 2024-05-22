import axios from 'axios';

const TOKEN = "cp725ahr01qpb9rafu00cp725ahr01qpb9rafu0g"

export default axios.create({
    baseURL:"https://finnHub.io/api/v1",
    params: {
        token: TOKEN
    }
})