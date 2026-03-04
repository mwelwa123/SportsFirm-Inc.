// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI, ordersAPI, categoriesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import {
  ShoppingBag, Package, ClipboardList, Plus, Pencil, Trash2,
  LogOut, X, Check, LayoutDashboard,
} from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge.jsx";

// ── Status badge color helper ────────────────────────────────────
const statusColor = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// ── Add / Edit Product Modal ─────────────────────────────────────
function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", description: "", price: "", stock: "", image: "", category_id: "" }
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input className={inputClass} placeholder="e.g. Running Shoes" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
              placeholder="Product description..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price ($)</label>
              <input className={inputClass} type="number" step="0.01" placeholder="0.00" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input className={inputClass} type="number" placeholder="0" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select className={inputClass} value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Image URL</label>
            <input className={inputClass} placeholder="https://..." value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-gray-300 text-gray-700" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700" disabled={saving}>
              {saving ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Dashboard ─────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load all data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, o, c] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getAll(),
          categoriesAPI.getAll(),
        ]);
        setProducts(p);
        setOrders(o);
        setCategories(c);
      } catch (err) {
        toast.error("Failed to load data. Are you an admin?");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Product Actions ──────────────────────────────────────────
  const handleSaveProduct = async (form) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, form);
        toast.success("Product updated!");
      } else {
        await productsAPI.add(form);
        toast.success("Product added!");
      }
      const updated = await productsAPI.getAll();
      setProducts(updated);
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Order Actions ────────────────────────────────────────────
  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success("Order status updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ── Stats ────────────────────────────────────────────────────
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: <Package className="h-6 w-6 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Total Orders", value: orders.length, icon: <ClipboardList className="h-6 w-6 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <ShoppingBag className="h-6 w-6 text-green-600" />, bg: "bg-green-50" },
    { label: "Categories", value: categories.length, icon: <LayoutDashboard className="h-6 w-6 text-purple-600" />, bg: "bg-purple-50" },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Nav ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="font-bold text-white text-sm">SF</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-gray-500">Sports Firm</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            👋 {user?.full_name || user?.email}
          </span>
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* ── Tabs ── */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 border border-gray-200 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.full_name || order.email}</td>
                            <td className="px-6 py-4 text-sm font-semibold">${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PRODUCTS TAB
        ══════════════════════════════════════════ */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Products</h2>
                <p className="text-sm text-gray-500">{products.length} total products</p>
              </div>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => { setEditingProduct(null); setShowModal(true); }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Image", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <img
                              src={product.image || "https://via.placeholder.com/48"}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                              {product.category_name || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">${parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${product.stock < 5 ? "text-red-500" : "text-green-600"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No products yet. Add your first one!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ORDERS TAB
        ══════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">Orders</h2>
              <p className="text-sm text-gray-500">{orders.length} total orders</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Order ID", "Customer", "Email", "Total", "Status", "Date"].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.full_name || "—"}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.email}</td>
                          <td className="px-6 py-4 text-sm font-semibold">${parseFloat(order.total_amount).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColor(order.status)}`}
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ── Product Modal ── */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
