import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PremiumShell from "../../components/PremiumShell";
import Logout from "../Logout";
import AdminHomePage from "./AdminHomePage";
import AdminProfile from "./AdminProfile";
import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";
import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";
import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";
import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";
import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";
import FeeManagement from "./feeRelated/FeeManagement";

export default function AdminDashboard(){
 return <PremiumShell role="Admin" title="Admin dashboard"><Routes>
  <Route path="/" element={<AdminHomePage/>}/><Route path="/Admin/dashboard" element={<AdminHomePage/>}/><Route path="/Admin/profile" element={<AdminProfile/>}/><Route path="/Admin/fees" element={<FeeManagement/>}/><Route path="/Admin/complains" element={<SeeComplains/>}/>
  <Route path="/Admin/addnotice" element={<AddNotice/>}/><Route path="/Admin/notices" element={<ShowNotices/>}/>
  <Route path="/Admin/subjects" element={<ShowSubjects/>}/><Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject/>}/><Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject"/>}/><Route path="/Admin/addsubject/:id" element={<SubjectForm/>}/><Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject/>}/>
  <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject"/>}/><Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject"/>}/>
  <Route path="/Admin/addclass" element={<AddClass/>}/><Route path="/Admin/classes" element={<ShowClasses/>}/><Route path="/Admin/classes/class/:id" element={<ClassDetails/>}/><Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class"/>}/>
  <Route path="/Admin/addstudents" element={<AddStudent situation="Student"/>}/><Route path="/Admin/students" element={<ShowStudents/>}/><Route path="/Admin/students/student/:id" element={<ViewStudent/>}/><Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student"/>}/><Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student"/>}/>
  <Route path="/Admin/teachers" element={<ShowTeachers/>}/><Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails/>}/><Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher"/>}/><Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm"/>}/><Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher"/>}/><Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher/>}/>
  <Route path="/logout" element={<Logout/>}/><Route path="*" element={<Navigate to="/Admin/dashboard"/>}/>
 </Routes></PremiumShell>;
}
