import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-neutral-border sticky top-0 z-50" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.92)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                                E-Store
                            </span>
                        </Link>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-all text-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Keranjang
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg">
                                    <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-text-primary hidden md:inline">{user.name}</span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-text-secondary hover:text-red-600 font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-text-secondary hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button & Cart */}
                    <div className="flex items-center md:hidden gap-2">
                        {/* Cart Mobile */}
                        <Link
                            to="/cart"
                            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-text-secondary hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-neutral-border bg-white animate-fade-in absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-3 border-b border-neutral-border mb-2">
                                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-text-primary">{user.name}</div>
                                        <div className="text-sm text-text-secondary">{user.role === 'admin' ? 'Admin' : 'User'}</div>
                                    </div>
                                </div>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
                                    >
                                        Dashboard Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2 mt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 text-base font-medium text-text-secondary hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
