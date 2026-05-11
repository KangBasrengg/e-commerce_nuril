const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

const createOrder = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            items,       // [{ product_id, quantity, weight_kg }]
            recipient_name,
            phone,
            address,
            city,
            postal_code,
            latitude,
            longitude,
            payment_method,
            notes
        } = req.body;

        const userId = req.userId;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Tidak ada item dalam pesanan' });
        }
        if (!recipient_name || !phone || !address || !city || !postal_code) {
            return res.status(400).json({ message: 'Alamat pengiriman harus diisi lengkap' });
        }

        let totalPrice = 0;
        const orderItemsData = [];

        // Verify stock and calculate price
        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: `Produk ${item.product_id} tidak ditemukan` });
            }

            if (product.stock < item.quantity) {
                await t.rollback();
                return res.status(400).json({ message: `Stok tidak cukup untuk ${product.name}` });
            }

            totalPrice += Number(product.price) * item.quantity;

            // Deduct stock
            product.stock -= item.quantity;
            await product.save({ transaction: t });

            orderItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                weight_kg: item.weight_kg || null,
                price: product.price
            });
        }

        // Create Order
        const order = await Order.create({
            user_id: userId,
            total_price: totalPrice,
            status: 'pending',
            recipient_name,
            phone,
            address,
            city,
            postal_code,
            latitude: latitude || null,
            longitude: longitude || null,
            payment_method: payment_method || 'qris',
            payment_status: 'unpaid',
            notes: notes || null
        }, { transaction: t });

        // Create Order Items
        for (const data of orderItemsData) {
            await OrderItem.create({
                order_id: order.id,
                ...data
            }, { transaction: t });
        }

        await t.commit();

        // Return order info (frontend will handle Xendit payment via public key)
        res.status(201).json({
            message: 'Pesanan berhasil dibuat',
            orderId: order.id,
            totalPrice: totalPrice,
            paymentMethod: payment_method || 'qris'
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Gagal membuat pesanan', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.userId },
            include: [{
                model: Product,
                through: { attributes: ['quantity', 'price', 'weight_kg'] }
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil pesanan', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: db.User, attributes: ['name', 'email'] },
                { model: Product, through: { attributes: ['quantity', 'price', 'weight_kg'] } }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil semua pesanan', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status, payment_status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

        if (status) order.status = status;
        if (payment_status) order.payment_status = payment_status;

        await order.save();
        res.json({ message: 'Status pesanan diperbarui', order });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui pesanan', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
