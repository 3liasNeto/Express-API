import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Request, Response } from "express";

export interface UserModel {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  icon: string;
}

type UserQuery = UserModel & RowDataPacket;

type UserResJson = {
  total: number;
  users: Partial<UserModel>[];
};

class User {
  async getUsersInfo(
    req: Request,
    res: Response,
    conn: Promise<mysql.Connection>,
  ) {
    try {
      const [getAllUser] = await (
        await conn
      ).query<UserQuery[]>("SELECT * FROM Users");
      const filter = this.filterResponse(getAllUser);

      return res.status(200).json(filter);
    } catch (err) {
      throw new Error(`Erro: ${err}`);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    conn: Promise<mysql.Connection>,
  ) {
    try {
      const data = req.body as Partial<Omit<UserModel, "id">>;
      const filteredData = [
        data.name,
        data.lastName,
        data.email,
        data.password,
        data.icon ?? "",
      ];
      if (!data)
        return res
          .status(400)
          .json({ error: "Missing required parameter: id" });

      const [createUser] = await (
        await conn
      ).execute(
        "INSERT INTO Users (name, lastName, email, password, icon) Values (?, ?, ?, ?, ?)",
        filteredData,
      );
      return res.status(201).json(`O Usuario ${data.name} foi criado!`);
    } catch (err) {
      console.error(`User: ${err}`);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    conn: Promise<mysql.Connection>,
  ) {
    try {
      const deleteID = req.query["id"];

      if (!deleteID) return res.status(400).json("Invalite Requisition");

      const [deleteDb] = await (
        await conn
      ).execute<ResultSetHeader>("Delete From Users Where id = ?", [deleteID]);

      return res.status(200).json("Usuario deletado com sucesso");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "ERROR", message: err });
    }
  }

  private filterResponse(data: UserModel[]): UserResJson {
    return {
      total: data.length,
      users: data.map((item) => ({
        email: item.email,
        name: item.name,
        lastName: item.lastName,
        id: item.id,
        icon: item.icon,
      })),
    };
  }
}

export { User };
