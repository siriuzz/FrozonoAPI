const { where } = require('sequelize');
const { Inventory, Store, Employee } = require('../models'); // Importa los modelos necesarios
const Op = require('sequelize').Op;

const getStores = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10; //itemes por defecto
        const name = req.query.name || '';

        const startIndex = (page - 1) * per_page;
        const whereClause = {};
        if (name) {
            if (Array.isArray(name) === false) {
                whereClause.name = name;
            } else {
                whereClause[Op.or] = name.map(name => ({ name: { [Op.like]: `%${name}%` } }));
            }
        }

        const stores = await Store.findAll({
            offset: startIndex,
            limit: per_page,
            where: whereClause
        }); // Busca todos los inventarios
        return stores;


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tiendas' });
    }
}


module.exports = {
    getStores
}