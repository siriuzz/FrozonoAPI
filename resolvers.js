const models = require('./models');

const resolvers = {
    Query: {
        inventory: async () => {
            return await models.Inventory.findAll({
                include: ['shop', 'employee', 'icecream']
            });
        },
        inventorybyflavor: async (_, { flavor }) => {
            return await models.Inventory.findAll({
                include: ['shop', 'employee', 'icecream'],
                where: {
                    flavor: flavor
                }
            });
        },
        inventorybyshop: async (_, { shop }) => {
            return await models.Inventory.findAll({
                include: ['shop', 'employee', 'icecream'],
                where: {
                    shop: shop
                }
            });
        },
        inventorybydate: async (_, { date }) => {
            return await models.Inventory.findAll({
                include: ['shop', 'employee', 'icecream'],
                where: {
                    date: date
                }
            });
        },
    },
    Mutation: {
        addinventory: async (_, { inventory }) => {
            return await models.Inventory.create(inventory, {
                include: ['shop', 'employee', 'icecream']
            });
        },
    },
    inventory: () => {
        // logic to get the inventory
    },
    // inventorybyflavor: ({ flavor }) => {
    //     // logic to get the inventory by flavor

    // },
    // inventorybyshop: ({ shop }) => {
    //     // logic to get the inventory by shop
    // },
    // inventorybydate: ({ date }) => {
    //     // logic to get the inventory by date
    // },
    addinventory: ({ inventory }) => {
        // logic to add new inventory
    },
};

export default resolvers;
