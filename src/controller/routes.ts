import { Router } from "express";
import { seed } from "../data/seed";
import { Book } from "./Books";
import { DB } from "../data/connect";
import { PaginatedController } from "./controller";
import { BookInfo } from "../models/book";

const route: Router = Router();

const bookService = new Book(DB);
const paginatedBook = new PaginatedController<BookInfo>({
  fetchPageData: (page: number, pageSize: number) =>
    bookService.getBookData(page, pageSize),
  createPageData: (data: BookInfo) => bookService.createBookData(data),
  updatePageData: (id, data) => bookService.updateBookData(id, data),
  deletePageData: (id) => bookService.deleteBookData(id),
});

route.get("/", (req, res) => {
  res.json(seed.book);
});

route.get("/books", (req, res) => paginatedBook.getData(req, res));
route.post("/add-book", (req, res) => paginatedBook.createData(req, res));
route.put("/update-book", (req, res) => paginatedBook.updateData(req, res));
route.delete("/delete-book", (req, res) => paginatedBook.deleteData(req, res));

export { route };
