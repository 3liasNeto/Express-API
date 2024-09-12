import { Router } from "express";
import { seed } from "../data/seed";
import { Book, BookQuery } from "./Books";
import { PaginatedController } from "./controller";
import { BookInfo } from "../models/book";
import { User } from "../models/user";
import { orm } from "../data/database.orm";
import {
  BodyValidator,
  QueryValidator,
  Validator,
} from "../middlewares/validation";
import {
  booksQuerySchema,
  createBookSchema,
  updateBookSchema,
} from "../schemas/books";

const route: Router = Router();

const paginatedBook = new PaginatedController<BookInfo>(orm);

route.get("/books", QueryValidator(booksQuerySchema), (req, res) =>
  paginatedBook.getData<BookQuery, "Books">(req, res, {
    model: "Books",
    conditions: {
      where: req.query.search ? { title: `%${req.query.search}%` } : {},
    },
  })
);

route.post("/add-book", BodyValidator(createBookSchema), (req, res) =>
  paginatedBook.createData<"Books">(req, res, { model: "Books" })
);

const query = booksQuerySchema.omit({ page: true, pageSize: true, search: true })
route.put(
  "/update-book",
  Validator(
    updateBookSchema,
    query
  ),
  (req, res) => paginatedBook.updateData<"Books">(req, res, { model: "Books" })
);
route.delete("/delete-book", QueryValidator(query) ,(req, res) => paginatedBook.deleteData<"Books">(req, res, { model: "Books" }));

// // Users
// route.get("/users", (req, res) => user.getUsersInfo(req, res, DB));
// route.post("/create-user", (req, res) => user.createUser(req, res, DB));
// route.delete("/delete-user", (req, res) => user.deleteUser(req, res, DB));

export { route };
