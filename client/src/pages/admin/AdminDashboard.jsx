import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Users,
  Filter,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { 
  setUsers, 
  setLoading, 
  setError, 
  deleteUser, 
  setSelectedUser,
  selectUsers,
  selectUsersLoading,
  selectUsersError
} from "../../features/users/usersSlice"; 

import { logout } from "../../features/auth/authSlice"; // adjust path if needed




export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  // Get data from Redux store
  const allUsers = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axiosInstance.get("/admin/allusers");
        dispatch(setUsers(res.data || []));
        dispatch(setError(""));
      } catch (err) {
        dispatch(setError("Failed to fetch users. Please try again later."));
        console.error("Fetch error:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    // Only fetch if we don't have users data or if you want to refresh
    if (allUsers.length === 0) {
      fetchUsers();
    }
  }, [dispatch, allUsers.length]);

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (id) => {
    if (!id) {
      return console.log("the user has no valid id");
    }
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      console.log(id);
      const res = await axiosInstance.delete(`/admin/delete/${id}`);
      console.log("the user is removed", res.data);
      
      // Update Redux store
      dispatch(deleteUser(id));
    } catch (error) {
      console.error("there is an error occured", error);
    }
  };

  const handleUpdateUser = (user) => {
    // Set the selected user in Redux store
    dispatch(setSelectedUser(user));
    
    // Navigate to edit page
    navigate(`/admin/edit-user/${user._id}`);
  };

  const handleRefreshUsers = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get("/admin/allusers");
      dispatch(setUsers(res.data || []));
      dispatch(setError(""));
    } catch (err) {
      dispatch(setError("Failed to fetch users. Please try again later."));
      console.error("Fetch error:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
  dispatch(logout());          // clears redux state and localStorage
  navigate("/admin/login");    // or "/login" based on your route
};


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  User Management
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
  <button
    onClick={handleRefreshUsers}
    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <RefreshCw className="w-4 h-4" />
    <span>Refresh</span>
  </button>

  <Link to="/admin/add-new-user">
    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
      <Plus className="w-4 h-4" />
      <span>Add New User</span>
    </button>
  </Link>

  {/* ✅ Logout Button */}
  <button
    onClick={handleLogout}
    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
  >
    <span>Logout</span>
  </button>
</div>

          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allUsers.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allUsers.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {filteredUsers.length} users
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading users...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={handleRefreshUsers}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && allUsers.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first user.
                </p>
                <Link to="/admin/add-new-user">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add New User
                  </button>
                </Link>
              </div>
            )}

            {/* Table */}
            {!loading && !error && filteredUsers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          User
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleUpdateUser(user)} 
                              className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

























































// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   Plus,
//   Edit3,
//   Trash2,
//   Users,
//   Filter,
//   MoreHorizontal,
//   RefreshCw,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axios";

// export default function AdminDashboard() {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosInstance.get("/admin/allusers");
//         setAllUsers(res.data || []);
//         setError("");
//       } catch (err) {
//         setError("Failed to fetch users. Please try again later.");
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = allUsers.filter((user) =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDeleteUser = async (id) => {
//     console.log("admin orale chaviti porathakind");
//     if (!id) {
//       return console.log("the user has no valid id");
//     }
//     if (!window.confirm("Are you sure you want to delete this user?")) {
//       return;
//     }

//     try {
//       console.log(id);

//       const res = await axiosInstance.delete(`/admin/delete/${id}`);

//       console.log("the user is removed", res.data);
//       setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
//     } catch (error) {
//       console.error("there is an error occured", error);
//     }
//   };

//   const handleUpdateUser = (id) => {
//     navigate(`/admin/edit-user/${id}`);
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Users className="w-5 h-5 text-white" />
//                 </div>
//                 <h1 className="text-2xl font-semibold text-gray-900">
//                   User Management
//                 </h1>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Link to="/admin/add-new-user">
//                 <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
//                   <Plus className="w-4 h-4" />
//                   <span>Add New User</span>
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Total Users
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {allUsers.length}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Users className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Active Users
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {allUsers.length}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 </div>
//               </div>
//             </div>
//             {/* <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">New This Month</p>
//                   <p className="text-2xl font-bold text-gray-900">{Math.floor(allUsers.length * 0.2)}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Plus className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* Table Card */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//             {/* Table Header */}
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <h2 className="text-lg font-semibold text-gray-900">Users</h2>
//                   <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
//                     {filteredUsers.length} users
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                     />
//                   </div>
//                   <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
//                     <Filter className="w-4 h-4" />
//                     <span>Filter</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="p-12 text-center">
//                 <div className="inline-flex items-center space-x-2">
//                   <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="text-gray-600">Loading users...</span>
//                 </div>
//               </div>
//             )}

//             {!loading && !error && allUsers.length === 0 && (
//               <div className="p-12 text-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No users found
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   Get started by adding your first user.
//                 </p>
//                 <Link to="/admin/add-new-user">
//                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                     Add New User
//                   </button>
//                 </Link>
//               </div>
//             )}

//             {/* Table */}
//             {!loading && !error && filteredUsers.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Role
//                       </th>

//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUsers.map((user) => (
//                       <tr
//                         key={user._id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap"></td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {user.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {user.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           User
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             <button 
//                               onClick={() => handleUpdateUser(user._id)} 
//                               className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
//                             >
//                               <Edit3 className="w-4 h-4" />
//                               <span>Edit</span>
//                             </button>
//                             <button
//                               onClick={() => handleDeleteUser(user._id)}
//                               className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               <span>Delete</span>
//                             </button>
//                             <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                               <MoreHorizontal className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Bulk Actions
//             {selectedUsers.length > 0 && (
//               <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">
//                     {selectedUsers.length} user{selectedUsers.length === 1 ? '' : 's'} selected
//                   </span>
//                   <div className="flex items-center space-x-3">
//                     <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
//                       Export Selected
//                     </button>
//                     <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
//                       Delete Selected
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )} */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }