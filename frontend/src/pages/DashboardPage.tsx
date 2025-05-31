import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  profilePicture?: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    console.log('Stored user data:', storedUserData); // Debug log

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('Parsed user data:', parsedData); // Debug log
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // ... rest of your existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Profile Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt={userData.name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-lg font-semibold">
                  {userData?.name?.charAt(0) || 'R'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {userData?.name || 'Reader'}!
              </h2>
              <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... existing dashboard content ... */}
      </div>
    </div>
  );
};

export default DashboardPage;