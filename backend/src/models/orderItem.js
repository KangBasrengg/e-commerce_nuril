const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        weight_kg: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Weight in kilograms for produce items'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
        // order_id and product_id handled by associations
    }, {
        tableName: 'order_items',
        timestamps: false
    });

    return OrderItem;
};
