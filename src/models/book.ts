import { v4 as uuid } from "uuid";

type Images = {
  small?: string;
  main?: string;
};

interface BookInfo {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  categories: string[];
  publishedDate: string;
  description: string;
  images: Images;
  language: string;
  averageRating: number;
  ratingsCount: number;
  price: number;
  total: number;
}

class BookData implements BookInfo {
  id: string = uuid();
  title: string;
  subtitle: string;
  authors: string[];
  categories: string[];
  publishedDate: string;
  description: string;
  images: Images;
  language: string;
  averageRating: number;
  ratingsCount: number;
  price: number;
  total: number;
  constructor(
    title: string,
    subtitle: string,
    authors: string[],
    categories: string[],
    publishedDate: string,
    description: string,
    images: Images,
    language: string,
    averageRating: number,
    ratingsCount: number,
    price: number
    total: number
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.authors = authors;
    this.categories = categories;
    this.publishedDate = publishedDate;
    this.description = description;
    this.images = images;
    this.language = language;
    this.averageRating = averageRating;
    this.ratingsCount = ratingsCount;
    this.price = price;
    this.total = total;
  }
}

export { BookData, BookInfo, Images };
