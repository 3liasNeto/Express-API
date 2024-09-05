import { Router } from "express";
import { seed } from "../data/seed";
import { Book } from "./Books";
import { DB } from "../data/connect";
import { PaginatedController } from "./controller";
import { BookInfo } from "../models/book";
import { User } from "../models/user";

const route: Router = Router();

const bookService = new Book(DB);
const paginatedBook = new PaginatedController<BookInfo>({
  fetchPageData: (page: number, pageSize: number) =>
    bookService.getBookData(page, pageSize),
  createPageData: (data: BookInfo) => bookService.createBookData(data),
  updatePageData: (id, data) => bookService.updateBookData(id, data),
  deletePageData: (id) => bookService.deleteBookData(id),
});

const user = new User();
route.get("/", (req, res) => {
  res.json(seed.book);
});

// route.get("/books", (req, res) => paginatedBook.getData(req, res));
route.post("/add-book", (req, res) => paginatedBook.createData(req, res));
route.put("/update-book", (req, res) => paginatedBook.updateData(req, res));
route.delete("/delete-book", (req, res) => paginatedBook.deleteData(req, res));

// Users
route.get("/users", (req, res) => user.getUsersInfo(req, res, DB));
route.post("/create-user", (req, res) => user.createUser(req, res, DB));
route.delete("/delete-user", (req, res) => user.deleteUser(req, res, DB));

export { route };
