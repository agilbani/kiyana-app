interface Data {
   sewing_by: any,
   finishing_by: any,
   end_finishing_at: any,
   end_sewing_at: any,
   start_sewing_at: any,
   start_finishing_at: any
}

export const getStatusBatch = (data: Data, type: "sewn" | "finishing") => {
   let status = '';
   
   if (type === 'sewn') {
      
      if (data.sewing_by === null) {
         status = 'Belum ada penjahit'
      } else {
         if (data.end_sewing_at === null) {
            if (data.start_sewing_at === null) {
               status = 'Produk perlu dijahit'
            } else {
               status = 'Produk sedang dijahit'
            }
         } else {
            status = 'Produk selesai dijahit'
         }
      }
   } else {
      if (data.finishing_by === null) {
         status = 'Produk perlu diproses finishing'
      } else {
         if (data.end_finishing_at === null) {
            if (data.start_finishing_at === null) {
               status = 'Produk perlu diproses finishing'
            } else {
               status = 'Produk sedang proses finishing'
            }
         } else {
            status = 'Produk selesai difinishing'
         }
      }
   }
   return status;
}