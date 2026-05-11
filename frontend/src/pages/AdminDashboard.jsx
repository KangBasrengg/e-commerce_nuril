import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Product form
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
    const [editingProductId, setEditingProductId] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);

    // Category form
    const [categoryForm, setCategoryForm] = useState({ name: '' });
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProducts();
        fetchCategories();
        fetchOrders();
    }, [user]);

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // ==================== FETCH ====================
    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    // ==================== PRODUCTS ====================
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, productForm);
                showMsg('Produk berhasil diperbarui');
            } else {
                await api.post('/products', productForm);
                showMsg('Produk berhasil ditambahkan');
            }
            setProductForm({ name: '', description: '', price: '', stock: '', category_id: '' });
            setEditingProductId(null);
            setShowProductForm(false);
            fetchProducts();
        } catch (err) {
            showMsg(err.response?.data?.message || 'Gagal menyimpan produk', 'error');
        } finally { setLoading(false); }
    };

    const editProduct = (product) => {
        setProductForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category_id: product.category_id || ''
        });
        setEditingProductId(product.id);
        setShowProductForm(true);
    };

    const deleteProduct = async (id) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;
        try {
            await api.delete(`/products/${id}`);
            showMsg('Produk dihapus');
            fetchProducts();
        } catch (err) {
            showMsg('Gagal menghapus', 'error');
        }
    };

    // ==================== CATEGORIES ====================
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingCategoryId) {
                await api.put(`/categories/${editingCategoryId}`, categoryForm);
                showMsg('Kategori berhasil diperbarui');
            } else {
                await api.post('/categories', categoryForm);
                showMsg('Kategori berhasil ditambahkan');
            }
            setCategoryForm({ name: '' });
            setEditingCategoryId(null);
            setShowCategoryForm(false);
            fetchCategories();
            fetchProducts(); // refresh product category names
        } catch (err) {
            showMsg(err.response?.data?.message || 'Gagal menyimpan kategori', 'error');
        } finally { setLoading(false); }
    };

    const editCategory = (cat) => {
        setCategoryForm({ name: cat.name });
        setEditingCategoryId(cat.id);
        setShowCategoryForm(true);
    };

    const deleteCategory = async (id) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await api.delete(`/categories/${id}`);
            showMsg('Kategori dihapus');
            fetchCategories();
        } catch (err) {
            showMsg('Gagal menghapus kategori', 'error');
        }
    };

    // ==================== ORDERS ====================
    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            showMsg('Status pesanan diperbarui');
            fetchOrders();
        } catch (err) {
            showMsg('Gagal memperbarui status', 'error');
        }
    };

    if (!user || user.role !== 'admin') return null;

    const tabs = [
        { id: 'products', label: 'Produk', icon: '📦' },
        { id: 'categories', label: 'Kategori', icon: '🏷️' },
        { id: 'orders', label: 'Pesanan', icon: '📋' },
    ];

    return (
        <div className="min-h-screen bg-neutral-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Dashboard Admin</h1>
                    <p className="text-text-secondary text-sm mt-1">Kelola produk, kategori, dan pesanan toko Anda.</p>
                </div>

                {/* Toast Message */}
                {message.text && (
                    <div className={`mb-6 p-3 rounded-lg text-sm font-medium animate-fade-in ${
                        message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-primary-50 border border-primary-200 text-primary-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-neutral-border pb-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-[1px] ${
                                activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600 bg-white'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-white/50'
                            }`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* ==================== PRODUCTS TAB ==================== */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-semibold text-text-primary">Daftar Produk ({products.length})</h2>
                            <button onClick={() => { setShowProductForm(true); setEditingProductId(null); setProductForm({ name: '', description: '', price: '', stock: '', category_id: '' }); }} className="btn-primary text-sm">
                                + Tambah Produk
                            </button>
                        </div>

                        {/* Product Form Modal */}
                        {showProductForm && (
                            <div className="card p-6 mb-6 animate-fade-in border-2 border-primary-200">
                                <h3 className="font-semibold text-text-primary mb-4">
                                    {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
                                </h3>
                                <form onSubmit={handleProductSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-1">Nama Produk *</label>
                                            <input value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="input-field" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-1">Kategori *</label>
                                            <select value={productForm.category_id} onChange={(e) => setProductForm({...productForm, category_id: e.target.value})} className="input-field" required>
                                                <option value="">Pilih Kategori</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-1">Harga (Rp) *</label>
                                            <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="input-field" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-1">Stok *</label>
                                            <input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="input-field" required />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi</label>
                                        <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="input-field" rows="2" />
                                    </div>
                                    <div className="flex gap-3 mt-5">
                                        <button type="submit" disabled={loading} className="btn-primary">
                                            {loading ? 'Menyimpan...' : (editingProductId ? 'Perbarui' : 'Simpan')}
                                        </button>
                                        <button type="button" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} className="btn-outline">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Product Table */}
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-primary-50/50 text-left">
                                            <th className="px-5 py-3 font-semibold text-text-primary">Produk</th>
                                            <th className="px-5 py-3 font-semibold text-text-primary">Kategori</th>
                                            <th className="px-5 py-3 font-semibold text-text-primary">Harga</th>
                                            <th className="px-5 py-3 font-semibold text-text-primary">Stok</th>
                                            <th className="px-5 py-3 font-semibold text-text-primary text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-border">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-primary-50/30 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="font-medium text-text-primary">{p.name}</div>
                                                    <div className="text-xs text-text-muted line-clamp-1">{p.description}</div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="badge badge-primary">{p.Category?.name || '-'}</span>
                                                </td>
                                                <td className="px-5 py-3 font-medium text-primary-600">{formatRupiah(p.price)}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`badge ${p.stock > 0 ? 'badge-primary' : 'badge-danger'}`}>{p.stock}</span>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => editProduct(p)} className="text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50">Edit</button>
                                                        <button onClick={() => deleteProduct(p.id)} className="btn-danger text-xs">Hapus</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {products.length === 0 && (
                                <div className="text-center py-10 text-text-muted">Belum ada produk.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== CATEGORIES TAB ==================== */}
                {activeTab === 'categories' && (
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-semibold text-text-primary">Daftar Kategori ({categories.length})</h2>
                            <button onClick={() => { setShowCategoryForm(true); setEditingCategoryId(null); setCategoryForm({ name: '' }); }} className="btn-primary text-sm">
                                + Tambah Kategori
                            </button>
                        </div>

                        {showCategoryForm && (
                            <div className="card p-6 mb-6 animate-fade-in border-2 border-primary-200">
                                <h3 className="font-semibold text-text-primary mb-4">
                                    {editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                                </h3>
                                <form onSubmit={handleCategorySubmit} className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-text-primary mb-1">Nama Kategori *</label>
                                        <input value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} className="input-field" required />
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-primary">
                                        {loading ? 'Menyimpan...' : (editingCategoryId ? 'Perbarui' : 'Simpan')}
                                    </button>
                                    <button type="button" onClick={() => { setShowCategoryForm(false); setEditingCategoryId(null); }} className="btn-outline">
                                        Batal
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="card p-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                                        <p className="text-xs text-text-muted">ID: {cat.id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editCategory(cat)} className="text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50">Edit</button>
                                        <button onClick={() => deleteCategory(cat.id)} className="btn-danger text-xs">Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {categories.length === 0 && (
                            <div className="text-center py-10 text-text-muted">Belum ada kategori.</div>
                        )}
                    </div>
                )}

                {/* ==================== ORDERS TAB ==================== */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="font-semibold text-text-primary mb-5">Daftar Pesanan ({orders.length})</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-10 text-text-muted">Belum ada pesanan.</div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="card p-5">
                                        <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                                            <div>
                                                <span className="text-sm font-bold text-text-primary">Order #{order.id}</span>
                                                <p className="text-xs text-text-muted">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                                {order.User && <p className="text-xs text-text-secondary mt-0.5">{order.User.name} ({order.User.email})</p>}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-primary-600">{formatRupiah(order.total_price)}</span>
                                                <div className="flex gap-2 mt-1">
                                                    <span className={`badge ${order.status === 'completed' ? 'badge-primary' : order.status === 'cancelled' ? 'badge-danger' : 'badge-neutral'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className={`badge ${order.payment_status === 'paid' ? 'badge-primary' : 'badge-danger'}`}>
                                                        {order.payment_status || 'unpaid'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {order.recipient_name && (
                                            <div className="text-xs text-text-secondary mb-3 p-3 bg-neutral-bg rounded-lg">
                                                <p className="font-medium">{order.recipient_name} · {order.phone}</p>
                                                <p>{order.address}, {order.city} {order.postal_code}</p>
                                            </div>
                                        )}

                                        {/* Items */}
                                        <div className="text-xs text-text-secondary mb-3">
                                            {order.Products?.map(p => (
                                                <span key={p.id} className="inline-block mr-3 mb-1">
                                                    {p.name} ×{p.OrderItem?.quantity}
                                                    {p.OrderItem?.weight_kg && ` (${p.OrderItem.weight_kg}kg)`}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Status Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            {['pending', 'paid', 'shipped', 'completed', 'cancelled'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateOrderStatus(order.id, s)}
                                                    disabled={order.status === s}
                                                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                                        order.status === s
                                                            ? 'bg-primary-500 text-white border-primary-500'
                                                            : 'border-neutral-border text-text-secondary hover:border-primary-400 hover:text-primary-600'
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
