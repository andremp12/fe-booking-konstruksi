export interface ILaporanKonstruksi{
    "id":number|any
    "konstruksi_id":number|any
    "mandor_id":number|any
    "title":string|any
    "tipe":string|any
    "client":string|any
    "mandor_name":string|any
    "bahan_konstruksi":IBahanKonstruksi|any
    "deskripsi":number|any
    "image":string|any
    "status"?:string|any
    "created_at":string|any
}

export interface IBahanKonstruksi {
    "id":string|any
    "name":string|any
    "price":number|any
    "qty":number|any
    "unit":string|any
    "total":number|any
}