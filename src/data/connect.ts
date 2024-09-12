import mysql, { ConnectionOptions } from "mysql2/promise";
import process from "process";
import dotenv from "dotenv";
import { OrmConnection } from "./database.orm";

dotenv.config();

const options: OrmConnection = {
  database: process.env.DB ?? "",
  user: process.env.USER ?? "",
  password: process.env.PASSWORD ?? "",
  port: 3306,
  host: process.env.HOST ?? "",
  multipleStatements: true,

};

const DB = mysql.createConnection(options);

export { options, DB };