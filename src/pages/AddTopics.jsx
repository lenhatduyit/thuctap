import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddTopics = () => {
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    description: "",
  });

  const navigate = useNavigate();

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm gửi dữ liệu tới API
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, level, description } = formData;

    // Kiểm tra nếu dữ liệu không đầy đủ
    if (!name || !level || !description) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // Gửi yêu cầu POST với dữ liệu JSON
      const response = await axios.post("http://localhost:5000/api/topics", {
        name,
        level,
        description,
      });

      // Hiển thị thông báo khi thêm thành công
      alert(response.data.message);

      // Điều hướng về trang danh sách topic
      navigate("/topic");
    } catch (error) {
      // Xử lý lỗi nếu có
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <div className="m-2 text-red-700">
        <Link to="/topic">
          <strong>&#8592; Back</strong>
        </Link>
      </div>
      <hr className="shadow-lg" />
      <div className="pl-10 pt-4 pr-10">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter topic name..."
              />

              <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
                Level
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                placeholder="Enter topic level..."
              />

              <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
                Description
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter topic description..."
              />
            </div>
            <button
              type="submit"
              className="mt-6 ml-6 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Add New Topic
            </button>
          </div>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default AddTopics;
