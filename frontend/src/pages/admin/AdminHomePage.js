import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AddRounded, GroupsRounded, SchoolRounded, ClassRounded, SubjectRounded, PaymentsRounded, TrendingUpRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import SeeNotice from "../../components/SeeNotice";
import { PremiumCard, KpiCard, SectionHeader, QuickAction, ScheduleWidget, ActivityWidget } from "../../components/PremiumShell";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList = [] } = useSelector(s => s.student);
  const { sclassesList = [] } = useSelector(s => s.sclass);
  const { teachersList = [] } = useSelector(s => s.teacher);
  const { currentUser } = useSelector(s => s.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (!adminID) return;
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const stats = [
    { icon: GroupsRounded, label: "Total students", value: studentsList.length, helper: "Active learners", trend: "+8.2%", tone: "blue" },
    { icon: SchoolRounded, label: "Teaching staff", value: teachersList.length, helper: "Faculty members", trend: "+3.1%", tone: "violet" },
    { icon: ClassRounded, label: "Classes", value: sclassesList.length, helper: "Academic groups", trend: "Stable", tone: "green" },
    { icon: PaymentsRounded, label: "Fee collection", value: "₹2.34L", helper: "This academic year", trend: "+12.4%", tone: "orange" },
  ];

  return <Box>
    <Box className="kpi-grid">{stats.map((s,i)=><KpiCard key={i} {...s}/>)}</Box>
    <Box className="dashboard-grid">
      <PremiumCard className="welcome-card">
        <Box><Typography className="eyebrow">Good to see you</Typography><Typography className="hero-title">Your campus, at a glance.</Typography><Typography className="hero-copy">Manage people, academics and communication from one polished workspace.</Typography></Box>
        <Box className="hero-actions"><Button variant="contained" startIcon={<AddRounded />} href="/Admin/addstudents">Add student</Button><Button variant="outlined" startIcon={<ClassRounded />} href="/Admin/addclass">Create class</Button></Box>
        <Box className="mini-stat"><TrendingUpRounded/><span><strong>+18%</strong> student engagement <small>vs last month</small></span></Box>
      </PremiumCard>
      <ScheduleWidget items={[
        {time:"08:30",title:"Morning assembly",meta:"Main ground • All students",tag:"Today"},
        {time:"10:15",title:"Faculty review",meta:"Conference room • Academic team",tag:"Meeting"},
        {time:"13:00",title:"Lunch break",meta:"Campus cafeteria",tag:"Break"},
        {time:"15:30",title:"Parent interaction",meta:"Block A • Room 204",tag:"Event"},
      ]}/>
    </Box>
    <Box className="dashboard-grid lower">
      <PremiumCard>
        <SectionHeader eyebrow="Shortcuts" title="Quick actions"/>
        <Box className="quick-grid">
          <QuickAction icon={GroupsRounded} label="Add student" description="Create student record" path="/Admin/addstudents"/>
          <QuickAction icon={SchoolRounded} label="Add teacher" description="Onboard faculty" path="/Admin/teachers"/>
          <QuickAction icon={ClassRounded} label="New class" description="Set up a class" path="/Admin/addclass"/>
          <QuickAction icon={SubjectRounded} label="New subject" description="Manage curriculum" path="/Admin/subjects"/>
        </Box>
      </PremiumCard>
      <ActivityWidget items={[
        {name:"A",title:"New student record created",meta:"Admissions • Class 10-A",time:"8m"},
        {name:"T",title:"Attendance submitted",meta:"Mathematics • 10-B",time:"24m"},
        {name:"N",title:"Notice published",meta:"Administration • All",time:"1h"},
        {name:"F",title:"Faculty profile updated",meta:"Science department",time:"2h"},
      ]}/>
    </Box>
    <PremiumCard sx={{mt:3}}><SectionHeader eyebrow="Announcements" title="Latest notices"/><SeeNotice/></PremiumCard>
  </Box>;
};
export default AdminHomePage;
