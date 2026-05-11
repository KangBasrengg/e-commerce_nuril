const { Xendit } = require('xendit-node');
const db = require('../models');
const Order = db.Order;

// Initialize Xendit client
const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
});

/**
 * Create a QRIS payment request via Xendit Payment Request API
 * POST /api/payment/create-qris
 * Body: { orderId }
 */
const createQRISPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'orderId wajib diisi' });
        }

        // Find the order
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Check if order belongs to user
        if (order.user_id !== req.userId) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        // Check if already paid
        if (order.payment_status === 'paid') {
            return res.status(400).json({ message: 'Pesanan sudah dibayar' });
        }

        const amount = Math.round(Number(order.total_price));
        const referenceId = `order_${order.id}_${Date.now()}`;

        // Create Payment Request with QRIS
        const paymentRequest = await xenditClient.PaymentRequest.createPaymentRequest({
            data: {
                reference_id: referenceId,
                amount: amount,
                currency: 'IDR',
                payment_method: {
                    type: 'QR_CODE',
                    qr_code: {
                        channel_code: 'QRIS',
                    },
                    reusability: 'ONE_TIME_USE',
                },
                metadata: {
                    order_id: order.id.toString(),
                },
            },
        });

        // Extract QR string from response
        const qrString = paymentRequest.actions?.find(a => a.action === 'PRESENT_TO_CUSTOMER')?.qr_checkout_string
            || paymentRequest.paymentMethod?.qrCode?.channelProperties?.qrString
            || null;

        // Save xendit reference to order
        order.xendit_invoice_id = paymentRequest.id;
        await order.save();

        res.json({
            success: true,
            payment_request_id: paymentRequest.id,
            qr_string: qrString,
            amount: amount,
            status: paymentRequest.status,
            reference_id: referenceId,
            // Fallback: return full response for debugging in dev mode
            ...(process.env.NODE_ENV !== 'production' && { raw_response: paymentRequest }),
        });

    } catch (error) {
        console.error('Xendit QRIS Error:', error?.message || error);

        // If Xendit SDK fails (e.g. invalid key), return a mock QR for development
        if (process.env.XENDIT_SECRET_KEY?.includes('placeholder')) {
            const order = await Order.findByPk(req.body.orderId);
            const amount = order ? Math.round(Number(order.total_price)) : 0;

            return res.json({
                success: true,
                payment_request_id: `dev_mock_${Date.now()}`,
                qr_string: `00020101021226670016COM.NOBUBANK.WWW01189360050300000879140214${Date.now()}5204541153033605802ID5913ESTORE DEV TX6007JAKARTA61051017162070703A0163049A33`,
                amount: amount,
                status: 'PENDING',
                reference_id: `order_${req.body.orderId}_dev`,
                is_mock: true,
            });
        }

        res.status(500).json({
            message: 'Gagal membuat pembayaran QRIS',
            error: error?.message || 'Unknown error',
        });
    }
};

/**
 * Check payment status
 * GET /api/payment/status/:orderId
 */
const checkPaymentStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        res.json({
            orderId: order.id,
            payment_status: order.payment_status,
            status: order.status,
            xendit_invoice_id: order.xendit_invoice_id,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

/**
 * Xendit Webhook callback
 * POST /api/payment/webhook
 */
const xenditWebhook = async (req, res) => {
    try {
        const event = req.body;

        console.log('📩 Xendit Webhook received:', JSON.stringify(event, null, 2));

        // Handle payment success
        if (event.event === 'payment.succeeded' || event.status === 'SUCCEEDED') {
            const paymentRequestId = event.data?.id || event.id;

            // Find order by xendit_invoice_id
            const order = await Order.findOne({
                where: { xendit_invoice_id: paymentRequestId }
            });

            if (order) {
                order.payment_status = 'paid';
                order.status = 'paid';
                await order.save();
                console.log(`✅ Order #${order.id} marked as PAID`);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(200).json({ received: true }); // Always return 200 to Xendit
    }
};

module.exports = { createQRISPayment, checkPaymentStatus, xenditWebhook };
