import axios from "axios";
import { BookInfo } from "../models/book";
import { GoogleBooks, initialBooks } from "./initial-books";
import { DB } from "./connect";
import path from "path";
import fs from "fs";
import { RowDataPacket } from "mysql2";

interface DataSeed extends RowDataPacket {
  id: number;
  Seeded: boolean;
  Date: Date;
  lastSeed: string;
}

const req = axios.create({
  baseURL: "https://www.googleapis.com/books/v1/volumes",
});

class Seed {
  book: Omit<BookInfo, "id" | "total">[] = [];
  seedBooks: string[] = initialBooks;
  seedFilePath: string = path.resolve(__dirname, "../data/initial-seed.json");
  isSeeded: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    await this.getBooks();
    await this.verifySeed();
    await this.seedDB();
    await this.setSeed();
  }

  async getBooks() {
    if (fs.existsSync(this.seedFilePath)) {
      try {
        const data = fs.readFileSync(this.seedFilePath, "utf8");
        this.book = JSON.parse(data);
        console.log("Dados carregados do arquivo JSON.");
        return this.book;
      } catch (err) {
        console.error("Erro ao ler o arquivo JSON:", err);
      }
    } else {
      try {
        for (const book of this.seedBooks) {
          const { data } = await req.get<GoogleBooks>("", {
            params: { q: book },
          });
          data.items.forEach((item) => {
            const { volumeInfo } = item;
            const {
              title,
              subtitle,
              authors,
              imageLinks,
              description,
              publishedDate,
              ratingsCount,
              averageRating,
              language,
              categories,
            } = volumeInfo;
            const smallThumbnail = imageLinks?.smallThumbnail || "";
            const thumbnail = imageLinks?.thumbnail || "";

            this.book.push({
              title,
              subtitle: subtitle || "",
              authors: authors || [],
              categories: categories || [],
              publishedDate,
              description: description || "",
              images: { small: smallThumbnail, main: thumbnail },
              language,
              averageRating: averageRating || 0,
              ratingsCount: ratingsCount || 0,
              price: 0,
            });
          });
        }

        fs.writeFileSync(this.seedFilePath, JSON.stringify(this.book, null, 2));
        console.log("Dados salvos no arquivo JSON.");
        return this.book;
      } catch (err) {
        console.log("Erro: ", err);
      }
    }
  }

  async verifySeed() {
    try {
      const [seed] = await (
        await DB
      ).query<DataSeed[]>(
        "SELECT lastSeed FROM Seeds WHERE lastSeed LIKE ? LIMIT 1",
        [`%${this.book[this.book.length - 1].title}%`],
      );
      // console.log(seed);
      // console.log(seed.length);
      // console.log(this.isSeeded);
      if (seed.length) {
        this.isSeeded = true;
      }
      return seed;
    } catch (err) {
      console.error(err);
    }
  }
  async seedDB() {
    console.info("Is Seeded: ", this.isSeeded);
    if (this.isSeeded) return;

    return await Promise.all(
      this.book.map(async (book) => {
        const query = `INSERT INTO Books (title, subtitle, authors, categories, publishedDate, description, images, language, averageRating, ratingsCount, price)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          book.title,
          book.subtitle,
          JSON.stringify(book.authors),
          JSON.stringify(book.categories),
          book.publishedDate,
          book.description,
          JSON.stringify(book.images),
          book.language,
          book.averageRating,
          book.ratingsCount,
          book.price,
        ];

        try {
          const [res] = await (await DB).query(query, values);

          return res;
        } catch (err) {
          console.error("Erro ao executar query:", err);
        }
      }),
    );
  }

  async setSeed() {
    if (this.isSeeded) return;
    try {
      const seedQuery = `INSERT INTO Seeds (Seeded, Date, lastSeed) VALUES (?, ? ,?)`;
      const values = [true, new Date(), this.book[this.book.length - 1].title];
      const [res, fields] = await (await DB).query(seedQuery, values);

      return res;
    } catch (err) {
      console.error(err);
    }
  }
}

export const seed = new Seed();
