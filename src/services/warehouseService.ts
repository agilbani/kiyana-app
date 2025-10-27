import api from "@/api/api";
import { ListTask, Task } from '@/types/task';

/**
 * Get all tasks by date and status
 * @param status Planned/Completed/etc.
 * @param start_date YYYY-MM-DD
 * @param end_date YYYY-MM-DD
 */

export async function getUnit(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/master/units`
  );
  return response.data;
}

export async function getSuppliers(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/master/suppliers`
  );
  return response.data;
}

//Material
export async function getMaterial(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/materials`
  );
  return response.data;
}

export async function getMaterialVariant(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/material-variants`
  );
  return response.data;
}

export async function getMaterialOne(
    materialSlug: string
): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/materials/${materialSlug}`
  );
  return response.data;
}

export const addMaterial = async (payload: any) => {
   console.log('payload bahan', payload);
   
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("supplier_id", payload.supplier_id);
    formData.append("unit_id", payload.unit_id);

    // append array variants
    if (payload.variants && Array.isArray(payload.variants)) {
      payload.variants.forEach((variant: any, index: number) => {
        formData.append(`variants[${index}][color_id]`, variant.color_id);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][min_stock]`, variant.min_stock);
        if (variant.image) {
          formData.append(`variants[${index}][image]`, variant.image);
        }
      });
    }

    const response = await api.post("/warehouse/materials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data?.message || "Tambah material berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "Tambah material gagal",
      status: error?.response?.status,
    };
  }
};

export const updateMaterial = async (
  materialSlug: string,
  payload: any,
) => {
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("supplier_id", payload.supplier_id);
    formData.append("unit_id", payload.unit_id);

    if (payload.variants && Array.isArray(payload.variants)) {
      payload.variants.forEach((variant: any, index: number) => {
        if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
        formData.append(`variants[${index}][color_id]`, variant.color_id);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][min_stock]`, variant.min_stock);
        if (variant.image) {
          formData.append(`variants[${index}][image]`, variant.image);
        }
      });
    }

    const response = await api.patch(
      `/warehouse/materials/${materialSlug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Update material berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);
    console.log("Update material error:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "Update material gagal",
      status: error?.response?.status,
    };
  }
};

export const deleteMaterial = async (
    materialSlug: string,
    payload: any,
) => {
  
  try {
    const response = await api.delete(
      `/warehouse/materials/${materialSlug}`,
    //   formData,
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

//Accesoris
export async function getAccesorice(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/accessories`
  );
  return response.data;
}

export async function getAccesoriceVariant(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/accessories-variants`
  );
  return response.data;
}

export async function getAccesoriceOne(
    accessoriesSlug: string
): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/accessories/${accessoriesSlug}`
  );
  return response.data;
}

export const addAccessory = async (payload: any) => {
   console.log('payload aksesoris', payload);
   
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("supplier_id", payload.supplier_id);
    formData.append("unit_id", payload.unit_id);

    if (payload.variants && Array.isArray(payload.variants)) {
      payload.variants.forEach((variant: any, index: number) => {
        formData.append(`variants[${index}][color_id]`, variant.color_id);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][min_stock]`, variant.min_stock);
        if (variant.image) {
          formData.append(`variants[${index}][image]`, variant.image);
        }
      });
    }

    const response = await api.post("/warehouse/accessories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data?.message || "Tambah aksesori berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);
    console.log("Tambah aksesori error:", error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "Tambah aksesori gagal",
      status: error?.response?.status,
    };
  }
};

export const updateAccessory = async (
  accessoriesSlug: string,
  payload: any,
) => {
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("supplier_id", payload.supplier_id);
    formData.append("unit_id", payload.unit_id);

    if (payload.variants && Array.isArray(payload.variants)) {
      payload.variants.forEach((variant: any, index: number) => {
        if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
        formData.append(`variants[${index}][color_id]`, variant.color_id);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][min_stock]`, variant.min_stock);
        if (variant.image) {
          formData.append(`variants[${index}][image]`, variant.image);
        }
      });
    }

    const response = await api.patch(
      `/warehouse/accessories/${accessoriesSlug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Update aksesori berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);
    console.log("Update aksesori error:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "Update aksesori gagal",
      status: error?.response?.status,
    };
  }
};


export const deleteAccesorice = async (
    accessoriesSlug: string,
    payload: any,
) => {
  
  try {
    const response = await api.delete(
      `/warehouse/accessories/${accessoriesSlug}`,
    //   formData,
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

//Product
export async function getProduct(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/products`
  );
  return response.data;
}

export async function getProductVariant(

): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/product-variants`
  );
  return response.data;
}

export async function getProductOne(
    productSlug: string
): Promise<Task[]> {
  const response = await api.get<ListTask[]>(
    `/warehouse/products/${productSlug}`
  );
  return response.data;
}

export const addProduct = async (payload: any) => {
  try {
    const formData = new FormData();

    // field utama
    formData.append("name", payload.name);
    formData.append("sort_name", payload.sort_name);
    formData.append("weight", payload.weight);
    formData.append("level", payload.level);
    formData.append("description", payload.description);
    formData.append("category_id", payload.category_id);
    formData.append("cutting_fee", payload.cutting_fee);
    formData.append("sewing_fee", payload.sewing_fee);
    formData.append("finishing_fee", payload.finishing_fee);
    formData.append("other_fee", payload.other_fee);

    // productMaterials
    if (payload.productMaterials && Array.isArray(payload.productMaterials)) {
      payload.productMaterials.forEach((item: any, index: number) => {
        if (item.material_id)
          formData.append(`productMaterials[${index}][material_id]`, item.material_id);
        formData.append(`productMaterials[${index}][usage_quantity]`, item.usage_quantity);
      });
    }

    // accessories
    if (payload.accessories && Array.isArray(payload.accessories)) {
      payload.accessories.forEach((item: any, index: number) => {
        if (item.accessory_variant_id)
          formData.append(`accessories[${index}][accessory_variant_id]`, item.accessory_variant_id);
        formData.append(`accessories[${index}][qty]`, item.qty);
      });
    }

    // attributes
    if (payload.attributes && Array.isArray(payload.attributes)) {
      payload.attributes.forEach((attr: any, index: number) => {
        formData.append(`attributes[${index}][attribute_id]`, attr.attribute_id);
        formData.append(`attributes[${index}][value]`, attr.value);
      });
    }

    // data → nested color + image + variants
    if (payload.data && Array.isArray(payload.data)) {
      payload.data.forEach((colorData: any, i: number) => {
        formData.append(`data[${i}][color]`, colorData.color);
        if (colorData.image) {
          formData.append(`data[${i}][image]`, colorData.image);
        }

        if (colorData.variants && Array.isArray(colorData.variants)) {
          colorData.variants.forEach((variant: any, j: number) => {
            formData.append(`data[${i}][variants][${j}][size_id]`, variant.size_id);
            formData.append(`data[${i}][variants][${j}][sku]`, variant.sku);
            formData.append(`data[${i}][variants][${j}][price]`, variant.price);
            formData.append(`data[${i}][variants][${j}][stock]`, variant.stock);
            formData.append(`data[${i}][variants][${j}][min_stock]`, variant.min_stock);
          });
        }
      });
    }

    // kirim request
    const response = await api.post("/warehouse/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data?.message || "Tambah produk berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);
    console.log("Tambah produk error:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "Tambah produk gagal",
      status: error?.response?.status,
    };
  }
};

export const updateProduct = async (productSlug: string, payload: any) => {
  try {
    const formData = new FormData();

    // field utama
    formData.append("name", payload.name);
    formData.append("sort_name", payload.sort_name);
    formData.append("weight", payload.weight);
    formData.append("level", payload.level);
    formData.append("description", payload.description);
    formData.append("category_id", payload.category_id);
    formData.append("cutting_fee", payload.cutting_fee);
    formData.append("sewing_fee", payload.sewing_fee);
    formData.append("finishing_fee", payload.finishing_fee);
    formData.append("other_fee", payload.other_fee);

    // productMaterials
    if (payload.productMaterials && Array.isArray(payload.productMaterials)) {
      payload.productMaterials.forEach((item: any, index: number) => {
        if (item.id)
          formData.append(`productMaterials[${index}][id]`, item.id);
        if (item.material_id)
          formData.append(`productMaterials[${index}][material_id]`, item.material_id);
        formData.append(`productMaterials[${index}][usage_quantity]`, item.usage_quantity);
      });
    }

    // accessories
    if (payload.accessories && Array.isArray(payload.accessories)) {
      payload.accessories.forEach((item: any, index: number) => {
        if (item.id)
          formData.append(`accessories[${index}][id]`, item.id);
        if (item.accessory_variant_id)
          formData.append(`accessories[${index}][accessory_variant_id]`, item.accessory_variant_id);
        formData.append(`accessories[${index}][qty]`, item.qty);
      });
    }

    // attributes
    if (payload.attributes && Array.isArray(payload.attributes)) {
      payload.attributes.forEach((attr: any, index: number) => {
        formData.append(`attributes[${index}][attribute_id]`, attr.attribute_id);
        formData.append(`attributes[${index}][value]`, attr.value);
      });
    }

    // data → nested color + image + variants
    if (payload.data && Array.isArray(payload.data)) {
      payload.data.forEach((colorData: any, i: number) => {
        formData.append(`data[${i}][color]`, colorData.color);
        if (colorData.image) {
          formData.append(`data[${i}][image]`, colorData.image);
        }

        if (colorData.variants && Array.isArray(colorData.variants)) {
          colorData.variants.forEach((variant: any, j: number) => {
            if (variant.id)
              formData.append(`data[${i}][variants][${j}][id]`, variant.id);
            formData.append(`data[${i}][variants][${j}][size_id]`, variant.size_id);
            formData.append(`data[${i}][variants][${j}][sku]`, variant.sku);
            formData.append(`data[${i}][variants][${j}][price]`, variant.price);
            formData.append(`data[${i}][variants][${j}][stock]`, variant.stock);
            formData.append(`data[${i}][variants][${j}][min_stock]`, variant.min_stock);
          });
        }
      });
    }

    // kirim PATCH request
    const response = await api.patch(
      `/warehouse/products/${productSlug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Update produk berhasil",
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    console.log("error response", error.response);
    console.log("error message", error.message);
    console.log("Update produk error:", error?.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || "Update produk gagal",
      status: error?.response?.status,
    };
  }
};

export const deleteProduct = async (
    productSlug: string,
    payload: any,
) => {
  
  try {
    const response = await api.delete(
      `/warehouse/products/${productSlug}`,
    //   formData,
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