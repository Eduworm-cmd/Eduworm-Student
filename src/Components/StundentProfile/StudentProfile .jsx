import React, { useState, useEffect } from 'react';
import {
  Camera,
  Heart,
  BookOpen,
  Users,
  User,
  EllipsisVertical,
  Loader2,
  Calendar,
  Award,
  Star,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Shield,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Settings,
  Bell,
  Download,
  Share2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import ChangePasswordModal from './ChangePasswordModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendenceData, setAttendenceData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const studentId = useSelector((state) => state.auth.user.studentId);
  const branchId = useSelector((state) => state.auth.user.branchId);

  const fetchAttendenceData = async () => {
    try {
      const response = await apiService.get(
        `attendance/student-calendar/${branchId}/${studentId}/2025/7`,
      );

      if (response.success) {
        const data = response.data;
        setAttendenceData(data);
      } else {
        console.error('Failed to fetch attendance data:', response.error);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`superStudent/ById/${studentId}`);

      if (response.success) {
        const data = response.data;
        const motherData = data.student.parents.find(
          (p) => p.relationship === 'mom',
        );
        const fatherData = data.student.parents.find(
          (p) => p.relationship === 'dad',
        );

        const transformedData = {
          avatar: data.student.avatar,
          name: `${data.student.firstName} ${data.student.lastName}`,
          class: data.student.class.className,
          rollNo: data.student.rollNo,
          adharNo: data.student.documents.aadharCard || 'Not provided',
          academicYear:
            new Date(data.student.dateOfJoining).getFullYear() +
            '-' +
            (new Date(data.student.dateOfJoining).getFullYear() + 1),
          admissionClass: data.student.class.className,
          oldAdmissionNo: data.student.admissionNumber,
          dateOfAdmission: new Date(
            data.student.dateOfJoining,
          ).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          dateOfBirth: new Date(data.student.dateOfBirth).toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            },
          ),
          parentEmail: data.student.parents[0]?.email || 'Not provided',
          motherName: motherData
            ? `${motherData.firstName} ${motherData.lastName}`
            : 'Not provided',
          fatherName: fatherData
            ? `${fatherData.firstName} ${fatherData.lastName}`
            : 'Not provided',
          schoolName: data.student.school.schoolName,
          schoolBranch: data.student.schoolBranch.name,
          bloodGroup: data.student.bloodGroup,
          uniqueId: data.student.uniqueId,
          gender: data.student.gender,
          emergencyContact: data.student.emergencyContact,
          enrollmentStatus: data.student.enrollmentStatus,
        };

        setStudentData(transformedData);
      } else {
        setError('Failed to fetch student data');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchAttendenceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading student profile...</p>
        </motion.div>
      </div>
    );
  }

  const {
    totalWorkingDays,
    presentDays,
    absentDays,
    attendancePercentage,
    halfDays,
    leaveDays,
    notMarkedDays,
  } = attendenceData?.attendanceStats || {};

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={fetchStudentData}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!studentData) return null;

  const attendanceStats = [
    {
      label: 'Total Working Days',
      value: totalWorkingDays || 0,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Present Days',
      value: presentDays || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Absent Days',
      value: absentDays || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Attendance %',
      value: `${attendancePercentage || 0}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Half Days',
      value: halfDays || 0,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Leave Days',
      value: leaveDays || 0,
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white">
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        studentId={studentId}
        parentEmail={studentData?.parentEmail}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Student Profile</h1>
              <p className="text-slate-600">Manage your academic information and settings</p>
            </div>
          </div>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden bg-white/20 backdrop-blur-sm">
                    <img
                      src={
                        studentData.avatar ||
                        'https://cdn-icons-png.flaticon.com/256/209/209076.png'
                      }
                      alt={studentData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">{studentData.name}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
                      {studentData.class}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
                      Roll: {studentData.rollNo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                >
                  <EllipsisVertical className="w-6 h-6 text-white" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50"
                    >
                      <button
                        onClick={() => {
                          setShowChangePassword(true);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors rounded-t-2xl"
                      >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Change Password
                      </button>
                      <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors">
                        <Edit3 className="w-4 h-4 inline mr-2" />
                        Edit Profile
                      </button>
                      <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors rounded-b-2xl">
                        <Download className="w-4 h-4 inline mr-2" />
                        Download Profile
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-50/50 px-6 py-4">
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { id: 'profile', label: '👤 Profile', icon: User },
                { id: 'academic', label: '📖 Academic', icon: BookOpen },
                { id: 'family', label: '👨‍👩‍👧‍👦 Family', icon: Users },
                { id: 'attendance', label: '📊 Attendance', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      icon="🆔"
                      title="Aadhaar Number"
                      value={studentData.adharNo}
                      bgColor="bg-blue-50"
                      borderColor="border-blue-200"
                    />
                    <InfoCard
                      icon="🎂"
                      title="Date of Birth"
                      value={studentData.dateOfBirth}
                      bgColor="bg-pink-50"
                      borderColor="border-pink-200"
                    />
                    <InfoCard
                      icon="🔢"
                      title="Unique ID"
                      value={studentData.uniqueId}
                      bgColor="bg-green-50"
                      borderColor="border-green-200"
                    />
                    <InfoCard
                      icon="⚕️"
                      title="Blood Group"
                      value={studentData.bloodGroup}
                      bgColor="bg-red-50"
                      borderColor="border-red-200"
                    />
                    <InfoCard
                      icon="👤"
                      title="Gender"
                      value={studentData.gender}
                      bgColor="bg-purple-50"
                      borderColor="border-purple-200"
                    />
                    <InfoCard
                      icon="📋"
                      title="Enrollment Status"
                      value={studentData.enrollmentStatus}
                      bgColor="bg-yellow-50"
                      borderColor="border-yellow-200"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'academic' && (
                <motion.div
                  key="academic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      icon="📅"
                      title="Academic Year"
                      value={studentData.academicYear}
                      bgColor="bg-green-50"
                      borderColor="border-green-200"
                    />
                    <InfoCard
                      icon="🎒"
                      title="Admission Class"
                      value={studentData.admissionClass}
                      bgColor="bg-yellow-50"
                      borderColor="border-yellow-200"
                    />
                    <InfoCard
                      icon="📝"
                      title="Admission Number"
                      value={studentData.oldAdmissionNo}
                      bgColor="bg-purple-50"
                      borderColor="border-purple-200"
                    />
                    <InfoCard
                      icon="📆"
                      title="Date of Admission"
                      value={studentData.dateOfAdmission}
                      bgColor="bg-orange-50"
                      borderColor="border-orange-200"
                    />
                    <InfoCard
                      icon="🏫"
                      title="School Name"
                      value={studentData.schoolName}
                      bgColor="bg-blue-50"
                      borderColor="border-blue-200"
                      fullWidth={true}
                    />
                    <InfoCard
                      icon="🏢"
                      title="School Branch"
                      value={studentData.schoolBranch}
                      bgColor="bg-indigo-50"
                      borderColor="border-indigo-200"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'family' && (
                <motion.div
                  key="family"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <InfoCard
                    icon="📧"
                    title="Parent Email ID"
                    value={studentData.parentEmail}
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    fullWidth={true}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      icon="👩"
                      title="Mother's Name"
                      value={studentData.motherName}
                      bgColor="bg-pink-50"
                      borderColor="border-pink-200"
                    />
                    <InfoCard
                      icon="👨"
                      title="Father's Name"
                      value={studentData.fatherName}
                      bgColor="bg-blue-50"
                      borderColor="border-blue-200"
                    />
                  </div>
                  {studentData.emergencyContact && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        🆘 Emergency Contact
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                          icon="👤"
                          title="Contact Name"
                          value={studentData.emergencyContact.name}
                          bgColor="bg-red-50"
                          borderColor="border-red-200"
                        />
                        <InfoCard
                          icon="📞"
                          title="Contact Phone"
                          value={studentData.emergencyContact.phone}
                          bgColor="bg-red-50"
                          borderColor="border-red-200"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'attendance' && (
                <motion.div
                  key="attendance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      📊 Attendance Summary
                    </h3>
                    <p className="text-gray-600">Your academic performance overview</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {attendanceStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} hover:shadow-lg transition-all`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md mb-3`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {notMarkedDays > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                      <div className="flex items-center">
                        <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Not Marked Days</h4>
                          <p className="text-yellow-700 text-sm">{notMarkedDays} days have not been marked for attendance</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-slate-200/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-3" />
            Fun Facts About Me! 🌟
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FunFactCard emoji="🎨" title="Favorite Color" value="Rainbow" />
            <FunFactCard emoji="🦄" title="Favorite Animal" value="Unicorn" />
            <FunFactCard emoji="🎵" title="Loves" value="Singing" />
            <FunFactCard emoji="⭐" title="Dream" value="Astronaut" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, bgColor, borderColor, fullWidth = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${bgColor} ${fullWidth ? 'col-span-full' : ''} rounded-2xl p-6 border ${borderColor} hover:shadow-lg transition-all`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
          <p className="text-gray-800 font-semibold break-words">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FunFactCard({ emoji, title, value }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer border border-purple-200"
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </motion.div>
  );
}