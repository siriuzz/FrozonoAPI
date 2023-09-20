const express = require('express');
const app = express();
const router = express.Router();
const InventoryController = require('./controllers/InventoryController');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const fs = require('fs');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/inventory', router);

router
    .get('/', async (req, res, next) => {
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
    }).post('/', async (req, res) => {
        try {
            const newInventory = await InventoryController.createInventory(req, res);
            console.log(newInventory);
            res.json(newInventory).status(201);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not create inventory' });
        }
    });
router.post('/upload', upload.single('csv'), async (req, res) => {

    const Papa = require('papaparse');
    const file = fs.createReadStream(req.file.path);
    Papa.parse(file, {
        delimiter: ',',
        newline: ',\n\c', // Newline character
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true, // Skip empty lines in the CSV
        transformHeader: header => header.trim(), // Trim header names
        transform: value => value.trim(), // Trim cell values
        complete: function (results) {
            // console.log(results);
            for (let i = 0; i < results.data.length; i++) {
                const element = results.data[i];

                // console.log(element);
                InventoryController.postInventoriesFromCSV(element);
            }
            console.log(results.data.length);
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

router.get('/:id', async (req, res) => {
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
}).delete('/:id', async (req, res) => {
    try {
        const inventory = await InventoryController.deleteInventoryById(req, res);
        console.log(inventory);
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete inventory' });
    }
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

module.exports = router;