import { Request, Response } from 'express'
import { PaginatedData } from './pagination';
import { PaginatedReturn } from './Books';

interface PaginationService<PCData> {
    fetchPageData: (page: number, pageSize : number) => Promise<PaginatedReturn<PCData>>;
    createPageData: (data : PCData) => Promise<DefaultPaginationResponse>;
    updatePageData: (id: number, data: Partial<PCData>) => Promise<DefaultPaginationResponse>;
    deletePageData : (id: number) => Promise<DefaultPaginationResponse>;
}

export interface DefaultPaginationResponse {
    message: string;
    status: boolean;
    item?: any;
}

class PaginatedController<PCData>{
    private paginationService: PaginationService<PCData>;
    
    constructor(paginationService: PaginationService<PCData>) {
        this.paginationService = paginationService;
      }
    async getData(req: Request, res: Response) {
        try{
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 15;


            const data = await this.paginationService.fetchPageData(page, pageSize);
            const paginatedData = new PaginatedData<PCData>({items: data.items, total: data.total,page: page, pageSize: pageSize})
            // console.log("Pagination: ", paginatedData);
            return res.status(200).json(paginatedData)
        }catch(err){
            res.status(500).json('Error')
        }
    }

    async createData(req: Request, res: Response){
        try{
            const body = req.body as PCData
            console.log(body)
            const create = await this.paginationService.createPageData(body);
            
            return res.status(200).json(create);
        }catch(err){
            console.log(err);
            res.status(500).json('Error')
        }
    }

    async updateData(req: Request, res: Response){
        try{
            const body = req.body as PCData
            const id = req.query['id']
            console.log("ID: ",id)
            if(!id){
                return res.status(400).json({ error: 'Missing required parameter: id' });
            }
            const update = await this.paginationService.updatePageData(Number(id), body);
            return res.status(200).json(update);

        }catch(err){
            console.log(err);
            res.status(500).json('Error')
        }
    }

    async deleteData(req: Request, res: Response){
        try{
            const id = req.query['id']

            if(!id){
                return res.status(400).json({ error: 'Missing required parameter: id' });
            }
            
            const update = await this.paginationService.deletePageData(Number(id));

            return res.status(200).json(update);
        }catch(err){
            console.log(err);
            res.status(500).json('Error')
        }
    }
}

class Controller {
    
}
    export { PaginatedController, PaginationService }