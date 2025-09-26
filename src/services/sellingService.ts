import api from '@/api/api';
import { queryParams } from '@/utils/getQueryParams';
import mime from 'mime';
import moment from 'moment';

export const addSelling = async (
  payload: any,
  accessories: any,
) => {
  
  try {
    const shipment = {
        name: payload.shipmentName,
        address: payload.shipmentAddress,
    };
    let items: { item_id: any; price: any; stock: any; qty: any }[] = [];
    accessories.map((v: any) => {
        items.push({
            item_id: v.accessory_id,
            price: v.price,
            stock: v.stock,
            qty: v.qty,
        });
    });

    let formatFile = [];
    for (let i = 0; i < payload.file.length; i++) {
        formatFile.push({
            uri: payload.file[i].uri,
            name: payload.file[i].fileName || 'photo.jpg',
            type: mime.getType(payload.file[i].uri) || 'image/jpeg',
        });
    }

    const formData = new FormData();

    formData.append("invoice_number", payload.invoice_number);
    formData.append(
        "selling_at",
        moment(payload.selling_at, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    formData.append("discount", payload.discount);
    formData.append("tax", payload.tax);
    formData.append("payment_method", payload.payment_method);
    formData.append("payment_status", payload.payment_status);
    formData.append("cash", payload.cash.replace(/\./g, ""));
    formData.append("change", payload.change);
    formData.append("sub_total", payload.sub_total);
    formData.append("total", payload.total);
    formData.append("customer_id", payload.customer_id);
    formData.append("shipment", JSON.stringify(shipment));
    // formData.append("items", items);
    items.forEach((item: any, index: any) => {
        formData.append(`items[${index}][item_id]`, item.item_id);
        formData.append(`items[${index}][price]`, item.price);
        formData.append(`items[${index}][qty]`, item.qty);
        formData.append(`items[${index}][stock]`, item.stock);
    });
    const asset = {
      uri: payload.file[0].uri,
      name: payload.file[0].fileName || 'photo.jpg',
      type: mime.getType(payload.file[0].uri) || 'image/jpeg',
    }
    formData.append('file', asset);
    const response = await api.post(
      '/sellings',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || 'Tambah penjualan berhasil',
      status: response.status,
    };
  } catch (error: any) {
    console.log('error', error);
    console.log('error response', error.response);
    console.log('error message', error.message);
    console.log('Tambah penjualan error:', error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Tambah penjualan failed',
      status: error?.response?.status,
    };
  }
};

export async function getSelling(payload: any) {
   try {
    const res = await api.get(`/sellings?${queryParams(payload)}`);
    console.log('res res seling', res);
    
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch data selling list",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}

export async function getDetailSelling(id: any) {
   try {
    const res = await api.get(`/sellings/${id}`);
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch data selling list",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}

export async function getWidget() {
   try {
    const res = await api.get("/sellings/widget");
    return {
      success: true,
      statusCode: 200,
      message: "Success fetch data selling list",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 400,
      data: [],
      message:
        error?.response?.data?.message ??
        "Terjadi kesalahan saat mengambil data kategori.",
    };
  }
}