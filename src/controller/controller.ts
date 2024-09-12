import { Request, Response } from "express";
import { PaginatedData } from "./pagination";
import { RowDataPacket } from "mysql2/promise";
import {
  OrmProps,
  QueryOptions,
  ModelKey,
  PaginatedReturn,
  GenericObject,
} from "../data/database.orm";

export interface DefaultPaginationResponse {
  message: string;
  status: boolean;
  item?: any;
}

class PaginatedController<PCData> {
  private orm: OrmProps;

  constructor(data: OrmProps) {
    this.orm = data;
  }

  async getData<T extends RowDataPacket, D extends ModelKey>(
    req: Request,
    res: Response,
    readProps: QueryOptions<D>
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 15;
      console.log(readProps.conditions?.where);
      const data = (await this.orm.read<T, D>({
        model: readProps.model,
        conditions: {
          paginated: true,
          limit: pageSize,
          offset: page,
          where: readProps.conditions?.where,
        },
      })) as PaginatedReturn<T>;
      // console.log(data.total);
      if (!data.items) return;

      const paginatedData = new PaginatedData<PCData>({
        items: data.items as PCData[],
        total: data.total,
        page: page,
        pageSize: pageSize,
      });

      // console.log(data);
      // console.log("Pagination: ", paginatedData);
      return res.status(200).json(paginatedData);
    } catch (err) {
      res.status(500).json("Error");
    }
  }

  async createData<T extends ModelKey>(
    req: Request,
    res: Response,
    readProps: QueryOptions<T>
  ) {
    try {
      const data = await this.orm.create<T>({
        data: req.body,
        model: readProps.model,
      });

      return res.status(201).json(data);
    } catch (err) {
      res.status(500).json("Error");
    }
  }
  async updateData<T extends ModelKey>(
    req: Request,
    res: Response,
    readProps: QueryOptions<T>
  ) {
    try {
      const data = await this.orm.update<T>({
        data: req.body,
        model: readProps.model,
        conditions: {
          where: req.query as Partial<GenericObject<T>>
        },
      });

      return res.status(200).json(data);
    } catch (err) {
      res.status(500).json("Error");
    }
  }

  async deleteData<T extends ModelKey>(
    req: Request,
    res: Response,
    readProps: QueryOptions<T>
  ) {
    try {
      const data = await this.orm.delete<T>({
        model: readProps.model,
        conditions: {
          where: req.query as Partial<GenericObject<T>>
        },
      });

      return res.status(200).json(data);
    } catch (err) {
      res.status(500).json("Error");
    }
  }
}

class Controller {}
export { PaginatedController };
