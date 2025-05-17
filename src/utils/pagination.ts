export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export const getPagination = (query: any): { limit: number; skip: number; page: number } => {
    const page = Math.max(1, parseInt(query.page)) || 1;
    const limit = Math.max(1, parseInt(query.limit)) || 10;
    const skip = (page - 1) * limit;
    return { limit, skip, page };
};

export const paginate = async <T>(
    model: any,
    query: any,
    filter: Record<string, any> = {}
): Promise<PaginationResult<T>> => {
    const { limit, skip, page } = getPagination(query);

    const [data, total] = await Promise.all([
        model.find(filter).skip(skip).limit(limit), // Fetch paginated data
        model.countDocuments(filter), // Get total count of documents
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};