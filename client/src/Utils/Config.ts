class Config {
    public urls = {
            vacations: "http://localhost:3001/api/vacations/",
            vacationImages: "http://localhost:3001/api/vacations/images/",
            followers: "http://localhost:3001/api/followers/",
            register: "http://localhost:3001/api/auth/register/",
            login: "http://localhost:3001/api/auth/login/",
            usernameVerify: "http://localhost:3001/api/auth/",
            socketServer : "http://localhost:3001"
    }
    apiUrl: any;
}

const config = new Config();

export default config;
