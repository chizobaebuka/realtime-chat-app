export interface PaginationParams {
    page?: number;
    limit?: number;
}

export const getPagination = (query: any): { limit: number; skip: number; page: number } => {
    const page = Math.max(1, parseInt(query.page)) || 1;
    const limit = Math.max(1, parseInt(query.limit)) || 10;
    const skip = (page - 1) * limit;
    return { limit, skip, page };
};