import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
            navigate('/login');
            alert('Pendaftaran berhasil! Silakan masuk.');
        } catch (err) {
            setError(err.response?.data?.message || 'Pendaftaran gagal');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Buat Akun Baru</h1>
                    <p className="text-text-secondary mt-1 text-sm">Daftar untuk mulai berbelanja</p>
                </div>

                {/* Card */}
                <div className="card p-7">
                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3 text-base">
                            Daftar
                        </button>
                    </form>

                    <p className="text-center mt-5 text-sm text-text-secondary">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
