import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, TrendingUp, Award, Truck, Search } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge.jsx";
import { products, categories } from "../data/mockData";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";

export default function DashboardPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

  const filteredProducts = featuredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col space-y-8">

        {/* ===== WELCOME BANNER ===== */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.email?.split("@")[0] || "Champion"}! 👋
              </h1>
              <p className="text-white/90 text-lg">
                Discover our latest collection of premium sports equipment
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shrink-0"
              asChild
            >
              <Link to="/products">
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Products",
              value: products.length,
              icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
            },
            {
              label: "Categories",
              value: categories.length,
              icon: <Award className="h-6 w-6 text-blue-600" />,
            },
            {
              label: "Free Shipping",
              value: "$100+",
              icon: <Truck className="h-6 w-6 text-blue-600" />,
            },
            {
              label: "Special Offers",
              value: "25% Off",
              icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            },
          ].map((stat, i) => (
            <Card key={i} className="transition-all hover:-translate-y-1 hover:shadow-lg duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ===== CATEGORIES ===== */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <p className="text-gray-500">Browse our wide range of sports equipment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== FEATURED PRODUCTS ===== */}
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-gray-500">Hand-picked selection of premium sports equipment</p>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 duration-300"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </Link>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge className="text-xs bg-blue-50 text-blue-600 border-blue-100">
                      {product.category}
                    </Badge>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your search.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
