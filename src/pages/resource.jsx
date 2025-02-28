import { useState, useEffect } from "react";
import Loader from "../components/Loder";
import ResourceCard from "../components/ResourceCard/ResourceCard";
import axios from "axios";
import { TbCategory } from "react-icons/tb";

const Resource = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Book", "Document", "Court Hearing", "Case Study", "Newspaper"];

  // Fetch all resources initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/resource/get-all-resource");
        setData(response.data.data);
        setFilteredData(response.data.data); // Set initial filtered data
        console.log("Fetched All Data:", response.data.data); // Debug fetched data
      } catch (error) {
        console.error("Error fetching all resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch resources by category
  const fetchResourcesByCategory = async (category) => {
    try {
      setLoading(true);

      if (category === "All") {
        // Fetch all resources if "All" is selected
        const response = await axios.get("http://localhost:3000/api/resource/get-all-resource");
        setFilteredData(response.data.data);
      } else {
        // Fetch resources for the selected category
        const response = await axios.post("http://localhost:3000/api/resource/category", {
          category,
        });
        setFilteredData(response.data.data);
      }

      console.log(`Resources for category ${category}:`, filteredData);
    } catch (error) {
      console.error(`Error fetching resources for category ${category}:`, error.response?.data || error.message);
      setFilteredData([]); // Set empty if no resources found
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    console.log(`User clicked category: ${category}`);
    setSelectedCategory(category);
    fetchResourcesByCategory(category); // Fetch resources for the selected category
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerSearchTerm) ||
        item.author.toLowerCase().includes(lowerSearchTerm)
    );

    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div className="bg-zinc-900 text-white px-12 py-8 min-h-screen h-auto">
      <h4 className="text-3xl text-yellow-200">Products</h4>

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by category, author, or book name..."
          className="w-full p-2 rounded-md text-black"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Category Filter */}
      <div className="flex space-x-4 my-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              selectedCategory === category
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <TbCategory />
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Display Filtered Data */}
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => (
              <ResourceCard key={i} data={item} />
            ))
          ) : (
            <p className="text-yellow-400">No resources found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Resource;
