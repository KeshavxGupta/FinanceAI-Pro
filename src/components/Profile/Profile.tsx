import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Award, TrendingUp, Save, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    company: 'TechCorp Inc.',
    joinDate: 'March 2024',
    bio: 'Passionate about technology and personal finance. Always looking for ways to optimize my financial health and achieve my goals.'
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Here you would typically save to backend
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const financialStats = [
    { label: 'Total Savings', value: '$45,280', change: '+12.5%', positive: true },
    { label: 'Monthly Income', value: '$3,500', change: '+5.2%', positive: true },
    { label: 'Credit Score', value: '785', change: '+15 pts', positive: true },
    { label: 'Investment Return', value: '8.4%', change: '+2.1%', positive: true }
  ];

  const achievements = [
    { title: 'Emergency Fund Complete', description: 'Built 6-month emergency fund', icon: '🛡️', date: '2024-01-15' },
    { title: 'Budget Master', description: 'Stayed within budget for 6 months', icon: '🎯', date: '2024-02-20' },
    { title: 'Investment Milestone', description: 'Reached $10K in investments', icon: '📈', date: '2024-03-10' },
    { title: 'Savings Streak', description: '90-day consistent saving streak', icon: '🔥', date: '2024-03-25' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your personal information and track your financial journey
          </p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit3 className="w-5 h-5" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <User className="w-16 h-16 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profileData.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {profileData.occupation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {profileData.company}
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <Calendar className="w-4 h-4" />
                <span>Member since {profileData.joinDate}</span>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Financial Overview
            </h4>
            <div className="space-y-4">
              {financialStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.location}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Occupation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.occupation}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{profileData.company}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-900 dark:text-white">{profileData.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Financial Achievements
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};