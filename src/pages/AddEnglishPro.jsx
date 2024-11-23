import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddEnglishPro = () => {
  const [formData, setFormData] = useState({ pronun_name: "", video_file: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook để điều hướng sau khi thêm thành công

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gửi

    try {
      const response = await axios.post("http://localhost:5000/api/english_pronunciation", formData);
      if (response.status === 200) {
        alert(response.data.message); // Hiển thị thông báo thành công
        navigate("/englishpronunciation"); // Điều hướng về trang danh sách Exercise
      }
    } catch (err) {
      console.error("Error adding exercise:", err.message);
      setError(err.response?.data?.error || "Failed to add exercise");
    }
  };

  return (
    <div>
      <div className="m-2 text-red-700">
        <Link to="/exercise">
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
                htmlFor="pronun_name"
              >
                Pronun_Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-grey-500 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="pronun_name"
                name="pronun_name"
                type="text"
                placeholder=""
                value={formData.pronun_name}
                onChange={handleInputChange}
                required
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="video_file"
              >
                Video_File
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-grey-500 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="video_file"
                name="video_file"
                type="text"
                placeholder=""
                value={formData.video_file}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="mt-6 ml-6 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Add New
          </button>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default AddEnglishPro;
