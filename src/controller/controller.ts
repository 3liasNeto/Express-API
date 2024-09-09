import { Request, Response } from "express";
import { PaginatedData } from "./pagination";
import { RowDataPacket } from "mysql2/promise";
import {
  OrmProps,
  QueryOptions,
  ModelKey,
  PaginatedReturn,
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
    readProps: QueryOptions<D>,
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 15;

      const data = (await this.orm.read<T, D>({
        model: readProps.model,
        conditions: {
          paginated: true,
          limit: pageSize,
          offset: page,
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
}

class Controller {}
export { PaginatedController };
