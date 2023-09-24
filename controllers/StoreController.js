const { Inventory, Store, Employee } = require('../models'); // Importa los modelos necesarios

const getStores = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10; //itemes por defecto

    const startIndex = (page - 1) * per_page;

    const stores = await Store.findAll({
        offset: startIndex,
        limit: per_page
    }); // Busca todos los inventarios
    return stores;
}
module.exports = {
    getStores
}