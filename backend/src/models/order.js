const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
            defaultValue: 'pending'
        },
        // Shipping address fields
        recipient_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Google Maps coordinates
        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },
        // Payment
        payment_method: {
            type: DataTypes.ENUM('qris', 'transfer', 'cod'),
            defaultValue: 'qris'
        },
        payment_status: {
            type: DataTypes.ENUM('unpaid', 'paid', 'failed', 'expired'),
            defaultValue: 'unpaid'
        },
        xendit_invoice_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        xendit_invoice_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
        // user_id handled by association
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Order;
};
