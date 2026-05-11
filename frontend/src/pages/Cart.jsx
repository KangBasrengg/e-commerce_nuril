import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const Cart = () => {
    const { cartItems, removeFromCart, getTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-bg flex flex-col items-center justify-center">
                <span className="text-6xl mb-4">🛒</span>
                <h2 className="text-xl font-bold text-text-primary mb-2">Keranjang Masih Kosong</h2>
                <p className="text-text-secondary mb-6 text-sm">Yuk, mulai belanja kebutuhan dapurmu!</p>
                <Link to="/" className="btn-primary">
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-bg py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Keranjang Belanja
                </h1>

                <div className="card overflow-hidden">
                    <ul>
                        {cartItems.map((item, index) => (
                            <li
                                key={item.product_id}
                                className={`flex items-center justify-between p-5 ${index < cartItems.length - 1 ? 'border-b border-neutral-border' : ''}`}
                            >
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-text-primary">{item.name}</h3>
                                    <p className="text-sm text-text-secondary mt-0.5">
                                        {formatRupiah(item.price)} × {item.quantity}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-base font-bold text-primary-600">
                                        {formatRupiah(Number(item.price) * item.quantity)}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.product_id)}
                                        className="btn-danger"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Total & Checkout */}
                    <div className="p-5 bg-primary-50/50 border-t border-neutral-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-text-secondary">Total Belanja</p>
                            <span className="text-2xl font-bold text-primary-700">{formatRupiah(getTotal())}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary py-3 px-8 text-base w-full sm:w-auto"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
