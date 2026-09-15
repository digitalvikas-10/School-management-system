import React, { useEffect, useState } from "react";
import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { BookRounded, EventAvailableRounded, AssignmentRounded, EmojiEventsRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import SeeNotice from "../../components/SeeNotice";
import { PremiumCard, KpiCard, SectionHeader, ScheduleWidget, ActivityWidget } from "../../components/PremiumShell";

const StudentHomePage=()=>{
 const dispatch=useDispatch(); const {userDetails,currentUser}=useSelector(s=>s.user); const {subjectsList=[]}=useSelector(s=>s.sclass); const [attendance,setAttendance]=useState([]);
 const classID=currentUser?.sclassName?._id;
 useEffect(()=>{if(currentUser?._id)dispatch(getUserDetails(currentUser._id,"Student")); if(classID)dispatch(getSubjectList(classID,"ClassSubjects"));},[dispatch,currentUser?._id,classID]);
 useEffect(()=>setAttendance(userDetails?.attendance||[]),[userDetails]);
 const pct=Math.round(calculateOverallAttendancePercentage(attendance)||0);
 return <Box>
  <Box className="kpi-grid">
   <KpiCard icon={BookRounded} label="Subjects" value={subjectsList.length} helper="Enrolled this term" trend="On track" tone="blue"/>
   <KpiCard icon={EventAvailableRounded} label="Attendance" value={`${pct}%`} helper="Overall attendance" trend={pct>=75?"Good":"Improve"} tone="green"/>
   <KpiCard icon={AssignmentRounded} label="Assignments" value="12" helper="3 due this week" trend="3 due" tone="violet"/>
   <KpiCard icon={EmojiEventsRounded} label="Performance" value="A−" helper="Current grade" trend="+4.6%" tone="orange"/>
  </Box>
  <Box className="dashboard-grid">
   <PremiumCard className="progress-card"><SectionHeader eyebrow="Academic health" title="Attendance overview"/><Box className="big-progress"><Typography>{pct}%</Typography><LinearProgress variant="determinate" value={pct}/><small>Target: 75% minimum • Keep your momentum going.</small></Box><Box className="progress-pills"><Chip label="Present 82" size="small"/><Chip label="Absent 7" size="small"/><Chip label="Leave 3" size="small"/></Box></PremiumCard>
   <ScheduleWidget items={[{time:"09:00",title:"Data Structures",meta:"Room B-204 • Prof. Sharma",tag:"Class"},{time:"11:00",title:"Web Development",meta:"Lab 2 • Practical",tag:"Lab"},{time:"14:00",title:"Database Systems",meta:"Room A-102",tag:"Class"},{time:"16:00",title:"Assignment review",meta:"Online • Submit before 6 PM",tag:"Due"}]}/>
  </Box>
  <Box className="dashboard-grid lower"><PremiumCard><SectionHeader eyebrow="Your week" title="Learning snapshot"/><Box className="subject-bars">{["Data Structures","Web Development","DBMS","Java"].map((x,i)=><Box key={x} className="subject-bar"><Typography>{x}</Typography><LinearProgress variant="determinate" value={[86,74,68,91][i]}/><strong>{[86,74,68,91][i]}%</strong></Box>)}</Box></PremiumCard><ActivityWidget items={[{name:"A",title:"Assignment submitted",meta:"Web Development",time:"20m"},{name:"T",title:"Attendance marked",meta:"Data Structures",time:"2h"},{name:"N",title:"New notice posted",meta:"Administration",time:"5h"}]}/></Box>
  <PremiumCard sx={{mt:3}}><SectionHeader eyebrow="Campus" title="Announcements"/><SeeNotice/></PremiumCard>
 </Box>
}
export default StudentHomePage;
