import React, { useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { GroupsRounded, MenuBookRounded, FactCheckRounded, AccessTimeRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getClassStudents, getSubjectDetails } from "../../redux/sclassRelated/sclassHandle";
import SeeNotice from "../../components/SeeNotice";
import { PremiumCard, KpiCard, SectionHeader, QuickAction, ScheduleWidget, ActivityWidget } from "../../components/PremiumShell";

const TeacherHomePage=()=>{
 const dispatch=useDispatch(); const {currentUser}=useSelector(s=>s.user); const {subjectDetails,sclassStudents=[]}=useSelector(s=>s.sclass);
 const classID=currentUser?.teachSclass?._id, subjectID=currentUser?.teachSubject?._id;
 useEffect(()=>{if(subjectID)dispatch(getSubjectDetails(subjectID,"Subject"));if(classID)dispatch(getClassStudents(classID));},[dispatch,subjectID,classID]);
 return <Box>
  <Box className="kpi-grid">
   <KpiCard icon={GroupsRounded} label="Class students" value={sclassStudents.length} helper="Assigned learners" trend="Active" tone="blue"/>
   <KpiCard icon={MenuBookRounded} label="Lessons" value={subjectDetails?.sessions||0} helper="Sessions planned" trend="+2 this week" tone="violet"/>
   <KpiCard icon={FactCheckRounded} label="Assessments" value="24" helper="Completed this term" trend="+6" tone="green"/>
   <KpiCard icon={AccessTimeRounded} label="Teaching hours" value="30h" helper="This month" trend="92% planned" tone="orange"/>
  </Box>
  <Box className="dashboard-grid"><PremiumCard className="welcome-card"><Typography className="eyebrow">Faculty workspace</Typography><Typography className="hero-title">Teach smarter, not harder.</Typography><Typography className="hero-copy">Keep attendance, assessments and student progress close at hand.</Typography><Box className="hero-actions"><QuickAction icon={FactCheckRounded} label="Take attendance" description="Open class roster" path="/Teacher/class"/><QuickAction icon={GroupsRounded} label="View students" description="Review your class" path="/Teacher/class"/></Box></PremiumCard><ScheduleWidget items={[{time:"09:00",title:"Mathematics • 10-A",meta:"Room C-201",tag:"Class"},{time:"11:15",title:"Mathematics • 10-B",meta:"Room C-204",tag:"Class"},{time:"13:30",title:"Faculty lunch",meta:"Staff room",tag:"Break"},{time:"15:00",title:"Assessment review",meta:"Grade submissions",tag:"Task"}]}/></Box>
  <Box className="dashboard-grid lower"><PremiumCard><SectionHeader eyebrow="Class pulse" title="Student progress"/><Box className="subject-bars">{["Attendance","Assignments","Assessments","Participation"].map((x,i)=><Box key={x} className="subject-bar"><Typography>{x}</Typography><LinearProgress variant="determinate" value={[88,76,82,71][i]}/><strong>{[88,76,82,71][i]}%</strong></Box>)}</Box></PremiumCard><ActivityWidget items={[{name:"10",title:"Attendance submitted",meta:"Class 10-A",time:"12m"},{name:"M",title:"Marks updated",meta:"Unit test • 10-B",time:"1h"},{name:"N",title:"New notice posted",meta:"Administration",time:"4h"}]}/></Box>
  <PremiumCard sx={{mt:3}}><SectionHeader eyebrow="Campus" title="Announcements"/><SeeNotice/></PremiumCard>
 </Box>
}
export default TeacherHomePage;
