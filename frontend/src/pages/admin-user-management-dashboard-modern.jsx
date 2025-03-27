import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import url from "../auth/url";

const AdminUserManagementDashboard = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    password: "",
    role: "Uploader",
    // isActive: true,
  });

  const [newPatient, setNewPatient] = useState({
    name: "",
    UHID: "",
    number: "",
  });

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...newUser, id: user.id } : user
        )
      );
      setSuccessMessage("User updated successfully!");
    } else {
      try {
        const newUserWithId = { ...newUser };
        // console.log(newUserWithId);

        const response = await axios.post(
          `${url}/api/v1/admin/admin-users`,

          newUserWithId
        );
        // console.log(response);
        if (response.status === 201) {
          setUsers([...users, newUserWithId]);
          toast.success("User created successfully!");
          // setSuccessMessage("User created successfully!");
          // setShowSuccess(true);
          // setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (error) {
        if (error.response.status === 400) {
          toast.error("User already exixt");
        } else {
          // console.error("Error creating user:", error);
          toast.error("Error creating user. Please try again.");
          // setSuccessMessage("Error creating user. Please try again.");
        }
      }
    }

    setNewUser({
      name: "",
      userId: "",
      password: "",
      role: "Uploader",
      isActive: true,
    });
    setEditingUser(null);
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const formattedPatient = {
      ...newPatient,
      number: `+91${newPatient.number}`, // Prepend +91 to the number
    };

    console.log(formattedPatient);

    try {
      const response = await axios.post(
        `${url}/api/v1/auth/register`,
        formattedPatient
      );
      console.log("Patient Created:", response);
      if (response.status === 201) {
        toast.success("Patient created successfully!");
        setNewPatient({ name: "", UHID: "", number: "" });
      }
    } catch (error) {
      console.error(
        "Error creating patient:",
        error.response?.data || error.message
      );
      toast.error("Failed to create patient.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/admin/admin-users`);
        // console.log(response);
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditUser = (user) => {
    setNewUser({ ...user, password: "" });
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setNewUser({
      name: "",
      userId: "",
      password: "",
      role: "Uploader",
      isActive: true,
    });
    setEditingUser(null);
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  /// csv
  const [file, setFile] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    // console.log(file)
    // console.log("ye le",formData)

    setIsLoading(true);

    console.log(file);

    try {
      const response = await axios.post(
        `${url}/api/v1/auth/bulk-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("CSV file uploaded successfully!");
      } else {
        toast.error("Failed to upload CSV file");
      }
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      if (error.response) {
        // console.log("error",error.response.data)
        toast.error("Faild to upload csv file");
      } else {
        toast.error("Faild to upload csv file");
      }
    }
    setIsLoading(false);
  };

  //csv

  const SuccessMessage = ({ message }) => (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
      <svg
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      {message}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 ">
      <button
        onClick={() => {
          localStorage.removeItem("userData");
          localStorage.removeItem("role");
          navigate("/");
        }}
        className=" absolute top-2 right-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none  focus:ring-teal-500"
      >
        Logout
      </button>
      <div className=" mx-auto bg-white shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Admin User Management
          </h1>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingUser ? "Edit Admin User" : "Create New Admin User"}
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={newUser.userId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  >
                    <option value="Uploader">Uploader</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                {editingUser && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-200"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create Patient
            </h2>
            <form onSubmit={handleCreatePatient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPatient.name}
                    onChange={handlePatientInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="UHID"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UHID
                  </label>
                  <input
                    type="text"
                    id="UHID"
                    name="UHID"
                    value={newPatient.UHID}
                    onChange={handlePatientInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    value={newPatient.number}
                    onChange={handlePatientInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-200"
                >
                  Create Patient
                </button>
              </div>
            </form>
          </div>

          {/* bulk upload */}
          {/* <div className=" p-6 bg-teal-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-teal-800 mb-6">
              Bulk Upload Patient Data
            </h1>

            <div className="mb-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 cursor-pointer"
                >
                  Choose CSV File
                </label>
                {file && (
                  <div className="mt-2 text-sm text-teal-600">
                    Selected File: {file.name}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-teal-600">
                Upload a CSV file with columns: Name, UHID, Mobile Number
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-teal-600  px-4 py-2 rounded hover:bg-teal-700 text-white"
            >
           
              {isloading ? "Uploading..." : "Submit Bulk Upload"}
            </button>
          </div> */}

          <button
            onClick={() => {
              navigate("/adminViewReport");
            }}
            className="bg-teal-600 rounded text-white m-2 text-center w-full h-12"
          >
            Admin View Report
          </button>

          <div>
            <h2 className="text-2xl mt-2 font-bold text-gray-800 mb-6">
              Existing Admin Users
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          User ID: {user.userId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Role: {user.role}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-200 ${
                            user.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500"
                              : "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && <SuccessMessage message={successMessage} />}
    </div>
  );
};

export default AdminUserManagementDashboard;
