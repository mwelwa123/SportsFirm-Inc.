// src/data/mockData.js

export const products = [
  {
    id: 1,
    name: "Running Shoes",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1595950659397-6a0ec6f2fa06?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80",
    price: 120,
    originalPrice: 150,
    rating: 4.5,
    reviews: 12,
    featured: true,
  },
  {
    id: 2,
    name: "Soccer Ball",
    category: "Balls",
    image: "https://images.unsplash.com/photo-1595950659397-6a0ec6f2fa06?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80",
    price: 30,
    originalPrice: 40,
    rating: 4,
    reviews: 8,
    featured: true,
  },
  {
    id: 3,
    name: "Fitness Tracker",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1595950659397-6a0ec6f2fa06?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80",
    price: 99,
    rating: 5,
    reviews: 20,
    featured: true,
  },
  {
    id: 4,
    name: "Yoga Mat",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1595950659397-6a0ec6f2fa06?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80",
    price: 25,
    originalPrice: 30,
    rating: 4,
    reviews: 5,
    featured: true,
  },
];

export const categories = [
  { id: "shoes", name: "Shoes", count: 15 },
  { id: "balls", name: "Balls", count: 10 },
  { id: "accessories", name: "Accessories", count: 8 },
  { id: "apparel", name: "Apparel", count: 12 },
  { id: "equipment", name: "Equipment", count: 7 },
];