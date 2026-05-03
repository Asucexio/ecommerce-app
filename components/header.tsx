"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/hooks/use-cart";
import { useAuthContext } from "@/hooks/use-auth-context";

const categories = [
    { name: "Breakfast & Dairy", icon: "🥛" },
    { name: "Meats & Seafood", icon: "🍗" },
    { name: "Breads & Bakery", icon: "🍞" },
    { name: "Chips & Snacks", icon: "🍿" },
    { name: "Medical Healthcare", icon: "💊" },
    { name: "Frozen Foods", icon: "❄️" },
    { name: "Grocery & Staples", icon: "🥫" },
    { name: "Other Items", icon: "📦" },
];

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}

export function Header() {
    const router = useRouter();
    const { cart, items } = useCart();
    const { auth } = useAuthContext();
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showCartSidebar, setShowCartSidebar] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const categoryRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryMenu(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSignOut() {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <>
            <header className="sticky top-0 z-40 bg-white">
                {/* Top Green Bar */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-2">
                    <div className="mx-auto max-w-7xl flex items-center justify-between text-white text-xs sm:text-sm">
                        <div className="font-semibold">FREE delivery & 40% Discount for next 3 orders!</div>
                        <div className="hidden md:block">We deliver daily from 7:00 to 22:00</div>
                        <div className="font-semibold">
                            Need help? <a href="tel:+258326821485" className="underline hover:no-underline">+258 3268 21485</a>
                        </div>
                    </div>
                </div>

                {/* Top Nav Bar */}
                <div className="border-b border-gray-200 px-4 py-2">
                    <div className="mx-auto max-w-7xl flex items-center justify-between text-xs sm:text-sm text-gray-700">
                        <div className="flex items-center gap-6">
                            <Link href="/about" className="hover:text-green-600">About Us</Link>
                            <Link href="/account" className="hover:text-green-600">My Account</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <select className="border-none bg-white text-xs text-gray-700 hover:text-green-600 cursor-pointer">
                                <option>English</option>
                                <option>Dutch</option>
                            </select>
                            <select className="border-none bg-white text-xs text-gray-700 hover:text-green-600 cursor-pointer">
                                <option>USD</option>
                                <option>EUR</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="border-b border-gray-200 px-4 py-4">
                    <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 text-2xl font-bold text-green-600">
                            NovaCart
                        </Link>

                        {/* Categories & Search */}
                        <div className="hidden flex-1 gap-3 lg:flex items-center">
                            <div className="relative" ref={categoryRef}>
                                <button
                                    onMouseEnter={() => setShowCategoryMenu(true)}
                                    onMouseLeave={() => setShowCategoryMenu(false)}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 whitespace-nowrap"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    Categories
                                </button>
                                {showCategoryMenu && (
                                    <div
                                        onMouseEnter={() => setShowCategoryMenu(true)}
                                        onMouseLeave={() => setShowCategoryMenu(false)}
                                        className="absolute top-full left-0 mt-0 w-56 rounded-lg border border-gray-200 bg-white shadow-xl z-50"
                                    >
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.name}
                                                href={`/products?category=${encodeURIComponent(cat.name)}`}
                                                className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm hover:bg-green-50 first:rounded-t-lg last:border-b-0 transition-colors"
                                            >
                                                <span className="text-xl">{cat.icon}</span>
                                                <span className="text-gray-700">{cat.name}</span>
                                                <svg className="h-4 w-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <form
                                    className="flex gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (searchQuery.trim()) {
                                            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                        }
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search for products, categories or brands..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Account — auth-aware */}
                            <div className="relative hidden sm:block" ref={userRef}>
                                {auth?.userId ? (
                                    <>
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-medium transition-all hover:border-green-600 hover:text-green-600"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm">Account</span>
                                        </button>
                                        {showUserMenu && (
                                            <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
                                                <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                                                <Link href="/account/order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                                                {auth.isAdmin && (
                                                    <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">Admin Dashboard</Link>
                                                )}
                                                <hr className="my-1" />
                                                <button
                                                    onClick={() => void handleSignOut()}
                                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-medium transition-all hover:border-green-600 hover:text-green-600"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm">Sign in</span>
                                    </Link>
                                )}
                            </div>

                            {/* Cart Button */}
                            <button
                                onClick={() => setShowCartSidebar(!showCartSidebar)}
                                className="relative flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-medium transition-all hover:border-green-600 hover:text-green-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm font-medium">My Cart</span>
                                {totalItems > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="rounded-lg px-2 py-2 text-gray-700 transition-all hover:bg-gray-100 lg:hidden"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-4 block lg:hidden">
                        <form
                            className="relative"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="border-b border-gray-200 bg-white px-4">
                    <div className="mx-auto max-w-7xl">
                        <nav className="hidden items-center justify-between md:flex">
                            <ul className="flex items-center gap-8">
                                <li><Link href="/" className="py-3 font-semibold text-gray-700 hover:text-green-600 transition-colors">Home</Link></li>
                                <li><Link href="/products" className="py-3 font-semibold text-gray-700 hover:text-green-600 transition-colors">Shop</Link></li>
                                <li><Link href="/account/order" className="py-3 font-semibold text-gray-700 hover:text-green-600 transition-colors">Orders</Link></li>
                                <li><Link href="/account" className="py-3 font-semibold text-gray-700 hover:text-green-600 transition-colors">Account</Link></li>
                            </ul>
                            <div className="flex items-center gap-4">
                                <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 transition-colors flex items-center gap-2">
                                    Get 30% Discount Now
                                    <span className="ml-1 inline-block rounded-full bg-red-500 px-2 py-1 text-xs font-bold">Sale</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="border-t border-gray-200 bg-white py-4 md:hidden">
                        <div className="mx-auto max-w-7xl px-4 space-y-1">
                            <Link href="/" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
                            <Link href="/products" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Shop</Link>
                            <Link href="/account/order" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">My Orders</Link>
                            {auth?.userId ? (
                                <>
                                    <Link href="/account" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">My Account</Link>
                                    <button onClick={() => void handleSignOut()} className="block w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Sign out</button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="block rounded-lg px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50">Sign in</Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Cart Sidebar */}
            {showCartSidebar && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCartSidebar(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg overflow-y-auto">
                        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({totalItems})</h2>
                            <button onClick={() => setShowCartSidebar(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 px-6 py-4">
                            {items.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-gray-600">Your cart is empty</p>
                                    <Link href="/products" onClick={() => setShowCartSidebar(false)} className="mt-4 inline-block text-green-600 font-semibold hover:underline">
                                        Browse Products →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                                            <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">Product</p>
                                                <p className="text-xs text-gray-500">{item.quantity} × ${(item.unit_price_cents / 100).toFixed(2)}</p>
                                                <p className="text-sm font-semibold text-gray-900">${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 space-y-3">
                                <div className="flex justify-between font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>${(totalPrice / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/cart" onClick={() => setShowCartSidebar(false)} className="flex-1 rounded-lg border border-green-600 px-4 py-2.5 text-center text-sm font-semibold text-green-600 transition-all hover:bg-green-50">
                                        View Cart
                                    </Link>
                                    <Link href="/checkout" onClick={() => setShowCartSidebar(false)} className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-green-700">
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
