import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  BookOpen,
  Users,
  User,
  MoreVertical,
  Loader2,
  Calendar,
  TrendingUp,
  Shield,
  Edit3,
  Download,
  Share2,
  ChevronDown,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Briefcase
} from 'lucide-react';
import { useSelector } from 'react-redux';

const mockAttendanceData = {
  totalWorkingDays: 187,
  presentDays: 172,
  absentDays: 12,
  attendancePercentage: 92.0,
  halfDays: 2,
  leaveDays: 1,
  notMarkedDays: 0
};

export default function StudentProfile() {
  const [activeView, setActiveView] = useState('dashboard');
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const student = useSelector((state) => state.userData?.user)

  const mockAttendanceData = {
    totalWorkingDays: 187,
    presentDays: 172,
    absentDays: 12,
    attendancePercentage: 92.0,
    halfDays: 2,
    leaveDays: 1,
    notMarkedDays: 0
  };

  const staticData = {
    gpa: 3.87,
    rank: 12,
    totalStudents: 156,
    academicYear: '2024-2025',
    admissionClass: 'LKG'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (student) {
          const mappedStudentData = {
            avatar: student.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            name: `${student.firstName} ${student.lastName}`,
            class: student.class?.className || 'N/A',
            rollNo: student.rollNo || 'N/A',
            adharNo: student.documents?.aadharCard || 'N/A',
            academicYear: staticData.academicYear,
            admissionClass: student.class?.className || staticData.admissionClass,
            oldAdmissionNo: student.admissionNumber || 'N/A',
            dateOfAdmission: student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'N/A',
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'N/A',
            parentEmail: student.parents?.[0]?.email || 'N/A',
            motherName: student.parents?.find(p => p.relationship === 'Mother')?.firstName ?
              `${student.parents.find(p => p.relationship === 'Mother').firstName} ${student.parents.find(p => p.relationship === 'Mother').lastName}` :
              'Not Available',
            fatherName: student.parents?.find(p => p.relationship === 'Father')?.firstName ?
              `${student.parents.find(p => p.relationship === 'Father').firstName} ${student.parents.find(p => p.relationship === 'Father').lastName}` :
              'Not Available',
            schoolName: student.school?.schoolName || 'N/A',
            schoolBranch: student.schoolBranch?.name || 'N/A',
            bloodGroup: student.bloodGroup || 'N/A',
            uniqueId: student.uniqueId || 'N/A',
            gender: student.gender || 'N/A',
            emergencyContact: {
              name: student.emergencyContact?.name || 'N/A',
              phone: student.emergencyContact?.phone || 'N/A',
              relationship: 'Emergency Contact'
            },
            enrollmentStatus: student.isActive ? 'Active' : 'Inactive',
            gpa: staticData.gpa,
            rank: staticData.rank,
            totalStudents: staticData.totalStudents,
            transferCertificate: student.documents?.transferCertificate || 'N/A',
            studentIDCard: student.documents?.studentIDCard || 'N/A'
          };

          setStudentData(mappedStudentData);
        }

        setAttendanceData(mockAttendanceData);
      } catch (err) {
        console.log(err);

        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [student]);

  const performanceMetrics = useMemo(() => {
    if (!attendanceData) return [];

    const { totalWorkingDays, presentDays, attendancePercentage } = attendanceData;

    return [
      {
        title: 'Attendance Rate',
        value: `${attendancePercentage}%`,
        change: '+2.3%',
        trend: 'up',
        icon: Calendar,
        color: 'emerald'
      },
      {
        title: 'Academic Performance',
        value: `${studentData?.gpa || 0}`,
        change: '+0.12',
        trend: 'up',
        icon: TrendingUp,
        color: 'blue'
      },
      {
        title: 'Class Ranking',
        value: `#${studentData?.rank || 0}`,
        change: '+3',
        trend: 'up',
        icon: Award,
        color: 'amber'
      },
      {
        title: 'Participation',
        value: '94%',
        change: '-1.2%',
        trend: 'down',
        icon: Activity,
        color: 'purple'
      }
    ];
  }, [attendanceData, studentData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-6">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'academics', label: 'Academics' },
                  { id: 'analytics', label: 'Analytics' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === item.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' && <DashboardView studentData={studentData} performanceMetrics={performanceMetrics} attendanceData={attendanceData} />}
        {activeView === 'profile' && <ProfileView studentData={studentData} />}
        {activeView === 'academics' && <AcademicsView studentData={studentData} />}
        {activeView === 'analytics' && <AnalyticsView attendanceData={attendanceData} performanceMetrics={performanceMetrics} />}
      </div>

    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Profile</h3>
        <p className="text-slate-500">Fetching your academic data...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <XCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Error</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

function DashboardView({ studentData, performanceMetrics, attendanceData }) {
  return (
    <div className="space-y-8">
      {/* Student Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={studentData.avatar}
                  alt={studentData.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
                />
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-1">{studentData.name}</h1>
                <p className="text-slate-300 mb-3">{studentData.class} • Roll No : #{studentData.rollNo}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{studentData.schoolBranch}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{studentData.academicYear}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AttendanceChart attendanceData={attendanceData} />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[metric.color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
        <div className="text-sm text-slate-500">{metric.title}</div>
      </div>
    </div>
  );
}

function AttendanceChart({ attendanceData }) {
  const { presentDays, absentDays, totalWorkingDays } = attendanceData;
  const attendanceRate = Math.round((presentDays / totalWorkingDays) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Attendance Overview</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <BarChart3 className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{presentDays}</div>
          <div className="text-sm text-slate-500">Present Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-500">{absentDays}</div>
          <div className="text-sm text-slate-500">Absent Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">{attendanceRate}%</div>
          <div className="text-sm text-slate-500">Overall Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Attendance Progress</span>
          <span>{attendanceRate}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${attendanceRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { type: 'assignment', title: 'Mathematics Assignment Submitted', time: '2 hours ago', status: 'completed' },
    { type: 'exam', title: 'Physics Mid-term Scheduled', time: '1 day ago', status: 'upcoming' },
    { type: 'attendance', title: 'Present - Chemistry Lab', time: '2 days ago', status: 'present' },
    { type: 'grade', title: 'English Essay Graded: A-', time: '3 days ago', status: 'graded' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'completed' ? 'bg-emerald-500' :
              activity.status === 'upcoming' ? 'bg-blue-500' :
                activity.status === 'present' ? 'bg-green-500' : 'bg-amber-500'
              }`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{activity.title}</p>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { icon: FileText, label: 'Download Transcript', color: 'bg-blue-500' },
    { icon: Mail, label: 'Contact Advisor', color: 'bg-emerald-500' },
    { icon: Calendar, label: 'Schedule Meeting', color: 'bg-purple-500' },
    { icon: Settings, label: 'Update Profile', color: 'bg-slate-500' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingEvents() {
  const events = [
    { title: 'Physics Practical Exam', date: 'Aug 15', type: 'exam' },
    { title: 'Parent-Teacher Conference', date: 'Aug 18', type: 'meeting' },
    { title: 'Science Fair Presentation', date: 'Aug 22', type: 'event' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">{event.title}</p>
              <p className="text-xs text-slate-500">{event.date}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${event.type === 'exam' ? 'bg-red-400' :
              event.type === 'meeting' ? 'bg-blue-400' : 'bg-green-400'
              }`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ studentData }) {
  const personalInfo = [
    { label: 'Full Name', value: studentData.name, icon: User },
    { label: 'Date of Birth', value: studentData.dateOfBirth, icon: Calendar },
    { label: 'Gender', value: studentData.gender, icon: User },
    { label: 'Blood Group', value: studentData.bloodGroup, icon: Activity },
    { label: 'Aadhaar Number', value: studentData.adharNo, icon: FileText },
    { label: 'Unique ID', value: studentData.uniqueId, icon: Target }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personalInfo.map((info, index) => (
          <DataField key={index} {...info} />
        ))}
      </div>

      <ContactInformation studentData={studentData} />
    </div>
  );
}

function AcademicsView({ studentData }) {
  const academicInfo = [
    { label: 'Current Class', value: studentData.class, icon: GraduationCap },
    { label: 'Roll Number', value: studentData.rollNo, icon: FileText },
    { label: 'Admission Number', value: studentData.oldAdmissionNo, icon: FileText },
    { label: 'Academic Year', value: studentData.academicYear, icon: Calendar },
    { label: 'Date of Admission', value: studentData.dateOfAdmission, icon: Calendar },
    { label: 'Enrollment Status', value: studentData.enrollmentStatus, icon: CheckCircle }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Academic Information</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Institution Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataField
            label="School Name"
            value={studentData.schoolName}
            icon={Building}
            fullWidth
          />
          <DataField
            label="Campus Branch"
            value={studentData.schoolBranch}
            icon={MapPin}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Student Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicInfo.map((info, index) => (
            <DataField key={index} {...info} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ attendanceData, performanceMetrics }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceBreakdown attendanceData={attendanceData} />
        <PerformanceTrends performanceMetrics={performanceMetrics} />
      </div>
    </div>
  );
}

function AttendanceBreakdown({ attendanceData }) {
  const { totalWorkingDays, presentDays, absentDays, halfDays, leaveDays } = attendanceData;

  const breakdown = [
    { label: 'Present', value: presentDays, color: 'bg-emerald-500', percentage: (presentDays / totalWorkingDays * 100).toFixed(1) },
    { label: 'Absent', value: absentDays, color: 'bg-red-500', percentage: (absentDays / totalWorkingDays * 100).toFixed(1) },
    { label: 'Half Day', value: halfDays, color: 'bg-amber-500', percentage: (halfDays / totalWorkingDays * 100).toFixed(1) },
    { label: 'Leave', value: leaveDays, color: 'bg-blue-500', percentage: (leaveDays / totalWorkingDays * 100).toFixed(1) }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Attendance Breakdown</h3>
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">{item.value} days</div>
              <div className="text-xs text-slate-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceTrends({ performanceMetrics }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Trends</h3>
      <div className="space-y-6">
        {performanceMetrics.slice(0, 3).map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">{metric.title}</div>
                  <div className="text-xs text-slate-500">Current: {metric.value}</div>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                }`}>
                {metric.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactInformation({ studentData }) {
  const contactInfo = [
    { label: 'Parent Email', value: studentData.parentEmail, icon: Mail },
    { label: 'Mother\'s Name', value: studentData.motherName, icon: User },
    { label: 'Father\'s Name', value: studentData.fatherName, icon: User }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Family & Contact Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {contactInfo.map((info, index) => (
          <DataField key={index} {...info} />
        ))}
      </div>

      {studentData.emergencyContact && (
        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-md font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Emergency Contact</span>
          </h4>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-red-600 mb-1">Contact Name</p>
                <p className="font-medium text-red-800">{studentData.emergencyContact.name}</p>
                {studentData.emergencyContact.relationship && (
                  <p className="text-xs text-red-600">({studentData.emergencyContact.relationship})</p>
                )}
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Phone Number</p>
                <p className="font-medium text-red-800">{studentData.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataField({ label, value, icon: Icon, fullWidth = false }) {
  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors`}>
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="font-medium text-slate-900 break-words">{value}</p>
      </div>
    </div>
  );
}