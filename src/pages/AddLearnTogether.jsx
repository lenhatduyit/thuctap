import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddLearnTogether = () => {
  const [formData, setFormData] = useState({
    title_name: "",
    learn_link: "",
    language: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/learn_together", formData);
      if (response.status === 200) {
        alert(response.data.message);
        navigate("/learntogether"); // Redirect to the Learn Together page
      }
    } catch (err) {
      console.error("Failed to add learn_together:", err.message);
      setError(err.response?.data?.error || "Failed to add Learn Together");
    }
  };

  return (
    <div>
      <div className="m-2 text-red-700">
        <Link to="/learntogether">
          <strong>&#8592; Back</strong>
        </Link>
        <hr />
      </div>
      <div className="pl-10 pt-4 pr-10">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="title_name"
              >
                Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="title_name"
                type="text"
                name="title_name"
                value={formData.title_name}
                onChange={handleChange}
                placeholder="Type the title"
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="learn_link"
              >
                Learn Link
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="learn_link"
                type="text"
                name="learn_link"
                value={formData.learn_link}
                onChange={handleChange}
                placeholder="Enter the learn link"
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="language"
              >
                Language
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="language"
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="Enter the language"
              />
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-6 ml-6 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Add New Learn Together
          </button>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default AddLearnTogether;
