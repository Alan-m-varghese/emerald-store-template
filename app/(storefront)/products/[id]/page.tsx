"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShoppingBag, ArrowLeft, Heart, Shield, RotateCcw, Truck, MessageSquare, Plus, Minus } from "lucide-react";
import { dbMock, MockProduct } from "@/lib/dbMock";
import { useCart } from "@/context/CartContext";

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: "r1", user: "Rajesh K.", rating: 5, date: "May 20, 2026", comment: "Absolutely stunning quality. Exceeded my expectations. The color matches the picture perfectly!" },
  { id: "r2", user: "Ananya S.", rating: 4, date: "May 15, 2026", comment: "Very nice fabric and finish. Delivery took 3 days to Bangalore. Worth the price." },
  { id: "r3", user: "Vikram M.", rating: 5, date: "Apr 28, 2026", comment: "Great craftsmanship. Highly recommended store for premium handcrafted products." }
];

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "" });
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<MockProduct[]>([]);

  useEffect(() => {
    const p = dbMock.getProductById(params.id);
    if (p) {
      setProduct(p);
      if (p.size) setSelectedSize(p.size);
      if (p.color) setSelectedColor(p.color);

      // Load related products (same category, excluding current)
      const related = dbMock.getProducts()
        .filter((item) => item.category === p.category && item.id !== p.id && item.isActive)
        .slice(0, 3);
      setRelatedProducts(related);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-4xl">😕</div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500 text-sm">The product you are looking for might have been removed or does not exist.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 rounded-xl"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      sku: product.id,
      price: product.price,
      image: product.image,
      size: selectedSize || product.size,
      color: selectedColor || product.color,
      stock: product.stock,
    }, quantity);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) return;

    const r: Review = {
      id: "r_" + Date.now(),
      user: newReview.user,
      rating: newReview.rating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      comment: newReview.comment
    };

    setReviews([r, ...reviews]);
    setNewReview({ user: "", rating: 5, comment: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-16">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Main Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left Side - Image */}
        <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-square relative border border-slate-100/50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            priority
          />
          {product.compareAtPrice > product.price && (
            <span className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-sm">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% Off
            </span>
          )}
        </div>

        {/* Right Side - Info */}
        <div className="flex flex-col gap-6 lg:py-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-primary-600 font-extrabold bg-primary-50 px-2.5 py-1 rounded-full">
              Handcrafted Product
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight mt-2">{product.name}</h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-amber-400" : ""} />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 border-y border-slate-100 py-4">
            <span className="text-2xl font-black text-slate-950">₹{product.price}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>

          {/* Variants Selectors */}
          <div className="space-y-4">
            {product.size && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Size: {selectedSize}</span>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL", "Free Size", "Standard"].includes(product.size) ? (
                    ["S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 text-xs font-bold rounded-xl border flex items-center justify-center transition-colors ${
                          selectedSize === sz
                            ? "border-primary-600 bg-primary-50 text-primary-700 font-extrabold"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {sz}
                      </button>
                    ))
                  ) : (
                    <button className="px-4 py-2 text-xs font-bold rounded-xl border border-primary-600 bg-primary-50 text-primary-700">
                      {product.size}
                    </button>
                  )}
                </div>
              </div>
            )}

            {product.color && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color: {selectedColor}</span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                    {product.color}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stock Notification */}
          <div>
            {product.stock > 0 ? (
              <span className="text-xs font-semibold text-emerald-600">
                ● In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="text-xs font-semibold text-red-500">
                ● Out of Stock
              </span>
            )}
          </div>

          {/* Quantity & Action Buttons */}
          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-200 rounded-xl px-2 self-start sm:self-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  justAdded
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10"
                }`}
              >
                <ShoppingBag size={16} />
                <span>{justAdded ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 border rounded-xl transition-all ${
                  isLiked
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                title="Add to wishlist"
              >
                <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-6 mt-2 text-[10px] text-slate-400 font-semibold text-center">
            <div className="space-y-1">
              <Truck size={14} className="mx-auto text-slate-400" />
              <span>Pan-India Delivery</span>
            </div>
            <div className="space-y-1">
              <RotateCcw size={14} className="mx-auto text-slate-400" />
              <span>7-Day Return</span>
            </div>
            <div className="space-y-1">
              <Shield size={14} className="mx-auto text-slate-400" />
              <span>100% Genuine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
        {/* Left Side: Summary & Write form */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Customer Reviews</h3>
            <p className="text-slate-500 text-xs mt-1">Read what our verified purchasers say about their experience.</p>
          </div>

          <form onSubmit={handleAddReview} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} /> Write a Review
            </h4>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul S."
                value={newReview.user}
                onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700 bg-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option>
                <option value="4">⭐⭐⭐⭐ (4 Star)</option>
                <option value="3">⭐⭐⭐ (3 Star)</option>
                <option value="2">⭐⭐ (2 Star)</option>
                <option value="1">⭐ (1 Star)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Comments</label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on product quality, color, fabric..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500 transition-all text-slate-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{rev.user}</span>
                      <span className="inline-flex items-center gap-0.5 ml-3 bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        ★ {rev.rating}.0
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs py-10">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 border-t border-slate-100 pt-16">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-950">You May Also Like</h3>
            <p className="text-slate-500 text-xs">Explore more premium products in the same category.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden card-hover-glow flex flex-col"
              >
                <div className="relative h-56 w-full bg-slate-50">
                  <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-primary-600">
                    <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                  </h4>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm font-extrabold text-slate-950">₹{prod.price}</span>
                    <Link
                      href={`/products/${prod.id}`}
                      className="text-[10px] font-bold text-primary-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
