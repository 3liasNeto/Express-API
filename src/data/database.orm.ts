import mysql, {
  Connection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import { options } from "./connect";
import { Models } from "../models/models";

type ModelKey = keyof Models;

export type OrmConnection = {
  database: string;
  user: string;
  password: string;
  port: number;
  host: string;
};

type GenericObject<M extends ModelKey> = {
  [key in keyof Models[M]]: any;
};

interface QueryOptions<M extends ModelKey> {
  model: M;
  conditions?: ConditionsOptions<M>;
  columns?: (keyof Models[M])[];
}

type Order = "DESC" | "ASC";

type OrderBy<M extends ModelKey> = {
  order: Order;
  items: (keyof Models[M])[]
};

type ConditionsOptions<M extends ModelKey> = {
  where?: Partial<GenericObject<M>>;
  order?: OrderBy<M>;
  offset?: number;
  limit?: number;
};

class Orm {
  protected connection: OrmConnection;
  // * Data Base Not Initialized Yet
  protected db: Promise<mysql.Connection | null>;

  constructor(data: OrmConnection) {
    this.connection = data;
    this.db = this.initializeDB();
  }

  private async dbConnection(
    data: OrmConnection
  ): Promise<[Error | null, Connection | null]> {
    try {
      const conn = await mysql.createConnection(data);
      return [null, conn];
    } catch (err) {
      return [err as Error, null];
    }
  }

  private async initializeDB() {
    if (!this.connection)
      throw new Error("Sem Objeto de Conexao com Banco de Dados.");
    const [err, data] = await this.dbConnection(this.connection);

    if (err)
      throw new Error(
        `Erro ao tentar conectar com banco de dados: ${err.message}`
      );
    console.info("DB Initialized!!");
    return data;
  }

  private filterCondition<D extends ModelKey>(data: ConditionsOptions<D>) {
    let query: string[] = [];

    const whereClause = Object.entries(data?.where ?? {}).map(
      ([key, value]) => `${key} = ${mysql.escape(value)}`
    );


    if (data.where) query.push(`WHERE ${whereClause[0]}`);

    if (data.order) query.push(`ORDER BY ${data.order.items.join(", ")} ${data.order.order}`);

    if (data.limit) query.push(`LIMIT ${data.limit}`);

    if (data.offset) query.push(`OFFSET ${data.offset}`);

    return query.length > 0 ? query.join(" ") : "";
  }

  private filterData(data: Object) {
    return Object.values(data)
      .map((value) => {
        let store: any[] = [];
        if (typeof value === "string") {
          store.push(`'${value.replace(/'/g, "\\'")}'`);
        } else if (typeof value === "number") {
          store.push(value);
        } else if (typeof value === "object" && value !== null) {
          store.push(`'${JSON.stringify(value).replace(/'/g, "\\'")}'`);
        } else {
          store.push("NULL");
        }
        return store;
      })
      .join(", ");
  }
  private filterUpdateData(data: Object) {
    return Object.entries(data)
      .map(([key, value]) => {
        let store: any[] = [];
        if (typeof value === "string") {
          store.push(`${key} = '${value.replace(/'/g, "\\'")}'`);
        } else if (typeof value === "number") {
          store.push(`${key} = ${value}`);
        } else if (typeof value === "object" && value !== null) {
          store.push(
            `${key} = '${JSON.stringify(value).replace(/'/g, "\\'")}'`
          );
        } else {
          store.push("NULL");
        }
        return store;
      })
      .join(", ");
  }

  public async read<T extends RowDataPacket, D extends ModelKey>({
    columns,
    conditions,
    model,
  }: QueryOptions<D>) {
    try {
      const queryConditions = conditions
        ? this.filterCondition(conditions)
        : "";
      const query = `SELECT ${
        columns && columns.length > 0 ? columns.join(", ") : "*"
      } FROM ${model} ${queryConditions}`;
      const connection = await this.db;

      console.log(query);
      if (connection === null)
        throw new Error("Sem conexão com banco de dados.");

      const [res] = await connection.query<T[]>(query);

      return res;
    } catch (err) {
      throw new Error(`Read Error : ${err}`);
    }
  }

  public async create<D extends ModelKey>({
    model,
    data,
  }: QueryOptions<D> & { data: Object }) {
    try {
      const columns = Object.keys(data).join(", ");
      const values = this.filterData(data);
      if (columns.length < 0 || values.length < 0)
        throw new Error("Campos em falta.");

      const connection = await this.db;
      if (connection === null)
        throw new Error("Sem conexão com banco de dados.");

      const query = `INSERT INTO ${model} (${columns}) VALUES (${values})`;
      console.log(query);
      const [res] = await connection.execute<ResultSetHeader>(query);

      return res;
    } catch (err) {
      throw new Error(`Create Error : ${err}`);
    }
  }

  public async update<D extends ModelKey>({
    model,
    conditions,
    data,
  }: QueryOptions<D> & { data: Object }) {
    try {
      if (!conditions?.where) throw new Error("Sem id para atualizar.");

      const values = this.filterUpdateData(data);
      const conditionQuery = this.filterCondition(conditions);
      const query = `UPDATE ${model} SET ${values} ${conditionQuery}`;
      const connection = await this.db;
      if (connection === null)
        throw new Error("Sem conexão com banco de dados.");

      const [res] = await connection.execute<ResultSetHeader>(query);

      return res;
    } catch (err) {
      throw new Error(`Update Error : ${err}`);
    }
  }

  public async delete<D extends ModelKey>({
    model,
    conditions,
  }: QueryOptions<D>) {
    try {
      const queryConditions = this.filterCondition(conditions ?? {});
      const query = `DELETE FROM ${model} ${queryConditions}`;

      const connection = await this.db;
      if (connection === null)
        throw new Error("Sem conexão com banco de dados.");

      const [res] = await connection.execute<ResultSetHeader>(query);
      // console.log(query);

      return res;
    } catch (err) {
      throw new Error(`Delete Error : ${err}`);
    }
  }
}

export const orm = new Orm(options);
