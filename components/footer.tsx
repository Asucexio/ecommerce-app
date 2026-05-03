import Link from "next/link";

function VisaIcon() {
    return (
        <svg viewBox="0 0 38 24" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="4" fill="#1A1F71" />
            <text x="7" y="17" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">VISA</text>
        </svg>
    );
}

function MastercardIcon() {
    return (
        <svg viewBox="0 0 38 24" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="4" fill="#fff" stroke="#e5e7eb" />
            <circle cx="15" cy="12" r="7" fill="#EB001B" />
            <circle cx="23" cy="12" r="7" fill="#F79E1B" />
            <path d="M19 6.8a7 7 0 010 10.4A7 7 0 0119 6.8z" fill="#FF5F00" />
        </svg>
    );
}

function AmexIcon() {
    return (
        <svg viewBox="0 0 38 24" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="4" fill="#2E77BC" />
            <text x="5" y="17" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
        </svg>
    );
}

function StripeIcon() {
    return (
        <svg viewBox="0 0 38 24" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="4" fill="#635BFF" />
            <text x="6" y="17" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">stripe</text>
        </svg>
    );
}

function PaypalIcon() {
    return (
        <svg viewBox="0 0 38 24" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="24" rx="4" fill="#003087" />
            <text x="4" y="17" fill="#009CDE" fontSize="9" fontWeight="bold" fontFamily="Arial">PayPal</text>
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-800 py-12">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5 mb-12">
                    {/* About */}
                    <div>
                        <h4 className="mb-5 text-lg font-bold text-gray-900">About Company</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📞</span>
                                <div>
                                    <p className="text-xs text-gray-500">Call Us 24/7</p>
                                    <p className="text-base font-bold text-green-600">+258 3692 2569</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-semibold text-gray-700">Mon–Fri:</span> 8:00am – 6:00pm</p>
                                <p><span className="font-semibold text-gray-700">Saturday:</span> 8:00am – 6:00pm</p>
                                <p><span className="font-semibold text-gray-700">Sunday:</span> <span className="text-red-500">Closed</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Our Stores */}
                    <div>
                        <h4 className="mb-5 text-lg font-bold text-gray-900">Our Stores</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                            {["Delivery Information", "Privacy Policy", "Terms & Conditions", "Support Center", "Careers"].map(l => (
                                <li key={l}><Link href="#" className="hover:text-green-600 transition-colors">{l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop Categories */}
                    <div>
                        <h4 className="mb-5 text-lg font-bold text-gray-900">Shop Categories</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                            {["Contact Us", "Information", "About Us", "Careers", "Blog"].map(l => (
                                <li key={l}><Link href="#" className="hover:text-green-600 transition-colors">{l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h4 className="mb-5 text-lg font-bold text-gray-900">Useful Links</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                            {["Cancellations & Returns", "Report Infringement", "Payments", "Shipping", "FAQ"].map(l => (
                                <li key={l}><Link href="#" className="hover:text-green-600 transition-colors">{l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-5 text-lg font-bold text-gray-900">Newsletter</h4>
                        <p className="mb-4 text-sm text-gray-600">
                            Subscribe for updates on new arrivals and exclusive discounts.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
                            />
                            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                        <label className="mt-3 flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
                            <input type="checkbox" className="mt-0.5" />
                            <span>I&apos;d like to receive news and special offers</span>
                        </label>
                    </div>
                </div>

                <div className="border-t border-gray-300 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Social */}
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-700">Follow Us:</p>
                            <div className="flex items-center gap-3">
                                {[
                                    { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                                    { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                ].map(({ label, path }) => (
                                    <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-green-600 hover:text-white transition-colors">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Payment methods — proper SVG icons, no external images */}
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-700">Payment Accepted:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <VisaIcon />
                                <MastercardIcon />
                                <AmexIcon />
                                <PaypalIcon />
                                <StripeIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} <span className="font-bold">NovaCart</span>. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400">
                        <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
                        <Link href="#" className="hover:text-gray-600">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
