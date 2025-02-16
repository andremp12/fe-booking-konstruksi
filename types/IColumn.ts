export interface IColumn{
    [key: string]: any;
    key: string;
    label?: string|any;
    sortable?: boolean | undefined;
    direction?: "asc" | "desc" | undefined;
    class?: string | undefined;
}