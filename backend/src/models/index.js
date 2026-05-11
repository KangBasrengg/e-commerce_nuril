const sequelize = require('../config/database');

// Import models
const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Category = require('./category')(sequelize);
const Order = require('./order')(sequelize);
const OrderItem = require('./orderItem')(sequelize);

// Define Associations

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Order <-> Product (Many-to-Many via OrderItem)
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'product_id' });

// Explicit OrderItem associations for easier access
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
    sequelize,
    User,
    Product,
    Category,
    Order,
    OrderItem
};
