export interface ISidebar{
    parent:number|any|null,
    id:number|any,
    label:string,
    page:string,
    routeName:string,
    routeAction:string,
    icon:string,
    scope:string,
    child: [] | ISidebar[]
}

export interface IGroupSidebar{
    label:string,
    menus:[] | ISidebar[]
}