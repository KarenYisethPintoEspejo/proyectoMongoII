import { MongoClient } from 'mongodb';

export class connect {
    static instanceConnect;
    db;
    user;
    port;
    cluster;
    #url;
    #host;
    #pass;
    #dbName;

    // mongodb://mongo:tKdRxmJRupdIXYhhNgTiotEtkcgMLKaF@roundhouse.proxy.rlwy.net:41753

    constructor() {
        if (connect.instanceConnect) {
            return connect.instanceConnect;
        }
        this.setHost = process.env.MONGO_HOST;
        this.user = process.env.MONGO_USER;
        this.setPass = process.env.MONGO_PWD;
        this.port = process.env.MONGO_PORT;
        this.cluster = process.env.MONGO_CLUSTER;
        this.setDbName = process.env.MONGO_DB;
        this.#open();
        connect.instanceConnect = this;
    }
    destructor(){
        connect.instanceConnect = undefined;
    }
    set setHost(host) {
        this.#host = host;
    }

    set setPass(pass) {
        this.#pass = pass;
    }

    set setDbName(dbName) {
        this.#dbName = dbName;
    }

    get getDbName() {
        return this.#dbName;
    }
    async reConnect() {
        await this.#open();
    }
    async #open() {
        console.log("Conexion exitosa");
        this.#url = `${this.#host}${this.user}:${this.#pass}@${this.cluster}:${this.port}`;
        this.conexion = new MongoClient(this.#url);
        await this.conexion.connect();
        console.log("Conexion realizada correctamente");
    }
}