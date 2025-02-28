import { useState } from "react";
import axios from "axios";

const AddResources = () => {
  const [data, setData] = useState({
    url: "",
    title: "",
    author: "",
    desc: "",
    category: "Book",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const categories = [
    "Book",
    "Document",
    "Court Hearing",
    "Case Study",
    "Newspaper",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !data.url ||
        !data.title ||
        !data.author ||
        !data.desc ||
        !data.category
      ) {
        alert("All fields are required");
        return;
      }

      // Make API request
      const response = await axios.post(
        "http://localhost:3000/api/resource/add-resource",
        { ...data },
        { headers }
      );

      if (response.status === 200) {
        alert("Resource added successfully!");
        setData({
          url: "",
          title: "",
          author: "",
          desc: "",
          category: "Book",
        });
      }
    } catch (error) {
      alert("An error occurred while adding the resource.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-950 p-4">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Add Resources
      </h1>
      <form
        className="w-full max-w-lg bg-purple-900 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="url" className="block text-purple-100 font-medium">
            Image URL
          </label>
          <input
            type="text"
            name="url"
            value={data.url}
            onChange={handleChange}
            className="w-full mt-2 p-2 bg-purple-800 text-purple-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter image URL"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-purple-100 font-medium">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full mt-2 p-2 bg-purple-800 text-purple-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="author" className="block text-purple-100 font-medium">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={data.author}
            onChange={handleChange}
            className="w-full mt-2 p-2 bg-purple-800 text-purple-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter author name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="desc" className="block text-purple-100 font-medium">
            Description
          </label>
          <textarea
            name="desc"
            value={data.desc}
            onChange={handleChange}
            className="w-full mt-2 p-2 bg-purple-800 text-purple-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter a description"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-purple-100 font-medium">
            Category
          </label>
          <select
            name="category"
            value={data.category}
            onChange={handleChange}
            className="w-full mt-2 p-2 bg-purple-800 text-purple-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-purple-900 font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-all duration-300"
        >
          Add Resource
        </button>
      </form>
    </div>
  );
};

export default AddResources;