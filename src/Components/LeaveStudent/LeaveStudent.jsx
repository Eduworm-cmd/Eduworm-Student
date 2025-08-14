import React, { useEffect, useState } from 'react';
import {
  Calendar,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { getStudentById } from '../../api/AllApis';
import { apiService } from '../../api/apiService';
import { Navigate, useNavigate } from 'react-router-dom';

const LeaveStudent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [classId, setClassId] = useState();

  const [formData, setFormData] = useState({
    LeaveDate: '',
    LeaveNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.LeaveDate) {
      newErrors.LeaveDate = 'Please select a leave date';
    } else {
      const selectedDate = new Date(formData.LeaveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.LeaveDate = 'Leave date cannot be in the past';
      }
    }

    if (!formData.LeaveNotes.trim()) {
      newErrors.LeaveNotes = 'Please provide a reason for leave';
    } else if (formData.LeaveNotes.trim().length < 10) {
      newErrors.LeaveNotes =
        'Please provide a more detailed reason (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        branchId: user?.branchId,
        classId,
        studentId: user?.studentId,
        LeaveDate: formData.LeaveDate,
        LeaveNotes: formData.LeaveNotes,
      };

      const response = await apiService.post('leaveStudent/create', payload)      
      if (response.success === true) {
        setSubmitted(true);
        setFormData({ LeaveDate: '', LeaveNotes: '' });
        setTimeout(() => setSubmitted(false), 3000);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }

    } catch (error) {
      console.error('Error submitting leave application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchStudent = async () => {
    try {
      const response = await getStudentById(user?.studentId);
      setClassId(response.data?.student?.class?._id);
    } catch (error) {
      console.log('Error fetching student:', error);
    }
  };

  useEffect(() => {
    if (user?.studentId) {
      fetchStudent();
    }
  }, [user?.studentId]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform animate-pulse">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900 my-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your leave application has been successfully submitted. You will
            receive a confirmation shortly.
          </p>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-3000"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 overflow-hidden">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leave Application
          </h1>
          <p className="text-gray-600">Submit your leave request with ease</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Student Leave Request
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            {/* Leave Date */}
            <div className="mb-6">
              <label
                htmlFor="LeaveDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="inline h-4 w-4 mr-1" />
                Leave Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="LeaveDate"
                  name="LeaveDate"
                  value={formData.LeaveDate}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.LeaveDate
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                />
                {errors.LeaveDate && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.LeaveDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.LeaveDate}
                </p>
              )}
            </div>

            {/* Leave Notes */}
            <div className="mb-8">
              <label
                htmlFor="LeaveNotes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="inline h-4 w-4 mr-1" />
                Reason for Leave
              </label>
              <div className="relative">
                <textarea
                  id="LeaveNotes"
                  name="LeaveNotes"
                  rows="4"
                  value={formData.LeaveNotes}
                  onChange={handleInputChange}
                  placeholder="Please provide a detailed reason for your leave..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${errors.LeaveNotes
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                />
                {errors.LeaveNotes && (
                  <div className="absolute top-3 right-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.LeaveNotes && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.LeaveNotes}
                </p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {formData.LeaveNotes.length}/500 characters
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ LeaveDate: '', LeaveNotes: '' });
                  setErrors({});
                }}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveStudent;
