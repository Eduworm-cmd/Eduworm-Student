import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import StudentPortalLogin from "./Components/Login/StudentPortalLogin";
import MainLayout from "./Components/Layout/MainLayout";
import AdminPanelLayout from "./Components/Layout/AdminPanelLayout";
import StudentProfile from "./Components/StundentProfile/StudentProfile ";
import ExamDatesheet from "./Components/ExamDateSheet/ExamDatesheet ";
import Assignment from "./Components/Assignment/Assignment";
import UserProtectedRoute from "./Components/ProtectedRoute/UserProtectedRoute";
import CalendarSidebar from "./Components/Calander/CalendarSidebar";
import SchoolHoliday from "./Components/Calander/SchoolHoliday";
import PlayQuize from "./Components/PlayQuize/PlayQuize";
import QuizeCards from "./Components/PlayQuize/QuizeCards";
import LeaveStudent from "./Components/LeaveStudent/LeaveStudent";
import { Events } from "./Components/Events/Events";
import { TimeTable } from "./Components/TimeTable/TImetable";
import Askdoubts from "./Components/Askdoubts/Askdoubts";
import StudentChatSystem from "./Components/StudentChatSystem/StudentChatSystem";
import NotFound from "./Components/404Page/NotFound ";
import ContentModal from "./Components/Assignment/Modal/ContentModal";

function App() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
      .catch((err) =>
        console.error("❌ Service Worker registration failed:", err)
      );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<StudentPortalLogin />} />
          <Route path="*" element={<NotFound />} />

          {/* Main Layout for Student */}
          <Route path="/main" element={<MainLayout />}>
            <Route path="timetable" element={<TimeTable />} />
            <Route path="QuizeCards" element={<QuizeCards />} />
            <Route path="quiz/:id" element={<PlayQuize />} />
            <Route path="ask-doubts" element={<Askdoubts />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="calander" element={<CalendarSidebar />} />
            <Route path="ExamDatesheet" element={<ExamDatesheet />} />
            <Route path="assignment" element={<Assignment />} />
            <Route path="SchoolHoliday" element={<SchoolHoliday />} />
            <Route path="LeaveApplication" element={<LeaveStudent />} />
            <Route path="events" element={<Events />} />
            <Route path="chat" element={<StudentChatSystem />} />
            <Route path="content-view" element={<ContentModal />} />
          </Route>

          {/* Protected Route for Admin Panel */}
          <Route path="/" element={<UserProtectedRoute><AdminPanelLayout /></UserProtectedRoute>}>
            <Route index element={<Assignment />} />
            <Route path="ExamDatesheet" element={<ExamDatesheet />} />
            <Route path="chat" element={<StudentChatSystem />} />
            <Route path="calander" element={<CalendarSidebar />} />
            <Route path="ask-doubts" element={<Askdoubts />} />
            <Route path="QuizeCards" element={<QuizeCards />} />
            <Route path="LeaveApplication" element={<LeaveStudent />} />
            <Route path="events" element={<Events />} />
            <Route path="SchoolHoliday" element={<SchoolHoliday />} />
            <Route path="timetable" element={<TimeTable />} />
            <Route path="assignment" element={<Assignment />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
