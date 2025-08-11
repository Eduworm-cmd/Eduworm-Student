import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import student from '../../assets/image-removebg-preview.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginRequest } from '../../redux/actions/auth.actions';
import { enqueueSnackbar } from 'notistack';


export default function StudentPortalLogin() {
  const { user, loading, error, success, message } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle success and error messages
  useEffect(() => {
    if (success && user) {
      setFormData({ email: '', password: '' });
      navigate('/');
    }

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      })
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [success, error, message, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      enqueueSnackbar('Please fill in all fields');
      return;
    }
    dispatch(clearError());
    dispatch(loginRequest(formData));
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row-reverse bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-90 right-56 w-16 h-16 bg-purple-100 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-indigo-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-100 rounded-full animate-pulse delay-700"></div>
      </div>
      <div className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-8 md:block hidden">
            <h2 className="text-5xl font-bold mb-4">Welcome to</h2>
            <h3 className="text-4xl font-light opacity-90">Student Portal</h3>
          </div>

          <div className="">
            <div className="text-center">
              <img
                src={student}
                alt="Your Image"
                className="w-full mx-auto mb-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 flex items-center justify-center p-8 rounded-t-4xl md:rounded-none md:rounded-r-4xl">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
            <p className="text-slate-400">Enter your account details</p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
