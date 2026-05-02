"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { listProducts } from "@/lib/repositories/products";

interface Product {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  description: string | null;
  active: boolean;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const { cart, addItem } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await listProducts({ limit: 20, active: true });
        setProducts(data);
        const initialQuantities: Record<string, number> = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }

    void loadProducts();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "Do not miss our amazing grocery deals",
      subtitle: "Get up to 30% off on your first $150 purchase",
      emoji: "🥒",
    },
    {
      title: "Fresh Products Delivered Daily",
      subtitle: "Get up to 40% off on your next order",
      emoji: "🥕",
    },
    {
      title: "Premium Quality Groceries",
      subtitle: "Free shipping on orders over $50",
      emoji: "🥬",
    },
  ];

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      // Ensure cart is initialized before adding item
      if (!cart?.id) {
        console.error("Cart not initialized. Cart ID is required.");
        alert("Cart is loading. Please try again.");
        return;
      }

      await addItem({
        cartId: cart.id, // Use the real cart ID
        productId: product.id,
        quantity: quantities[product.id] || 1,
      });

      // Success feedback
      console.log(`Added ${product.name} to cart`);
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Slider Section */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="relative h-full">
          {/* Slide Container */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="text-center text-white">
                <div className="mb-6 text-8xl">{slide.emoji}</div>
                <h1 className="mb-4 text-5xl font-bold">{slide.title}</h1>
                <p className="mb-8 text-xl text-gray-300">{slide.subtitle}</p>
                <Link
                  href="/products"
                  className="inline-block rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition-all hover:bg-green-700"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Products With Discounts Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Products With Discounts</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Side - Promo Banners */}
            <div className="flex flex-col gap-4">
              {/* Orange Banner */}
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-6 text-white shadow-lg">
                <div className="absolute -right-8 -top-8 text-8xl opacity-20">🎉</div>
                <h3 className="relative text-2xl font-bold">Special Offer</h3>
                <p className="relative mt-2">Get 30% Off on Selected Items</p>
                <button className="relative mt-4 inline-block rounded-lg bg-white px-6 py-2 font-bold text-orange-600 hover:bg-orange-50">
                  Shop Now
                </button>
              </div>

              {/* Green Banner */}
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-br from-green-400 to-green-600 p-6 text-white shadow-lg">
                <div className="absolute -right-8 -bottom-8 text-8xl opacity-20">🌿</div>
                <h3 className="relative text-2xl font-bold">Fresh Produce</h3>
                <p className="relative mt-2">Farm Fresh Quality Guaranteed</p>
                <button className="relative mt-4 inline-block rounded-lg bg-white px-6 py-2 font-bold text-green-600 hover:bg-green-50">
                  Explore
                </button>
              </div>
            </div>

            {/* Right Side - Product Grid */}
            <div className="lg:col-span-2">
              <div className="grid gap-4 grid-cols-2">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg">
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900">
                      25% Off
                    </div>

                    {/* Product Image */}
                    <div className="relative mb-3 h-32 w-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* Product Details */}
                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
                    <p className="mb-2 text-xs text-gray-600">500g Pack</p>

                    {/* Price */}
                    <div className="mb-3 flex gap-2">
                      <span className="text-lg font-bold text-red-600">${(product.price_cents / 100 * 0.75).toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${(product.price_cents / 100).toFixed(2)}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-600 px-2 py-1">
                      <button
                        onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                        className="text-green-600 hover:font-bold"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-medium">{quantities[product.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                        className="text-green-600 hover:font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full rounded-lg border border-green-600 py-2 font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                      disabled={!cart?.id}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products Section */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Best Selling Products</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-lg">
                {/* Discount Badge */}
                <div className="absolute top-1 left-1 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-gray-900">
                  25% Off
                </div>

                {/* Product Image */}
                <div className="relative mb-2 h-24 w-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Product Details */}
                <h3 className="mb-1 line-clamp-2 text-xs font-semibold text-gray-900">{product.name}</h3>

                {/* Price */}
                <div className="mb-2 flex gap-1">
                  <span className="text-sm font-bold text-red-600">${(product.price_cents / 100 * 0.75).toFixed(2)}</span>
                  <span className="text-xs text-gray-500 line-through">${(product.price_cents / 100).toFixed(2)}</span>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => {
                    handleQuantityChange(product.id, 1);
                    handleAddToCart(product);
                  }}
                  className="w-full rounded-lg border border-green-600 py-1 text-xs font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                  disabled={!cart?.id}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
