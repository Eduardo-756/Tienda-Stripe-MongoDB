const { default: SummaryApi } = require("../common");

const fetchCategoryWiseProduct = async (category) => {
    try {
        const response = await fetch(SummaryApi.categoryWiseProduct.url, {
            method: SummaryApi.categoryWiseProduct.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: category
            })
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const dataResponse = await response.json();
        return dataResponse;

    } catch (error) {
        console.error("Error al obtener los productos por categoría:", error);
        throw error;
    }
};

export default fetchCategoryWiseProduct;