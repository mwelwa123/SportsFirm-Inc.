import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, TrendingUp, Award, Truck } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge.jsx";
import { products, categories } from "../data/mockData";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { toast } from "sonner";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-r from-primary to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">
                New Collection 2026
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your <br /> Performance
              </h1>

              <p className="text-lg md:text-xl text-white/90">
                Premium sports equipment and athletic gear for champions.
                Discover quality products designed to help you achieve your goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/dashboard">
                        Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      asChild
                    >
                      <Link to="/products">Shop Now</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/login">
                        Login In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      asChild
                    >
                      <Link to="/register">Create Account</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1761985063815-b1bf6f91cf3a?auto=format&fit=crop&w=1080&q=80"
                alt="Athletic Performance"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Truck className="h-6 w-6" />,
              title: "Free Shipping",
              desc: "On orders over $100",
            },
            {
              icon: <Award className="h-6 w-6" />,
              title: "Premium Quality",
              desc: "100% authentic products",
            },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Best Prices",
              desc: "Competitive pricing",
            },
            {
              icon: <ShoppingBag className="h-6 w-6" />,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our hand-picked selection of premium sports equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 duration-300"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      ${product.price}
                    </span>
                  </div>

                  <Button
                    className="w-full mt-3"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>

          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and elevate your athletic
            performance today.
          </p>

          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100"
            asChild
          >
            <Link to="/products">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}