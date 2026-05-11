import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const Checkout = () => {
    const { cartItems, getTotal, clearCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Review, 2: Address, 3: Payment, 4: QRIS
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Weight per item (kg)
    const [weights, setWeights] = useState({});

    // Address form
    const [form, setForm] = useState({
        recipient_name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        notes: '',
    });

    // Map
    const [mapCoords, setMapCoords] = useState({ lat: -6.2088, lng: 106.8456 });

    // QRIS data
    const [qrisData, setQrisData] = useState(null);
    const [paymentChecking, setPaymentChecking] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [orderId, setOrderId] = useState(null);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleWeightChange = (productId, value) => {
        const num = parseFloat(value);
        setWeights({ ...weights, [productId]: isNaN(num) || num <= 0 ? '' : num });
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    alert('Gagal mendapatkan lokasi. Pastikan GPS diaktifkan.');
                }
            );
        }
    };

    const isAddressValid = form.recipient_name && form.phone && form.address && form.city && form.postal_code;

    // Create order and then generate QRIS
    const handlePayWithQRIS = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Create the order
            const orderItems = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                weight_kg: weights[item.product_id] || null
            }));

            const orderPayload = {
                items: orderItems,
                recipient_name: form.recipient_name,
                phone: form.phone,
                address: form.address,
                city: form.city,
                postal_code: form.postal_code,
                latitude: mapCoords.lat,
                longitude: mapCoords.lng,
                payment_method: 'qris',
                notes: form.notes
            };

            const orderRes = await api.post('/orders', orderPayload);
            const newOrderId = orderRes.data.orderId;
            setOrderId(newOrderId);

            // Step 2: Generate QRIS via payment API
            const qrisRes = await api.post('/payment/create-qris', { orderId: newOrderId });

            if (qrisRes.data.success && qrisRes.data.qr_string) {
                setQrisData(qrisRes.data);
                clearCart();
                setStep(4); // Show QRIS page
            } else {
                throw new Error('QR string tidak ditemukan dalam response');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Gagal membuat pembayaran');
        } finally {
            setLoading(false);
        }
    };

    // Poll payment status every 5 seconds on QRIS step
    useEffect(() => {
        let interval;
        if (step === 4 && orderId) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get(`/payment/status/${orderId}`);
                    if (res.data.payment_status === 'paid') {
                        setPaymentStatus('paid');
                        clearInterval(interval);
                    }
                } catch (e) { /* silently fail */ }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [step, orderId]);

    if (!user) return (
        <div className="min-h-screen bg-neutral-bg flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">🔒</span>
            <h2 className="text-xl font-bold text-text-primary mb-2">Masuk Terlebih Dahulu</h2>
            <p className="text-text-secondary mb-6 text-sm">Anda perlu masuk untuk melanjutkan checkout.</p>
            <Link to="/login" className="btn-primary">Masuk</Link>
        </div>
    );

    if (cartItems.length === 0 && step < 4) return (
        <div className="min-h-screen bg-neutral-bg flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">📭</span>
            <h2 className="text-xl font-bold text-text-primary mb-2">Keranjang Kosong</h2>
            <p className="text-text-secondary mb-6 text-sm">Tidak ada barang untuk di-checkout.</p>
            <Link to="/" className="btn-primary">Mulai Belanja</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-bg py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Back */}
                {step < 4 && (
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
                        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary-600 mb-6 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                )}

                {/* Steps Indicator */}
                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {['Review Pesanan', 'Alamat Pengiriman', 'Pembayaran'].map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    step > i + 1 ? 'bg-primary-500 text-white' :
                                    step === i + 1 ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' :
                                    'bg-neutral-border text-text-muted'
                                }`}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-medium hidden sm:inline ${step === i + 1 ? 'text-text-primary' : 'text-text-muted'}`}>
                                    {label}
                                </span>
                                {i < 2 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-primary-500' : 'bg-neutral-border'}`} />}
                            </div>
                        ))}
                    </div>
                )}

                {/* ==================== STEP 1: Review ==================== */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-xl font-bold text-text-primary mb-5">Review Pesanan</h1>

                        <div className="card overflow-hidden mb-6">
                            {cartItems.map((item, index) => (
                                <div key={item.product_id} className={`p-5 ${index < cartItems.length - 1 ? 'border-b border-neutral-border' : ''}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{item.name}</h3>
                                            <p className="text-sm text-text-secondary">{formatRupiah(item.price)} / unit</p>
                                        </div>
                                        <span className="font-bold text-primary-600">
                                            {formatRupiah(Number(item.price) * item.quantity)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-text-secondary">Jumlah:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                                className="input-field w-20 text-center py-1.5 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-text-secondary">Berat (kg):</label>
                                            <input
                                                type="number"
                                                min="0.1"
                                                step="0.1"
                                                placeholder="Opsional"
                                                value={weights[item.product_id] || ''}
                                                onChange={(e) => handleWeightChange(item.product_id, e.target.value)}
                                                className="input-field w-28 text-center py-1.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card p-5 flex justify-between items-center mb-6">
                            <span className="font-bold text-text-primary">Total</span>
                            <span className="text-2xl font-bold text-primary-600">{formatRupiah(getTotal())}</span>
                        </div>

                        <button onClick={() => setStep(2)} className="btn-primary w-full py-3.5 text-base">
                            Lanjut ke Alamat Pengiriman
                        </button>
                    </div>
                )}

                {/* ==================== STEP 2: Address ==================== */}
                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-xl font-bold text-text-primary mb-5">Alamat Pengiriman</h1>

                        <div className="card p-6 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Penerima *</label>
                                    <input name="recipient_name" value={form.recipient_name} onChange={handleFormChange} className="input-field" placeholder="Nama lengkap penerima" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">No. Telepon *</label>
                                    <input name="phone" value={form.phone} onChange={handleFormChange} className="input-field" placeholder="08xxxxxxxxxx" required />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-text-primary mb-1.5">Alamat Lengkap *</label>
                                <textarea name="address" value={form.address} onChange={handleFormChange} className="input-field" rows="3" placeholder="Jl. contoh No. 123, RT/RW, Kelurahan, Kecamatan" required />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Kota *</label>
                                    <input name="city" value={form.city} onChange={handleFormChange} className="input-field" placeholder="Nama kota" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Kode Pos *</label>
                                    <input name="postal_code" value={form.postal_code} onChange={handleFormChange} className="input-field" placeholder="12345" required />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-text-primary mb-1.5">Catatan (Opsional)</label>
                                <input name="notes" value={form.notes} onChange={handleFormChange} className="input-field" placeholder="Mis: patokan rumah, warna pagar, dll." />
                            </div>
                        </div>

                        {/* Map */}
                        <div className="card p-6 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-text-primary text-sm">📍 Titik Lokasi (Google Maps)</h3>
                                <button onClick={handleGetLocation} className="btn-outline text-xs px-3 py-1.5">
                                    Gunakan Lokasi Saya
                                </button>
                            </div>

                            <div className="rounded-xl overflow-hidden border border-neutral-border" style={{ height: '280px' }}>
                                <iframe
                                    title="Google Maps Location"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
                                />
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                Koordinat: {mapCoords.lat.toFixed(5)}, {mapCoords.lng.toFixed(5)}
                            </p>
                        </div>

                        <button
                            onClick={() => setStep(3)}
                            disabled={!isAddressValid}
                            className="btn-primary w-full py-3.5 text-base"
                        >
                            Lanjut ke Pembayaran
                        </button>
                    </div>
                )}

                {/* ==================== STEP 3: Payment Confirmation ==================== */}
                {step === 3 && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-xl font-bold text-text-primary mb-5">Konfirmasi & Pembayaran</h1>

                        {/* Order Summary */}
                        <div className="card p-6 mb-6">
                            <h3 className="font-semibold text-text-primary mb-3">Ringkasan Pesanan</h3>
                            <ul className="divide-y divide-neutral-border text-sm">
                                {cartItems.map(item => (
                                    <li key={item.product_id} className="py-2.5 flex justify-between">
                                        <div>
                                            <span className="text-text-primary">{item.name}</span>
                                            <span className="text-text-muted ml-1.5">×{item.quantity}</span>
                                            {weights[item.product_id] && (
                                                <span className="text-text-muted ml-1.5">({weights[item.product_id]} kg)</span>
                                            )}
                                        </div>
                                        <span className="font-medium text-text-primary">{formatRupiah(Number(item.price) * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-neutral-border mt-3 pt-3 flex justify-between">
                                <span className="font-bold text-text-primary">Total</span>
                                <span className="text-xl font-bold text-primary-600">{formatRupiah(getTotal())}</span>
                            </div>
                        </div>

                        {/* Shipping Summary */}
                        <div className="card p-6 mb-6">
                            <h3 className="font-semibold text-text-primary mb-3">Alamat Pengiriman</h3>
                            <div className="text-sm text-text-secondary space-y-1">
                                <p className="font-medium text-text-primary">{form.recipient_name}</p>
                                <p>{form.phone}</p>
                                <p>{form.address}</p>
                                <p>{form.city}, {form.postal_code}</p>
                                {form.notes && <p className="italic text-text-muted">Catatan: {form.notes}</p>}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="card p-6 mb-6">
                            <h3 className="font-semibold text-text-primary mb-3">Metode Pembayaran</h3>
                            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50/50">
                                <div className="w-12 h-12 rounded-lg bg-white border border-neutral-border flex items-center justify-center">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">QRIS</p>
                                    <p className="text-xs text-text-secondary">Scan QR code untuk bayar via GoPay, OVO, Dana, ShopeePay, dll.</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Pay button */}
                        <button
                            onClick={handlePayWithQRIS}
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Membuat QRIS...
                                </span>
                            ) : (
                                `Bayar ${formatRupiah(getTotal())} dengan QRIS`
                            )}
                        </button>
                    </div>
                )}

                {/* ==================== STEP 4: QRIS QR Code ==================== */}
                {step === 4 && qrisData && (
                    <div className="animate-fade-in-up">
                        {paymentStatus === 'paid' ? (
                            /* Payment Success */
                            <div className="card p-10 text-center max-w-md mx-auto">
                                <span className="text-6xl mb-4 block">✅</span>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">Pembayaran Berhasil!</h2>
                                <p className="text-text-secondary mb-6">Pesanan Anda sedang diproses dan akan segera dikirim.</p>
                                <button onClick={() => navigate('/')} className="btn-primary w-full py-3">
                                    Kembali ke Beranda
                                </button>
                            </div>
                        ) : (
                            /* Show QR Code */
                            <div className="card p-8 text-center max-w-md mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-text-primary mb-1">Scan QR Code untuk Membayar</h2>
                                    <p className="text-text-secondary text-sm">Gunakan aplikasi e-wallet atau mobile banking Anda</p>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white p-6 rounded-2xl border border-neutral-border inline-block mb-6">
                                    <QRCode
                                        value={qrisData.qr_string}
                                        size={220}
                                        level="M"
                                        bgColor="#FFFFFF"
                                        fgColor="#1A231E"
                                    />
                                </div>

                                {/* Amount */}
                                <div className="mb-6">
                                    <p className="text-sm text-text-secondary mb-1">Total Pembayaran</p>
                                    <p className="text-3xl font-bold text-primary-600">{formatRupiah(qrisData.amount)}</p>
                                </div>

                                {/* Payment apps */}
                                <div className="flex justify-center gap-3 mb-6">
                                    {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'LinkAja'].map(app => (
                                        <span key={app} className="badge badge-neutral text-xs">{app}</span>
                                    ))}
                                </div>

                                {/* Status indicator */}
                                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm mb-4">
                                    <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                    Menunggu pembayaran...
                                </div>

                                {qrisData.is_mock && (
                                    <p className="text-xs text-text-muted mb-4 italic">
                                        ⚠️ Mode Development — QR ini adalah simulasi. Ganti XENDIT_SECRET_KEY dengan key asli untuk produksi.
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button onClick={() => navigate('/')} className="btn-outline flex-1 py-2.5">
                                        Kembali
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Copy QR string to clipboard
                                            navigator.clipboard?.writeText(qrisData.qr_string);
                                            alert('QR string disalin ke clipboard');
                                        }}
                                        className="btn-outline flex-1 py-2.5"
                                    >
                                        Salin QR String
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
