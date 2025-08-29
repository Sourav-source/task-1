import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import Toast from './Toast';


// Main Dashboard Component
const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // API Base URL
  const API_BASE = "https://fakestoreapi.com";

  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/products`);

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      setProducts(data);
      setFilteredProducts(data);

      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);

      showToast(`${data.length} products loaded successfully`, "success");
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to load products. Using sample data.", "error");
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Load sample data as fallback
  const loadSampleData = () => {
    const sampleProducts = [
      {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: { rate: 3.9, count: 120 },
      },
      {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        description:
          "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
        category: "men's clothing",
        image:
          "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        rating: { rate: 4.1, count: 259 },
      },
      {
        id: 3,
        title: "Mens Cotton Jacket",
        price: 55.99,
        description:
          "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        rating: { rate: 4.7, count: 500 },
      },
      {
        id: 4,
        title:
          "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        price: 695,
        description:
          "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
        category: "jewelery",
        image:
          "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 4.6, count: 400 },
      },
    ];

    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);

    const uniqueCategories = [
      ...new Set(sampleProducts.map((p) => p.category)),
    ];
    setCategories(uniqueCategories);
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      // Create product with unique ID
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id), 0) + 1, // Generate a unique ID
        rating: { rate: 0, count: 0 },
      };

      // Try to post to API
      try {
        const response = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (response.ok) {
          const apiProduct = await response.json();
          // Use the product returned from API if available
          newProduct.id = apiProduct.id || newProduct.id;
        }
      } catch (apiError) {
        console.log("API unavailable, adding locally:", apiError.message);
      }

      // Update local state
      setProducts((prev) => [newProduct, ...prev]);

      // Update categories if new category
      if (!categories.includes(productData.category)) {
        setCategories((prev) => [...prev, productData.category]);
      }

      setIsModalOpen(false);
      showToast("Product added successfully", "success");
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("Error adding product", "error");
    }
  };

  // Update product
  const updateProduct = async (productData) => {
    try {
      const updatedProduct = {
        ...editingProduct,
        ...productData,
      };

      // Try to update via API
      try {
        const response = await fetch(
          `${API_BASE}/products/${editingProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        );

        if (response.ok) {
          const apiProduct = await response.json();
          // Use the product returned from API if available
          Object.assign(updatedProduct, apiProduct);
        }
      } catch (apiError) {
        console.log("API unavailable, updating locally:", apiError.message);
      }

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );

      // Update categories if new category
      if (!categories.includes(productData.category)) {
        setCategories((prev) => [...prev, productData.category]);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      showToast("Product updated successfully", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      showToast("Error updating product", "error");
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Try to delete via API
      try {
        await fetch(`${API_BASE}/products/${productId}`, {
          method: "DELETE",
        });
      } catch (apiError) {
        console.log("API unavailable, deleting locally:", apiError.message);
      }

      // Update local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      showToast("Product deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Error deleting product", "error");
    }
  };

  // Handle form submission
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
  };

  // Filter products based on search and category
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management Dashboard
            </h1>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {loading
              ? "Loading..."
              : `Showing ${filteredProducts.length} of ${products.length} products`}
            {selectedCategory && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Category: {selectedCategory}
              </span>
            )}
            {searchTerm && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading products...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setIsModalOpen(true);
                }}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductDashboard;
