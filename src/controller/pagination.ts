interface Pagination<PData> {
    items: PData[];
    total: number;
    page: number;
    pageSize: number;
    next: number | null;
    previous: number | null;
}

type PaginationInput<PData> = Omit<Pagination<PData>, 'next' | 'previous'>;

class PaginatedData<PData> implements Pagination<PData> {
    items: PData[];
    total: number;
    page: number = 1;
    pageSize: number = 15;
    next: number | null;
    previous: number | null;

    constructor(pagination: PaginationInput<PData>) {
        const formattedPagination = this.createPagination(pagination);
        this.items = formattedPagination.items;
        this.total = formattedPagination.total;
        this.page = formattedPagination.page;
        this.pageSize = formattedPagination.pageSize;
        this.next = formattedPagination.next;
        this.previous = formattedPagination.previous;
    }

    private createPagination(pagination: PaginationInput<PData>): Pagination<PData> {
        const totalPages = Math.ceil(pagination.total / pagination.pageSize);
        console.log(pagination.items.length);
        // console.log("Data :", pagination);
        return {
            total: totalPages,
            page: pagination.page,
            pageSize: pagination.pageSize,
            next: pagination.page < totalPages ? pagination.page + 1 : null,
            previous: pagination.page > 1 ? pagination.page - 1 : null,
            items: pagination.items,
        };
    }
}

export { PaginatedData, Pagination } 