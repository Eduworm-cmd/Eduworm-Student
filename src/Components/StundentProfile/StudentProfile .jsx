import React, { useState, useEffect } from 'react';
import {
  Camera,
  Heart,
  BookOpen,
  Users,
  User,
  EllipsisVertical,
  Loader2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import ChangePasswordModal from './ChangePasswordModal';
import { useParams } from 'react-router-dom';

export default function StudentProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendenceData, setAttendenceData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

    // const { studentId } = useParams();

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
        const formatted = {
          absentDays: data?.attendanceStats?.absentDays,
          attendancePercentage: data?.attendanceStats?.attendancePercentage,
          halfDays: data?.attendanceStats?.halfDays,
          leaveDays: data?.attendanceStats?.leaveDays,
          notMarkedDays: data?.attendanceStats?.notMarkedDays,
          presentDays: data?.attendanceStats?.presentDays,
          totalWorkingDays: data?.attendanceStats?.totalWorkingDays,
        };
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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading student profile...
          </p>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-red-500 font-medium text-lg mb-4">❌ {error}</p>
          <button
            onClick={fetchStudentData}
            className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) return null;

  return (
    <div className="min-h-screen ">
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        studentId={studentId}
        parentEmail={studentData?.parentEmail}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-200">
          {/* Profile Header */}
          <div className="bg-sky-400 p-6 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="focus:outline-none"
              >
                <EllipsisVertical className="w-6 h-6 text-white cursor-pointer" />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 ">
                  <button
                    onClick={() => {
                      setShowChangePassword(true);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={
                      studentData.avatar ||
                      'https://cdn-icons-png.flaticon.com/256/209/209076.png'
                    }
                    alt={studentData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {studentData.name}
                </h2>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="bg-white bg-opacity-70 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {studentData.class}
                  </span>
                  <span className="bg-white bg-opacity-70 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    Roll: {studentData.rollNo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex space-x-1">
              {[
                { id: 'profile', label: '👤 Profile', icon: User },
                { id: 'academic', label: '📖 Academic', icon: BookOpen },
                { id: 'family', label: '👨‍👩‍👧‍👦 Family', icon: Users },
                { id: 'Class', label: '👨‍👩‍👧‍👦 Class', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon="🆔"
                    title="Aadhaar Number"
                    value={studentData.adharNo}
                    bgColor="bg-blue-50"
                  />
                  <InfoCard
                    icon="🎂"
                    title="Date of Birth"
                    value={studentData.dateOfBirth}
                    bgColor="bg-pink-50"
                  />
                  <InfoCard
                    icon="🔢"
                    title="Unique ID"
                    value={studentData.uniqueId}
                    bgColor="bg-green-50"
                  />
                  <InfoCard
                    icon="⚕️"
                    title="Blood Group"
                    value={studentData.bloodGroup}
                    bgColor="bg-red-50"
                  />
                  <InfoCard
                    icon="👤"
                    title="Gender"
                    value={studentData.gender}
                    bgColor="bg-purple-50"
                  />
                  <InfoCard
                    icon="📋"
                    title="Enrollment Status"
                    value={studentData.enrollmentStatus}
                    bgColor="bg-yellow-50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon="📅"
                    title="Academic Year"
                    value={studentData.academicYear}
                    bgColor="bg-green-50"
                  />
                  <InfoCard
                    icon="🎒"
                    title="Admission Class"
                    value={studentData.admissionClass}
                    bgColor="bg-yellow-50"
                  />
                  <InfoCard
                    icon="📝"
                    title="Admission Number"
                    value={studentData.oldAdmissionNo}
                    bgColor="bg-purple-50"
                  />
                  <InfoCard
                    icon="📆"
                    title="Date of Admission"
                    value={studentData.dateOfAdmission}
                    bgColor="bg-orange-50"
                  />
                  <InfoCard
                    icon="🏫"
                    title="School Name"
                    value={studentData.schoolName}
                    bgColor="bg-blue-50"
                  />
                  <InfoCard
                    icon="🏢"
                    title="School Branch"
                    value={studentData.schoolBranch}
                    bgColor="bg-indigo-50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-4">
                <InfoCard
                  icon="📧"
                  title="Parent Email ID"
                  value={studentData.parentEmail}
                  bgColor="bg-blue-50"
                  fullWidth={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon="👩"
                    title="Mother's Name"
                    value={studentData.motherName}
                    bgColor="bg-pink-50"
                  />
                  <InfoCard
                    icon="👨"
                    title="Father's Name"
                    value={studentData.fatherName}
                    bgColor="bg-blue-50"
                  />
                </div>
                {studentData.emergencyContact && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      🆘 Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard
                        icon="👤"
                        title="Contact Name"
                        value={studentData.emergencyContact.name}
                        bgColor="bg-red-50"
                      />
                      <InfoCard
                        icon="📞"
                        title="Contact Phone"
                        value={studentData.emergencyContact.phone}
                        bgColor="bg-red-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Class' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-700">
                  📊 Attendance Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard
                    icon="📅"
                    title="Total Working Days"
                    value={totalWorkingDays}
                    bgColor="bg-blue-100"
                  />
                  <InfoCard
                    icon="✅"
                    title="Present Days"
                    value={presentDays}
                    bgColor="bg-green-100"
                  />
                  <InfoCard
                    icon="❌"
                    title="Absent Days"
                    value={absentDays}
                    bgColor="bg-red-100"
                  />
                  <InfoCard
                    icon="➗"
                    title="Attendance %"
                    value={`${attendancePercentage}%`}
                    bgColor="bg-yellow-100"
                  />
                  <InfoCard
                    icon="🌓"
                    title="Half Days"
                    value={halfDays}
                    bgColor="bg-purple-100"
                  />
                  <InfoCard
                    icon="📋"
                    title="Leave Days"
                    value={leaveDays}
                    bgColor="bg-pink-100"
                  />
                  <InfoCard
                    icon="❓"
                    title="Not Marked Days"
                    value={notMarkedDays}
                    bgColor="bg-gray-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            Fun Facts About Me! 🌟
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FunFactCard emoji="🎨" title="Favorite Color" value="Rainbow" />
            <FunFactCard emoji="🦄" title="Favorite Animal" value="Unicorn" />
            <FunFactCard emoji="🎵" title="Loves" value="Singing" />
            <FunFactCard emoji="⭐" title="Dream" value="Astronaut" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, bgColor, fullWidth = false }) {
  return (
    <div
      className={`${bgColor} ${
        fullWidth ? 'col-span-full' : ''
      } rounded-sm p-1 border-0 border-opacity-10 hover:shadow-md transition-all`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
          <p className="text-gray-800 font-semibold break-all">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FunFactCard({ emoji, title, value }) {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer">
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="text-xs font-medium text-gray-600 mb-1">{title}</h4>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}