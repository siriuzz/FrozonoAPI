const express = require('express');
const app = express();
const router = express.Router();
const InventoryController = require('./controllers/InventoryController');
const StoreController = require('./controllers/StoreController');
const EmployeeController = require('./controllers/EmployeeController');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const fs = require('fs');
const Papa = require('papaparse');
require('dotenv').config();
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120, deleteOnExpire: true });

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

router
    .get('/inventory', async (req, res) => {
        try {
            const inventories = await InventoryController.getAllInventories(req, res);

            console.log(inventories);
            res.json(inventories);
        }
        catch (error) {
            // Handle errors here
            console.error(error);
            res.status(500).json({ error: 'Could not get inventories' });
        }
    }).post('/inventory', async (req, res) => {
        try {
            const newInventory = await InventoryController.createInventory(req, res);
            console.log(newInventory);
            res.json(newInventory).status(201);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not create inventory' });
        }
    });



router.post('/inventory/upload', upload.single('csv'), async (req, res) => {
    const file = fs.createReadStream(req.file.path);
    Papa.parse(file, {
        delimiter: ',',
        newline: '', // Newline character
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true, // Skip empty lines in the CSV
        transformHeader: header => header.trim(), // Trim header names
        transform: value => value.trim(), // Trim cell values
        complete: async function (results) {
            // console.log(results);
            for (let i = 0; i < results.data.length; i++) {
                const element = results.data[i];
                await InventoryController.postInventoriesFromCSV(element);
            }
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al eliminar el archivo' });
                }
                //file removed
            })

            res.status(201).json(results.data);

        },
        error: function (error) {
            res.status(400).json({ error: 'Invalid CSV format' }); // Handle errors
        },
    });

    // fs.readFile(req, async (err, data) => {
    //     console.log(req.body);
    //     // if (err) {
    //     //     console.error(err);
    //     //     res.status(500).json({ error: 'Error al leer el archivo' });
    //     // } else {
    //     //     try {
    //     //         const inventories = await InventoryController.postInventoriesFromCSV(data);
    //     //         res.json(inventories);
    //     //     } catch (error) {
    //     //         console.error(error);
    //     //         res.status(500).json({ error: 'Error al crear inventario a partir de un csv' });
    //     //     }
    //     // }
    // });
});

router.get('/inventory/:id', async (req, res) => {
    try {
        const inventory = await InventoryController.getInventoryById(req, res);
        console.log(inventory);
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not get inventory' });
    }
}).put('/:id', async (req, res) => {
    try {
        const inventory = await InventoryController.updateInventoryById(req, res);
        console.log(inventory);
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update inventory' });
    }
}).delete('/inventory/:id', async (req, res) => {
    try {
        const inventory = await InventoryController.deleteInventoryById(req, res);
        console.log(inventory);
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete inventory' });
    }
});

router.get('/store', async (req, res, next) => {
    const allStores = await StoreController.getStores(req, res);

    const cacheData = allStores.map(store => {
        return { key: "store" + store.id.toString(), val: store.name }

    });

    success = myCache.mset(cacheData)
    console.log(success);
    next();
}, async (req, res) => {
    try {
        if (myCache.keys().length > 0) {
            console.log("Cache hit");

            res.json(myCache.mget(myCache.keys()));
        } else {
            const stores = await StoreController.getStores(req, res);
            // Devuelve los inventarios en formato json
            res.json(stores);
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tiendas' });
    }
});

router.get('/employee', async (req, res, next) => {
    const allEmployees = await EmployeeController.getEmployees(req, res);

    const cacheData = allEmployees.map(employee => {
        return { key: "employee" + employee.id.toString(), val: employee.name }

    });

    success = myCache.mset(cacheData)
    console.log(success);
    next();
}, async (req, res) => {
    try {
        if (myCache.keys().length > 0) {
            console.log("Cache hit");
            res.json(myCache.mget(myCache.keys()));
        } else {
            const employees = await EmployeeController.getEmployees(req, res);
            // Devuelve los inventarios en formato json
            res.json(employees);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

module.exports = router;