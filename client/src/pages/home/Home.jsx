import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useSelector } from 'react-redux'

export default function Home() {
  const userData = useSelector((state) => state.auth)
  const user = userData.user;

  return (
    <>
      <Navbar 
        name={user?.name || "User"} 
        imageUrl={user?.profileImage}
      />

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600 mb-8">Here is your profile overview and recent activity.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-6">
              <img
                className="h-20 w-20 rounded-full object-cover border border-gray-300"
                src={user?.profileImage}
                alt="Profile"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            
          </div>

          {/* Recent Activity or Placeholder Section */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="bg-white p-6 rounded-xl shadow text-gray-600">
              <p>You haven’t done anything yet. Start exploring!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
