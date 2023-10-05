const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLBoolean, GraphQLInt } = require('graphql');
const { Inventory, Store, Employee } = require('./models');
const { Op } = require('sequelize');

const includeModels = [
  {
    model: Store,
    as: 'store',
    attributes: ['name'],
  },
  {
    model: Employee,
    as: 'employee',
    attributes: ['name'],
  }
];

const addIceCreamToInventories = async (inventories) => {
  inventories.forEach(inventory => {
    inventory.icecream = {
      flavor: inventory.flavor,
      quantity: inventory.quantity,
      is_season_flavor: inventory.is_season_flavor
    }
  });
  return inventories;
};


const IceCreamInputType = new GraphQLInputObjectType({
  name: 'IceCreamInput',
  fields: {
    flavor: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    is_season_flavor: { type: GraphQLBoolean },
  },
});

const StoreInputType = new GraphQLInputObjectType({
  name: 'StoreInput',
  fields: {
    name: { type: GraphQLString },
  },
});


const EmployeeInputType = new GraphQLInputObjectType({
  name: 'EmployeeInput',
  fields: {
    name: { type: GraphQLString },
  },
});

const StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: {
    name: { type: GraphQLString },
  },
});

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: {
    name: { type: GraphQLString },
  },
});

const IceCreamType = new GraphQLObjectType({
  name: 'IceCream',
  fields: {
    flavor: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    is_season_flavor: { type: GraphQLBoolean },
  },
});

const InventoryInputType = new GraphQLInputObjectType({
  name: 'InventoryInput',
  fields: {
    store: { type: StoreInputType },
    employee: { type: EmployeeInputType },
    icecream: { type: IceCreamInputType },
    date: { type: GraphQLString },
  },
});

const InventoryType = new GraphQLObjectType({
  name: 'Inventory',
  fields: {
    store: { type: StoreType },
    employee: { type: EmployeeType },
    icecream: { type: IceCreamType },
    date: { type: GraphQLString },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    inventory: {
      type: new GraphQLList(InventoryType),
      async resolve() {
        const inventories = await Inventory.findAll(
          {
            attributes: ['flavor', 'quantity', 'is_season_flavor', 'date'],
            include: includeModels
          }
        );
        addIceCreamToInventories(inventories);
        // const graphqlInventories = [];
        // for (let i = 0; i < inventories.length; i++) {
        //   const inventory = {};
        //   inventory.store = inventories[i].store;
        //   inventory.employee = inventories[i].employee;
        //   inventory.icecream = inventories[i];
        //   inventory.date = inventories[i].date;
        //   graphqlInventories.push(inventory);
        // }
        return inventories;
      },
    },
    inventorybyflavor: {
      type: new GraphQLList(InventoryType),
      args: {
        flavor: { type: GraphQLString },
      },
      async resolve(_, { flavor }) {
        const inventories = await Inventory.findAll({
          where: {
            flavor: flavor
          },
          include: includeModels
        });
        console.log(inventories);
        addIceCreamToInventories(inventories);
        return inventories;
      },
    },
    inventorybystore: {
      type: new GraphQLList(InventoryType),
      args: {
        store: { type: GraphQLString },
      },
      async resolve(_, { store }) {
        const storeId = await Store.findOne({
          attributes: ['id'],
          where: {
            name: store
          }
        });
        const inventories = await Inventory.findAll({
          include: includeModels,
          where: {
            store_id: storeId.id
          }
        });
        addIceCreamToInventories(inventories);
        return inventories;
      },
    },
    inventorybydate: {
      type: new GraphQLList(InventoryType),
      args: {
        date: { type: GraphQLString },
      },
      async resolve(_, { date }) {
        const inventories = await Inventory.findAll({
          include: includeModels,
          where: {
            date: Date.parse(date)
          }
        });
        addIceCreamToInventories(inventories);
        return inventories;
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addinventory: {
      type: InventoryType,
      args: {
        inventory: { type: InventoryInputType },
      },
      async resolve(_, { inventory }) {
        let newInventory = {};
        const store = await Store.findOrCreate({
          where: {
            name: inventory.store.name
          }
        });
        // console.log(store);
        newInventory.store_id = store[0].dataValues.id;
        const employee = await Employee.findOrCreate({
          where: {
            name: inventory.employee.name
          }
        });
        newInventory.employee_id = store[0].dataValues.id;

        newInventory.flavor = inventory.icecream.flavor;
        newInventory.quantity = inventory.icecream.quantity;
        newInventory.is_season_flavor = inventory.icecream.is_season_flavor;
        newInventory.date = new Date();

        return await Inventory.create(newInventory);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType,
});

module.exports = schema;