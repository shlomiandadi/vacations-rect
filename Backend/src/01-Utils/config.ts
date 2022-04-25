abstract class Config {
    public mySql = { host: "", user: "", password: "", database: "" };
    public port: number;
    public loginExpiresIn: string;

}
class DevelopmentConfig extends Config {
    // clientUrl: StaticOrigin | CustomOrigin;
    public constructor() {
        super();
        this.port = 3001;
        this.mySql = { host: "localhost", user: "root", password: "1234", database: "observacation" };
        this.loginExpiresIn = "12h"; 
    }
}

const config = new DevelopmentConfig();

export default config;
