import Link from "next/link";

export default function AccountPage() {
    return (
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-2 text-3xl font-semibold">My Account</h1>
            <p className="mb-6 text-slate-600">Manage your profile, orders, and account preferences.</p>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/account/order" className="rounded-xl border bg-white p-5 shadow-sm hover:bg-slate-50">
                    <h2 className="text-xl font-semibold">My Orders</h2>
                    <p className="mt-2 text-sm text-slate-600">Track and review all your placed orders.</p>
                </Link>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-semibold">Profile</h2>
                    <p className="mt-2 text-sm text-slate-600">Starter card for profile settings and addresses.</p>
                </div>
            </div>
        </main>
    );
}
