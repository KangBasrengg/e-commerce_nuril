import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = ['Semua', ...new Set(products.map(p => p.Category?.name).filter(Boolean))];

    const filteredProducts = selectedCategory === 'Semua'
        ? products
        : products.filter(p => p.Category?.name === selectedCategory);

    return (
        <div className="min-h-screen bg-neutral-bg">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Section */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 badge badge-primary mb-4 text-sm">
                        <span>🛒</span> Belanja Segar Setiap Hari
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight">
                        Kebutuhan Dapur, <br className="sm:hidden" />
                        <span className="text-primary-500">Satu Klik</span> Sampai Rumah
                    </h1>
                    <p className="mt-3 text-base text-text-secondary max-w-xl mx-auto">
                        Sayuran segar, bumbu dapur lengkap, dan bahan pokok berkualitas dengan harga terbaik.
                    </p>
                </div>

                {/* Category Filter */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Count */}
                {!loading && (
                    <p className="text-sm text-text-muted mb-5">
                        Menampilkan <span className="font-semibold text-text-primary">{filteredProducts.length}</span> produk
                    </p>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-3"></div>
                        <p className="text-text-secondary">Memuat produk...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl mb-4 block">📭</span>
                        <p className="text-text-secondary text-lg">Belum ada produk tersedia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredProducts.map((product, index) => (
                            <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-border mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-text-muted">
                        &copy; 2026 E-Store. Belanja kebutuhan dapur dengan mudah dan cepat.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
