const { Inventory, Store, Employee } = require('../models'); // Importa los modelos necesarios

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
        // if (store !== null) ;
        // else {
        //     const createdStore = Store.create({
        //         name: row["Store"]
        //     })
        // }
        // if (storeCreated) { console.log("Store created -----------------------------"); }
        // storeId = store.id;

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