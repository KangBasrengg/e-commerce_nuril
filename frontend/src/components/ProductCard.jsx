import React from 'react';
import { Link } from 'react-router-dom';

const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

// Simple emoji icons per category
const getCategoryIcon = (categoryName) => {
    const icons = {
        'Sayuran': '🥬',
        'Bumbu Dapur': '🧄',
        'Buah-buahan': '🍎',
        'Bahan Pokok': '🌾',
    };
    return icons[categoryName] || '📦';
};

const ProductCard = ({ product }) => {
    const categoryName = product.Category?.name || '';

    return (
        <div className="card p-0 overflow-hidden flex flex-col group">
            {/* Image Area */}
            <div className="relative bg-primary-50/50 h-44 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(categoryName)}
                </span>

                {/* Category Badge */}
                {categoryName && (
                    <span className="badge badge-primary absolute top-3 left-3">
                        {categoryName}
                    </span>
                )}

                {/* Stock indicator */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="badge badge-danger text-sm">Stok Habis</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-text-primary mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {product.description || "Deskripsi produk belum tersedia."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-border">
                    <span className="text-lg font-bold text-primary-600">
                        {formatRupiah(product.price)}
                    </span>
                    <Link
                        to={`/products/${product.id}`}
                        className="btn-primary text-xs px-4 py-2"
                    >
                        Lihat Detail
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
