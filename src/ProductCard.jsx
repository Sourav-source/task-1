// Product Card Component
import { Edit, Trash2 } from "lucide-react";
const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-3"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x200?text=Image+Not+Found";
        }}
      />
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {product.title}
      </h3>
      <p className="text-gray-600 text-sm mb-2 capitalize">
        {product.category}
      </p>
      <p className="text-2xl font-bold text-green-600 mb-3">${product.price}</p>
      <div className="flex-grow mb-4">
        <p className="text-gray-700 text-sm line-clamp-3">
          {product.description}
        </p>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
