export interface PageResponse<T> {
    content: T[]
    totalPages: number
    totalElements: number
    currentPage: number
    pageSize: number
}

export interface BaseResponse<T> {
    data: T
    message: string
}

export interface PageRequest {
    page: number
    size: number
    sort: string[]
}