import mysql, { ConnectionOptions } from "mysql2/promise";
import process from "process";
import dotenv from "dotenv";

dotenv.config();

const options: ConnectionOptions = {
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: 3306,
  host: process.env.HOST,
};

const DB = mysql.createConnection(options);

export { options, DB };