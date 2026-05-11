import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Masuk ke Akun</h1>
                    <p className="text-text-secondary mt-1 text-sm">Selamat datang kembali di E-Store</p>
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
                                placeholder="Masukkan password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3 text-base">
                            Masuk
                        </button>
                    </form>

                    <p className="text-center mt-5 text-sm text-text-secondary">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
