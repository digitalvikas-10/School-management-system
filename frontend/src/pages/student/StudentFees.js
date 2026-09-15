import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Box, Chip, Divider, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { PaymentsRounded, ReceiptLongRounded } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { KpiCard, PremiumCard, SectionHeader } from '../../components/PremiumShell';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const money = n => `₹${Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const date = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';

export default function StudentFees(){
 const {currentUser}=useSelector(s=>s.user); const [fees,setFees]=useState([]); const [error,setError]=useState('');
 useEffect(()=>{ if(!currentUser?._id)return; axios.get(`${API}/Fees/Student/${currentUser._id}`).then(r=>setFees(r.data)).catch(e=>setError(e.response?.data?.message||'Unable to load fees.')); },[currentUser?._id]);
 const total=fees.reduce((s,x)=>s+Number(x.totalAmount||0),0), paid=fees.reduce((s,x)=>s+Number(x.paidAmount||0),0), balance=fees.reduce((s,x)=>s+Number(x.balance||0),0);
 return <Box>{error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Box className="kpi-grid"><KpiCard icon={ReceiptLongRounded} label="Total fees" value={money(total)} helper="All issued invoices" tone="blue"/><KpiCard icon={PaymentsRounded} label="Paid" value={money(paid)} helper="Payments received" tone="green"/><KpiCard icon={ReceiptLongRounded} label="Outstanding" value={money(balance)} helper="Amount remaining" tone="orange"/></Box><PremiumCard sx={{mt:2}}><SectionHeader eyebrow="Student finance" title="My fee invoices"/><Table size="small"><TableHead><TableRow>{['Invoice','Term','Total','Paid','Balance','Due','Status'].map(x=><TableCell key={x}>{x}</TableCell>)}</TableRow></TableHead><TableBody>{fees.map(f=><TableRow key={f._id}><TableCell><b>{f.invoiceNumber}</b></TableCell><TableCell>{f.term}</TableCell><TableCell>{money(f.totalAmount)}</TableCell><TableCell>{money(f.paidAmount)}</TableCell><TableCell><b>{money(f.balance)}</b></TableCell><TableCell>{date(f.dueDate)}</TableCell><TableCell><Chip size="small" label={f.status} color={f.status==='Paid'?'success':f.status==='Overdue'?'error':f.status==='Partially Paid'?'warning':'default'}/></TableCell></TableRow>)}{!fees.length&&<TableRow><TableCell colSpan={7}><Typography sx={{p:3,textAlign:'center'}} color="text.secondary">No fee invoices have been issued yet.</Typography></TableCell></TableRow>}</TableBody></Table></PremiumCard><Stack spacing={2} sx={{mt:2}}>{fees.filter(f=>f.payments?.length).map(f=><PremiumCard key={f._id}><SectionHeader eyebrow={f.invoiceNumber} title="Payment history"/><Stack spacing={1.5}>{f.payments.map(p=><Paper key={p._id} variant="outlined" sx={{p:1.5}}><Stack direction="row" justifyContent="space-between"><Typography>{p.receiptNumber} · {p.method}</Typography><Typography fontWeight={700}>{money(p.amount)}</Typography></Stack><Divider sx={{my:1}}/><Typography variant="caption" color="text.secondary">{date(p.paidAt)} {p.transactionId ? `· Ref ${p.transactionId}` : ''}</Typography></Paper>)}</Stack></PremiumCard>)}</Stack></Box>
}
