import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Settings from "./settings";
import UnderConstruction from "../UnderConstruction";
import ReadLater from "./ReadLater.jsx";
import MyRentals from "./MyRentals.jsx";
import Messages from "./Messages.jsx";

const ProfileBody = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [hoveredSection, setHoveredSection] = useState("profile");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", image: null });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError(true);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data.userData);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const updatedProducts = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updatedProducts);
    setNewProduct({ name: "", description: "", price: "", category: "", image: null });
    setShowModal(false);
  };

  // Add these handlers for sidebar items
  const handleSectionHover = (section) => {
    setHoveredSection(section);
  };

  const handleSectionLeave = () => {
    setHoveredSection(activeSection);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-yellow-400">
              Welcome, {userData?.name}
            </h1>
            <div className="flex flex-col lg:flex-row items-center bg-zinc-800 p-6 rounded-lg shadow-lg">
              <img
                src={userData?.avatar || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-md"
              />
              <div className="lg:ml-6 mt-4 lg:mt-0 text-center lg:text-left">
                <p className="text-2xl font-semibold">{userData?.name}</p>
                <p className="text-lg text-zinc-300">{userData?.email}</p>
                <p className="text-md text-zinc-300">User ID: {userData?.id}</p>
              </div>
            </div>
            {/* Additional User Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-zinc-800 p-4 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-yellow-400">Rent Points</h3>
                <p className="text-3xl font-bold text-white">{userData?.rentPoints || 0}</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-yellow-400">Badges Earned</h3>
                <p className="text-lg text-white">{userData?.badges?.join(", ") || "No Badges Yet"}</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-yellow-400">Products Posted</h3>
                <p className="text-3xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </div>
        );
      case "readLater":
        return <ReadLater />;
      case "messages":
        return <Messages />;
      case "myRentals":  // Add this case
        return <MyRentals />;
      case "downloads":
        return <UnderConstruction />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="text-lg text-zinc-300">
            Select an option from the sidebar to view details.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load user data. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-zinc-800 p-4 h-screen shadow-lg">
        <Sidebar 
          setActiveSection={setActiveSection} 
          onSectionHover={handleSectionHover}
          onSectionLeave={handleSectionLeave}
        />
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-3/4 p-6 overflow-auto">
        {renderContent()}

        {/* Products Section - Only visible when hovering on Profile */}
        {hoveredSection === "profile" && (
          <div className="mt-12 p-6 bg-zinc-800 rounded-lg shadow-lg transition-opacity duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">Products</h2>
              <button
                className="bg-yellow-400 text-zinc-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
                onClick={() => setShowModal(true)}
              >
                + Add Product
              </button>
            </div>
            {products.length > 0 ? (
              <ul className="space-y-4">
                {products.map((product) => (
                  <li key={product.id} className="p-4 bg-zinc-700 rounded-md shadow-md">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-md text-zinc-300">{product.description}</p>
                    <p className="text-md text-yellow-400 font-semibold">
                      ${product.price} per day
                    </p>
                    {product.image && (
                      <img src={product.image} alt={product.name} className="mt-2 w-full h-40 object-cover rounded-lg" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-md text-zinc-300">No products uploaded for rent.</p>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-96 relative">
            {/* Exit Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-yellow-400 mb-4">Add a New Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 focus:border-yellow-400"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <textarea
                placeholder="Product Description"
                className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 focus:border-yellow-400"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              {/* Category Dropdown */}
              <label className="block text-yellow-400 font-semibold">Select Category</label>
              <select
                className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 focus:border-yellow-400"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Others">Others</option>
              </select>

              <label className="block text-yellow-400 font-semibold">Enter product image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 focus:border-yellow-400"
                onChange={handleImageUpload}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-yellow-400 text-zinc-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBody;