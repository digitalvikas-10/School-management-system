import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PremiumShell from "../../components/PremiumShell";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import StudentFees from "./StudentFees";
import Logout from "../Logout";

export default function StudentDashboard(){
 return <PremiumShell role="Student" title="Student dashboard"><Routes>
  <Route path="/" element={<StudentHomePage/>}/><Route path="/Student/dashboard" element={<StudentHomePage/>}/><Route path="/Student/profile" element={<StudentProfile/>}/><Route path="/Student/subjects" element={<StudentSubjects/>}/><Route path="/Student/attendance" element={<ViewStdAttendance/>}/><Route path="/Student/fees" element={<StudentFees/>}/><Route path="/Student/complain" element={<StudentComplain/>}/><Route path="/logout" element={<Logout/>}/><Route path="*" element={<Navigate to="/Student/dashboard"/>}/>
 </Routes></PremiumShell>;
}
