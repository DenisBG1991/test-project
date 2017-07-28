export interface IPagingState {
    pageSize: number;
    currentPage: number;
    total: number;
}

export interface IPageInfo {
    pageNum: number;
    pageSize: number;
}

export interface IPage<T> {
    items: Array<T>;
    pageNum: number;
    pageSize: number;
    itemsTotal: number;
}
