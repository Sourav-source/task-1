import { useEffect, useState } from "react";

// Product Form Modal
const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
        image: product.image || "",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.image && !isValidUrl(formData.image))
      newErrors.image = "Valid URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Convert price to number
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    onSave(processedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              step="0.01"
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {product ? "Update" : "Add"} Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;