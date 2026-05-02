import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-800 py-12">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5 mb-12">
                    {/* About Company */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-gray-900">About Company</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📞</span>
                                <div>
                                    <p className="text-xs text-gray-600">Have Question? Call Us 24/7</p>
                                    <p className="text-lg font-bold text-green-600">+258 3692 2569</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-sm text-gray-700">Monday - Friday: <span className="font-normal">8:00am - 6:00pm</span></p>
                                <p className="font-semibold text-sm text-gray-700">Saturday: <span className="font-normal">8:00am - 6:00pm</span></p>
                                <p className="font-semibold text-sm text-gray-700">Sunday: <span className="text-red-600">Service Close</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Our Stores */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-gray-900">Our Stores</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Delivery Information
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Support Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Shop Categories */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-gray-900">Shop Categories</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Information
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Nest Stories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-gray-900">Useful Links</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Cancellation & Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Report Infringement
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Payments
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-green-600 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-6 text-lg font-bold text-gray-900">Our Newsletter</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Subscribe to the mailing list to receive updates one the new arrivals and other discounts
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                        <label className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                            <input type="checkbox" className="mt-1" />
                            <span>I would like to receive news and special offer</span>
                        </label>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 py-8">
                    {/* Social Media & Payment Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Social Media */}
                        <div>
                            <p className="font-semibold text-gray-900 mb-4">Follow Us:</p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                                    </svg>
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.595a6.61 6.61 0 01-1.837-.529 1.32 1.32 0 00-1.94 1.205v.03a6.465 6.465 0 015.728 3.175 1.32 1.32 0 002.126-.655 8.348 8.348 0 00-5.113-4.207V3.24a1.32 1.32 0 00-1.97-1.175 23.876 23.876 0 00-6.745 6.745 1.32 1.32 0 001.174 1.971 8.348 8.348 0 014.208 5.112h-.03a1.32 1.32 0 00.655 2.126 6.466 6.466 0 01-3.176-5.729h-.03a1.32 1.32 0 00-1.205 1.94 6.61 6.61 0 00.529 1.838" />
                                    </svg>
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                    </svg>
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.64-12.09l-5.55 7.63L9 11l-2 2 5 5 7-9.46-2-1.53z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <p className="font-semibold text-gray-900 mb-4">Payment Accepts:</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <img src="https://via.placeholder.com/45x30?text=VISA" alt="Visa" className="h-8" />
                                <img src="https://via.placeholder.com/45x30?text=MASTER" alt="Mastercard" className="h-8" />
                                <img src="https://via.placeholder.com/45x30?text=PAYPAL" alt="PayPal" className="h-8" />
                                <img src="https://via.placeholder.com/45x30?text=AMEX" alt="Amex" className="h-8" />
                                <img src="https://via.placeholder.com/45x30?text=VISA2" alt="Visa" className="h-8" />
                                <img src="https://via.placeholder.com/45x30?text=STRIPE" alt="Stripe" className="h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright & Download */}
                <div className="border-t border-gray-300 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                        <p className="text-sm text-gray-600">
                            Copyright 2024 © <span className="font-bold">NovaCart</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 md:justify-end">
                            <span className="text-sm font-semibold text-gray-700">Download App:</span>
                            <button className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white hover:bg-gray-800 transition-colors text-xs font-semibold">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 13.5c-.91 0-1.64.74-1.64 1.65.01.91.73 1.65 1.64 1.65.92 0 1.65-.74 1.65-1.65-.01-.91-.73-1.65-1.65-1.65zM4.5 12.5c-1.21 0-2.2 1-2.2 2.2s.99 2.2 2.2 2.2 2.2-.99 2.2-2.2-.99-2.2-2.2-2.2zm10.35-4.05c1.01 0 1.85-.84 1.85-1.85S15.86 4.75 14.85 4.75s-1.85.84-1.85 1.85.84 1.85 1.85 1.85z" />
                                </svg>
                                Google Play
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white hover:bg-gray-800 transition-colors text-xs font-semibold">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.18l1.42 1.41c.9-.55 1.92-.87 3.01-.87 3.04 0 5.68 2.36 5.92 5.26l1.42-1.41c.9.55 1.92.87 3.01.87.82 0 1.6-.15 2.33-.43l-1.02-1.02zM3 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm18 12c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM7.8 13.5c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8zm8.4 0c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8z" />
                                </svg>
                                App Store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
