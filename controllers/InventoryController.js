const { parse } = require('papaparse');
const { Inventory, Store, Employee } = require('../models'); // Importa los modelos necesarios
const Op = require('sequelize').Op;


async function getAllInventories(req, res) {
    try {
        const queryParams = req.query;
        const allEmpty = Object.values(queryParams).every(param => param === null || param === '');
        if (!allEmpty) {
            const page = parseInt(req.query.page) || 1;
            const per_page = parseInt(req.query.per_page) || 10; //itemes por defecto
            const { employee_id, store_id, quantity, startDate, endDate, flavor, is_season_flavor, operator } = req.query;
            const startIndex = (page - 1) * per_page;

            whereClause = {};
            if (employee_id) {
                if (Array.isArray(employee_id)) {
                    whereClause[Op['or']] ? whereClause[Op['or']] : whereClause[Op['or']] = [];
                    whereClause[Op['or']].push({ employee_id: employee_id.map(id => parseInt(id)) });
                } else {
                    whereClause.employee_id = parseInt(employee_id);
                }
            }

            if (store_id) {
                if (Array.isArray(store_id)) {
                    whereClause[Op['or']] ? whereClause[Op['or']] : whereClause[Op['or']] = [];
                    whereClause[Op['or']].push({ store_id: store_id.map(store_id => parseInt(store_id)) });
                } else {
                    whereClause.store_id = parseInt(store_id);
                }
            }


            if (quantity) {
                switch (operator ? operator : 'eq') {
                    case 'gt':
                        whereClause.quantity = { [Op.gt]: parseInt(quantity) };
                        break;
                    case "gte":
                        whereClause.quantity = { [Op.gte]: parseInt(quantity) };
                        break;
                    case "lt":
                        whereClause.quantity = { [Op.lt]: parseInt(quantity) };
                        break;
                    case "lte":
                        whereClause.quantity = { [Op.lte]: parseInt(quantity) };
                        break;
                    case "eq":
                        whereClause.quantity = { [Op.eq]: parseInt(quantity) };
                        break;
                    default:
                        whereClause.quantity = { [Op.eq]: parseInt(quantity) };
                        break;
                }
            }

            if (startDate !== undefined && endDate !== undefined) {
                console.log(startDate);
                whereClause.date = {
                    [Op.and]: [
                        { [Op.gte]: new Date(startDate) },
                        { [Op.lte]: new Date(endDate) }
                    ]
                }
            } else if (startDate || endDate) {
                whereClause.date = startDate ? new Date(startDate) : new Date(endDate);
            }

            if (flavor) {
                if (Array.isArray(flavor)) {
                    whereClause[Op['or']] ? whereClause[Op['or']] : whereClause[Op['or']] = [];
                    whereClause[Op['or']].push(flavor.map(flavor => ({ flavor: { [Op.iLike]: `%${flavor}%` } })));
                } else {
                    whereClause.flavor = { [Op.like]: flavor };
                }
            }

            if (is_season_flavor) {
                whereClause.is_season_flavor = is_season_flavor === 'true' ? true : false;
            }

            const inventories = await Inventory.findAll({
                offset: startIndex,
                limit: per_page,
                where: whereClause
            }); // Busca todos los inventarios
            return inventories;
        } else {
            const inventories = await Inventory.findAll(); // Busca todos los inventarios
            // Devuelve los inventarios en formato json
            return inventories;
        }


    } catch (error) {
        // console.error(error);
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

async function postInventoriesFromCSV(row) {
    try {
        const keys = Object.keys(row);
        for (let i = 0; i < keys.length; i++) {
            // console.log(`${keys[i]},${row[keys[i]]}`)
            if ((row[keys[i]] === null || row[keys[i]] === undefined) && (i !== keys.length - 1)) {
                return console.log("Elemento nulo");
            }
        }
        let storeId;
        let employeeId;
        const [store, storeCreated] = await Store.findOrCreate({
            where: {
                name: row["Store"]
            },
            defaults: {
                name: row["Store"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        storeId = store.id;

        const [employee, employeeCreated] = await Employee.findOrCreate({
            where: {
                name: row["Listed By"]
            }
        })
        employeeId = employee.id;

        if (row["Is Season Flavor"] === "Yes") {
            row["Is Season Flavor"] = true;
        } else {
            row["Is Season Flavor"] = false;
        }
        // console.log(storeId, employeeId, row["Date"], row["Flavor"], row["Is Season Flavor"], row["Quantity"]);
        await Inventory.create({
            store_id: storeId,
            employee_id: employeeId,
            date: row["Date"],
            flavor: row["Flavor"],
            is_season_flavor: row["Is Season Flavor"],
            quantity: row["Quantity"]
        });

    } catch (error) {
        // console.error(error);
    }
}

module.exports = {
    getAllInventories,
    createInventory,
    getInventoryById,
    updateInventoryById,
    deleteInventoryById,
    postInventoriesFromCSV
};