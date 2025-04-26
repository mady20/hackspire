import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeProfile } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BecomeCreatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
    profilePic: null,
    socialLinks: {
      twitter: '',
      instagram: '',
      website: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const social = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [social]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Create FormData for file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePic') {
          if (formData[key]) {
            data.append(key, formData[key]);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      await completeProfile(data);
      navigate(`/creator/${formData.username}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Become a Creator
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Set up your creator profile and start receiving support from your audience
          </p>
        </div>

        <div className="mt-12">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your-unique-username"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This will be your unique identifier on the platform
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  required
                  className="input"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell your audience about yourself..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  name="profilePic"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              
              <div>
                <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social.twitter"
                    id="social.twitter"
                    className="input"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social.instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social.instagram"
                    id="social.instagram"
                    className="input"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="social.website" className="block text-sm font-medium text-gray-700">
                  Personal Website
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="social.website"
                    id="social.website"
                    className="input"
                    value={formData.socialLinks.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Profile...</span>
                  </div>
                ) : (
                  'Create Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
