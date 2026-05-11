import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const getCategoryIcon = (categoryName) => {
    const icons = {
        'Sayuran': '🥬',
        'Bumbu Dapur': '🧄',
        'Buah-buahan': '🍎',
        'Bahan Pokok': '🌾',
    };
    return icons[categoryName] || '📦';
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError('Gagal memuat produk');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-3"></div>
                <p className="text-text-secondary">Memuat...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
            <div className="text-center">
                <span className="text-5xl mb-4 block">⚠️</span>
                <p className="text-red-500 font-medium">{error}</p>
                <button onClick={() => navigate('/')} className="btn-outline mt-4">Kembali</button>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
            <div className="text-center">
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="text-text-secondary text-lg">Produk tidak ditemukan</p>
                <button onClick={() => navigate('/')} className="btn-outline mt-4">Kembali</button>
            </div>
        </div>
    );

    const categoryName = product.Category?.name || '';

    return (
        <div className="min-h-screen bg-neutral-bg">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary-600 mb-6 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </button>

                {/* Product Detail Card */}
                <div className="card overflow-hidden md:flex animate-fade-in-up">
                    {/* Image Area */}
                    <div className="md:w-5/12 bg-primary-50/50 flex items-center justify-center p-10 min-h-[300px]">
                        <span className="text-9xl">
                            {getCategoryIcon(categoryName)}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="md:w-7/12 p-8 flex flex-col">
                        {/* Category */}
                        {categoryName && (
                            <span className="badge badge-primary self-start mb-3">
                                {categoryName}
                            </span>
                        )}

                        <h1 className="text-2xl font-bold text-text-primary mb-3">
                            {product.name}
                        </h1>

                        <p className="text-text-secondary leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {/* Price & Stock */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold text-primary-600">
                                {formatRupiah(product.price)}
                            </span>
                            <span className={`badge ${product.stock > 0 ? 'badge-primary' : 'badge-danger'}`}>
                                {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <div className="mt-auto">
                            <button
                                className={`btn-primary w-full py-3.5 text-base ${addedToCart ? '!bg-primary-700' : ''}`}
                                disabled={product.stock <= 0}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Ditambahkan!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                        </svg>
                                        Tambah ke Keranjang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
