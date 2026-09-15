import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PremiumShell from "../../components/PremiumShell";
import TeacherHomePage from "./TeacherHomePage";
import TeacherProfile from "./TeacherProfile";
import TeacherComplain from "./TeacherComplain";
import TeacherClassDetails from "./TeacherClassDetails";
import TeacherViewStudent from "./TeacherViewStudent";
import StudentAttendance from "../admin/studentRelated/StudentAttendance";
import StudentExamMarks from "../admin/studentRelated/StudentExamMarks";
import Logout from "../Logout";

export default function TeacherDashboard(){
 return <PremiumShell role="Teacher" title="Teacher dashboard"><Routes>
  <Route path="/" element={<TeacherHomePage/>}/><Route path="/Teacher/dashboard" element={<TeacherHomePage/>}/><Route path="/Teacher/profile" element={<TeacherProfile/>}/><Route path="/Teacher/complain" element={<TeacherComplain/>}/><Route path="/Teacher/class" element={<TeacherClassDetails/>}/><Route path="/Teacher/class/student/:id" element={<TeacherViewStudent/>}/><Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject"/>}/><Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject"/>}/><Route path="/logout" element={<Logout/>}/><Route path="*" element={<Navigate to="/Teacher/dashboard"/>}/>
 </Routes></PremiumShell>;
}
