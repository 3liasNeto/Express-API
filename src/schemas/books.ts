import { z } from "zod";

type PageSize = 15 | 30 | 50 | 100;

interface BookQuery {
    id?: number;
    page?: number;
    pageSize?: PageSize;
    search?: string;
}

const closestPageSize = (value: number): PageSize => {
  const sizes: PageSize[] = [15, 30, 50, 100];
  return sizes.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
};

const booksQuerySchema = z.object({
    id: z.string().transform((val) => parseInt(val)).optional(),
    page: z.string().transform((val) => parseInt(val)).optional(),
    pageSize: z.preprocess((val) => {
        if (typeof val === "string") {
          return closestPageSize(Number(val));
        }
        return 15;
      }, z.number().optional()),
    search : z.string().optional(),
}).strip();

const createBookSchema = z.object({
    title: z.string().min(1).max(255),
    subtitle: z.string().min(1).max(255),
    authors: z.array(z.string()).min(1),
    categories: z.array(z.string()).min(1),
    publishedDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            return new Date(arg);
        }
        return arg;
    }, z.date().transform((value) => value.toLocaleDateString('en-GB'))),
    description: z.string().min(1),
    images: z.object({
        smallThumbnail: z.string().url(),
        thumbnail: z.string().url(),
    }).optional(),
    language: z.string().min(2).max(8),
    averageRating: z.number().min(0).max(5),
    ratingsCount: z.number(),
    price: z.number().min(1),
}).strip();

const updateBookSchema = createBookSchema.partial();

export { createBookSchema, updateBookSchema, booksQuerySchema };