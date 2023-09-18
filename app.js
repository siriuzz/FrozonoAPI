const express = require('express');
const app = express();
const router = express.Router();
const InventoryController = require('./controllers/InventoryController');
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

router.post('/upload', async (req, res) => {

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