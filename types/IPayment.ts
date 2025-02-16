import type {IClient} from "~/types/IClient";
import type {IKonstruksi} from "~/types/IKonstruksi";

export interface IPayment {
    id: string|any;
    name: string|any;
    kode: string|any;
    konstruksi_id : string|any;
    client_id : string|any;
    metode : string|any;
    status : string|any;
    total : number|any;
    due_date : string|any;
    payment_date : string|any;
    konstruksi? : IKonstruksi;
    client?: IClient
}