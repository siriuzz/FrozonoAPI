const { Inventory, Store, Employee } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize'); // Importa el operador de sequelize

const getAllInventories = async (req, res, next) => {
    try {
        const inventories = await Inventory.findAll(); // Busca todos los inventarios
        // Devuelve los inventarios en formato json
        return inventories;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener inventarios' });
    }
};

const createInventory = async (req, res) => {
    try {
        const inventory = await Inventory.create(req.body); // Crea un nuevo inventario
        return inventory;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear inventario' });
    }
};

const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id); // Busca un inventario por su id
        return inventory;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
};

const updateInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.update(req.body, { // Actualiza un inventario por su id
            where: {
                id: req.params.id
            }
        });
        return inventory;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar inventario' });
    }
};

const deleteInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.destroy({ // Elimina un inventario por su id
            where: {
                id: req.params.id
            }
        });
        return inventory;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar inventario' });
    }
};



module.exports = {
    getAllInventories,
    createInventory,
    getInventoryById,
    updateInventoryById,
    deleteInventoryById

};