import { BookInfo } from "../../models/book";
import mysql, { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DefaultPaginationResponse } from "../controller";

export interface PaginatedReturn<BData> {
items: BData[],
total: number;
}

interface BookActions {
    DB: Promise<mysql.Connection>;
    getBookData: (page: number, pageSize : number) => Promise<PaginatedReturn<BookInfo>>;
    createBookData : (data : BookInfo) => Promise<DefaultPaginationResponse>;
    updateBookData : (id: number, data: Partial<BookInfo>) => Promise<DefaultPaginationResponse>;
    deleteBookData : (id: number) => Promise<DefaultPaginationResponse>;
}

type CrudQueries = {
    get: string[];
    delete: string;
    create: string;
    update: string;
}

const queries : CrudQueries = {
    get: ["SELECT * FROM Books ORDER BY id DESC LIMIT ? OFFSET ?",
        "SELECT COUNT(*) AS id FROM Books"
    ],
    delete: "DELETE FROM Books WHERE id = ?",
    create: `INSERT INTO Books (title, subtitle, authors, categories, publishedDate, description, images, language, averageRating, ratingsCount, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    update: "UPDATE Books SET ? WHERE id = ?"
}

type BookQuery = BookInfo & RowDataPacket

class Book implements BookActions {
    DB: Promise<mysql.Connection>;

    constructor(DB : Promise<mysql.Connection>){
        this.DB = DB
    }

    async getBookData(page: number, pageSize : number) : Promise<PaginatedReturn<BookInfo>>{
        try{
            const startIndex = (page - 1) * pageSize; // 1 -> 1 - 1 * 15 = 0 || 2 -> 2 - 1 * 15 = 15
            const [book] = await (
                await this.DB
              ).query<BookQuery[]>(queries.get[0], [ pageSize, startIndex ]);
            const [total] = await (
                await this.DB
              ).query<BookQuery[]>(queries.get[1]);
            // console.log("Query Books: ", book)
            console.log("Total Books: ", total)
            return {
                items: book,
                total: Number(total[0].id)
            }
        }catch(err){
            console.error("ERRO: ", err);
            throw new Error("DB Error")
        }
    }

    async createBookData(data: BookInfo) : Promise<DefaultPaginationResponse>{
        try{
            const filteredData = [       
                data.title,
                data.subtitle,
                JSON.stringify(data.authors),
                JSON.stringify(data.categories),
                data.publishedDate,
                data.description,
                JSON.stringify(data.images),
                data.language,
                data.averageRating,
                data.ratingsCount,
                data.price,
              ];

            const [create] = await (
                await this.DB
              ).execute<ResultSetHeader>(queries.create, filteredData);
              

              return {
                status: true,
                message: `ID: ${create.insertId.toString()} - Livro: ${data.title}, foi adicionado com sucesso em nosso sistema`,
                item: {...data, id: create.insertId}
              }
        }catch(err){
            console.log("MySql: ",err)
            throw new Error('Error mySQL');
        }
    };

    async updateBookData(id: number, data: Partial<BookInfo>): Promise<DefaultPaginationResponse>{
        try{
            const objectValues = Object.entries(data)
            .map(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (typeof value === 'object') {
                        return `${key} = '${JSON.stringify(value)}'`;
                    } else {
                        return `${key} = '${value}'`;
                    }
                }
                return null;
            })
            .filter(item => item !== null); 


            const query = `UPDATE Books SET ${objectValues.join(', ')} WHERE id = ?`;

            const [update] = await (
                await this.DB
              ).execute<ResultSetHeader>(query, [id]);
            
              const selectQuery = "SELECT * FROM Books WHERE id = ?" 
              const [bookData] = await (
                await this.DB
              ).query<BookQuery[]>(selectQuery, [ id ]);
              console.log("MySql", update);

              return {
                status: true,
                message: `ID: ${id} - Livro: ${bookData[0].title}, foi atualizado com sucesso em nosso sistema`,
                item: {...bookData[0], id: id}
              }  
        }catch(err){
            console.log("MySQL: ",err)
            throw new Error("erro")
        }
    }

    async deleteBookData(id: number): Promise<DefaultPaginationResponse>{
        try{
            const selectQuery = "SELECT * FROM Books WHERE id = ?" 
              const [bookData] = await (
                await this.DB
              ).query<BookQuery[]>(selectQuery, [ id ]);
              
              const [deleteData] = await (
                await this.DB
              ).execute<ResultSetHeader>(queries.delete, [id]);
              console.log("MySql", deleteData);
            
            return{
                status: true,
                message: `ID: ${id} - Livro: ${bookData[0].title}, foi deletado com sucesso do nosso sistema`,
            }
        }catch(err){
            throw new Error("Error")
        }
    }
}

export { Book }