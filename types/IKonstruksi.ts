import type {ITipeKonstruksi} from "~/types/ITipeKonstruksi";
import type {IMandor} from "~/types/IMandor";
import type {IClient} from "~/types/IClient";

export interface IKonstruksi {
    "id":number|any,
    "no_booking":string|any,
    "tipe_konstruksi_id":number|any,
    "client_id":number|any,
    "tipe":string|any
    "address":string|any
    "keterangan":string|any
    "total":number|any
    "paid":number|any
    "remaining_payment":number|any
    "status":string|any
    "start_date":string|any
    "end_date":string|any
    "created_at":string|any
    "tipe_konstruksi"?:ITipeKonstruksi
    "mandor" : IMandor
    "client" : IClient
}

export interface IKonstruksiConfirmation {
    "id":number|null|any,
    "mandor_id":number|null|any,
    "start_date":string|null|any
    "end_date":string|null|any
}