import type {ITipeKonstruksi} from "~/types/ITipeKonstruksi";

export interface IBooking {
    "id":number|any,
    "tipe_konstruksi_id":number|any,
    "user_id":number|any,
    "tipe":string|any
    "address":string|any
    "keterangan":string|any
    "total":number|any
    "start_date":string|any
    "end_date":string|any
    "created_at":string|any
    "tipe_konstruksi"?:ITipeKonstruksi
}
