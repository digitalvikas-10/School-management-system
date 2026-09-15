import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppBar, Avatar, Box, Chip, CssBaseline, Divider, Drawer, IconButton,
  InputBase, List, ListItemButton, ListItemIcon, ListItemText, Toolbar,
  Tooltip, Typography, useMediaQuery
} from "@mui/material";
import {
  DashboardRounded, GroupsRounded, SchoolRounded, ClassRounded, SubjectRounded,
  CampaignRounded, PersonRounded, LogoutRounded, MenuRounded, SearchRounded,
  NotificationsNoneRounded, DarkModeRounded, LightModeRounded, ChevronLeftRounded,
  AssessmentRounded, CalendarMonthRounded, PaymentsRounded, SettingsRounded,
  EventNoteRounded, AutoGraphRounded
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NAV = {
  Admin: [
    { label: "Overview", path: "/Admin/dashboard", icon: DashboardRounded },
    { label: "Students", path: "/Admin/students", icon: GroupsRounded },
    { label: "Teachers", path: "/Admin/teachers", icon: SchoolRounded },
    { label: "Classes", path: "/Admin/classes", icon: ClassRounded },
    { label: "Subjects", path: "/Admin/subjects", icon: SubjectRounded },
    { label: "Notices", path: "/Admin/notices", icon: CampaignRounded },
    { label: "Complaints", path: "/Admin/complains", icon: AssessmentRounded },
    { label: "Fees & Invoices", path: "/Admin/fees", icon: PaymentsRounded },
    { label: "Profile", path: "/Admin/profile", icon: PersonRounded },
  ],
  Teacher: [
    { label: "Overview", path: "/Teacher/dashboard", icon: DashboardRounded },
    { label: "My Class", path: "/Teacher/class", icon: GroupsRounded },
    { label: "Attendance", path: "/Teacher/class", icon: EventNoteRounded },
    { label: "Complaints", path: "/Teacher/complain", icon: CampaignRounded },
    { label: "Profile", path: "/Teacher/profile", icon: PersonRounded },
  ],
  Student: [
    { label: "Overview", path: "/Student/dashboard", icon: DashboardRounded },
    { label: "Subjects", path: "/Student/subjects", icon: SubjectRounded },
    { label: "Attendance", path: "/Student/attendance", icon: EventNoteRounded },
    { label: "Fees", path: "/Student/fees", icon: PaymentsRounded },
    { label: "Complaints", path: "/Student/complain", icon: CampaignRounded },
    { label: "Profile", path: "/Student/profile", icon: PersonRounded },
  ],
};

export const PremiumCard = ({ children, sx = {}, className = "" }) => (
  <Box className={`premium-card ${className}`} sx={sx}>{children}</Box>
);

export const KpiCard = ({ icon: Icon, label, value, helper, trend, tone = "blue" }) => (
  <PremiumCard className="kpi-card">
    <Box className="kpi-icon" data-tone={tone}><Icon /></Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography className="eyebrow">{label}</Typography>
      <Typography className="kpi-value">{value ?? "—"}</Typography>
      <Typography className="kpi-helper">{helper}</Typography>
    </Box>
    {trend && <Chip label={trend} size="small" className="trend-chip" />}
  </PremiumCard>
);

export const SectionHeader = ({ eyebrow, title, action }) => (
  <Box className="section-header">
    <Box>
      {eyebrow && <Typography className="eyebrow">{eyebrow}</Typography>}
      <Typography className="section-title">{title}</Typography>
    </Box>
    {action}
  </Box>
);

export const QuickAction = ({ icon: Icon, label, path, description }) => {
  const navigate = useNavigate();
  return (
    <button className="quick-action" onClick={() => navigate(path)}>
      <span className="quick-action-icon"><Icon /></span>
      <span><strong>{label}</strong><small>{description}</small></span>
    </button>
  );
};

export const ScheduleWidget = ({ items }) => (
  <PremiumCard>
    <SectionHeader eyebrow="Today" title="Schedule" action={<CalendarMonthRounded className="muted-icon" />} />
    <Box className="schedule-list">
      {items.map((item, i) => (
        <Box className="schedule-row" key={`${item.time}-${i}`}>
          <Typography className="schedule-time">{item.time}</Typography>
          <Box className="schedule-dot" />
          <Box sx={{ flex: 1 }}>
            <Typography className="schedule-title">{item.title}</Typography>
            <Typography className="schedule-meta">{item.meta}</Typography>
          </Box>
          <Chip label={item.tag} size="small" variant="outlined" />
        </Box>
      ))}
    </Box>
  </PremiumCard>
);

export const ActivityWidget = ({ items }) => (
  <PremiumCard>
    <SectionHeader eyebrow="Live feed" title="Recent activity" action={<AutoGraphRounded className="muted-icon" />} />
    <Box className="activity-list">
      {items.map((item, i) => (
        <Box className="activity-row" key={i}>
          <Avatar className="activity-avatar">{item.name?.[0] || "S"}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="activity-title">{item.title}</Typography>
            <Typography className="activity-meta">{item.meta}</Typography>
          </Box>
          <Typography className="activity-time">{item.time}</Typography>
        </Box>
      ))}
    </Box>
  </PremiumCard>
);

const PremiumShell = ({ role, title, children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("sms-theme") === "dark");
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery("(max-width:900px)");
  const nav = useMemo(() => NAV[role] || [], [role]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("sms-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  const drawer = (
    <Box className="premium-sidebar">
      <Box className="brand">
        <Box className="brand-mark"><SchoolRounded /></Box>
        <Box><Typography className="brand-name">Edu<span>Flow</span></Typography><Typography className="brand-sub">School OS</Typography></Box>
        {isMobile && <IconButton onClick={() => setMobileOpen(false)}><ChevronLeftRounded /></IconButton>}
      </Box>
      <Divider className="sidebar-divider" />
      <Typography className="nav-label">Workspace</Typography>
      <List className="premium-nav">
        {nav.filter(n => !search || n.label.toLowerCase().includes(search.toLowerCase())).map(({ label, path, icon: Icon }) => (
          <ListItemButton key={label} component={NavLink} to={path} onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `premium-nav-item ${isActive ? "active" : ""}`}>
            <ListItemIcon><Icon /></ListItemIcon><ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <Box className="sidebar-bottom">
        <Box className="sidebar-tip"><Typography>✨ Smart school management</Typography><small>One workspace for your whole campus.</small></Box>
        <ListItemButton component={NavLink} to={`/${role}/profile`} className="premium-nav-item"><ListItemIcon><SettingsRounded /></ListItemIcon><ListItemText primary="Settings" /></ListItemButton>
        <ListItemButton component={NavLink} to="/logout" className="premium-nav-item danger"><ListItemIcon><LogoutRounded /></ListItemIcon><ListItemText primary="Sign out" /></ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box className={`premium-app ${dark ? "theme-dark" : ""}`}>
      <CssBaseline />
      <AppBar position="fixed" className="premium-topbar" elevation={0}>
        <Toolbar>
          <IconButton className="mobile-menu" onClick={() => setMobileOpen(true)}><MenuRounded /></IconButton>
          <Box className="search-box"><SearchRounded /><InputBase placeholder="Search students, classes, notices..." value={search} onChange={e => setSearch(e.target.value)} /></Box>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={dark ? "Light mode" : "Dark mode"}><IconButton onClick={toggleTheme} className="top-icon">{dark ? <LightModeRounded /> : <DarkModeRounded />}</IconButton></Tooltip>
          <Tooltip title="Notifications"><IconButton className="top-icon"><NotificationsNoneRounded /><span className="notification-dot" /></IconButton></Tooltip>
          <Divider orientation="vertical" flexItem className="top-divider" />
          <Avatar className="top-avatar">{currentUser?.name?.[0] || role?.[0] || "U"}</Avatar>
          <Box className="top-user"><Typography>{currentUser?.name || `${role} account`}</Typography><small>{role}</small></Box>
        </Toolbar>
      </AppBar>
      {!isMobile && <Drawer variant="permanent" className="premium-drawer" PaperProps={{ className: "premium-drawer-paper" }}>{drawer}</Drawer>}
      {isMobile && <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ className: "premium-drawer-paper mobile-drawer" }}>{drawer}</Drawer>}
      <Box component="main" className="premium-main">
        <Box className="page-heading">
          <Box><Typography className="page-eyebrow">EDUFLOW • {role.toUpperCase()}</Typography><Typography className="page-title">{title}</Typography></Box>
          <Chip label="System online" size="small" className="online-chip" />
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default PremiumShell;
