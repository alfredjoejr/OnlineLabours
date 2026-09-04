import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, AlertTriangle, ArrowLeft, Briefcase, Calendar, CheckCircle2, ChevronRight, Clock, Edit2, FileText, LayoutDashboard, LogOut, Mail, MapPin, Menu, PlusCircle, Save, Search, Settings, Shield, ShieldCheck, Smartphone, Star, UploadCloud, User, X, Zap, Mic, Square, Type, Image as ImageIcon, XCircle, CreditCard, Lock, CheckCircle, MessageSquare, Phone, ArrowRight, Camera, Navigation, UserPlus, Users, BarChart2, Download, Receipt, Target, FileWarning, Check, Copy, QrCode, Key, RefreshCw, Trash2, Inbox, Send, Eye } from 'lucide-react';
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleLocationPicker } from './components/GoogleLocationPicker';
import { GoogleMapView } from './components/GoogleMapView';
import { StripePaymentForm } from './components/StripePaymentForm';
import { requestNotificationPermission, onForegroundMessage, saveFcmTokenToBackend, isFirebaseConfigured } from './services/firebase';
import { Analytics } from '@vercel/analytics/react';

// Reusable Glass Card Component
function GlassCard({ children, className = "", ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const isOverflowHidden = !className.includes('overflow-') ? 'overflow-hidden' : '';
  return (
    <div className={`bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl ${isOverflowHidden} ${className}`} {...props}>
      {children}
    </div>
  );
}



export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'signup' | 'login' | 'forgotPassword' | 'customerDashboard' | 'providerDashboard' | 'userProfile' | 'settings' | 'postTask' | 'directHireList' | 'directHireBooking' | 'paymentGateway' | 'taskTracking' | 'providerPendingVerification' | 'providerActiveWorkspace' | 'supervisorDashboard' | 'supervisorActiveWorkspace' | 'hrDashboard' | 'financeDashboard' | 'adminDashboard'>('home');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [selectedProviderForHire, setSelectedProviderForHire] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'provider' | 'supervisor' | 'hr' | 'finance' | 'admin' | null>(null);
  const [providerVerificationStatus, setProviderVerificationStatus] = useState<'pending' | 'active' | 'rejected' | null>(null);

  // Modern Toast Notification System State
  const [activeToast, setActiveToast] = useState<{ id: number; title: string; message?: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setActiveToast({ id, title, message, type });
  };

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const [paymentContext, setPaymentContext] = useState<{ type: 'directHire' | 'broadcast', provider?: any } | null>(null);
  const [trackingTask, setTrackingTask] = useState<any>(null);
  const [activeWorkspaceJob, setActiveWorkspaceJob] = useState<any>(null);
  const [providerMilestoneIndex, setProviderMilestoneIndex] = useState(3);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  // Supervisor States
  const [supervisorActiveTab, setSupervisorActiveTab] = useState<'assigned' | 'completed' | 'escalated'>('assigned');
  const [supervisorSelectedJob, setSupervisorSelectedJob] = useState<any>(null);
  const [supervisorAssessmentNotes, setSupervisorAssessmentNotes] = useState('');
  const [supervisorEvidences, setSupervisorEvidences] = useState<string[]>([]);
  const [isSupervisorEscalateModalOpen, setIsSupervisorEscalateModalOpen] = useState(false);
  const [supervisorEscalateDescription, setSupervisorEscalateDescription] = useState('');
  const [supervisorTasks, setSupervisorTasks] = useState<{ assigned: any[]; completed: any[]; escalated: any[] }>({ assigned: [], completed: [], escalated: [] });
  const [supervisorIsLoading, setSupervisorIsLoading] = useState(false);

  // HR States
  const [hrActiveTab, setHrActiveTab] = useState<'onboarding' | 'directory' | 'analytics'>('onboarding');
  const [hrSearchQuery, setHrSearchQuery] = useState('');
  const [hrTradeFilter, setHrTradeFilter] = useState('All Trades');
  const [hrExperienceFilter, setHrExperienceFilter] = useState('All');
  const [hrApplicantsList, setHrApplicantsList] = useState<any[]>([]);
  const [hrLaborersList, setHrLaborersList] = useState<any[]>([]);
  const [hrIsLoading, setHrIsLoading] = useState(false);
  const [hrSelectedApplicant, setHrSelectedApplicant] = useState<any>(null);
  const [isHrRejectModalOpen, setIsHrRejectModalOpen] = useState(false);
  const [hrRejectReason, setHrRejectReason] = useState('');
  const [isHrApplicationDrawerOpen, setIsHrApplicationDrawerOpen] = useState(false);
  const [hrSelectedLaborerLog, setHrSelectedLaborerLog] = useState<any>(null);
  const [isHrLogModalOpen, setIsHrLogModalOpen] = useState(false);
  const [isHrProfileMenuOpen, setIsHrProfileMenuOpen] = useState(false);


  // Finance States
  const [financeActiveTab, setFinanceActiveTab] = useState<'ledger' | 'reconciliation' | 'analytics'>('ledger');
  const [financeSelectedDateRange, setFinanceSelectedDateRange] = useState('This Month');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [financeSelectedTransaction, setFinanceSelectedTransaction] = useState<any>(null);
  const [isFinanceProfileMenuOpen, setIsFinanceProfileMenuOpen] = useState(false);

  // Admin States
  const [adminActiveTab, setAdminActiveTab] = useState<'overview' | 'users' | 'disputes' | 'logs'>('overview');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState('all');
  const [isAdminProfileMenuOpen, setIsAdminProfileMenuOpen] = useState(false);
  const [adminOverviewMetrics, setAdminOverviewMetrics] = useState<{
    metrics: {
      total_users: number;
      total_customers: number;
      total_providers: number;
      active_providers: number;
      pending_providers: number;
      online_providers: number;
      completed_bookings: {
        total: number;
        by_customers: number;
        by_providers: number;
        fulfillment_rate: number;
      };
    };
    officers: {
      hr_officers: number;
      hr_pending_verifications: number;
      field_supervisors: number;
      field_active_audits: number;
      finance_controllers: number;
      finance_cleared_payouts: number;
    };
    system_health: {
      database: string;
      api: string;
      payment_gateway: string;
      server_url: string;
      version: string;
    };
  }>({
    metrics: {
      total_users: 0,
      total_customers: 0,
      total_providers: 0,
      active_providers: 0,
      pending_providers: 0,
      online_providers: 0,
      completed_bookings: {
        total: 0,
        by_customers: 0,
        by_providers: 0,
        fulfillment_rate: 100,
      },
    },
    officers: {
      hr_officers: 1,
      hr_pending_verifications: 0,
      field_supervisors: 1,
      field_active_audits: 0,
      finance_controllers: 1,
      finance_cleared_payouts: 0,
    },
    system_health: {
      database: '100% Online',
      api: '99.9% Uptime',
      payment_gateway: 'Connected',
      server_url: 'your backend URL',
      version: 'v1.2.0-Prod',
    }
  });
  const [adminUsersList, setAdminUsersList] = useState<any[]>([]);
  const [adminDisputesList, setAdminDisputesList] = useState<any[]>([]);
  const [adminContactMessages, setAdminContactMessages] = useState<any[]>([]);
  const [adminLogsSubTab, setAdminLogsSubTab] = useState<'messages' | 'audit'>('messages');
  const [adminMessageFilter, setAdminMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [adminMessageSearch, setAdminMessageSearch] = useState('');
  const [adminIsLoading, setAdminIsLoading] = useState(false);

  const [isPostTaskOptionsOpen, setIsPostTaskOptionsOpen] = useState(false);
  const [completedTasksCount, setCompletedTasksCount] = useState(12);
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const alertedTaskIdsRef = useRef<Set<number>>(new Set());
  const reviewedTaskIdsRef = useRef<Set<number>>(new Set());
  const isInitialProviderFetchRef = useRef<boolean>(true);

  // Poll live task status when customer is on taskTracking page
  useEffect(() => {
    if (currentPage === 'taskTracking' && trackingTask) {
      const checkStatus = async () => {
        const token = localStorage.getItem('tasklink_token');
        if (!token) return;
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/tasks`, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const rawId = trackingTask.rawId || (typeof trackingTask.id === 'string' ? parseInt(trackingTask.id.replace('TASK-', '')) : trackingTask.id);
            const liveTask = (data.tasks || []).find((t: any) => t.id === rawId);
            if (liveTask) {
              const displayStatus = liveTask.status === 'completed'
                ? 'Completed'
                : liveTask.status === 'in_review'
                  ? 'Quality Check Pending'
                  : liveTask.status === 'in_progress' || liveTask.status === 'assigned'
                    ? 'In Progress'
                    : 'Booked';

              setTrackingTask((prev: any) => ({
                ...prev,
                status: displayStatus,
                provider: liveTask.provider || prev?.provider,
                rawId: liveTask.id
              }));

              if (liveTask.status === 'posted') {
                setMilestoneIndex(0);
              } else if (liveTask.status === 'assigned') {
                setMilestoneIndex(1);
              } else if (liveTask.status === 'in_progress') {
                setMilestoneIndex(3);
              } else if (liveTask.status === 'in_review') {
                setMilestoneIndex(4);
              } else if (liveTask.status === 'completed') {
                setMilestoneIndex(5);
                // Only open review modal if this task has NOT been reviewed yet
                if (!liveTask.review && !reviewedTaskIdsRef.current.has(liveTask.id) && !isFeedbackModalOpen) {
                  setIsFeedbackModalOpen(true);
                }
              }
            }
          }
        } catch (err) {
          console.error('Failed to poll tracking task:', err);
        }
      };

      checkStatus();
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [currentPage, trackingTask?.rawId, trackingTask?.id, isFeedbackModalOpen]);

  const [isProviderOnline, setIsProviderOnline] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [incomingJobAlert, setIncomingJobAlert] = useState<any>(null);
  const [jobAlertCountdown, setJobAlertCountdown] = useState(30);

  const [customerTasks, setCustomerTasks] = useState<any[]>([]);
  const [customerActiveCount, setCustomerActiveCount] = useState<number>(0);
  const [customerCompletedCount, setCustomerCompletedCount] = useState<number>(0);
  const [topProvidersList, setTopProvidersList] = useState<any[]>([]);

  // Provider Dashboard live data
  const [providerDashboardData, setProviderDashboardData] = useState<any>({
    stats: { active_jobs_count: 0, earnings_this_week: 0, average_rating: 0, review_count: 0, completed_all_time: 0 },
    active_jobs: [],
    available_tasks: [],
    upcoming_schedule: [],
  });
  const [providerNotifications, setProviderNotifications] = useState<any[]>([]);
  const [providerUnreadCount, setProviderUnreadCount] = useState(0);

  const fetchCustomerTasks = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/tasks`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerTasks(data.tasks || []);
        setCustomerActiveCount(data.active_count || 0);
        setCustomerCompletedCount(data.completed_count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchTopProviders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/providers/top`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTopProvidersList(data.providers || []);
      }
    } catch (err) {
      console.error('Failed to fetch top providers:', err);
    }
  };

  const fetchProviderDashboard = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/dashboard`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const available = data.available_tasks || [];
        setProviderDashboardData(data);
        setProviderJobFeed(available);

        // If this is the initial load, record all existing tasks as seen so they don't trigger a popup
        if (isInitialProviderFetchRef.current) {
          available.forEach((t: any) => alertedTaskIdsRef.current.add(t.id));
          isInitialProviderFetchRef.current = false;
        } else if (available.length > 0) {
          // If a new task arrives after initial load, trigger popup modal
          const newest = available[0];
          if (!alertedTaskIdsRef.current.has(newest.id)) {
            alertedTaskIdsRef.current.add(newest.id);
            setIncomingJobAlert({
              id: newest.id,
              title: newest.title || 'New Task',
              category: newest.category || 'General Service',
              budget: `LKR ${newest.budget || '0'}`,
              isNegotiable: !!newest.isNegotiable,
              location: newest.neighborhood || newest.location || 'Your Area',
              neighborhood: newest.neighborhood || newest.location || 'Your Area',
              timePosted: 'Just now',
              description: newest.description || 'Customer service booking.'
            });
            setJobAlertCountdown(30);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch provider dashboard:', err);
    }
  };

  const fetchProviderNotifications = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/notifications`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProviderNotifications(data.notifications || []);
        setProviderUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch provider notifications:', err);
    }
  };

  const handleAcceptTask = async (taskId: number) => {
    alertedTaskIdsRef.current.add(taskId);
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/tasks/${taskId}/accept`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Task Accepted', 'You have accepted the job request.', 'success');
        await fetchProviderDashboard();
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Failed to accept task.', 'error');
      }
    } catch (err) {
      console.error('Failed to accept task:', err);
    }
  };

  const handleDeclineTask = async (taskId: number) => {
    alertedTaskIdsRef.current.add(taskId);
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/tasks/${taskId}/decline`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      // Just remove from local feed
      setProviderJobFeed(prev => prev.filter(j => j.id !== taskId));
    } catch (err) {
      console.error('Failed to decline task:', err);
    }
  };

  const handleStartTask = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/tasks/${taskId}/start`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setProviderMilestoneIndex(3);
        if (activeWorkspaceJob) {
          setActiveWorkspaceJob((prev: any) => ({ ...prev, status: 'in_progress' }));
        }
        showToast('Work In Progress', 'You have started work on this task.', 'success');
        await fetchProviderDashboard();
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Failed to start task.', 'error');
      }
    } catch (err) {
      console.error('Failed to start task:', err);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setProviderMilestoneIndex(4);
        if (activeWorkspaceJob) {
          setActiveWorkspaceJob((prev: any) => ({ ...prev, status: 'in_review' }));
        }
        showToast('Work Completed & Submitted', 'Task submitted to Field Supervisor for Quality Check sign-off.', 'success');
        await fetchProviderDashboard();
        setTimeout(() => {
          setCurrentPage('providerDashboard');
        }, 1500);
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Failed to submit task for review.', 'error');
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleCancelTask = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/tasks/${taskId}/cancel`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Task Cancelled', 'Your task booking has been cancelled.', 'info');
        await fetchCustomerTasks();
        setTrackingTask(null);
        setCurrentPage('customerDashboard');
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Failed to cancel task.', 'error');
      }
    } catch (err) {
      console.error('Failed to cancel task:', err);
    }
  };

  const fetchSupervisorData = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      setSupervisorIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/supervisor/tasks`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupervisorTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch supervisor tasks:', err);
    } finally {
      setSupervisorIsLoading(false);
    }
  };

  const handleSupervisorSiteVisit = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/supervisor/tasks/${taskId}/site-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: supervisorAssessmentNotes })
      });
      if (res.ok) {
        showToast('Site Visit Authorized', 'Site inspection confirmed and work authorized for Provider.', 'success');
        await fetchSupervisorData();
        setSupervisorAssessmentNotes('');
        setCurrentPage('supervisorDashboard');
      } else {
        const err = await res.json();
        showToast('Authorization Failed', err.message || 'Failed to authorize site visit.', 'error');
      }
    } catch (err) {
      console.error('Failed to authorize site visit:', err);
    }
  };

  const handleSupervisorQualityCheck = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/supervisor/tasks/${taskId}/quality-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: supervisorAssessmentNotes })
      });
      if (res.ok) {
        showToast('Quality Check Approved', 'Quality inspection approved! Payout released to Provider.', 'success');
        await fetchSupervisorData();
        setSupervisorAssessmentNotes('');
        setCurrentPage('supervisorDashboard');
      } else {
        const err = await res.json();
        showToast('Quality Check Failed', err.message || 'Failed to approve quality check.', 'error');
      }
    } catch (err) {
      console.error('Failed to approve quality check:', err);
    }
  };

  const handleSupervisorEscalate = async (taskId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/supervisor/tasks/${taskId}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: supervisorEscalateDescription })
      });
      if (res.ok) {
        showToast('Dispute Escalated', 'Task flagged and escalated to Administration.', 'warning');
        await fetchSupervisorData();
        setIsSupervisorEscalateModalOpen(false);
        setSupervisorEscalateDescription('');
        setCurrentPage('supervisorDashboard');
      } else {
        const err = await res.json();
        showToast('Escalation Failed', err.message || 'Failed to escalate dispute.', 'error');
      }
    } catch (err) {
      console.error('Failed to escalate dispute:', err);
    }
  };

  const initFirebaseForProvider = async () => {
    if (!isFirebaseConfigured()) return;
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      await saveFcmTokenToBackend(fcmToken);
      // Listen for foreground messages
      onForegroundMessage((payload: any) => {
        const data = payload?.data || {};
        if (data.task_id) {
          // Trigger the visual popup
          setIncomingJobAlert({
            id: data.task_id,
            title: data.title || 'New Task',
            category: data.category || 'General Service',
            budget: `LKR ${data.budget || '0'}`,
            isNegotiable: data.is_negotiable === '1',
            location: data.location || 'Your Area',
            neighborhood: data.location || 'Your Area',
            timePosted: 'Just now'
          });
          setJobAlertCountdown(30);

          // Refresh dashboard to show new task in the list
          fetchProviderDashboard();
          fetchProviderNotifications();
        }
      });
    }
  };


  const fetchHrData = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      setHrIsLoading(true);
      const [appRes, labRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/hr/applicants`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/hr/laborers`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        })
      ]);
      if (appRes.ok) {
        const data = await appRes.json();
        setHrApplicantsList(data.applicants || []);
      }
      if (labRes.ok) {
        const data = await labRes.json();
        setHrLaborersList(data.laborers || []);
      }
    } catch (err) {
      console.error('Failed to fetch HR data:', err);
    } finally {
      setHrIsLoading(false);
    }
  };

  const handleApproveApplicant = async (applicantId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/hr/applicants/${applicantId}/approve`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchHrData();
        await fetchTopProviders();
        setIsHrApplicationDrawerOpen(false);
      }
    } catch (err) {
      console.error('Failed to approve applicant:', err);
    }
  };

  const handleRejectApplicant = async (applicantId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/hr/applicants/${applicantId}/reject`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchHrData();
        setIsHrRejectModalOpen(false);
        setIsHrApplicationDrawerOpen(false);
      }
    } catch (err) {
      console.error('Failed to reject applicant:', err);
    }
  };

  const fetchAdminData = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      setAdminIsLoading(true);
      const [overviewRes, usersRes, disputesRes, messagesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/overview`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/users`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/disputes`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/contact-messages`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setAdminOverviewMetrics(overviewData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAdminUsersList(usersData);
      }
      if (disputesRes.ok) {
        const disputesData = await disputesRes.json();
        setAdminDisputesList(disputesData);
      }
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setAdminContactMessages(messagesData);
      }
    } catch (err) {
      console.error('Failed to fetch Admin data:', err);
    } finally {
      setAdminIsLoading(false);
    }
  };

  const handleUpdateMessageStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/contact-messages/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast('Message Updated', `Status marked as ${status}.`, 'success');
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  const handleDeleteAdminMessage = async (id: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showToast('Message Deleted', 'Inquiry removed from database.', 'success');
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleResolveDispute = async (taskId: number, action: 'release' | 'refund') => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/disputes/${taskId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(action === 'release' ? 'Escrow Released' : 'Client Refunded', data.message, 'success');
        await fetchAdminData();
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Failed to resolve dispute.', 'error');
      }
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  const handleAdminToggleUserStatus = async (userId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Status Updated', data.message, 'info');
        setAdminUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: data.status } : u));
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Could not update user status.', 'error');
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  // Restore logged-in user profile from Laravel API on app load
  useEffect(() => {
    fetchTopProviders();
    const token = localStorage.getItem('tasklink_token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => {
          if (res && res.status === 403) {
            localStorage.removeItem('tasklink_token');
            showToast('Account Suspended', 'Your account is suspended. Please contact support.', 'error');
            return null;
          }
          return res && res.ok ? res.json() : null;
        })
        .then(user => {
          if (user) {
            if (user.verification_status === 'suspended') {
              localStorage.removeItem('tasklink_token');
              showToast('Account Suspended', 'Your account is suspended. Please contact support.', 'error');
              return;
            }
            const role = user.role;
            if (role === 'admin') {
              setCurrentUserRole('admin');
              setCurrentPage('adminDashboard');
            } else if (role === 'provider') {
              setCurrentUserRole('provider');
              setProviderVerificationStatus(user.verification_status || 'pending');
              if (user.verification_status === 'pending') {
                setCurrentPage('providerPendingVerification');
              } else {
                setCurrentPage('providerDashboard');
              }
            } else if (role === 'supervisor') {
              setCurrentUserRole('supervisor');
              setCurrentPage('supervisorDashboard');
            } else if (role === 'hr') {
              setCurrentUserRole('hr');
              setCurrentPage('hrDashboard');
            } else if (role === 'finance') {
              setCurrentUserRole('finance');
              setCurrentPage('financeDashboard');
            } else {
              setCurrentUserRole('client');
              setCurrentPage('customerDashboard');
            }

            setProfileData({
              firstName: user.name ? user.name.split(' ')[0] : '',
              lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
              email: user.email || '',
              phone: user.phone_number || '',
              dob: user.dob || '',
              location: user.address || '',
              bio: user.bio || '',
              hourlyRate: user.provider_profile?.hourly_rate || 1500,
              avatar: user.avatar_url || (user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${user.avatar}`) : ''),
            });
            setIs2FAActive(!!user.two_factor_enabled);
            setSettingsEmail(user.email || '');
            setIsProviderOnline(user.is_online || false);
            fetchCustomerTasks();
          }
        })
        .catch(err => console.error('Failed to restore user session:', err));
    }
  }, []);

  useEffect(() => {
    if (currentPage === 'home') {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % 4);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentPage]);

  // Real-time Provider Heartbeat and Presence Management
  useEffect(() => {
    if (currentUserRole === 'provider' && isProviderOnline) {
      const token = localStorage.getItem('tasklink_token');
      if (!token) return;

      // Heartbeat ping every 40 seconds to keep last_seen_at active
      const interval = setInterval(async () => {
        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/heartbeat`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (err) {
          console.error('Provider heartbeat ping failed:', err);
        }
      }, 40000);

      // Take provider offline if browser window/tab is closed
      const handleBeforeUnload = () => {
        try {
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/offline`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            keepalive: true,
          });
        } catch (e) {
          // ignore
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentUserRole, isProviderOnline]);

  const handleUserLogout = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('tasklink_token');
    setCurrentUserRole(null);
    setIsProviderOnline(false);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsHrProfileMenuOpen(false);
    setIsFinanceProfileMenuOpen(false);
    setIsAdminProfileMenuOpen(false);
    setCurrentPage('home');
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  useEffect(() => {
    if (currentPage === 'customerDashboard' || currentPage === 'directHireList') {
      fetchCustomerTasks();
      fetchTopProviders();
    } else if (currentPage === 'providerDashboard') {
      fetchProviderDashboard();
      fetchProviderNotifications();
      initFirebaseForProvider();
    } else if (currentPage === 'hrDashboard') {
      fetchHrData();
    } else if (currentPage === 'supervisorDashboard') {
      fetchSupervisorData();
    } else if (currentPage === 'adminDashboard') {
      fetchAdminData();
    }
  }, [currentPage]);

  const navigateToDashboard = () => {
    if (currentUserRole === 'admin') {
      setCurrentPage('adminDashboard');
    } else if (currentUserRole === 'provider') {
      if (providerVerificationStatus === 'active') {
        setCurrentPage('providerDashboard');
      } else {
        setCurrentPage('providerPendingVerification');
      }
    } else if (currentUserRole === 'supervisor') {
      setCurrentPage('supervisorDashboard');
    } else if (currentUserRole === 'hr') {
      setCurrentPage('hrDashboard');
    } else if (currentUserRole === 'finance') {
      setCurrentPage('financeDashboard');
    } else {
      setCurrentPage('customerDashboard');
    }
  };
  const [providerJobFeed, setProviderJobFeed] = useState<any[]>([]);

  // Poll for new tasks when provider is online (replaces simulated alerts)
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isProviderOnline && currentUserRole === 'provider') {
      // Fetch dashboard data immediately when online
      fetchProviderDashboard();
      fetchProviderNotifications();

      // Poll for new tasks every 10 seconds
      pollInterval = setInterval(() => {
        fetchProviderDashboard();
        fetchProviderNotifications();
      }, 10000);
    }

    if (incomingJobAlert) {
      countdownInterval = setInterval(() => {
        setJobAlertCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIncomingJobAlert(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [isProviderOnline, currentUserRole, currentPage, incomingJobAlert]);

  // Poll active workspace job in real time to sync supervisor authorizations
  useEffect(() => {
    if (currentPage === 'providerActiveWorkspace' && activeWorkspaceJob) {
      let interval: NodeJS.Timeout;
      const pollActiveJob = async () => {
        const token = localStorage.getItem('tasklink_token');
        if (!token) return;
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/dashboard`, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const matchingJob = (data.active_jobs || []).find((j: any) => j.id === activeWorkspaceJob.id);
            if (matchingJob) {
              setActiveWorkspaceJob((prev: any) => ({
                ...prev,
                status: matchingJob.status,
                customerName: matchingJob.customer?.name || prev?.customerName,
                customerPhone: matchingJob.customer?.phone || prev?.customerPhone,
                exactAddress: matchingJob.location || prev?.exactAddress,
              }));
              const newMilestone = matchingJob.status === 'completed' ? 5
                : matchingJob.status === 'in_review' ? 4
                  : matchingJob.status === 'in_progress' ? 3
                    : 1;
              setProviderMilestoneIndex(newMilestone);
            }
          }
        } catch (err) {
          console.error('Failed to poll active workspace job:', err);
        }
      };

      pollActiveJob();
      interval = setInterval(pollActiveJob, 3000);
      return () => clearInterval(interval);
    }
  }, [currentPage, activeWorkspaceJob?.id]);

  const [dhCategory, setDhCategory] = useState('all');
  const [dhLocationRadius, setDhLocationRadius] = useState(10);
  const [dhMinRating, setDhMinRating] = useState(0);
  const [dhMinExperience, setDhMinExperience] = useState(0);
  const [dhAvailableOnly, setDhAvailableOnly] = useState(false);

  // Filter real database providers
  const filteredProviders = topProvidersList.filter(p => {
    if (dhAvailableOnly && !p.availableNow) return false;
    if (dhMinRating > 0 && p.rating < dhMinRating) return false;
    if (dhMinExperience > 0 && p.experience < dhMinExperience) return false;
    if (dhCategory !== 'all') {
      const isMatch = (p.skill || '').toLowerCase().includes(dhCategory.toLowerCase());
      if (!isMatch) return false;
    }
    return true;
  });

  // Signup State
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupTrade, setSignupTrade] = useState('');
  const [signupExperience, setSignupExperience] = useState('');
  const [signupNic, setSignupNic] = useState('');
  const [signupIdFile, setSignupIdFile] = useState<File | null>(null);
  const [signupCvFile, setSignupCvFile] = useState<File | null>(null);
  const [signupAvatarFile, setSignupAvatarFile] = useState<File | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // Input refs for clicking the hidden file input
  const idInputRef = useRef<HTMLInputElement>(null);
  const permitInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupLoading(true);

    try {
      let response: Response;

      if (role === 'client') {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: signupName.trim() || signupEmail.split('@')[0],
            email: signupEmail.trim(),
            password: signupPassword,
            role: 'customer',
            phone: signupPhone.trim() || undefined,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('name', signupName.trim() || 'Provider');
        formData.append('email', signupEmail.trim());
        formData.append('password', signupPassword);
        formData.append('role', 'provider');
        formData.append('phone', signupPhone.trim());
        formData.append('nic', signupNic.trim());
        formData.append('experience', signupExperience || '1');
        if (signupIdFile) formData.append('id_file', signupIdFile);
        if (signupCvFile) formData.append('cv_file', signupCvFile);
        if (signupAvatarFile) formData.append('avatar', signupAvatarFile);

        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/register`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        let msg = data.message || 'Registration failed.';
        if (data.errors) {
          const errList = Object.values(data.errors).flat();
          if (errList.length > 0) msg = errList.join(' ');
        }
        setSignupError(msg);
        setSignupLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('tasklink_token', data.access_token);
      const user = data.user;

      if (role === 'client') {
        setCurrentUserRole('client');
        setCurrentPage('customerDashboard');
      } else {
        setCurrentUserRole('provider');
        setCurrentPage('providerPendingVerification');
      }

      setProfileData({
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email || '',
        phone: user.phone_number || signupPhone || '',
        dob: user.dob || '',
        location: user.address || signupAddress || '',
        bio: user.bio || '',
        hourlyRate: user.provider_profile?.hourly_rate || 1500,
        avatar: user.avatar_url || (user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${user.avatar}`) : ''),
      });

      // Clear fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupPhone('');
      setSignupAddress('');
      setSignupNic('');
      setSignupExperience('');
      setSignupIdFile(null);
      setSignupCvFile(null);
      setSignupAvatarFile(null);

    } catch (err) {
      console.error('Signup error:', err);
      setSignupError('Could not connect to backend server at your backend URL.');
    } finally {
      setSignupLoading(false);
    }
  };

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [login2FaCode, setLogin2FaCode] = useState('');
  const [isLogin2FaRequired, setIsLogin2FaRequired] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const payload: any = {
        email: loginEmail,
        password: loginPassword,
      };

      if (isLogin2FaRequired) {
        payload.two_factor_code = login2FaCode;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || 'Invalid email or password.');
        return;
      }

      // Check if 2FA code is needed
      if (data.two_factor_required) {
        setIsLogin2FaRequired(true);
        return;
      }

      // Store token
      localStorage.setItem('tasklink_token', data.access_token);

      const user = data.user;
      const role = user.role; // 'customer', 'provider', 'admin', 'hr', 'finance', 'supervisor'

      // Map DB roles to frontend states
      if (role === 'admin') {
        setCurrentUserRole('admin');
        setCurrentPage('adminDashboard');
      } else if (role === 'customer') {
        setCurrentUserRole('client');
        setCurrentPage('customerDashboard');
      } else if (role === 'provider') {
        setCurrentUserRole('provider');
        setProviderVerificationStatus(user.verification_status || 'pending');
        if (user.verification_status === 'pending') {
          setCurrentPage('providerPendingVerification');
        } else {
          setCurrentPage('providerDashboard');
        }
      } else if (role === 'supervisor') {
        setCurrentUserRole('supervisor');
        setCurrentPage('supervisorDashboard');
      } else if (role === 'hr') {
        setCurrentUserRole('hr');
        setCurrentPage('hrDashboard');
      } else if (role === 'finance') {
        setCurrentUserRole('finance');
        setCurrentPage('financeDashboard');
      } else {
        setCurrentUserRole('client');
        setCurrentPage('customerDashboard');
      }

      setProfileData({
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email || '',
        phone: user.phone_number || '',
        dob: user.dob || '',
        location: user.address || '',
        bio: user.bio || '',
        hourlyRate: user.provider_profile?.hourly_rate || 1500,
        avatar: user.avatar_url || (user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${user.avatar}`) : ''),
      });
      setIs2FAActive(!!user.two_factor_enabled);
      setSettingsEmail(user.email || '');
      setIsProviderOnline(user.is_online || false);

      setLoginEmail('');
      setLoginPassword('');
      setLogin2FaCode('');
      setIsLogin2FaRequired(false);

    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Could not connect to backend server at your backend URL. Please check your local server.');
    }
  };

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('idle');

    if (!resetEmail.trim()) {
      setResetStatus('error');
      return;
    }

    // Simple frontend logic check for demonstration
    if (resetEmail.includes('@') && resetEmail.endsWith('.com')) {
      setResetStatus('success');
    } else {
      setResetStatus('error');
    }
  };

  // User Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const profileAvatarInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    location: '',
    bio: '',
    hourlyRate: '',
    avatar: '',
  });

  const handleProfileAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileAvatarFile(file);
      const preview = URL.createObjectURL(file);
      setProfileAvatarPreview(preview);

      const token = localStorage.getItem('tasklink_token');
      if (token) {
        setIsUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/avatar`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const updatedUser = data.user;
            const newAvatar = data.avatar_url || (updatedUser.avatar ? (updatedUser.avatar.startsWith('http') ? updatedUser.avatar : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${updatedUser.avatar}`) : preview);
            setProfileData(prev => ({
              ...prev,
              avatar: newAvatar,
            }));
            showToast('Avatar Saved', 'Your new profile avatar is now active.', 'success');
          } else {
            const errData = await response.json();
            showToast('Upload Failed', errData.message || 'Could not upload avatar.', 'error');
          }
        } catch (err) {
          console.error('Avatar upload error:', err);
          showToast('Upload Error', 'Could not upload avatar to server.', 'error');
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    }
  };

  const handleSaveProfile = async () => {
    if (isEditingProfile) {
      const token = localStorage.getItem('tasklink_token');
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

      if (token) {
        try {
          const formData = new FormData();
          formData.append('name', fullName);
          formData.append('phone_number', profileData.phone || '');
          formData.append('dob', profileData.dob || '');
          formData.append('bio', profileData.bio || '');
          formData.append('address', profileData.location || '');
          if (currentUserRole === 'provider') {
            formData.append('hourly_rate', profileData.hourlyRate || '1500');
          }
          if (profileAvatarFile) {
            formData.append('avatar', profileAvatarFile);
          }

          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/profile`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const updatedUser = data.user;
            const avatarUrl = data.avatar_url || updatedUser.avatar_url || (updatedUser.avatar ? (updatedUser.avatar.startsWith('http') ? updatedUser.avatar : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${updatedUser.avatar}`) : profileData.avatar);
            setProfileData({
              firstName: updatedUser.name ? updatedUser.name.split(' ')[0] : '',
              lastName: updatedUser.name ? updatedUser.name.split(' ').slice(1).join(' ') : '',
              email: updatedUser.email || '',
              phone: updatedUser.phone_number || '',
              dob: updatedUser.dob || '',
              location: updatedUser.address || '',
              bio: updatedUser.bio || '',
              hourlyRate: updatedUser.provider_profile?.hourly_rate || 1500,
              avatar: avatarUrl || '',
            });
            setProfileAvatarFile(null);
            setProfileAvatarPreview(null);
            showToast('Profile Updated', 'Your profile details have been saved.', 'success');
          } else {
            const errData = await response.json();
            showToast('Save Failed', errData.message || 'Could not update profile.', 'error');
          }
        } catch (err) {
          console.error('Error saving profile:', err);
          showToast('Save Error', 'Error connecting to server.', 'error');
        }
      }
      setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  };

  // Settings & 2FA State
  const [is2FAActive, setIs2FAActive] = useState(false);
  const [is2FASetupModalOpen, setIs2FASetupModalOpen] = useState(false);
  const [twoFaTab, setTwoFaTab] = useState<'qr' | 'key'>('qr');
  const [twoFaSecret, setTwoFaSecret] = useState('JBSWY3DPEHPK3PXP');
  const [twoFaFormattedSecret, setTwoFaFormattedSecret] = useState('JBSW Y3DP EHPK 3PXP');
  const [twoFaQrUrl, setTwoFaQrUrl] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaSetupStatus, setTwoFaSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [twoFaErrorMessage, setTwoFaErrorMessage] = useState('');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivate2FaCode, setDeactivate2FaCode] = useState('');
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [settingsEmail, setSettingsEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailUpdateMessage, setEmailUpdateMessage] = useState('');

  const fetchTwoFactorSetup = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;

    setTwoFaSetupStatus('idle');
    setTwoFaErrorMessage('');
    setTwoFaCode('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/2fa/setup`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTwoFaSecret(data.secret || 'JBSWY3DPEHPK3PXP');
        setTwoFaFormattedSecret(data.formatted_secret || 'JBSW Y3DP EHPK 3PXP');
        setTwoFaQrUrl(data.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=otpauth://totp/TaskLink:${encodeURIComponent(profileData.email || 'user@tasklink.com')}?secret=${data.secret}&issuer=TaskLink`);
        if (data.two_factor_enabled !== undefined) {
          setIs2FAActive(data.two_factor_enabled);
        }
      }
    } catch (err) {
      console.error('Failed to fetch 2FA setup:', err);
    }
  };

  const handleOpen2FASetup = () => {
    setIs2FASetupModalOpen(true);
    setTwoFaTab('qr');
    fetchTwoFactorSetup();
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(twoFaSecret);
    setIsCopiedKey(true);
    showToast('Secret Key Copied', '2FA secret key copied to clipboard.', 'info');
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleActivate2FA = async () => {
    if (twoFaCode.length !== 6) return;

    const token = localStorage.getItem('tasklink_token');
    if (!token) return;

    setTwoFaSetupStatus('loading');
    setTwoFaErrorMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/2fa/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: twoFaCode,
          secret: twoFaSecret,
        }),
      });

      const data = await responseOk(res);
      if (data) {
        setTwoFaSetupStatus('success');
        setIs2FAActive(true);
        showToast('2FA Activated', 'Two-Factor Authentication is now active on your account.', 'success');
        setTimeout(() => {
          setIs2FASetupModalOpen(false);
          setTwoFaSetupStatus('idle');
          setTwoFaCode('');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        setTwoFaSetupStatus('error');
        setTwoFaErrorMessage(errData.message || 'Invalid code. Please try again.');
        showToast('Activation Failed', errData.message || 'Verification failed.', 'error');
      }
    } catch (err) {
      console.error('Failed to activate 2FA:', err);
      setTwoFaSetupStatus('error');
      setTwoFaErrorMessage('Connection error. Please try again.');
    }
  };

  const responseOk = async (res: Response) => {
    if (res.ok) {
      return await res.json();
    }
    return null;
  };

  const handleDisable2FA = async () => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) {
      setIs2FAActive(false);
      setIsDisable2FAModalOpen(false);
      return;
    }

    setIsDisabling2FA(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/2fa/disable`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIs2FAActive(false);
        setIsDisable2FAModalOpen(false);
        showToast('2FA Disabled', 'Two-Factor Authentication has been turned off.', 'info');
      } else {
        const data = await res.json();
        showToast('Action Failed', data.message || 'Could not disable 2FA.', 'error');
      }
    } catch (err) {
      console.error('Failed to disable 2FA:', err);
      showToast('Error', 'Connection error while disabling 2FA.', 'error');
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleDeactivateAccount = async () => {
    setDeactivateError(null);
    setIsDeactivating(true);

    const token = localStorage.getItem('tasklink_token');
    if (!token) {
      localStorage.removeItem('tasklink_token');
      setCurrentUserRole(null);
      setCurrentPage('home');
      setIsDeactivateModalOpen(false);
      setIsDeactivating(false);
      return;
    }

    try {
      const payload: any = {
        password: deactivatePassword,
      };
      if (is2FAActive) {
        payload.two_factor_code = deactivate2FaCode;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/user/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeactivateError(data.message || 'Failed to deactivate account. Please check your credentials.');
        setIsDeactivating(false);
        return;
      }

      // Success: clean up state and logout
      localStorage.removeItem('tasklink_token');
      setCurrentUserRole(null);
      setProfileData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        location: '',
        bio: '',
        hourlyRate: '',
        avatar: '',
      });
      setIsDeactivateModalOpen(false);
      setDeactivatePassword('');
      setDeactivate2FaCode('');
      setIsProfileMenuOpen(false);
      setCurrentPage('home');
      showToast('Account Deactivated', 'Your account has been deleted.', 'info');
    } catch (err) {
      console.error('Deactivation error:', err);
      setDeactivateError('Failed to connect to the server.');
    } finally {
      setIsDeactivating(false);
    }
  };

  // Post Task State & Scheduling Helpers
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinTimeForToday = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000); // exactly 1 hour from current time
    const today = new Date();
    // If +1 hour crossed midnight into tomorrow
    if (d.getDate() !== today.getDate()) {
      return null;
    }
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const validateTaskSchedule = (dateStr: string, timeStr: string): { isValid: boolean; message?: string } => {
    const todayStr = getTodayDateString();
    if (!dateStr) {
      return { isValid: false, message: 'Please select a date for your task.' };
    }
    if (dateStr < todayStr) {
      return { isValid: false, message: 'Task date cannot be in the past. Please select today or a future date.' };
    }
    if (!timeStr) {
      return { isValid: false, message: 'Please select a time for your task.' };
    }
    if (dateStr === todayStr) {
      const minTime = getMinTimeForToday();
      if (!minTime) {
        return {
          isValid: false,
          message: 'Same-day bookings are closed for tonight because providers require at least 1 hour notice. Please select tomorrow or a later date.'
        };
      }
      if (timeStr < minTime) {
        return {
          isValid: false,
          message: `For bookings today, please choose a time at least 1 hour from now (after ${minTime}).`
        };
      }
    }
    return { isValid: true };
  };

  const [taskLocation, setTaskLocation] = useState('');
  const [taskLatitude, setTaskLatitude] = useState<number | undefined>(undefined);
  const [taskLongitude, setTaskLongitude] = useState<number | undefined>(undefined);
  const [taskDate, setTaskDate] = useState(getTodayDateString());
  const [taskTime, setTaskTime] = useState(getMinTimeForToday() || '09:00');
  const [taskBudget, setTaskBudget] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState('cleaning');

  // Interactive Payment Card States
  const [simCardNumber, setSimCardNumber] = useState('4532 8921 4482 1098');
  const [simCardHolder, setSimCardHolder] = useState('KAMAL PERERA');
  const [simCardExpiry, setSimCardExpiry] = useState('08/29');
  const [simCardCvv, setSimCardCvv] = useState('482');
  const [simCardBrand, setSimCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover'>('visa');

  // Voice recording & photos state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [taskPhotos, setTaskPhotos] = useState<string[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptAccumulatedRef = useRef<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isRecordingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech Not Supported', 'Voice-to-text is not supported by your browser engine. Please use Chrome, Edge, or Safari, or enter your description as text.', 'warning');
      return;
    }

    setLiveTranscript('');
    transcriptAccumulatedRef.current = '';
    setIsRecording(true);
    isRecordingRef.current = true;
    setRecordingTime(0);

    // Request mic access to ensure browser permission is granted
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }
    } catch (err: any) {
      console.warn('Microphone permission request error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showToast('Microphone Permission Denied', 'Please grant microphone access in your browser to record voice notes.', 'error');
        setIsRecording(false);
        isRecordingRef.current = false;
        return;
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript;
        }
        transcriptAccumulatedRef.current = fullText;
        setLiveTranscript(fullText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          showToast('Microphone Access Blocked', 'Microphone permissions were blocked. Please enable them in browser settings.', 'error');
          stopRecording();
        }
      };

      recognition.onend = () => {
        // Auto-restart recognition if recording is still active (handles browser pauses)
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already started or finished
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      showToast('Voice Error', 'Could not initialize speech recognition service.', 'error');
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    const finalResult = transcriptAccumulatedRef.current.trim();
    if (finalResult) {
      setTaskDescription(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${finalResult}` : finalResult;
      });
      showToast('Voice Transcribed', 'Your speech was successfully converted into task description!', 'success');
    } else {
      showToast('No Speech Detected', 'No clear words were recognized. You can try recording again or type directly.', 'info');
    }

    setLiveTranscript('');
    transcriptAccumulatedRef.current = '';
    setIsVoiceMode(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const remainingSlots = 5 - taskPhotos.length;
      const filesToAdd = filesArray.slice(0, remainingSlots);

      const newPhotos = filesToAdd.map(file => URL.createObjectURL(file));
      setTaskPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setTaskPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Animated Ambient Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[10%] w-[70%] h-[70%] rounded-full bg-pink-300/40 blur-[120px] mix-blend-multiply"
        />
      </div>

      {/* Navigation */}
      {(currentPage !== 'hrDashboard' && currentPage !== 'financeDashboard' && currentPage !== 'adminDashboard') && (
        <nav className={`fixed top-0 w-full z-50 px-6 ${(currentUserRole === 'supervisor' || currentPage === 'supervisorDashboard') ? 'py-2' : 'py-4'}`}>
          <GlassCard className={`max-w-7xl mx-auto px-6 overflow-visible ${(currentUserRole === 'supervisor' || currentPage === 'supervisorDashboard') ? 'rounded-[2rem] py-3 flex flex-col gap-3' : 'py-3 flex items-center justify-between rounded-full'} bg-white/50`}>
            <div className="flex items-center justify-between w-full">
              <div
                className="flex items-center gap-2 cursor-pointer group shrink-0"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block font-semibold text-xl tracking-tight text-slate-800">Online Labours</span>
                {(currentUserRole === 'supervisor' || currentPage === 'supervisorDashboard' || currentPage === 'supervisorActiveWorkspace') && (
                  <div className="flex items-center ml-1">
                    <span className="text-sm font-bold text-slate-900 leading-tight hidden sm:block mr-2">{profileData.firstName} {profileData.lastName}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded items-center gap-1 uppercase flex whitespace-nowrap">
                      <Shield className="w-3 h-3" /> {currentUserRole === 'admin' ? 'ADMIN OVERRIDE' : 'SV-4592'}
                    </span>
                  </div>
                )}
              </div>

              {currentUserRole !== null ? (
                <div className="flex items-center gap-4 relative">
                  {currentUserRole === 'provider' && providerVerificationStatus === 'active' && (
                    <button
                      onClick={async () => {
                        const newStatus = !isProviderOnline;
                        setIsProviderOnline(newStatus);
                        const token = localStorage.getItem('tasklink_token');
                        if (token) {
                          try {
                            await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/provider/status`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ is_online: newStatus })
                            });
                          } catch (err) {
                            console.error('Failed to update online status:', err);
                          }
                        }
                      }}
                      className={`flex text-sm font-semibold items-center gap-2 px-3 py-1.5 rounded-full transition-all border shadow-sm cursor-pointer ${isProviderOnline ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isProviderOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className="hidden sm:inline">{isProviderOnline ? 'Go Offline' : 'Go Online'}</span>
                      <span className="sm:hidden">{isProviderOnline ? 'Online' : 'Offline'}</span>
                    </button>
                  )}

                  <div className="hidden md:flex items-center gap-4 relative">
                    {currentUserRole === 'client' && (
                      <button
                        onClick={() => setIsPostTaskOptionsOpen(true)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Post a Task
                      </button>
                    )}
                    <div
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                    >
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-indigo-600 font-bold text-sm">{profileData.firstName ? profileData.firstName[0].toUpperCase() : 'U'}</span>
                      )}
                    </div>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-14 right-0 w-64 z-50 shadow-2xl"
                          >
                            <div className="p-4 flex flex-col items-center shadow-xl border border-slate-200 bg-white rounded-3xl">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-sm flex items-center justify-center mb-3 overflow-hidden">
                                {profileData.avatar ? (
                                  <img src={profileData.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-indigo-600 font-bold text-2xl">{profileData.firstName ? profileData.firstName[0].toUpperCase() : 'U'}</span>
                                )}
                              </div>
                              <h2 className="text-base font-bold text-slate-900 mx-auto text-center">{profileData.firstName} {profileData.lastName}</h2>
                              <p className="text-xs text-slate-500 mb-4 mx-auto text-center">{profileData.email}</p>

                              <div className="flex flex-col gap-1 w-full">
                                {(currentUserRole !== 'provider' || providerVerificationStatus === 'active') && (
                                  <>
                                    <button
                                      onClick={() => {
                                        navigateToDashboard();
                                        setIsProfileMenuOpen(false);
                                      }}
                                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors text-sm w-full text-left"
                                    >
                                      <LayoutDashboard className="w-4 h-4" />
                                      Dashboard
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCurrentPage('userProfile');
                                        setIsProfileMenuOpen(false);
                                      }}
                                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors text-sm w-full text-left"
                                    >
                                      <User className="w-4 h-4" />
                                      User Profile
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCurrentPage('settings');
                                        setIsProfileMenuOpen(false);
                                      }}
                                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors text-sm w-full text-left"
                                    >
                                      <Settings className="w-4 h-4" />
                                      Settings
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="mt-3 pt-3 border-t border-slate-200 w-full mb-1">
                                <button
                                  onClick={() => handleUserLogout()}
                                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors cursor-pointer"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Log out
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 px-4 py-2 rounded-xl transition-all"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => setCurrentPage('signup')}
                    className="text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 ml-2"
                  >
                    Sign up
                  </button>
                </div>
              )}

              <button
                className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {currentPage === 'supervisorDashboard' && (
              <div className="w-full flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1 pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSupervisorActiveTab('assigned')}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${supervisorActiveTab === 'assigned' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Assigned Trips
                  </button>
                  <button
                    onClick={() => setSupervisorActiveTab('completed')}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${supervisorActiveTab === 'completed' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Completed Audits
                  </button>
                  <button
                    onClick={() => setSupervisorActiveTab('escalated')}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${supervisorActiveTab === 'escalated' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Escalated Disputes
                  </button>
                </div>

                {currentUserRole === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('adminDashboard')}
                    className="ml-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 hover:bg-indigo-600 text-white flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    Back to Admin Terminal
                  </button>
                )}
              </div>
            )}

          </GlassCard>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute top-20 left-6 right-6 z-40"
              >
                <div className="p-4 flex flex-col gap-2 rounded-3xl shadow-xl border border-slate-200 bg-white">
                  {currentUserRole !== null ? (
                    <>
                      <button
                        onClick={() => {
                          navigateToDashboard();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 w-full py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('userProfile');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 w-full py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" /> User Profile
                      </button>
                      {currentUserRole === 'client' && (
                        <button
                          onClick={() => {
                            setIsPostTaskOptionsOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 w-full py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" /> Post a Task
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCurrentPage('settings');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 w-full py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button
                        onClick={() => handleUserLogout()}
                        className="text-sm font-medium text-red-600 hover:bg-red-50 w-full py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage('login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100/50 w-full py-3 rounded-xl transition-all text-center"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('signup');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 w-full py-3 rounded-xl transition-all duration-300 hover:shadow-lg shadow-indigo-500/20 active:scale-95 text-center"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-28 lg:pt-32 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center max-w-3xl mx-auto mb-12"
              >
                <span className="inline-block py-1.5 px-4 rounded-full bg-white/40 border border-white/50 backdrop-blur-md text-sm font-medium text-indigo-700 mb-5 shadow-sm">
                  ✨ The new standard for everyday services
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
                  Your tasks, linked. <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Your goals, achieved.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                  Find trusted professionals for any task, or offer your expertise on your own terms. The smartest way to get work done.
                </p>
              </motion.div>

              {/* How it Works: Interactive Showcase */}
              <div className="w-full max-w-6xl mt-6 relative z-10">
                <GlassCard className="p-3 md:p-4 bg-white/50 backdrop-blur-3xl border border-white/70 shadow-2xl">
                  {/* Tabs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {[
                      { id: 0, title: '1. Request', desc: 'Customer posts task & locks funds', icon: <Search className="w-5 h-5" />, colorClass: 'border-blue-500', bgClass: 'bg-blue-100 text-blue-600' },
                      { id: 1, title: '2. Connect & Work', desc: 'Provider accepts & executes', icon: <Briefcase className="w-5 h-5" />, colorClass: 'border-purple-500', bgClass: 'bg-purple-100 text-purple-600' },
                      { id: 2, title: '3. Quality Check', desc: 'Supervisor inspects site', icon: <ShieldCheck className="w-5 h-5" />, colorClass: 'border-emerald-500', bgClass: 'bg-emerald-100 text-emerald-600' },
                      { id: 3, title: '4. Job Done', desc: 'Funds released securely', icon: <CheckCircle2 className="w-5 h-5" />, colorClass: 'border-indigo-500', bgClass: 'bg-indigo-100 text-indigo-600' },
                    ].map((step) => (
                      <div
                        key={step.id}
                        onClick={() => setActiveSlide(step.id)}
                        className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 flex flex-col items-center text-center ${activeSlide === step.id ? 'bg-white shadow-lg scale-[1.02] border-b-4 ' + step.colorClass : 'hover:bg-white/60 opacity-60 hover:opacity-100'}`}
                      >
                        <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${activeSlide === step.id ? step.bgClass : 'bg-slate-100 text-slate-500'}`}>
                          {step.icon}
                        </div>
                        <h3 className={`font-bold text-sm md:text-base ${activeSlide === step.id ? 'text-slate-900' : 'text-slate-600'}`}>{step.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 hidden md:block">{step.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Screen */}
                  <div className="w-full min-h-[360px] bg-slate-900 rounded-3xl overflow-hidden relative shadow-inner border border-slate-800 flex items-center justify-center p-6 md:p-10">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <AnimatePresence mode="wait">
                      {activeSlide === 0 && (
                        <motion.div key="slide0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center relative z-10">
                          <div className="bg-white w-full rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-50 shadow-inner"><Search className="w-6 h-6 text-blue-600" /></div>
                              <div><h4 className="text-xl font-bold text-slate-800">Plumbing Repair</h4><p className="text-slate-500 text-sm">Fix leaking kitchen sink</p></div>
                            </div>
                            <div className="space-y-4 mb-6">
                              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/3 animate-pulse"></div></div>
                              <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-emerald-800 font-bold"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Escrow Locked</div>
                              <span className="font-bold text-emerald-600 text-lg">LKR 4,500</span>
                            </div>
                          </div>
                          <p className="mt-6 text-slate-300 text-center text-sm md:text-base font-medium px-4">Customers post their requirements. Escrow ensures funds are locked securely before any work begins.</p>
                        </motion.div>
                      )}

                      {activeSlide === 1 && (
                        <motion.div key="slide1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center relative z-10">
                          <div className="bg-white w-full rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-md relative">
                                  <User className="w-6 h-6 text-purple-600" />
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div><h4 className="text-xl font-bold text-slate-800">Saman K.</h4><div className="flex items-center text-amber-500 text-xs mt-1"><Star className="w-3 h-3 fill-current mr-1" /> 4.9 <span className="text-slate-400 ml-1">(124 jobs)</span></div></div>
                              </div>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full animate-pulse border border-purple-200">In Progress</span>
                            </div>
                            <div className="h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                              <div className="flex items-center gap-6 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10"><MapPin className="w-6 h-6 text-rose-500" /></div>
                                <div className="w-24 border-t-4 border-dashed border-slate-300 relative">
                                  <motion.div animate={{ x: [0, 90] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-3 -left-2 w-6 h-6 bg-purple-500 rounded-full shadow-lg flex items-center justify-center">
                                    <Briefcase className="w-3 h-3 text-white" />
                                  </motion.div>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10"><Settings className="w-6 h-6 text-slate-400 animate-[spin_3s_linear_infinite]" /></div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-6 text-slate-300 text-center text-sm md:text-base font-medium px-4">A verified local professional accepts the job and gets to work immediately, tracking progress in real-time.</p>
                        </motion.div>
                      )}

                      {activeSlide === 2 && (
                        <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center relative z-10">
                          <div className="bg-white w-full rounded-2xl p-6 shadow-2xl border-t-8 border-emerald-500">
                            <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><ShieldCheck className="w-6 h-6" /></div>
                                <div><h4 className="font-bold text-slate-800">Quality Inspection</h4><p className="text-xs text-slate-500">Supervisor: Charlie S.</p></div>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-slate-700">Plumbing materials verified</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-slate-700">No leakage observed</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center"><Camera className="w-3 h-3 text-indigo-600" /></div>
                                <span className="text-sm font-bold text-indigo-900">Upload Site Photos</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-6 text-slate-300 text-center text-sm md:text-base font-medium px-4">Before payment is released, a Field Supervisor thoroughly inspects the work to ensure top-notch quality.</p>
                        </motion.div>
                      )}

                      {activeSlide === 3 && (
                        <motion.div key="slide3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md flex flex-col items-center relative z-10">
                          <div className="w-full bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 shadow-2xl relative text-center text-white overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-inner border border-white/30">
                              <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
                            </motion.div>
                            <h4 className="text-3xl font-bold mb-2 tracking-tight">Job Complete!</h4>
                            <p className="text-indigo-100 text-sm mb-8">Escrow funds released securely. Client is satisfied, provider got paid.</p>
                            <div className="flex flex-col gap-3 relative z-10">
                              <button onClick={() => { setRole('client'); setCurrentPage('signup'); }} className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                Request a Service
                              </button>
                              <button onClick={() => { setRole('provider'); setCurrentPage('signup'); }} className="w-full py-3 bg-indigo-800/50 text-white rounded-xl font-bold shadow-sm border border-indigo-400 hover:bg-indigo-800 transition-all">
                                Become a Provider
                              </button>
                            </div>
                          </div>
                          <p className="mt-6 text-slate-300 text-center text-sm md:text-base font-medium px-4">Once verified, the escrow funds are automatically released. A safe, secure, and hassle-free experience.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </div>
            </main>

            {/* Trust Elements Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-10">Why millions trust TaskLink</p>

                <div className="grid md:grid-cols-3 gap-8">
                  <GlassCard className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Vetted Professionals</h3>
                      <p className="text-sm text-slate-600">Every provider passes rigorous background checks and quality standards before joining.</p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Guaranteed Quality</h3>
                      <p className="text-sm text-slate-600">Our platform ensures you're satisfied with the work or your money is fully refunded.</p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Instant Matching</h3>
                      <p className="text-sm text-slate-600">Our smart algorithm connects you with the perfect provider in seconds, not days.</p>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}

        {currentPage === 'about' && (
          <motion.main
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen"
          >
            <div className="mb-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>

            <GlassCard className="p-8 md:p-12 bg-white/60">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About TaskLink</h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                  We are on a mission to revolutionize how everyday tasks are managed and completed by connecting skilled professionals with those who need them most.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h2>
                  <p className="text-slate-600 leading-relaxed">
                    At TaskLink, we envision a world where getting things done is seamless, transparent, and efficient. We believe in empowering independent workers and small businesses by providing them with a robust platform to showcase their skills, find meaningful work, and build lasting relationships with clients.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Why Choose Us?</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600"><strong>Verified Professionals:</strong> Every service provider undergoes a rigorous background check and skills assessment.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600"><strong>Secure Payments:</strong> Funds are held securely in escrow until you are 100% satisfied with the completed work.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600"><strong>Instant Matching:</strong> Our advanced algorithms connect you with the right experts in your area within minutes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'contact' && (
          <motion.main
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 min-h-screen"
          >
            <div className="mb-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>

            {/* System Operations & Dev Dispatch Relay: joashjeshurun9@protonmail.ch */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Contact Information & Google Maps */}
              <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-8 bg-white/60">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">TaskLink Headquarters</h2>
                      <p className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">Batticaloa Operations Center</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Physical Address</div>
                        <div className="text-slate-600 mt-0.5">
                          31/1 A, Upstair Road, Batticaloa,<br />
                          Sri Lanka
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Phone Support</div>
                        <div className="text-slate-600 mt-0.5">+94 777778984</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Email Inquiries</div>
                        <div className="text-slate-600 mt-0.5">support@tasklink.lk</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Business Hours</div>
                        <div className="text-slate-600 mt-0.5">Monday &ndash; Saturday: 8:30 AM &ndash; 6:00 PM (IST)</div>
                      </div>
                    </div>
                  </div>

                  {/* Google Map Section */}
                  <div className="mt-6 pt-6 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office Location (Batticaloa)</span>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live Map
                      </span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-56 w-full">
                      <iframe
                        title="TaskLink Batticaloa Location"
                        src="https://maps.google.com/maps?q=Batticaloa,+Sri+Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right Column: Contact & Message Form */}
              <div className="lg:col-span-7">
                <GlassCard className="p-8 md:p-10 bg-white/60 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="py-1 px-3 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold">
                        Get in Touch
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Send us a Message</h1>
                    <p className="text-slate-600 text-sm mb-6">
                      Have a query about task bookings, becoming a verified provider, or enterprise partnerships? Fill out the form below.
                    </p>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
                          showToast('Missing Fields', 'Please complete all required fields.', 'warning');
                          return;
                        }
                        setIsSubmittingContact(true);
                        try {
                          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/contact`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                              name: contactName,
                              email: contactEmail,
                              subject: contactSubject,
                              message: contactMessage
                            })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setContactName('');
                            setContactEmail('');
                            setContactMessage('');
                            showToast('Message Sent Successfully!', data.message || 'Thank you! Your message has been received by TaskLink administration.', 'success');
                          } else {
                            showToast('Failed to Send', data.message || 'Could not send your message.', 'error');
                          }
                        } catch (err) {
                          console.error('Contact submission error:', err);
                          showToast('Network Error', 'Could not send message. Please check connection.', 'error');
                        } finally {
                          setIsSubmittingContact(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Alex Fernando"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="alex@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Inquiry Topic
                        </label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Customer Booking Support">Customer Booking Support</option>
                          <option value="Provider Verification & Onboarding">Provider Verification & Onboarding</option>
                          <option value="Supervisor Escalation">Supervisor Escalation</option>
                          <option value="Corporate / Partnership">Corporate / Partnership</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="How can our Batticaloa team help you today? Please describe your request..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingContact}
                          className="w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        >
                          {isSubmittingContact ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Transmitting Message...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>⚡ Average response time: &lt; 2 hours</span>
                    <span>🔒 End-to-end Encrypted</span>
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.main>
        )}
        {currentPage === 'signup' && (
          <motion.main
            key="signup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to home
              </button>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create an account</h1>
              <p className="text-slate-600 mb-8 text-sm">Join TaskLink today. It takes less than a minute.</p>

              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8">
                <button
                  onClick={() => setRole('client')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${role === 'client' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  I'm a Client
                </button>
                <button
                  onClick={() => setRole('provider')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${role === 'provider' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  I'm a Provider
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSignupSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      setSignupError(null);
                    }}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupError(null);
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupError(null);
                    }}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                  />
                </div>

                {role === 'client' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number (Optional)</label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                    />
                  </div>
                )}

                <AnimatePresence>
                  {role === 'provider' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden space-y-5"
                    >
                      <div className="pt-4 border-t border-slate-200/60">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                            <input
                              type="tel"
                              required={role === 'provider'}
                              value={signupPhone}
                              onChange={(e) => setSignupPhone(e.target.value)}
                              placeholder="+94 7X XXX XXXX"
                              className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Permanent Address</label>
                            <textarea
                              rows={2}
                              value={signupAddress}
                              onChange={(e) => setSignupAddress(e.target.value)}
                              placeholder="Enter your full address"
                              className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Avatar</label>
                            <input
                              type="file"
                              ref={avatarInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSignupAvatarFile(e.target.files[0]);
                                }
                              }}
                            />
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                                {signupAvatarFile ? (
                                  <img src={URL.createObjectURL(signupAvatarFile)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-8 h-8" />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="px-4 py-2 bg-white text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                {signupAvatarFile ? 'Change Photo' : 'Upload Photo'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/60">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Professional Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Trade Category</label>
                            <select
                              value={signupTrade}
                              onChange={(e) => setSignupTrade(e.target.value)}
                              className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all"
                            >
                              <option value="">Select your profession...</option>
                              <option value="mason">Masons</option>
                              <option value="carpenter">Carpenters</option>
                              <option value="electrician">Electricians</option>
                              <option value="plumber">Plumbers</option>
                              <option value="painter">Painters</option>
                              <option value="cleaner">Cleaners</option>
                              <option value="allied">Allied Trades</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience</label>
                            <input
                              type="number"
                              min="0"
                              value={signupExperience}
                              onChange={(e) => setSignupExperience(e.target.value)}
                              placeholder="e.g. 5"
                              className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/60">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Verification Documents</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">National Identity Card (NIC) Number</label>
                            <input
                              type="text"
                              required={role === 'provider'}
                              value={signupNic}
                              onChange={(e) => setSignupNic(e.target.value)}
                              placeholder="123456789v or 199012345678"
                              className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400"
                            />
                          </div>
                          {/* ID Card Upload */}
                          <div>
                            <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                              <span>NIC / Passport Photo</span>
                              <span className="text-indigo-600 font-medium normal-case">Required*</span>
                            </label>
                            <input
                              type="file"
                              ref={idInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSignupIdFile(e.target.files[0]);
                                }
                              }}
                            />
                            <div
                              onClick={() => idInputRef.current?.click()}
                              className="w-full px-4 py-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                            >
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="text-sm font-medium text-indigo-900 text-center">
                                {signupIdFile ? `Selected: ${signupIdFile.name}` : 'Click to upload ID photo'}
                              </span>
                              <span className="text-xs text-slate-500 mt-1">JPEG, PNG up to 10MB</span>
                            </div>
                          </div>

                          {/* CV Upload */}
                          <div>
                            <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                              <span>Curriculum Vitae (CV)</span>
                              <span className="text-indigo-600 font-medium normal-case">Required*</span>
                            </label>
                            <input
                              type="file"
                              ref={permitInputRef}
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSignupCvFile(e.target.files[0]);
                                }
                              }}
                            />
                            <div
                              onClick={() => permitInputRef.current?.click()}
                              className="w-full px-4 py-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                            >
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="text-sm font-medium text-indigo-900 text-center">
                                {signupCvFile ? `Selected: ${signupCvFile.name}` : 'Drag & Drop or Click to upload CV'}
                              </span>
                              <span className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {signupError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 bg-red-50/50 p-3 rounded-xl border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{signupError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full text-base font-semibold text-white bg-slate-900 hover:bg-indigo-600 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {signupLoading ? 'Creating Account...' : (role === 'client' ? 'Sign Up as Client' : 'Submit Registration Pipeline')}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                Already have an account? <span onClick={() => setCurrentPage('login')} className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Log in</span>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'login' && (
          <motion.main
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to home
              </button>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                {isLogin2FaRequired ? 'Two-Factor Verification' : 'Welcome back'}
              </h1>
              <p className="text-slate-600 mb-8 text-sm">
                {isLogin2FaRequired
                  ? 'Enter the 6-digit verification code from your authenticator app.'
                  : 'Log in to TaskLink to continue.'}
              </p>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                {!isLogin2FaRequired ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="user@example.com"
                        className={`w-full px-4 py-3 bg-white/70 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400 ${loginError ? 'border-red-300 focus:ring-red-500/50' : 'border-white/50 focus:ring-indigo-500/50'
                          }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <span onClick={() => setCurrentPage('forgotPassword')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">Forgot password?</span>
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 bg-white/70 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400 ${loginError ? 'border-red-300 focus:ring-red-500/50' : 'border-white/50 focus:ring-indigo-500/50'
                          }`}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-900 font-semibold">Protected Account</p>
                        <p className="text-xs text-indigo-700">Verification required for {loginEmail}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-center">
                        6-Digit Authenticator Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={login2FaCode}
                        onChange={(e) => {
                          setLogin2FaCode(e.target.value.replace(/\D/g, ''));
                          setLoginError(null);
                        }}
                        placeholder="000000"
                        className={`w-full px-4 py-3.5 bg-white border rounded-2xl focus:outline-none focus:ring-2 text-slate-900 text-center tracking-[0.5em] font-mono text-xl shadow-inner transition-all ${loginError ? 'border-red-300 focus:ring-red-500/50' : 'border-slate-200 focus:ring-indigo-500/50'
                          }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin2FaRequired(false);
                        setLogin2FaCode('');
                        setLoginError(null);
                      }}
                      className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ← Back to email & password
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 bg-red-50/50 p-3 rounded-xl border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{loginError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLogin2FaRequired && login2FaCode.length !== 6}
                    className="w-full text-base font-semibold text-white bg-slate-900 hover:bg-indigo-600 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isLogin2FaRequired ? 'Verify & Continue' : 'Log In'}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                Don't have an account? <span onClick={() => setCurrentPage('signup')} className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Sign up</span>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'forgotPassword' && (
          <motion.main
            key="forgotPassword"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to login
              </button>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Reset password</h1>
              <p className="text-slate-600 mb-8 text-sm">Enter your email address and we'll send you a link to reset your password.</p>

              <form className="space-y-5" onSubmit={handleResetSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetStatus('idle');
                    }}
                    className={`w-full px-4 py-3 bg-white/70 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white text-slate-900 shadow-sm transition-all placeholder:text-slate-400 ${resetStatus === 'error'
                        ? 'border-red-300 focus:ring-red-500/50'
                        : resetStatus === 'success'
                          ? 'border-emerald-300 focus:ring-emerald-500/50'
                          : 'border-white/50 focus:ring-indigo-500/50'
                      }`}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {resetStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Check your mail for the reset link!</span>
                    </motion.div>
                  )}
                  {resetStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 bg-red-50/50 p-3 rounded-xl border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>No such email found. Please try again.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <button type="submit" className="w-full text-base font-semibold text-white bg-slate-900 hover:bg-indigo-600 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl shadow-indigo-500/20 active:scale-[0.98]">
                    Send Reset Link
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                Remember your password? <span onClick={() => setCurrentPage('login')} className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Log in</span>
              </div>
            </GlassCard>
          </motion.main>
        )}
        {currentPage === 'customerDashboard' && (
          <motion.main
            key="customerDashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 min-h-screen"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 flex flex-col gap-8">
                {/* Greeting & Quick Stats */}
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back, {profileData.firstName}! 👋</h1>
                    <p className="text-slate-600">Here's what's happening with your tasks today.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassCard className="p-5 flex flex-col pt-6 pb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-1">{customerActiveCount}</h3>
                      <p className="text-sm font-medium text-slate-500">Active tasks</p>
                    </GlassCard>
                    <GlassCard className="p-5 flex flex-col pt-6 pb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-1">{customerCompletedCount}</h3>
                      <p className="text-sm font-medium text-slate-500">Completed tasks</p>
                    </GlassCard>
                    <GlassCard
                      onClick={() => setIsPostTaskOptionsOpen(true)}
                      className="p-5 flex flex-col pt-6 pb-6 cursor-pointer hover:bg-white/60 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-3 text-indigo-600 group-hover:scale-110 transition-transform">
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">New Task</h3>
                      <p className="text-sm font-medium text-slate-500">Post a new job</p>
                    </GlassCard>
                  </div>
                </div>

                {/* Main Activity Area */}
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <GlassCard className="p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                        {customerTasks.length} Total
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      {customerTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200/60 rounded-2xl">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-5 h-5 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 mb-1">No active tasks</h3>
                          <p className="text-xs text-slate-500 mb-4 max-w-[200px]">You don't have any ongoing tasks at the moment.</p>
                          <button onClick={() => setIsPostTaskOptionsOpen(true)} className="text-xs font-semibold text-white bg-slate-900 py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                            Post your first task
                          </button>
                        </div>
                      ) : (
                        customerTasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              setTrackingTask({
                                id: 'TASK-' + task.id,
                                rawId: task.id,
                                title: task.title,
                                provider: task.provider,
                                review: task.review,
                                status: task.status === 'completed' ? 'Completed' : task.status === 'in_review' ? 'Quality Check Pending' : task.status === 'assigned' || task.status === 'in_progress' ? 'In Progress' : 'Booked',
                                date: task.task_date || new Date(task.created_at).toLocaleDateString(),
                              });
                              if (task.status === 'posted') setMilestoneIndex(0);
                              else if (task.status === 'assigned') setMilestoneIndex(1);
                              else if (task.status === 'in_progress') setMilestoneIndex(3);
                              else if (task.status === 'in_review') setMilestoneIndex(4);
                              else if (task.status === 'completed') setMilestoneIndex(5);
                              setCurrentPage('taskTracking');
                            }}
                            className="p-3.5 bg-white/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow group flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : task.status === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : task.status === 'in_progress'
                                      ? 'bg-indigo-100 text-indigo-700'
                                      : 'bg-blue-100 text-blue-700'
                                }`}>
                                {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : task.status === 'cancelled' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                  <span className="capitalize font-medium text-slate-600">{task.category}</span>
                                  <span>•</span>
                                  <span>{task.location || 'Colombo'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-slate-900">LKR {parseFloat(task.budget).toLocaleString()}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : task.status === 'cancelled'
                                    ? 'bg-red-50 text-red-700 border border-red-200/60'
                                    : task.status === 'in_progress'
                                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>

                  {/* Recommended Providers */}
                  <GlassCard className="p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-slate-900">Top Providers</h2>
                      <button onClick={() => setCurrentPage('directHireList')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">Browse all</button>
                    </div>

                    <div className="flex flex-col gap-3 flex-1 justify-center">
                      {topProvidersList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200/60 rounded-2xl">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                            <Users className="w-5 h-5" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 mb-1">No providers registered yet</h3>
                          <p className="text-xs text-slate-500 mb-4 max-w-[200px]">New service professionals will appear here once they register in the system.</p>
                          <button onClick={() => setCurrentPage('signup')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 py-2 px-4 rounded-xl border border-indigo-100 transition-colors cursor-pointer">
                            Register as Provider
                          </button>
                        </div>
                      ) : (
                        topProvidersList.map((provider) => (
                          <div
                            key={provider.id}
                            onClick={() => {
                              setSelectedProviderForHire({
                                id: provider.id,
                                name: provider.name,
                                skill: provider.skill,
                                rating: provider.rating,
                                reviews: provider.reviews || 0,
                                hourlyRate: 1500,
                                experience: provider.experience || 1,
                                jobs: 0,
                                avatar: provider.avatar,
                                distance: '2.5 km away',
                                neighborhood: provider.location || 'Colombo',
                                availableNow: true,
                                snippet: provider.skill,
                              });
                              setCurrentPage('directHireBooking');
                            }}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/80 transition-all cursor-pointer border border-transparent hover:border-indigo-100 group shadow-sm bg-white/40"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white shadow-xs">
                                <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{provider.name}</h4>
                                <p className="text-xs text-slate-500">{provider.skill}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-700 px-2 py-1 rounded-lg text-xs font-semibold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {provider.rating}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'providerDashboard' && (
          <motion.main
            key="providerDashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 min-h-screen"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Header spans all 3 columns */}
              <div className="lg:col-span-3">
                <div className="mb-4 text-center lg:text-left">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back, {profileData.firstName}! 👋</h1>
                  <p className="text-slate-600">Here's your provider overview for today.</p>
                </div>
              </div>

              {/* Quick Stats span all 3 columns */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <GlassCard className="p-5 flex flex-col pt-6 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{providerDashboardData.stats.active_jobs_count}</h3>
                    <p className="text-sm font-medium text-slate-500">Active Jobs</p>
                  </GlassCard>
                  <GlassCard className="p-5 flex flex-col pt-6 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">LKR {providerDashboardData.stats.earnings_this_week.toLocaleString()}</h3>
                    <p className="text-sm font-medium text-slate-500">Earned this week</p>
                  </GlassCard>
                  <GlassCard className="p-5 flex flex-col pt-6 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3 text-amber-600">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{providerDashboardData.stats.average_rating}</h3>
                    <p className="text-sm font-medium text-slate-500">Average Rating</p>
                  </GlassCard>
                </div>
              </div>

              {/* Main Content Area spans 2 columns */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Main Activity Area */}
                <div className="grid md:grid-cols-2 gap-8 h-full">
                  {/* Available Tasks */}
                  <GlassCard className="p-6 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <h2 className="text-lg font-bold text-slate-900">Available Tasks Near You</h2>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Find work</button>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 pr-2 pb-2 -mr-2">
                      {providerJobFeed.length === 0 ? (
                        <div className="text-center text-slate-500 py-8 text-sm">No tasks currently available in your area.</div>
                      ) : (
                        providerJobFeed.map(job => (
                          <div key={job.id} className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-indigo-700 text-lg">LKR {job.budget.toLocaleString()}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mt-1 ${job.isNegotiable ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {job.isNegotiable ? 'Negotiable' : 'Fixed'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{job.category}</span>
                              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <MapPin className="w-3.5 h-3.5" /> {job.distance} ({job.neighborhood})
                              </div>
                            </div>

                            <p className="text-sm text-slate-600 mb-3 line-clamp-3">{job.description}</p>

                            {job.voiceNote && (
                              <div className="mb-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <Mic className="w-4 h-4 text-indigo-600" />
                                  <span className="text-xs font-semibold text-indigo-900">Voice Note Transcription</span>
                                </div>
                                <p className="text-xs text-indigo-800 italic">"{job.voiceNote}"</p>
                              </div>
                            )}

                            {job.photos && job.photos.length > 0 && (
                              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                {job.photos.map((photo, index) => (
                                  <div key={index} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                                    <img src={photo} alt="Task thumbnail" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                              <button
                                onClick={() => handleDeclineTask(job.id)}
                                className="py-2.5 px-4 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptTask(job.id)}
                                className="py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all"
                              >
                                Accept Job
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>

                  {/* Active Jobs */}
                  <GlassCard className="p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-slate-900">Your Active Jobs</h2>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Manage</button>
                    </div>

                    <div className="flex flex-col gap-4 flex-1 justify-start overflow-y-auto">
                      {providerDashboardData.active_jobs.length === 0 ? (
                        <div className="text-center text-slate-500 py-8 text-sm">No active jobs. Accept a task to get started!</div>
                      ) : (
                        providerDashboardData.active_jobs.map((job: any) => (
                          <div
                            key={job.id}
                            onClick={() => {
                              setActiveWorkspaceJob({
                                ...job,
                                customerName: job.customer?.name || 'Customer',
                                customerPhone: job.customer?.phone || '+94 77 123 4567',
                                exactAddress: job.location || 'Colombo',
                              });
                              setProviderMilestoneIndex(job.status === 'completed' ? 5 : 3);
                              setCurrentPage('providerActiveWorkspace');
                            }}
                            className={`flex flex-col p-4 rounded-2xl transition-colors cursor-pointer hover:shadow-md ${job.status === 'in_progress' ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                            </div>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                {job.status === 'in_progress' ? <Clock className="w-3 h-3 text-indigo-500" /> : <CheckCircle2 className="w-3 h-3 text-slate-500" />}
                                <span>{job.status === 'in_progress' ? 'In Progress' : 'Assigned (Click to Open)'}</span>
                              </div>
                              <span className="text-xs font-semibold text-indigo-600">LKR {job.budget.toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* Sidebar spans 1 column */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                <GlassCard className="p-6 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Upcoming Schedule</h3>
                  <div className="flex flex-col gap-3">
                    {providerDashboardData.upcoming_schedule.length === 0 ? (
                      <div className="text-center text-slate-500 py-4 text-sm">No scheduled tasks.</div>
                    ) : (
                      providerDashboardData.upcoming_schedule.map((job: any) => {
                        const dateObj = new Date(job.date);
                        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                        const day = dateObj.getDate();
                        return (
                          <div key={job.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col items-center justify-center p-2 bg-indigo-100 text-indigo-700 rounded-lg min-w-[3rem]">
                              <span className="text-xs font-bold">{month}</span>
                              <span className="text-lg font-black leading-none">{day}</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {job.time}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </GlassCard>

                <GlassCard className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-slate-100 flex-1 flex flex-col justify-end">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Provider Tips</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">Respond to new task requests within 1 hour to increase your acceptance rate by 3x.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'userProfile' && (
          <motion.main
            key="userProfile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={navigateToDashboard}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to dashboard
                </button>
                <button
                  onClick={handleSaveProfile}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${isEditingProfile
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="w-4 h-4" /> Save Profile
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    onClick={() => {
                      if (isEditingProfile && profileAvatarInputRef.current) {
                        profileAvatarInputRef.current.click();
                      }
                    }}
                    className={`w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden group transition-all ${isEditingProfile ? 'cursor-pointer ring-4 ring-indigo-500/20 hover:ring-indigo-500/40 hover:scale-105' : ''
                      }`}
                  >
                    {profileAvatarPreview || profileData.avatar ? (
                      <img
                        src={profileAvatarPreview || profileData.avatar}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-600 font-bold text-4xl">{profileData.firstName[0] || 'A'}</span>
                    )}
                    {isEditingProfile && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <UploadCloud className="w-6 h-6 text-white mb-0.5" />
                        <span className="text-[10px] text-white font-bold tracking-tight">Upload</span>
                      </div>
                    )}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={profileAvatarInputRef}
                    onChange={handleProfileAvatarChange}
                    accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                    className="hidden"
                  />
                  {isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => profileAvatarInputRef.current?.click()}
                      className="mt-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {profileData.avatar ? 'Change Avatar' : 'Upload Avatar'}
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all font-medium"
                        />
                      ) : (
                        <p className="px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-xl text-slate-900 font-medium h-11 flex items-center">
                          {profileData.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all font-medium"
                        />
                      ) : (
                        <p className="px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-xl text-slate-900 font-medium h-11 flex items-center">
                          {profileData.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm"
                        />
                      ) : (
                        <p className="px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-xl text-slate-600 text-sm flex items-center h-11">
                          {profileData.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm"
                        />
                      ) : (
                        <p className="px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-xl text-slate-600 text-sm flex items-center h-11">
                          {profileData.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                      <div className="relative">
                        {!isEditingProfile && <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />}
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={profileData.dob}
                            onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm text-[15px]"
                          />
                        ) : (
                          <p className="pl-9 pr-4 py-2 text-slate-600 text-sm flex items-center h-11 bg-slate-50/50 border border-transparent rounded-xl">
                            {profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                      <div className="relative">
                        {!isEditingProfile && <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />}
                        {isEditingProfile ? (
                          <input
                            type="text"
                            placeholder="City, Country"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm"
                          />
                        ) : (
                          <p className={`pl-9 pr-4 py-2 text-sm flex items-center h-11 bg-slate-50/50 border border-transparent rounded-xl ${profileData.location ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                            {profileData.location || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                    {isEditingProfile ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm resize-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-slate-50/50 border border-transparent rounded-xl text-slate-600 text-sm leading-relaxed min-h-[100px]">
                        {profileData.bio || 'No bio provided yet.'}
                      </p>
                    )}
                  </div>

                  {currentUserRole === 'provider' && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Hourly Rate (LKR)</label>
                      {isEditingProfile ? (
                        <input
                          type="number"
                          value={profileData.hourlyRate}
                          onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 transition-all text-sm"
                        />
                      ) : (
                        <p className="px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-xl text-slate-600 text-sm flex items-center h-11">
                          LKR {profileData.hourlyRate || 1500}/hr
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'settings' && (
          <motion.main
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={navigateToDashboard}
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                </div>
              </div>

              <div className="space-y-8">
                {/* 2FA Section */}
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Security</h2>
                  <div className="bg-white/60 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="mt-1 sm:mt-0 p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          Two-Factor Authentication (2FA)
                          {is2FAActive && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">Active</span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => is2FAActive ? setIsDisable2FAModalOpen(true) : handleOpen2FASetup()}
                      className={`whitespace-nowrap px-4 py-2 ${is2FAActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
                        } text-sm font-medium rounded-xl transition-all self-start sm:self-auto cursor-pointer`}
                    >
                      {is2FAActive ? 'Disable' : 'Set up 2FA'}
                    </button>
                  </div>
                </div>

                {/* Email Section */}
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Contact Methods</h2>
                  <div className="bg-white/60 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start sm:items-center gap-4 mb-5">
                      <div className="mt-1 sm:mt-0 p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Email Address</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-600">{settingsEmail}</p>
                          {isEmailVerified ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">Verified</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide">Unverified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          placeholder="New email address"
                          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 text-sm font-medium"
                        />
                        <button
                          onClick={() => {
                            if (newEmailInput) {
                              setSettingsEmail(newEmailInput);
                              setIsEmailVerified(false);
                              setEmailUpdateMessage('Check email with verification link');
                              setNewEmailInput('');
                            }
                          }}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shrink-0"
                        >
                          Update Email
                        </button>
                      </div>
                      {emailUpdateMessage && (
                        <p className="text-sm text-indigo-600 mt-3 font-medium bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          {emailUpdateMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                {['client', 'provider'].includes(currentUserRole || '') && (
                  <div className="pt-4">
                    <h2 className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wider">Danger Zone</h2>
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="mt-1 sm:mt-0 p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-900">Deactivate Account</h3>
                          <p className="text-sm text-red-700/80 mt-1">Once you deactivate your account, there is no going back.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDeactivateModalOpen(true)}
                        className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm self-start sm:self-auto"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Modals */}
            <AnimatePresence>
              {is2FASetupModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Set Up 2FA</h3>
                            <p className="text-xs text-slate-500">Authenticator App (TOTP)</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIs2FASetupModalOpen(false);
                            setTwoFaSetupStatus('idle');
                            setTwoFaErrorMessage('');
                          }}
                          className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mode Tabs: QR vs Key */}
                      <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
                        <button
                          type="button"
                          onClick={() => setTwoFaTab('qr')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${twoFaTab === 'qr'
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Scan QR Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setTwoFaTab('key')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${twoFaTab === 'key'
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <Key className="w-3.5 h-3.5" />
                          Manual Key
                        </button>
                      </div>

                      <div className="flex flex-col items-center">
                        {twoFaTab === 'qr' ? (
                          <div className="w-full flex flex-col items-center">
                            <div className="w-48 h-48 bg-white border-2 border-indigo-100 rounded-2xl mb-3 flex items-center justify-center p-3 shadow-inner relative group">
                              <img
                                src={twoFaQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`otpauth://totp/TaskLink:${profileData.email || 'user@tasklink.com'}?secret=${twoFaSecret}&issuer=TaskLink`)}`}
                                alt="2FA QR Code"
                                className="w-full h-full object-contain filter contrast-125"
                              />
                            </div>
                            <div className="flex items-center justify-between w-full px-2 mb-4">
                              <span className="text-[11px] text-slate-500">Scan with Google Authenticator or Authy</span>
                              <button
                                type="button"
                                onClick={fetchTwoFactorSetup}
                                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" /> Refresh
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full mb-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                              Setup Key (Base32)
                            </label>
                            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-3">
                              <span className="font-mono text-sm font-bold text-slate-800 tracking-wider select-all">
                                {twoFaFormattedSecret || twoFaSecret}
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyKey}
                                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${isCopiedKey
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                                  }`}
                              >
                                {isCopiedKey ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-white/60 p-2.5 rounded-lg border border-slate-100">
                              <div><span className="font-medium text-slate-700">Account:</span> {profileData.email || 'User'}</div>
                              <div><span className="font-medium text-slate-700">Type:</span> Time-based</div>
                            </div>
                          </div>
                        )}

                        <div className="w-full space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 text-center">
                              Enter 6-digit Code from Authenticator
                            </label>
                            <input
                              type="text"
                              maxLength={6}
                              value={twoFaCode}
                              onChange={(e) => {
                                setTwoFaCode(e.target.value.replace(/\D/g, ''));
                                setTwoFaSetupStatus('idle');
                                setTwoFaErrorMessage('');
                              }}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 text-center tracking-[0.5em] font-mono text-xl shadow-inner transition-all"
                              placeholder="000000"
                            />
                          </div>

                          {twoFaErrorMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100"
                            >
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>{twoFaErrorMessage}</span>
                            </motion.div>
                          )}

                          {twoFaSetupStatus === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-bold"
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                              <span>2FA successfully activated!</span>
                            </motion.div>
                          )}

                          <button
                            type="button"
                            onClick={handleActivate2FA}
                            disabled={twoFaCode.length !== 6 || twoFaSetupStatus === 'loading' || twoFaSetupStatus === 'success'}
                            className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm
                              ${twoFaCode.length === 6 && twoFaSetupStatus !== 'success'
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer active:scale-[0.99]'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                          >
                            {twoFaSetupStatus === 'loading' ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : twoFaSetupStatus === 'success' ? (
                              'Activated!'
                            ) : (
                              'Activate 2FA'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Disable 2FA Modal */}
              {isDisable2FAModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Disable 2FA?</h3>
                    <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
                      Disabling two-factor authentication removes the extra security layer from your account.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsDisable2FAModalOpen(false)}
                        className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Keep 2FA
                      </button>
                      <button
                        type="button"
                        onClick={handleDisable2FA}
                        disabled={isDisabling2FA}
                        className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {isDisabling2FA ? 'Disabling...' : 'Yes, Disable'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isDeactivateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100"
                  >
                    <div className="p-6 md:p-8">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                        Deactivate Account?
                      </h3>

                      <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                        Are you absolutely sure you want to deactivate your account? This action cannot be undone. All your data, tasks, and history will be permanently deleted across all databases.
                      </p>

                      {deactivateError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{deactivateError}</span>
                        </div>
                      )}

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                          <input
                            type="password"
                            value={deactivatePassword}
                            onChange={(e) => {
                              setDeactivatePassword(e.target.value);
                              setDeactivateError(null);
                            }}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-slate-900 transition-all font-sans"
                            placeholder="••••••••"
                          />
                        </div>
                        {is2FAActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="relative"
                          >
                            <label className="block text-sm font-semibold text-slate-700 mb-2">2FA Code</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={deactivate2FaCode}
                              onChange={(e) => setDeactivate2FaCode(e.target.value.replace(/\D/g, ''))}
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-slate-900 tracking-[0.3em] font-mono transition-all text-center text-lg"
                              placeholder="000000"
                            />
                          </motion.div>
                        )}

                        <div className="flex flex-col gap-3 pt-4">
                          <button
                            onClick={handleDeactivateAccount}
                            disabled={!deactivatePassword || isDeactivating || (is2FAActive && deactivate2FaCode.length !== 6)}
                            className={`w-full py-3.5 font-semibold rounded-xl text-white transition-all shadow-sm ${deactivatePassword && !isDeactivating && (!is2FAActive || deactivate2FaCode.length === 6)
                                ? 'bg-red-600 hover:bg-red-700 hover:shadow-md cursor-pointer'
                                : 'bg-red-300 cursor-not-allowed'
                              }`}
                          >
                            {isDeactivating ? 'Deleting Account...' : 'Yes, delete my account permanently'}
                          </button>
                          <button
                            onClick={() => {
                              setIsDeactivateModalOpen(false);
                              setDeactivateError(null);
                              setDeactivatePassword('');
                            }}
                            className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.main>
        )}

        {currentPage === 'postTask' && (
          <motion.main
            key="postTask"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage('customerDashboard')}
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">Post a New Task</h1>
                </div>
              </div>

              <div className="space-y-8">
                {/* Task Details */}
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">What do you need help with?</h2>
                  <div className="grid gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="e.g. Clean my 2-bedroom apartment"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                        <select
                          value={taskCategory}
                          onChange={(e) => setTaskCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all appearance-none"
                        >
                          <option value="cleaning">Cleaning</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="electrical">Electrical</option>
                          <option value="moving">Moving & Packing</option>
                          <option value="gardening">Gardening</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <GoogleLocationPicker
                          value={taskLocation}
                          onChange={(loc) => {
                            setTaskLocation(loc.address);
                            setTaskLatitude(loc.lat);
                            setTaskLongitude(loc.lng);
                          }}
                          label="Task Location / Service Address"
                          placeholder="Search Sri Lankan city or address (e.g. Colombo 03, Kandy, Galle)..."
                          showMapPreview={true}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => setIsVoiceMode(false)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${!isVoiceMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Type className="w-3.5 h-3.5" /> Text
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsVoiceMode(true)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${isVoiceMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Mic className="w-3.5 h-3.5" /> Voice
                          </button>
                        </div>
                      </div>

                      {isVoiceMode ? (
                        <div className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isRecording ? 'border-red-400 bg-red-50/40 shadow-xs' : 'border-slate-200 bg-slate-50'}`}>
                          {isRecording ? (
                            <>
                              <div className="relative mb-3">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                                  <motion.div animate={{ scale: [1, 1.22, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                                    <Mic className="w-8 h-8 text-red-500" />
                                  </motion.div>
                                </div>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                              </div>

                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <h3 className="text-base font-bold text-slate-900">Recording & Transcribing...</h3>
                              </div>

                              <p className="text-xs font-mono font-bold text-red-600 mb-3 bg-red-100/80 px-2.5 py-0.5 rounded-md">
                                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                              </p>

                              {/* Live Audio Waveform */}
                              <div className="flex items-center gap-1 mb-4 h-5">
                                {[40, 80, 100, 60, 90, 50, 85, 45].map((height, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 bg-red-400 rounded-full"
                                    animate={{ height: [`${Math.max(15, height * 0.25)}%`, `${height}%`, `${Math.max(15, height * 0.25)}%`] }}
                                    transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.15, ease: 'easeInOut' }}
                                  />
                                ))}
                              </div>

                              {/* Live Transcription Bubble */}
                              <div className="w-full max-w-md p-4 bg-white/95 rounded-xl border border-red-200/80 shadow-xs min-h-[72px] flex items-center justify-center text-center mb-5">
                                {liveTranscript ? (
                                  <p className="text-sm font-medium text-slate-800 italic leading-relaxed animate-fade-in">
                                    "{liveTranscript}"
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                                    Listening... Speak clearly into your microphone
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                                >
                                  <Square className="w-4 h-4 fill-current" /> Stop & Apply Text
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                                <Mic className="w-8 h-8" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">Describe your task naturally</h3>
                              <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
                                Tap record and tell us what you need. Real-time voice-to-text will transcribe and convert your spoken requirements into text.
                              </p>
                              <button
                                type="button"
                                onClick={startRecording}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                              >
                                <Mic className="w-4 h-4" /> Start Voice Recording
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <textarea
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          rows={4}
                          placeholder="Describe what exactly needs to be done, any specific requirements, or things the provider should bring..."
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all resize-none"
                        />
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Task Photos <span className="text-slate-400 font-normal">(Optional, up to 5)</span>
                      </label>

                      <div className="flex flex-wrap gap-4">
                        {taskPhotos.map((photo, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                            <img src={photo} alt={`Task ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {taskPhotos.length < 5 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-semibold text-center leading-tight">Add<br />Photo</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mt-4 mb-4">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">When do you need it?</h2>
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/80 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Min. 1 hr advance notice
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <span className="text-[11px] text-slate-500 font-medium">Today or future</span>
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          min={getTodayDateString()}
                          value={taskDate}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setTaskDate(selected);
                            const todayStr = getTodayDateString();
                            if (selected === todayStr) {
                              const minTime = getMinTimeForToday();
                              if (minTime && (!taskTime || taskTime < minTime)) {
                                setTaskTime(minTime);
                              }
                            }
                          }}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Time</label>
                        {taskDate === getTodayDateString() && (
                          <span className="text-[11px] text-amber-600 font-semibold">
                            {getMinTimeForToday() ? `At least 1 hr after now (${getMinTimeForToday()}+)` : 'Pick tomorrow'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="time"
                          min={taskDate === getTodayDateString() ? (getMinTimeForToday() || '23:59') : undefined}
                          value={taskTime}
                          onChange={(e) => {
                            const newTime = e.target.value;
                            setTaskTime(newTime);
                            const todayStr = getTodayDateString();
                            if (taskDate === todayStr) {
                              const minTime = getMinTimeForToday();
                              if (minTime && newTime < minTime) {
                                showToast('Notice Window', `For today, bookings must be at least 1 hour in advance (after ${minTime}).`, 'warning');
                              }
                            }
                          }}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                        />
                      </div>
                      {taskDate === getTodayDateString() && getMinTimeForToday() && (
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                          Earliest booking time today: <strong className="text-slate-700">{getMinTimeForToday()}</strong> (1 hr preparation window)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-2 border-t border-slate-200">
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider mt-4">Budget & Payment</h2>
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="flex-1 w-full relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Offered Amount (LKR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 font-semibold text-slate-400">LKR</span>
                        <input
                          type="number"
                          value={taskBudget}
                          onChange={(e) => setTaskBudget(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="100"
                          className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:pt-6">
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only group"
                            checked={isNegotiable}
                            onChange={(e) => setIsNegotiable(e.target.checked)}
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${isNegotiable ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isNegotiable ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Price is negotiable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pre-Booking Fee Summary */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><AlertCircle className="w-5 h-5 text-indigo-600" /></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-indigo-900 mb-1">Pre-booking Authorization</h4>
                      <p className="text-xs text-indigo-700 mb-3">
                        A fully refundable authorization hold of LKR 100 is required to broadcast this task publicly. This hold verifies your intent and is released once you hire a provider or cancel the request.
                      </p>
                      <div className="flex items-center justify-between py-2 border-t border-indigo-200/50 font-medium text-sm">
                        <span className="text-indigo-900">Task Posting Hold:</span>
                        <span className="text-indigo-900 font-bold">LKR 100.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => setCurrentPage('customerDashboard')}
                    className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!taskTitle.trim()) {
                        showToast('Missing Title', 'Please provide a title for your task.', 'warning');
                        return;
                      }
                      if (!taskLocation.trim()) {
                        showToast('Missing Location', 'Please provide a location for your task.', 'warning');
                        return;
                      }
                      const schedCheck = validateTaskSchedule(taskDate, taskTime);
                      if (!schedCheck.isValid) {
                        showToast('Invalid Schedule', schedCheck.message || 'Please check date and time.', 'warning');
                        return;
                      }
                      setPaymentContext({ type: 'broadcast' });
                      setCurrentPage('paymentGateway');
                    }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Publish Task
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'directHireList' && (
          <motion.main
            key="directHireList"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full min-h-screen"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage('customerDashboard')}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Direct Hire</h1>
              </div>
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold text-slate-900">{filteredProviders.length} Providers Found</h2>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Search & Filter Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <GlassCard className="p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-600" />
                    Find Providers
                  </h2>

                  <div className="space-y-6">
                    {/* Skill Category */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Skill Category</label>
                      <select
                        value={dhCategory}
                        onChange={(e) => setDhCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 text-sm"
                      >
                        <option value="all">Every Category</option>
                        <option value="electrician">Electricians</option>
                        <option value="plumber">Plumbers</option>
                        <option value="painter">Painters</option>
                        <option value="mason">Masons</option>
                        <option value="carpenter">Carpenters</option>
                        <option value="cleaner">Cleaners</option>
                      </select>
                    </div>

                    {/* Location Range */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Distance Range: {dhLocationRadius} km
                      </label>
                      <input
                        type="range"
                        min="1" max="50"
                        value={dhLocationRadius}
                        onChange={(e) => setDhLocationRadius(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>1 km</span>
                        <span>50 km</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Rating</label>
                      <div className="flex items-center gap-2">
                        {[0, 4, 4.5, 4.8].map(rating => (
                          <button
                            key={rating}
                            onClick={() => setDhMinRating(rating)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${dhMinRating === rating ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'}`}
                          >
                            {rating === 0 ? 'Any' : `${rating}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
                      <select
                        value={dhMinExperience}
                        onChange={(e) => setDhMinExperience(parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 text-sm"
                      >
                        <option value={0}>Any Experience</option>
                        <option value={1}>1+ Years</option>
                        <option value={5}>5+ Years</option>
                        <option value={10}>10+ Years</option>
                      </select>
                    </div>

                    {/* Availability */}
                    <div className="pt-4 border-t border-slate-100">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-semibold text-slate-700">Available Now Only</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={dhAvailableOnly}
                            onChange={(e) => setDhAvailableOnly(e.target.checked)}
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${dhAvailableOnly ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${dhAvailableOnly ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Results Grid */}
              <div className="flex-1">
                <div className="mb-6 lg:hidden">
                  <h2 className="text-xl font-bold text-slate-900">{filteredProviders.length} Providers Found</h2>
                </div>

                {filteredProviders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl min-h-[350px]">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-500">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Providers Registered Yet</h3>
                    <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                      There are currently 0 verified service providers in the database. Service professionals will appear here once they complete their registration and onboarding.
                    </p>
                    <button onClick={() => setCurrentPage('signup')} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm">
                      Sign up as a Provider
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProviders.map(provider => (
                      <GlassCard key={provider.id} className="p-0 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-indigo-50 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
                              </div>
                              {provider.availableNow && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>

                            <div className="bg-amber-100/80 backdrop-blur-sm text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {provider.rating}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{provider.name}</h3>
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">
                              {provider.skill}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                            "{provider.snippet || provider.skill}"
                          </p>

                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-auto pt-4 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              {provider.jobs || 0} Jobs
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {provider.experience || 1} Yrs Exp
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 font-medium">Hourly Rate</span>
                            <p className="text-base font-bold text-slate-900">LKR {provider.hourlyRate || 1500}/hr</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProviderForHire(provider);
                              setCurrentPage('directHireBooking');
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                          >
                            Hire Now
                          </button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'directHireBooking' && selectedProviderForHire && (
          <motion.main
            key="directHireBooking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage('directHireList')}
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">Booking {selectedProviderForHire.name.split(' ')[0]}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="block text-xs font-bold text-slate-900">{selectedProviderForHire.skill}</span>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-current" /> {selectedProviderForHire.rating}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                    <img src={selectedProviderForHire.avatar} alt={selectedProviderForHire.name} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Task Details */}
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">What do you need help with?</h2>
                  <div className="grid gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder={`e.g. Need help with ${selectedProviderForHire.skill.toLowerCase()}`}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                      />
                    </div>

                    <div>
                      <GoogleLocationPicker
                        value={taskLocation}
                        onChange={(loc) => {
                          setTaskLocation(loc.address);
                          setTaskLatitude(loc.lat);
                          setTaskLongitude(loc.lng);
                        }}
                        label="Location / Job Address"
                        placeholder="Search Sri Lankan city or address (e.g. Colombo 03, Kandy, Galle)..."
                        showMapPreview={true}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => setIsVoiceMode(false)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${!isVoiceMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Type className="w-3.5 h-3.5" /> Text
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsVoiceMode(true)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${isVoiceMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Mic className="w-3.5 h-3.5" /> Voice
                          </button>
                        </div>
                      </div>

                      {isVoiceMode ? (
                        <div className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isRecording ? 'border-red-400 bg-red-50/40 shadow-xs' : 'border-slate-200 bg-slate-50'}`}>
                          {isRecording ? (
                            <>
                              <div className="relative mb-3">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                                  <motion.div animate={{ scale: [1, 1.22, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                                    <Mic className="w-8 h-8 text-red-500" />
                                  </motion.div>
                                </div>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                              </div>

                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <h3 className="text-base font-bold text-slate-900">Recording & Transcribing...</h3>
                              </div>

                              <p className="text-xs font-mono font-bold text-red-600 mb-3 bg-red-100/80 px-2.5 py-0.5 rounded-md">
                                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                              </p>

                              {/* Live Audio Waveform */}
                              <div className="flex items-center gap-1 mb-4 h-5">
                                {[40, 80, 100, 60, 90, 50, 85, 45].map((height, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 bg-red-400 rounded-full"
                                    animate={{ height: [`${Math.max(15, height * 0.25)}%`, `${height}%`, `${Math.max(15, height * 0.25)}%`] }}
                                    transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.15, ease: 'easeInOut' }}
                                  />
                                ))}
                              </div>

                              {/* Live Transcription Bubble */}
                              <div className="w-full max-w-md p-4 bg-white/95 rounded-xl border border-red-200/80 shadow-xs min-h-[72px] flex items-center justify-center text-center mb-5">
                                {liveTranscript ? (
                                  <p className="text-sm font-medium text-slate-800 italic leading-relaxed animate-fade-in">
                                    "{liveTranscript}"
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                                    Listening... Speak clearly into your microphone
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                                >
                                  <Square className="w-4 h-4 fill-current" /> Stop & Apply Text
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                                <Mic className="w-8 h-8" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">Describe your task naturally</h3>
                              <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
                                Tap record and tell us what you need. Real-time voice-to-text will transcribe and convert your spoken requirements into text.
                              </p>
                              <button
                                type="button"
                                onClick={startRecording}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                              >
                                <Mic className="w-4 h-4" /> Start Voice Recording
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <textarea
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          rows={4}
                          placeholder="Describe exactly what needs to be done..."
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all resize-none"
                        />
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Task Photos <span className="text-slate-400 font-normal">(Optional, up to 5)</span>
                      </label>

                      <div className="flex flex-wrap gap-4">
                        {taskPhotos.map((photo, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                            <img src={photo} alt={`Task ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {taskPhotos.length < 5 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-semibold text-center leading-tight">Add<br />Photo</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mt-4 mb-4">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">When do you need it?</h2>
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/80 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Min. 1 hr advance notice
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <span className="text-[11px] text-slate-500 font-medium">Today or future</span>
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          min={getTodayDateString()}
                          value={taskDate}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setTaskDate(selected);
                            const todayStr = getTodayDateString();
                            if (selected === todayStr) {
                              const minTime = getMinTimeForToday();
                              if (minTime && (!taskTime || taskTime < minTime)) {
                                setTaskTime(minTime);
                              }
                            }
                          }}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">Time</label>
                        {taskDate === getTodayDateString() && (
                          <span className="text-[11px] text-amber-600 font-semibold">
                            {getMinTimeForToday() ? `At least 1 hr after now (${getMinTimeForToday()}+)` : 'Pick tomorrow'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="time"
                          min={taskDate === getTodayDateString() ? (getMinTimeForToday() || '23:59') : undefined}
                          value={taskTime}
                          onChange={(e) => {
                            const newTime = e.target.value;
                            setTaskTime(newTime);
                            const todayStr = getTodayDateString();
                            if (taskDate === todayStr) {
                              const minTime = getMinTimeForToday();
                              if (minTime && newTime < minTime) {
                                showToast('Notice Window', `For today, bookings must be at least 1 hour in advance (after ${minTime}).`, 'warning');
                              }
                            }
                          }}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all"
                        />
                      </div>
                      {taskDate === getTodayDateString() && getMinTimeForToday() && (
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                          Earliest booking time today: <strong className="text-slate-700">{getMinTimeForToday()}</strong> (1 hr preparation window)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-2 border-t border-slate-200">
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider mt-4">Budget & Payment</h2>
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="flex-1 w-full relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Offered Amount (LKR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 font-semibold text-slate-400">LKR</span>
                        <input
                          type="number"
                          value={taskBudget}
                          onChange={(e) => setTaskBudget(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="100"
                          className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 font-medium transition-all text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:pt-6">
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only group"
                            checked={isNegotiable}
                            onChange={(e) => setIsNegotiable(e.target.checked)}
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${isNegotiable ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isNegotiable ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Price is negotiable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pre-Booking Fee Summary */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><AlertCircle className="w-5 h-5 text-indigo-600" /></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-indigo-900 mb-1">Pre-booking Authorization</h4>
                      <p className="text-xs text-indigo-700 mb-3">
                        A fully refundable authorization hold of LKR 100 is required to confirm this direct booking request. If {selectedProviderForHire.name.split(' ')[0]} declines, it is immediately released.
                      </p>
                      <div className="flex items-center justify-between py-2 border-t border-indigo-200/50 font-medium text-sm">
                        <span className="text-indigo-900">Booking Request Fee:</span>
                        <span className="text-indigo-900 font-bold">LKR 100.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => setCurrentPage('directHireList')}
                    className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const schedCheck = validateTaskSchedule(taskDate, taskTime);
                      if (!schedCheck.isValid) {
                        showToast('Invalid Schedule', schedCheck.message || 'Please check date and time.', 'warning');
                        return;
                      }
                      setPaymentContext({ type: 'directHire', provider: selectedProviderForHire });
                      setCurrentPage('paymentGateway');
                    }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Publish Request
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'paymentGateway' && paymentContext && (() => {
          const budgetAmount = parseFloat(taskBudget) || (paymentContext.type === 'directHire' ? (paymentContext.provider?.hourlyRate || 3500) : 3500);

          const handlePaymentSuccess = async (paymentIntentId: string) => {
            const token = localStorage.getItem('tasklink_token');
            if (token) {
              try {
                const payload: any = {
                  title: taskTitle || (paymentContext.type === 'directHire' ? `Direct Hire with ${paymentContext.provider?.name}` : 'Home Service Task'),
                  category: taskCategory || 'cleaning',
                  description: taskDescription || 'Customer requested service booking.',
                  location: taskLocation || 'Colombo',
                  latitude: taskLatitude,
                  longitude: taskLongitude,
                  task_date: taskDate || getTodayDateString(),
                  task_time: taskTime || (getMinTimeForToday() || '09:00'),
                  budget: budgetAmount,
                  is_negotiable: isNegotiable,
                  payment_intent_id: paymentIntentId,
                };

                if (paymentContext.type === 'directHire' && paymentContext.provider?.id) {
                  payload.provider_id = paymentContext.provider.id;
                }

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}`}/tasks`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                });

                if (response.ok) {
                  const data = await response.json();
                  showToast('Payment Authorized & Escrow Reserved', 'Funds safely held in escrow. Task booking confirmed!', 'success');
                  await fetchCustomerTasks();
                  setTrackingTask({
                    id: 'TASK-' + (data.task?.id || Math.floor(Math.random() * 10000)),
                    rawId: data.task?.id,
                    title: data.task?.title || payload.title,
                    provider: paymentContext.provider,
                    status: data.task?.status === 'assigned' ? 'In Progress' : 'Booked',
                    date: data.task?.task_date || new Date().toLocaleDateString(),
                  });
                  setMilestoneIndex(data.task?.status === 'assigned' ? 1 : 0);
                  setCurrentPage('taskTracking');
                  setTaskTitle('');
                  setTaskDescription('');
                  setTaskLocation('');
                  setTaskBudget('');
                  setIsNegotiable(false);
                  setTaskPhotos([]);
                  setTaskDate(getTodayDateString());
                  setTaskTime(getMinTimeForToday() || '09:00');
                } else {
                  const err = await response.json();
                  showToast('Authorization Failed', err.message || 'Task creation failed.', 'error');
                }
              } catch (err) {
                console.error('Failed to post task to database:', err);
                showToast('Connection Error', 'Failed to reach server. Please try again.', 'error');
              }
            }
          };

          return (
            <motion.main
              key="paymentGateway"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center w-full min-h-screen"
            >
              <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs mb-3 shadow-sm">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" /> Secure Escrow Payment Gateway
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Authorize Task Booking</h1>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Enter your card details below. Funds will be held securely in escrow until supervisor quality check approval.
                  </p>
                </div>

                <StripePaymentForm
                  budgetAmount={budgetAmount}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => {
                    setCurrentPage(paymentContext.type === 'directHire' ? 'directHireBooking' : 'postTask');
                  }}
                  isSubmittingTask={isSubmittingTask}
                />

                {/* Security Trust Badges */}
                <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-8">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-600" /> PCI-DSS Compliant</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-indigo-600" /> 3D Secure 2.0</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> SSL 256-Bit Encryption</span>
                </div>
              </div>
            </motion.main>
          );
        })()}

        {currentPage === 'taskTracking' && trackingTask && (
          <motion.main
            key="taskTracking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={navigateToDashboard}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                  {milestoneIndex < 3 && trackingTask.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        const rawId = trackingTask.rawId || (typeof trackingTask.id === 'string' ? parseInt(trackingTask.id.replace('TASK-', '')) : trackingTask.id);
                        if (rawId) handleCancelTask(rawId);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Task
                    </button>
                  )}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${trackingTask.status === 'cancelled'
                      ? 'bg-red-50 text-red-700'
                      : milestoneIndex === 5
                        ? 'bg-emerald-50 text-emerald-700'
                        : milestoneIndex === 4
                          ? 'bg-purple-50 text-purple-700'
                          : milestoneIndex < 3
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-indigo-50 text-indigo-700'
                    }`}>
                    <Clock className="w-4 h-4" /> {trackingTask.status === 'cancelled' ? 'Cancelled' : milestoneIndex === 5 ? 'Completed' : milestoneIndex === 4 ? 'Waiting for Supervisor Quality Inspection' : milestoneIndex < 3 ? 'Supervisor Approval Pending' : 'In Progress'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tracking Column */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard className="p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{trackingTask.title}</h1>
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-4">
                      <span>ID: {trackingTask.id}</span>
                      <span>Created: {trackingTask.date}</span>
                    </p>

                    {/* Progress Bar UI */}
                    <div className="mt-10 mb-6">
                      <h2 className="text-lg font-bold text-slate-900 mb-6">Job Flow</h2>

                      <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-200 z-0"></div>

                        <div className="space-y-8 relative z-10">
                          {[
                            { title: 'Task Booked', desc: 'Authorization and escrow reservation complete.' },
                            { title: 'Supervisor Assigned', desc: 'Field supervisor is assessing requirements before authorizing work.' },
                            { title: 'Site Visit Completed', desc: 'Supervisor has authorized work on site.' },
                            { title: 'Work In Progress', desc: 'Provider is actively executing the requested job.' },
                            { title: 'Quality Check', desc: 'Waiting for supervisor quality inspection to complete.' },
                            { title: 'Task Completed', desc: 'Supervisor sign-off complete. Escrow finalized.' },
                          ].map((milestone, idx) => {
                            const completed = milestoneIndex > idx || (milestoneIndex === 5 && idx === 5);
                            const current = milestoneIndex === idx && milestoneIndex !== 5;
                            return (
                              <div key={idx} className="flex gap-4 items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${completed ? 'bg-indigo-600 border-indigo-600' : current ? 'bg-white border-indigo-600 shadow-indigo-100' : 'bg-white border-slate-200'}`}>
                                  {completed ? (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  ) : current ? (
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                                  ) : (
                                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                  )}
                                </div>
                                <div className={`pt-2 ${completed || current ? 'opacity-100' : 'opacity-40'}`}>
                                  <h3 className={`font-bold ${current ? 'text-indigo-900 text-lg' : 'text-slate-900'}`}>{milestone.title}</h3>
                                  <p className="text-sm text-slate-500 mt-1">{milestone.desc}</p>

                                  {idx === 1 && (completed || current) && (
                                    <div className="mt-4 p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 flex items-center gap-4 max-w-sm">
                                      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                        <img src={trackingTask.provider?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=" + (trackingTask.provider?.name || 'Provider')} alt="Provider" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-indigo-600" /> {trackingTask.provider?.name || 'Assigned Provider'}</h4>
                                        <p className="text-xs text-indigo-600 font-medium pb-0.5">Service Provider</p>
                                      </div>
                                      <button className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer">
                                        <Phone className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                  {idx === 5 && (completed || current) && (
                                    <div className="mt-3">
                                      {trackingTask.review ? (
                                        <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/60 max-w-sm">
                                          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`w-4 h-4 ${i < (trackingTask.review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                            ))}
                                            <span className="text-xs font-bold text-slate-700 ml-1">Rated ({trackingTask.review.rating}/5)</span>
                                          </div>
                                          {trackingTask.review.comment && (
                                            <p className="text-xs text-slate-600 italic">"{trackingTask.review.comment}"</p>
                                          )}
                                        </div>
                                      ) : reviewedTaskIdsRef.current.has(trackingTask.rawId) ? (
                                        <div className="p-2.5 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-700 flex items-center gap-1.5 max-w-sm border border-emerald-200">
                                          <CheckCircle2 className="w-4 h-4" /> Review Submitted
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setIsFeedbackModalOpen(true)}
                                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                          <Star className="w-3.5 h-3.5 fill-current" /> Leave a Review
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* AI Support Chatbot Sidebar */}
                <div className="lg:col-span-1">
                  <GlassCard className="h-[600px] flex flex-col p-0 overflow-hidden sticky top-24">
                    <div className="bg-indigo-600 p-4 shrink-0">
                      <h2 className="text-white font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 fill-indigo-300 text-indigo-300" />
                        AI Support Assistant
                      </h2>
                      <p className="text-indigo-200 text-xs mt-1">Available 24/7 for quick answers</p>
                    </div>
                    <div className="flex-1 bg-slate-50/50 p-4 overflow-y-auto flex flex-col gap-4">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm max-w-[85%] self-start">
                        <p className="text-sm text-slate-700">Hi! I am monitoring your task <b>{trackingTask.id}</b>. Currently, a supervisor is being dispatched. Do you need any help?</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                      <div className="relative">
                        <input type="text" placeholder="Type a message..." className="w-full pl-4 pr-10 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50" />
                        <button className="absolute right-2 top-1.5 p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'providerActiveWorkspace' && activeWorkspaceJob && (
          <motion.main
            key="providerActiveWorkspace"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-32 flex justify-center w-full min-h-screen"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setCurrentPage('providerDashboard')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
              </div>

              <div className="space-y-6">
                {/* Contextual Lifecycle Status Banner */}
                {providerMilestoneIndex < 3 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-900">Supervisor Approval Pending</h3>
                      <p className="text-xs text-amber-700 mt-0.5">Field Supervisor has been dispatched to assess worksite requirements. You will be authorized to begin work once the site inspection is signed off.</p>
                    </div>
                  </div>
                )}

                {providerMilestoneIndex === 3 && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                      <Zap className="w-5 h-5 text-indigo-600 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-indigo-900">Work Authorized & In Progress</h3>
                      <p className="text-xs text-indigo-700 mt-0.5">Field Supervisor has authorized the site visit. Proceed with your tasks. Once finished, click "Signal Work Completed" below.</p>
                    </div>
                  </div>
                )}

                {providerMilestoneIndex === 4 && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <Shield className="w-5 h-5 text-purple-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-purple-900">Waiting for Supervisor Quality Inspection</h3>
                      <p className="text-xs text-purple-700 mt-0.5">Work completion signaled. The Field Supervisor is currently performing the quality inspection before escrow payout is released.</p>
                    </div>
                  </div>
                )}

                {providerMilestoneIndex === 5 && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-900">Task Completed & Quality Approved</h3>
                      <p className="text-xs text-emerald-700 mt-0.5">Field Supervisor has signed off on the quality inspection. Payment has been released to your account.</p>
                    </div>
                  </div>
                )}

                {/* 1. Header & Financial Summary Strip */}
                <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-indigo-600">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Job ID: #{String(activeWorkspaceJob.id || '').toUpperCase().replace('JOB-', 'OL-24')}</span>
                      <span className="text-sm font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${providerMilestoneIndex < 5 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        Status: {providerMilestoneIndex === 3 ? 'Work In Progress' : providerMilestoneIndex === 4 ? 'Quality Check (Pending)' : providerMilestoneIndex === 5 ? 'Completed' : 'Supervisor Approval Pending'}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{activeWorkspaceJob.title || 'Task Details'}</h1>
                  </div>
                  <div className="flex flex-col items-start md:items-end w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Payout</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">LKR {Number(activeWorkspaceJob.budget || 0).toLocaleString()}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${activeWorkspaceJob.isNegotiable ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {activeWorkspaceJob.isNegotiable ? 'Price Negotiable' : 'Fixed Price'}
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 2. Customer Contact & Communication Panel */}
                  <GlassCard className="p-6">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Customer Details
                    </h2>
                    <div className="flex flex-col mb-6">
                      <span className="text-lg font-bold text-slate-900">{activeWorkspaceJob.customerName || activeWorkspaceJob.customer?.name || 'Customer'}</span>
                      <span className="text-sm font-medium text-slate-500">{activeWorkspaceJob.customerPhone || activeWorkspaceJob.customer?.phone || 'Available via app'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <a href={`tel:${activeWorkspaceJob.customerPhone || activeWorkspaceJob.customer?.phone || ''}`} className="w-full py-3 px-4 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-center text-sm">
                        <Phone className="w-4 h-4" /> Call Customer
                      </a>
                      <button onClick={() => showToast('Support Center', 'Connected to 24/7 Priority Support Desk.', 'info')} className="w-full py-3 px-4 font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4" /> Chat with Support
                      </button>
                    </div>
                  </GlassCard>

                  {/* 3. Navigation & Precise Location Card */}
                  <GlassCard className="p-6">
                    <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" /> Worksite Location
                    </h2>
                    <div className="flex flex-col mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-20 justify-center">
                      <span className="text-base font-medium text-slate-800 leading-snug">{activeWorkspaceJob.exactAddress || activeWorkspaceJob.location || 'Colombo, Sri Lanka'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <a href={activeWorkspaceJob.lat && activeWorkspaceJob.lng ? `https://www.google.com/maps/search/?api=1&query=${activeWorkspaceJob.lat},${activeWorkspaceJob.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeWorkspaceJob.exactAddress || activeWorkspaceJob.location || 'Colombo, Sri Lanka')}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 px-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-center text-sm">
                        <Navigation className="w-4 h-4" /> Open in Google Maps
                      </a>
                    </div>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 4. Read-Only Job Scope Box */}
                  <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Job Scope</h2>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wide">{activeWorkspaceJob.category}</span>
                      </div>

                      <div className="prose prose-slate prose-sm max-w-none text-slate-600 mb-8">
                        <p>{activeWorkspaceJob.description}</p>
                      </div>

                      {activeWorkspaceJob.voiceNote && (
                        <div className="mb-8">
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Mic className="w-3.5 h-3.5 text-indigo-500" /> AI Transcript (Voice Note)
                          </h3>
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-sm text-indigo-900 font-medium italic">"{activeWorkspaceJob.voiceNote}"</p>
                          </div>
                        </div>
                      )}

                      {activeWorkspaceJob.photos && activeWorkspaceJob.photos.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-slate-400" /> Attached Photos
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {activeWorkspaceJob.photos.map((photo: string, index: number) => (
                              <div key={index} className="aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer hover:opacity-90 transition-opacity">
                                <img src={photo} alt={`Task detail ${index + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  </div>

                  {/* 5. Real-Time Milestone Tracker */}
                  <div className="lg:col-span-1">
                    <GlassCard className="p-6 md:p-8 h-full">
                      <h2 className="text-lg font-bold text-slate-900 mb-8">Tracker</h2>
                      <div className="relative">
                        <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100 z-0"></div>
                        <div className="space-y-6 relative z-10">
                          {[
                            { title: 'Booked', isSupervisor: false },
                            { title: 'Supervisor Assigned', subtitle: activeWorkspaceJob.supervisorName, isSupervisor: true },
                            { title: 'Site Visit Completed', isSupervisor: true },
                            { title: 'Work In Progress', isSupervisor: false },
                            { title: 'Quality Check', subtitle: 'Supervisor Sign-off', isSupervisor: true },
                            { title: 'Completed', isSupervisor: false }
                          ].map((step, idx) => {
                            const completed = providerMilestoneIndex > idx || (providerMilestoneIndex === 5 && idx === 5);
                            const current = providerMilestoneIndex === idx && providerMilestoneIndex !== 5;
                            return (
                              <div key={idx} className="flex gap-4 items-start">
                                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 shadow-sm bg-white ${completed ? 'border-green-500' : current ? 'border-indigo-600' : 'border-slate-200'}`}>
                                  {completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : current ? (
                                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div>
                                  ) : (
                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                  )}
                                </div>
                                <div className={`pt-1.5 ${completed || current ? 'opacity-100' : 'opacity-40'}`}>
                                  <h3 className={`text-sm font-bold ${current ? 'text-indigo-900' : completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</h3>
                                  {step.subtitle && <p className="text-xs text-slate-500 mt-0.5">{step.subtitle}</p>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* 6. Bottom Action Command Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 px-6 z-50 flex justify-center shadow-lg">
                  <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => setIsReportIssueModalOpen(true)}
                      className="w-full sm:w-auto py-3 px-6 text-sm font-bold text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl transition-colors cursor-pointer"
                    >
                      Escalate / Report Issue
                    </button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {providerMilestoneIndex < 3 && (
                        <button
                          onClick={() => showToast('Supervisor Approval Pending', 'Please wait for the Field Supervisor to conduct the site visit and authorize work.', 'warning')}
                          className="w-full sm:w-auto py-3.5 px-8 text-sm font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-xl transition-all cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Clock className="w-4 h-4 text-amber-600 animate-spin" /> Supervisor Approval Pending
                        </button>
                      )}

                      {providerMilestoneIndex === 3 && (
                        <button
                          onClick={() => handleCompleteTask(Number(activeWorkspaceJob?.id))}
                          className="w-full sm:w-auto py-3.5 px-8 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Signal Work Completed
                        </button>
                      )}

                      {providerMilestoneIndex === 4 && (
                        <button
                          onClick={() => showToast('Quality Inspection In Progress', 'Waiting for supervisor quality inspection to complete.', 'info')}
                          className="w-full sm:w-auto py-3.5 px-8 text-sm font-bold text-purple-800 bg-purple-100 border border-purple-300 rounded-xl transition-all cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Clock className="w-4 h-4 text-purple-600 animate-pulse" /> Waiting for Supervisor Quality Inspection to Complete
                        </button>
                      )}

                      {providerMilestoneIndex === 5 && (
                        <button
                          disabled
                          className="w-full sm:w-auto py-3.5 px-8 text-sm font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Job Finalized & Verified
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'providerPendingVerification' && (
          <motion.main
            key="providerPendingVerification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-xl mx-auto px-6 pt-32 pb-24 flex justify-center w-full min-h-screen"
          >
            <GlassCard className="w-full p-8 md:p-10 h-fit bg-white/50 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <Shield className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Awaiting Verification</h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg mb-6 border border-amber-200 shadow-sm text-sm">
                <Clock className="w-4 h-4" /> Status: Pending HR Review
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-md">
                Thank you for applying to be a TaskLink provider. An HR Officer will conduct a verification call with you shortly. Please keep your mobile phone nearby.
              </p>

              <div className="w-full bg-slate-50 p-4 rounded-xl text-left border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Next Steps</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Application submitted successfully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 shrink-0 mt-0.5 relative">
                      <div className="absolute inset-1 rounded-full bg-indigo-600 animate-pulse"></div>
                    </div>
                    <span className="font-semibold text-indigo-900">Document Verification by HR</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5"></div>
                    <span>Phone Interview</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5"></div>
                    <span>Profile Activated</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 w-full">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="w-full text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 py-3.5 rounded-2xl transition-all duration-300 shadow-sm flex flex-col items-center justify-center max-w-md mx-auto"
                >
                  Return to Homepage
                </button>
              </div>
            </GlassCard>
          </motion.main>
        )}

        {currentPage === 'supervisorDashboard' && (
          <motion.main
            key="supervisorDashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full min-h-screen pb-24 pt-[165px]"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1.5">Field Operations Terminal</h1>
                  <p className="text-sm font-medium text-slate-500">Live on-site inspection queue, quality verification, and dispute mediation.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span>Active Queue: {supervisorTasks[supervisorActiveTab]?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supervisorTasks[supervisorActiveTab] && supervisorTasks[supervisorActiveTab].length > 0 ? (
                  supervisorTasks[supervisorActiveTab].map((job: any, idx: number) => (
                    <GlassCard key={job.id || idx} className="p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Job #{String(job.id)}</span>
                          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-wide">{job.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>

                        <div className="space-y-2 mb-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span>{job.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> <span className="truncate">{job.neighborhood}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                            <span className="text-xs font-bold text-slate-500">Payout</span>
                            <span className="text-sm font-black text-indigo-700">LKR {Number(job.budget || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold mb-4 border ${job.statusColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' : job.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                          <div className={`w-2 h-2 rounded-full ${job.statusColor === 'amber' ? 'bg-amber-500' : job.statusColor === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                          <span>Status: {job.status}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSupervisorSelectedJob(job);
                          setCurrentPage('supervisorActiveWorkspace');
                        }}
                        className="w-full py-3 text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        Inspect Workspace <ArrowRight className="w-4 h-4" />
                      </button>
                    </GlassCard>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-xl rounded-3xl border border-slate-200 p-8">
                    <CheckCircle2 className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-800 font-bold text-lg mb-1">No {supervisorActiveTab} tasks found</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">Tasks assigned to your supervision zone requiring site inspection or quality verification will appear here automatically.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.main>
        )}

        {currentPage === 'supervisorActiveWorkspace' && supervisorSelectedJob && (
          <motion.main
            key="supervisorActiveWorkspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full min-h-screen bg-slate-50/50 pb-36 pt-[120px]"
          >
            {/* Top Navigation & Info Header */}
            <div className="max-w-7xl mx-auto px-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage('supervisorDashboard')}
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Job #{supervisorSelectedJob.id}</span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded uppercase">{supervisorSelectedJob.category}</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">{supervisorSelectedJob.title}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border ${supervisorSelectedJob.statusColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' : supervisorSelectedJob.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                    <div className={`w-2 h-2 rounded-full ${supervisorSelectedJob.statusColor === 'amber' ? 'bg-amber-500' : supervisorSelectedJob.statusColor === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                    <span>{supervisorSelectedJob.status}</span>
                  </div>
                  <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    LKR {Number(supervisorSelectedJob.budget || 0).toLocaleString()}
                  </div>
                  {currentUserRole === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('adminDashboard')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5" /> Admin Terminal
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Landscape 2-Column Grid */}
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left / Main Column (7 of 12 cols on desktop) */}
                <div className="lg:col-span-7 space-y-6">

                  {/* 1. Dual-Party Contact Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassCard className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Customer Details
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">{supervisorSelectedJob.customerName}</h3>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-1">{supervisorSelectedJob.neighborhood}</p>
                      </div>
                      <a
                        href={`tel:${supervisorSelectedJob.customerPhone}`}
                        className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl flex justify-center items-center gap-2 text-xs border border-indigo-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Customer ({supervisorSelectedJob.customerPhone || 'N/A'})
                      </a>
                    </GlassCard>

                    <GlassCard className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> Assigned Laborer
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">{supervisorSelectedJob.providerName}</h3>
                        <p className="text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded mb-4">{supervisorSelectedJob.providerSkill}</p>
                      </div>
                      <a
                        href={`tel:${supervisorSelectedJob.providerPhone}`}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 text-xs shadow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Laborer ({supervisorSelectedJob.providerPhone || 'N/A'})
                      </a>
                    </GlassCard>
                  </div>

                  {/* 2. Original Job Request Viewer */}
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" /> Work Scope Specifications
                      </h3>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{supervisorSelectedJob.category}</span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-200 pl-3 mb-6">{supervisorSelectedJob.description}</p>

                    {supervisorSelectedJob.voiceNote && (
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Mic className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Voice Note Transcription</span>
                        </div>
                        <p className="text-xs text-indigo-800 italic leading-relaxed">"{supervisorSelectedJob.voiceNote}"</p>
                      </div>
                    )}

                    {supervisorSelectedJob.photos && supervisorSelectedJob.photos.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-slate-400" /> Client Uploaded References
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {supervisorSelectedJob.photos.map((photo: string, index: number) => (
                            <div key={index} className="aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                              <img src={photo} alt={`Job detail ${index}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassCard>

                  {/* 3. Interactive Assessment & Data Entry Form */}
                  <GlassCard className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-emerald-500" /> Field Assessment & Inspection Report
                    </h3>
                    <textarea
                      value={supervisorAssessmentNotes}
                      onChange={(e) => setSupervisorAssessmentNotes(e.target.value)}
                      placeholder="Enter official scope assessment, material needs, compliance findings, or quality check results..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-28 mb-4 transition-all"
                    />

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center bg-slate-50 text-center relative overflow-hidden group cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        capture="environment"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          if (e.target.files) {
                            setSupervisorEvidences(Array.from(e.target.files).map(f => URL.createObjectURL(f as File)));
                          }
                        }}
                      />
                      <Camera className="w-6 h-6 text-slate-400 mb-1.5 group-hover:-translate-y-1 transition-transform" />
                      <p className="text-sm font-bold text-slate-700">Upload On-Site Photographic Evidence</p>
                      <p className="text-xs text-slate-400 mt-0.5">Tap or click to capture evidence images</p>
                    </div>

                    {supervisorEvidences.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
                        {supervisorEvidences.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                            <img src={photo} alt={`Evidence ${index}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>

                </div>

                {/* Right Sidebar Column (5 of 12 cols on desktop) */}
                <div className="lg:col-span-5 space-y-6">

                  {/* 1. Job Flow Progression Timeline */}
                  <GlassCard className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" /> Operational Progression
                    </h3>
                    <div className="relative">
                      <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100 z-0"></div>
                      <div className="space-y-5 relative z-10">
                        {[
                          { title: 'Job Booked & Escrow Funded', desc: 'Customer authorized payment' },
                          { title: 'Supervisor Assigned', desc: 'Supervisor dispatched to area' },
                          { title: 'Site Inspection Authorized', desc: 'Pre-work assessment confirmed' },
                          { title: 'Work In Progress', desc: 'Laborer executing required scope' },
                          { title: 'Quality Verification', desc: 'Final audit & photo check' },
                          { title: 'Task Completed & Settled', desc: 'Escrow released to provider' },
                        ].map((milestone, idx) => {
                          const completed = supervisorSelectedJob.providerMilestoneIndex > idx || (supervisorSelectedJob.providerMilestoneIndex === 5 && idx === 5);
                          const current = supervisorSelectedJob.providerMilestoneIndex === idx && supervisorSelectedJob.providerMilestoneIndex !== 5;
                          return (
                            <div key={idx} className="flex gap-3.5 items-start">
                              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 shadow-sm bg-white ${completed ? 'border-emerald-500 bg-emerald-50' : current ? 'border-indigo-600' : 'border-slate-200'}`}>
                                {completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : current ? (
                                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div>
                                ) : (
                                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                )}
                              </div>
                              <div className={`pt-0.5 ${completed || current ? 'opacity-100' : 'opacity-40'}`}>
                                <h4 className={`text-xs font-bold ${current ? 'text-indigo-900' : completed ? 'text-slate-900' : 'text-slate-500'}`}>{milestone.title}</h4>
                                <p className="text-[11px] text-slate-500">{milestone.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </GlassCard>

                  {/* 2. Worksite Navigation & Google Map Card */}
                  <GlassCard className="p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-500" /> Worksite Geolocation Map
                    </h3>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                      <GoogleMapView
                        center={{ lat: supervisorSelectedJob.lat || 6.9271, lng: supervisorSelectedJob.lng || 79.8612 }}
                        addressName={supervisorSelectedJob.neighborhood || 'Job Worksite'}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="truncate">{supervisorSelectedJob.neighborhood || 'Colombo, Sri Lanka'}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${supervisorSelectedJob.lat || 6.9271},${supervisorSelectedJob.lng || 79.8612}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 text-xs shadow-md shadow-blue-600/20 transition-all"
                    >
                      <Navigation className="w-4 h-4" /> Open in Google Maps Navigation
                    </a>
                  </GlassCard>

                </div>

              </div>
            </div>

            {/* E. Milestone State Progression Controls (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-[60] pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {supervisorSelectedJob.rawStatus === 'completed' || supervisorSelectedJob.providerMilestoneIndex === 5 ? (
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Quality Audit Approved & Escrow Finalized</span>
                    </div>
                    <button
                      onClick={() => setCurrentPage('supervisorDashboard')}
                      className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSupervisorEscalateModalOpen(true)}
                      className="w-full sm:w-auto py-3 px-6 bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      Escalate Dispute / Halt Work
                    </button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {(supervisorSelectedJob.providerMilestoneIndex === 1 || supervisorSelectedJob.rawStatus === 'assigned') && (
                        <button
                          onClick={() => handleSupervisorSiteVisit(supervisorSelectedJob.id)}
                          className="w-full sm:w-auto py-3 px-8 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Confirm Site Visit & Authorize Work
                        </button>
                      )}

                      {(supervisorSelectedJob.providerMilestoneIndex === 4 || supervisorSelectedJob.rawStatus === 'in_review' || supervisorSelectedJob.rawStatus === 'in_progress') && (
                        <button
                          onClick={() => handleSupervisorQualityCheck(supervisorSelectedJob.id)}
                          className="w-full sm:w-auto py-3 px-8 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                          Approve Quality Check & Finalize Task
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

          </motion.main>
        )}

        {currentPage === 'hrDashboard' && (
          <motion.main
            key="hrDashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden"
          >
            {/* Left Sidebar Navigation */}
            <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shrink-0">
              <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">TaskLink HR</span>
              </div>
              <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() => setHrActiveTab('onboarding')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${hrActiveTab === 'onboarding' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <UserPlus className="w-5 h-5" /> Onboarding Queue
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
                </button>
                <button
                  onClick={() => setHrActiveTab('directory')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${hrActiveTab === 'directory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Users className="w-5 h-5" /> Verified Directory
                </button>
                <button
                  onClick={() => setHrActiveTab('analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${hrActiveTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <BarChart2 className="w-5 h-5" /> Performance Analytics
                </button>
              </div>


            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Top Header Bar */}
              <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-30">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-slate-800">HR Administration Terminal</h1>
                  {currentUserRole === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('adminDashboard')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      Back to Admin Terminal
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 relative">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{profileData.firstName} {profileData.lastName}</p>
                    <p className="text-xs font-semibold text-indigo-600">{currentUserRole === 'admin' ? 'Super Administrator' : 'HR Officer'}</p>
                  </div>
                  <div
                    onClick={() => setIsHrProfileMenuOpen(!isHrProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all"
                  >
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=David" alt="HR profile" className="w-full h-full object-cover" />
                  </div>

                  <AnimatePresence>
                    {isHrProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsHrProfileMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-14 right-0 w-64 z-50 shadow-2xl"
                        >
                          <div
                            className="p-4 flex flex-col items-center shadow-2xl border border-slate-200 rounded-3xl relative z-50"
                            style={{ backgroundColor: '#ffffff', opacity: 1 }}
                          >
                            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-indigo-100 overflow-hidden shadow-sm flex items-center justify-center mb-2">
                              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=David" alt="HR profile" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 mx-auto text-center">{profileData.firstName} {profileData.lastName}</h2>
                            <p className="text-xs text-indigo-600 font-semibold mb-1">{currentUserRole === 'admin' ? 'Super Administrator' : 'HR Administration Officer'}</p>
                            <p className="text-xs text-slate-500 mb-3 mx-auto text-center">{profileData.email}</p>

                            {currentUserRole === 'admin' && (
                              <div className="w-full border-t border-slate-100 pt-2 mb-1">
                                <button
                                  onClick={() => {
                                    setCurrentPage('adminDashboard');
                                    setIsHrProfileMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium text-sm text-left transition-colors w-full cursor-pointer"
                                >
                                  <Shield className="w-4 h-4 text-indigo-600" />
                                  Master Admin Terminal
                                </button>
                              </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-slate-100 w-full">
                              <button
                                onClick={() => handleUserLogout()}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors cursor-pointer"
                              >
                                <LogOut className="w-4 h-4" />
                                Log out
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {hrActiveTab === 'onboarding' && (
                  <div className="space-y-6">
                    {/* A. Search, Sort, & Filter Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search by applicant name or ID..."
                          value={hrSearchQuery}
                          onChange={(e) => setHrSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <select
                        value={hrTradeFilter}
                        onChange={(e) => setHrTradeFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option>All Trades</option>
                        <option>Masons</option>
                        <option>Carpenters</option>
                        <option>Electricians</option>
                        <option>Plumbers</option>
                        <option>Painters</option>
                        <option>Cleaners</option>
                        <option>Allied Trades</option>
                      </select>
                      <select
                        value={hrExperienceFilter}
                        onChange={(e) => setHrExperienceFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option>All</option>
                        <option>0-2 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </div>

                    {/* B. Main Applicants Data Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                              <th className="px-6 py-4">Applicant ID</th>
                              <th className="px-6 py-4">Profile Snapshot</th>
                              <th className="px-6 py-4">Selected Trade</th>
                              <th className="px-6 py-4">Experience</th>
                              <th className="px-6 py-4">Submission Timestamp</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {hrApplicantsList.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                                      <Users className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-slate-700">No pending applicants</p>
                                    <p className="text-xs text-slate-400 mt-0.5">New provider registrations awaiting HR review will appear here.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              hrApplicantsList
                                .filter(a => {
                                  if (hrSearchQuery && !a.name.toLowerCase().includes(hrSearchQuery.toLowerCase()) && !a.trade.toLowerCase().includes(hrSearchQuery.toLowerCase())) return false;
                                  if (hrTradeFilter !== 'All Trades' && !a.trade.toLowerCase().includes(hrTradeFilter.toLowerCase())) return false;
                                  return true;
                                })
                                .map((applicant, i) => (
                                  <tr key={applicant.id || i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">{applicant.app_id || `#APP-${applicant.id}`}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                        <img src={applicant.avatar} alt={applicant.name} className="w-full h-full object-cover" />
                                      </div>
                                      <span className="font-bold text-slate-800">{applicant.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">{applicant.trade}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{applicant.experience}</td>
                                    <td className="px-6 py-4 text-slate-500">{applicant.date}</td>
                                    <td className="px-6 py-4">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                        {applicant.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <button
                                        onClick={() => {
                                          setHrSelectedApplicant(applicant);
                                          setIsHrApplicationDrawerOpen(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors border border-indigo-200 cursor-pointer"
                                      >
                                        Review Application
                                      </button>
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {hrActiveTab === 'directory' && (
                  <div className="space-y-6">
                    {/* A. Main Performance Grid Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                              <th className="px-6 py-4">Laborer ID</th>
                              <th className="px-6 py-4">Professional Identity</th>
                              <th className="px-6 py-4">Trade Designation</th>
                              <th className="px-6 py-4">System Status</th>
                              <th className="px-6 py-4">Completed Jobs</th>
                              <th className="px-6 py-4">Avg Rating</th>
                              <th className="px-6 py-4">Response Time</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {hrLaborersList.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                                      <Users className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-slate-700">No active laborers registered yet</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Approved providers will appear in this directory.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              hrLaborersList.map((laborer, i) => (
                                <tr key={laborer.id || i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 font-mono text-slate-500">{laborer.lab_id || `#LAB-${laborer.id}`}</td>
                                  <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                      <img src={laborer.avatar} alt={laborer.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-slate-800">{laborer.name}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">{laborer.trade}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${laborer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${laborer.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      {laborer.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-slate-700">{laborer.jobs || 0} jobs</td>
                                  <td className="px-6 py-4 flex items-center gap-1 font-bold text-slate-800">
                                    <Star className={`w-4 h-4 ${laborer.rating >= 4.5 ? 'text-amber-400 fill-amber-400' : laborer.rating >= 4.0 ? 'text-amber-400' : 'text-slate-300'}`} />
                                    {laborer.rating}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600">Avg: {laborer.response || '10 mins'}</td>
                                  <td className="px-6 py-4 flex justify-end gap-2 text-right">
                                    <button
                                      onClick={() => {
                                        setHrSelectedLaborerLog(laborer);
                                        setIsHrLogModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      View Complete Log
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {hrActiveTab === 'analytics' && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Performance analytics coming soon...</p>
                  </div>
                )}
              </div>

              {/* Slide-Over Drawer */}
              <AnimatePresence>
                {isHrApplicationDrawerOpen && hrSelectedApplicant && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-[110]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsHrApplicationDrawerOpen(false)}
                    />
                    <motion.div
                      className="absolute top-0 right-0 h-full w-[800px] max-w-full bg-white shadow-2xl z-[120] flex flex-col border-l border-slate-200"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white">
                        <h2 className="text-lg font-bold text-slate-900">Application Review: #{hrSelectedApplicant.id}</h2>
                        <button onClick={() => setIsHrApplicationDrawerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 border-b border-slate-200">
                        {/* Panel Left: Personal & Contact Profiles */}
                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal & Contact Profiles</h3>

                            <div className="space-y-4">
                              <div>
                                <span className="block text-xs font-medium text-slate-500 mb-1">Full Legal Name</span>
                                <span className="block text-sm font-bold text-slate-800">{hrSelectedApplicant.name}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-slate-500 mb-1">National Identity Card (NIC)</span>
                                <span className="block text-sm font-bold text-slate-800 font-mono">{hrSelectedApplicant.nic}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-slate-500 mb-1">Permanent Residential Address</span>
                                <span className="block text-sm font-bold text-slate-800">{hrSelectedApplicant.address}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-slate-500 mb-1">Verified Mobile Number</span>
                                <span className="block text-sm font-bold text-slate-800">{hrSelectedApplicant.phone}</span>
                              </div>

                              <a href={`tel:${hrSelectedApplicant.phone}`} className="mt-4 w-full py-3 bg-slate-800 text-white font-bold rounded-xl flex justify-center items-center gap-2 text-sm shadow-sm hover:bg-slate-900 transition-colors">
                                <Phone className="w-4 h-4" /> Call Applicant
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Panel Right: Professional Document Viewer */}
                        <div className="space-y-6 flex flex-col h-full">
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Professional Document Viewer</h3>

                            <div className="flex gap-4 mb-4">
                              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 w-1/2">
                                <span className="block text-xs font-medium text-slate-500 mb-1">Declared Trade Base</span>
                                <span className="block text-sm font-bold text-slate-800">{hrSelectedApplicant.trade}</span>
                              </div>
                              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 w-1/2">
                                <span className="block text-xs font-medium text-slate-500 mb-1">Years of Experience</span>
                                <span className="block text-sm font-bold text-slate-800">{hrSelectedApplicant.experience}</span>
                              </div>
                            </div>

                            <div className="flex-1 border-2 border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center min-h-[250px] p-6 text-center">
                              <FileText className="w-12 h-12 text-slate-300 mb-3" />
                              <p className="text-sm font-medium text-slate-500 mb-4 px-2">Inline preview unavailable for this document type.</p>
                              <button className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                                <Download className="w-4 h-4 text-slate-500" /> Download CV Document
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Drawer Footer: Decision Action Panel */}
                      <div className="p-6 bg-white shrink-0 flex gap-4">
                        <button
                          onClick={() => { setIsHrRejectModalOpen(true); }}
                          className="flex-1 py-3.5 bg-white border-2 border-red-500 text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Reject Application
                        </button>
                        <button
                          onClick={() => {
                            if (hrSelectedApplicant?.id) {
                              handleApproveApplicant(hrSelectedApplicant.id);
                            }
                          }}
                          className="flex-1 py-3.5 bg-green-600 text-white font-bold rounded-xl text-sm shadow-md shadow-green-600/20 hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Approve & Activate Profile
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Reject Application Modal */}
              <AnimatePresence>
                {isHrRejectModalOpen && (
                  <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHrRejectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Application</h3>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Reason for refusal</label>
                      <select value={hrRejectReason} onChange={(e) => setHrRejectReason(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-6 truncate max-w-full">
                        <option value="">Select a reason...</option>
                        <option value="Incomplete CV Document">Incomplete CV Document</option>
                        <option value="Mismatched Identification Data">Mismatched Identification Data</option>
                        <option value="Failed Verification Call">Failed Verification Call</option>
                        <option value="Insufficient Experience Record">Insufficient Experience Record</option>
                      </select>
                      <div className="flex gap-3">
                        <button onClick={() => setIsHrRejectModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
                        <button
                          onClick={() => {
                            if (hrSelectedApplicant?.id) {
                              handleRejectApplicant(hrSelectedApplicant.id);
                            }
                          }}
                          className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                          disabled={!hrRejectReason}
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Complete Log Modal */}
              <AnimatePresence>
                {isHrLogModalOpen && hrSelectedLaborerLog && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHrLogModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Performance Log: {hrSelectedLaborerLog.name}</h3>
                          <span className="text-xs font-mono text-slate-500">#{hrSelectedLaborerLog.id}</span>
                        </div>
                        <button onClick={() => setIsHrLogModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                        {/* Metrics Snapshot */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                            <span className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Cancel Rate</span>
                            <span className="text-xl font-bold text-slate-900">2.4%</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                            <span className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Avg Speed</span>
                            <span className="text-xl font-bold text-slate-900">4.5 Hrs</span>
                          </div>
                          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                            <span className="block text-xs font-medium text-green-700 uppercase tracking-widest mb-1">Current Flag</span>
                            <span className="text-xl font-bold text-green-800">Clear</span>
                          </div>
                        </div>

                        {/* Review Feed */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Consumer Feedback History</h4>
                          <div className="space-y-4">
                            {[
                              { customer: 'Mrs. Silva', score: 5, comment: 'Excellent work. Very polite and cleaned up perfectly.' },
                              { customer: 'Mr. Fernando', score: 4, comment: 'Good job overall, arrived a bit late but finished quickly.' },
                              { customer: 'Anonymous', score: 5, comment: 'Fixed the leak immediately. Highly recommended.' }
                            ].map((review, i) => (
                              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-sm text-slate-800">{review.customer}</span>
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                      <Star key={j} className={`w-3.5 h-3.5 ${j < review.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">"{review.comment}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </motion.main>
        )}

        {currentPage === 'financeDashboard' && (
          <motion.main
            key="financeDashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden"
          >
            {/* Left Sidebar Navigation */}
            <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shrink-0">
              <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">TaskLink Finance</span>
              </div>
              <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() => setFinanceActiveTab('ledger')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${financeActiveTab === 'ledger' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Receipt className="w-5 h-5" /> Transaction Ledger
                </button>
                <button
                  onClick={() => setFinanceActiveTab('reconciliation')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${financeActiveTab === 'reconciliation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <FileWarning className="w-5 h-5" /> Reconciliation Desk
                </button>
                <button
                  onClick={() => setFinanceActiveTab('analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${financeActiveTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <BarChart2 className="w-5 h-5" /> Revenue Analytics
                </button>
              </div>


            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Top Header Bar */}
              <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-30">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-slate-800">Finance Control Terminal</h1>
                  {currentUserRole === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('adminDashboard')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      Back to Admin Terminal
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 relative">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{profileData.firstName} {profileData.lastName}</p>
                    <p className="text-xs font-semibold text-indigo-600">{currentUserRole === 'admin' ? 'Super Administrator' : 'Financial Controller'}</p>
                  </div>
                  <div
                    onClick={() => setIsFinanceProfileMenuOpen(!isFinanceProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all"
                  >
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Emma" alt="Finance profile" className="w-full h-full object-cover" />
                  </div>

                  <AnimatePresence>
                    {isFinanceProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsFinanceProfileMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-14 right-0 w-64 z-50 shadow-2xl"
                        >
                          <div
                            className="p-4 flex flex-col items-center shadow-2xl border border-slate-200 rounded-3xl relative z-50"
                            style={{ backgroundColor: '#ffffff', opacity: 1 }}
                          >
                            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-indigo-100 overflow-hidden shadow-sm flex items-center justify-center mb-2">
                              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Emma" alt="Finance profile" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 mx-auto text-center">{profileData.firstName} {profileData.lastName}</h2>
                            <p className="text-xs text-indigo-600 font-semibold mb-1">{currentUserRole === 'admin' ? 'Super Administrator' : 'Financial Controller'}</p>
                            <p className="text-xs text-slate-500 mb-3 mx-auto text-center">{profileData.email}</p>

                            {currentUserRole === 'admin' && (
                              <div className="w-full border-t border-slate-100 pt-2 mb-1">
                                <button
                                  onClick={() => {
                                    setCurrentPage('adminDashboard');
                                    setIsFinanceProfileMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium text-sm text-left transition-colors w-full cursor-pointer"
                                >
                                  <Shield className="w-4 h-4 text-indigo-600" />
                                  Master Admin Terminal
                                </button>
                              </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-slate-100 w-full">
                              <button
                                onClick={() => handleUserLogout()}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors cursor-pointer"
                              >
                                <LogOut className="w-4 h-4" />
                                Log out
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {financeActiveTab === 'ledger' && (
                  <div className="space-y-6">
                    {/* A. Global Metric Scorecards (Top Row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <CreditCard className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Gross Revenue (This Month)</p>
                          <p className="text-3xl font-bold text-slate-900">LKR 24,500.00</p>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Break-Even Tracker</span>
                          </div>
                          <span className="text-sm font-bold text-slate-800">245 / 300</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3.5 mb-1 overflow-hidden flex">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '81.6%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>0%</span>
                          <span>Target: 300 Bookings</span>
                        </div>
                      </div>
                    </div>

                    {/* B. PayHere Ledger Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-800">Platform Transaction Ledger</h3>
                      </div>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                              <th className="px-6 py-4">Reference ID</th>
                              <th className="px-6 py-4">Job ID</th>
                              <th className="px-6 py-4">Customer Profile</th>
                              <th className="px-6 py-4">Amount</th>
                              <th className="px-6 py-4">Timestamp</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { ref: 'PH-10928374', job: 'JOB-8493', customerName: 'Roshan Silva', customerId: 'CUS-492', amount: 'LKR 100.00', date: '2023-11-20 09:45:12', status: 'Success' },
                              { ref: 'PH-10928375', job: 'JOB-8494', customerName: 'Amara Weerasinghe', customerId: 'CUS-102', amount: 'LKR 100.00', date: '2023-11-20 10:15:33', status: 'Success' },
                              { ref: 'PH-10928376', job: 'JOB-8495', customerName: 'Dinesh Perera', customerId: 'CUS-511', amount: 'LKR 100.00', date: '2023-11-20 11:30:05', status: 'Pending Webhook' },
                              { ref: 'PH-10928377', job: 'JOB-8496', customerName: 'Sunethra Kumaran', customerId: 'CUS-208', amount: 'LKR 100.00', date: '2023-11-20 14:22:10', status: 'Failed' },
                            ].map((tx, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500">{tx.ref}</td>
                                <td className="px-6 py-4"><a href="#" className="font-bold text-indigo-600 hover:underline">{tx.job}</a></td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-slate-800 block">{tx.customerName}</span>
                                  <span className="text-xs text-slate-500 font-mono">{tx.customerId}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">{tx.amount}</td>
                                <td className="px-6 py-4 text-slate-500 text-xs font-mono">{tx.date}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${tx.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : tx.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-green-500' : tx.status === 'Failed' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    {tx.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => { setFinanceSelectedTransaction(tx); setIsInvoiceModalOpen(true); }}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-xs font-bold transition-colors border border-slate-200"
                                  >
                                    View Invoice Summary
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {financeActiveTab === 'reconciliation' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-200 bg-red-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Gateway Discrepancy Queue
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">Transactions flagged with a synchronization error or mismatched signature.</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                              <th className="px-6 py-4">System Log ID</th>
                              <th className="px-6 py-4">User Reference</th>
                              <th className="px-6 py-4">Reported Issue</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { log: 'LOG-ERR-940', user: 'CUS-834', issue: 'Signature Mismatch (MD5 Hash Failed)' },
                              { log: 'LOG-ERR-941', user: 'CUS-112', issue: 'Gateway Timeout (Webhook Not Received)' },
                            ].map((err, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{err.log}</td>
                                <td className="px-6 py-4 font-mono font-bold text-slate-700">{err.user}</td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {err.issue}
                                  </span>
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-3 text-right">
                                  <button className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-sm font-bold transition-colors shadow-sm">
                                    Verify Gateway Signature
                                  </button>
                                  <button onClick={() => showToast('Manual Override', 'Moving job status manually to BOOKED.', 'info')} className="px-4 py-2 bg-white text-amber-600 border border-amber-600 hover:bg-amber-50 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Force Manual Approval
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {financeActiveTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* A. Interactive Filters Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative">
                          <select
                            value={financeSelectedDateRange}
                            onChange={(e) => setFinanceSelectedDateRange(e.target.value)}
                            className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none shadow-sm"
                          >
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Last Quarter</option>
                            <option>Year to Date</option>
                          </select>
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                      <button className="flex items-center justify-center gap-2 px-5 py-2 w-full sm:w-auto bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                        <Download className="w-4 h-4" /> Export Financial Report
                      </button>
                    </div>

                    {/* B. Core Data Charts Components */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                      {/* Component 1: Revenue Velocity Graph */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                          Revenue Velocity
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">(LKR)</span>
                        </h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { name: 'Mon', revenue: 1200 },
                                { name: 'Tue', revenue: 1800 },
                                { name: 'Wed', revenue: 2400 },
                                { name: 'Thu', revenue: 1600 },
                                { name: 'Fri', revenue: 3100 },
                                { name: 'Sat', revenue: 4200 },
                                { name: 'Sun', revenue: 3800 },
                              ]}
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`LKR ${value}`, 'Revenue']}
                              />
                              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Component 2: Category Profitability Index */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg mb-6">Category Profitability Index</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: 'Plumbing', volume: 145 },
                                { name: 'Electrical', volume: 180 },
                                { name: 'Masonry', volume: 85 },
                                { name: 'Carpentry', volume: 110 },
                                { name: 'Cleaning', volume: 220 },
                              ]}
                              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={90} />
                              <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f1f5f9' }}
                                formatter={(value: number) => [`${value} Bookings`, 'Volume']}
                              />
                              <Bar dataKey="volume" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Modal Summary */}
            <AnimatePresence>
              {isInvoiceModalOpen && financeSelectedTransaction && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInvoiceModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                    <div className="p-6 text-center border-b border-indigo-100 bg-indigo-50/50">
                      <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-indigo-100 text-indigo-600">
                        <Receipt className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">{financeSelectedTransaction.amount}</h3>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Platform Fee</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Status</span>
                        <span className="font-bold text-green-600 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Paid</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Date</span>
                        <span className="font-medium text-slate-800 text-sm">{financeSelectedTransaction.date}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Customer</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{financeSelectedTransaction.customerName}<br /><span className="text-xs text-slate-400 font-mono">{financeSelectedTransaction.customerId}</span></span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Reference ID</span>
                        <span className="font-mono text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded">{financeSelectedTransaction.ref}</span>
                      </div>
                      <div className="pt-2">
                        <button onClick={() => setIsInvoiceModalOpen(false)} className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-slate-900/10">Close Receipt</button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.main>
        )}

        {currentPage === 'adminDashboard' && (
          <motion.main
            key="adminDashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-slate-900 flex overflow-hidden font-sans text-slate-100"
          >
            {/* Left Sidebar */}
            <div className="w-64 bg-slate-950 text-white flex flex-col h-full border-r border-slate-800 shrink-0">
              <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mr-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white">TaskLink</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  ADMIN
                </span>
              </div>

              <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                <button
                  onClick={() => setAdminActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${adminActiveTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <BarChart2 className="w-5 h-5" /> Executive Overview
                </button>
                <button
                  onClick={() => setAdminActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${adminActiveTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <Users className="w-5 h-5" /> User & Role Control
                  <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{adminUsersList.length}</span>
                </button>
                <button
                  onClick={() => setAdminActiveTab('disputes')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${adminActiveTab === 'disputes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <AlertTriangle className="w-5 h-5" /> Escalated Disputes
                  <span className="ml-auto bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">{adminDisputesList.length}</span>
                </button>
                <button
                  onClick={() => setAdminActiveTab('logs')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${adminActiveTab === 'logs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <Shield className="w-5 h-5" /> Security & Audit Logs
                  {adminContactMessages.filter(m => m.status === 'unread').length > 0 && (
                    <span className="ml-auto bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                      {adminContactMessages.filter(m => m.status === 'unread').length} new
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Platform Switcher Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Switch Terminal</p>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setCurrentPage('hrDashboard')}
                    className="px-2 py-1.5 bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors"
                  >
                    HR
                  </button>
                  <button
                    onClick={() => setCurrentPage('financeDashboard')}
                    className="px-2 py-1.5 bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors"
                  >
                    Finance
                  </button>
                  <button
                    onClick={() => setCurrentPage('supervisorDashboard')}
                    className="px-2 py-1.5 bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors"
                  >
                    Field
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
              {/* Top Header */}
              <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 relative z-30">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-white">Master Administration Terminal</h1>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Platform Operational
                  </span>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">{profileData.firstName} {profileData.lastName}</p>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Super Administrator</p>
                  </div>
                  <div
                    onClick={() => setIsAdminProfileMenuOpen(!isAdminProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden border-2 border-indigo-400 shadow-md flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-400/50 transition-all"
                  >
                    <span className="text-white font-bold text-base">A</span>
                  </div>

                  <AnimatePresence>
                    {isAdminProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsAdminProfileMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-14 right-0 w-64 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        >
                          <div
                            className="p-4 flex flex-col items-center shadow-2xl border border-slate-700 rounded-3xl text-white relative z-50"
                            style={{ backgroundColor: '#090d16', opacity: 1 }}
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400 flex items-center justify-center mb-2 shadow-inner">
                              <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <h2 className="text-base font-bold text-white">{profileData.firstName} {profileData.lastName}</h2>
                            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Super Administrator</p>
                            <p className="text-xs text-slate-400 mb-3">{profileData.email}</p>

                            <div className="flex flex-col gap-1 w-full border-t border-slate-800 pt-2">
                              <button
                                onClick={() => { setCurrentPage('home'); setIsAdminProfileMenuOpen(false); }}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm text-left transition-colors"
                              >
                                <Zap className="w-4 h-4 text-indigo-400" />
                                View Public Homepage
                              </button>
                              <button
                                onClick={() => { setCurrentPage('userProfile'); setIsAdminProfileMenuOpen(false); }}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm text-left transition-colors"
                              >
                                <User className="w-4 h-4 text-indigo-400" />
                                Admin Profile
                              </button>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-800 w-full">
                              <button
                                onClick={() => handleUserLogout()}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/50 hover:text-red-300 rounded-xl font-semibold transition-colors cursor-pointer"
                              >
                                <LogOut className="w-4 h-4" />
                                Log out
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Tab Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {adminActiveTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Top Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1. Total Users (Customers + Providers Only) */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users (Clients & Providers)</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">
                              {Number(adminOverviewMetrics.metrics.total_users).toLocaleString()}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            ↑ {adminOverviewMetrics.metrics.total_customers} Customers • {adminOverviewMetrics.metrics.total_providers} Providers
                          </span>
                          <span className="text-[11px] text-slate-400">Strictly client & service workforce accounts</span>
                        </div>
                      </div>

                      {/* 2. Completed Bookings */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Bookings</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">
                              {Number(adminOverviewMetrics.metrics.completed_bookings.total).toLocaleString()}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-purple-400">
                            {adminOverviewMetrics.metrics.completed_bookings.by_customers} Client Placed • {adminOverviewMetrics.metrics.completed_bookings.by_providers} Provider Fulfilled
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {adminOverviewMetrics.metrics.completed_bookings.fulfillment_rate}% Platform Fulfillment Rate
                          </span>
                        </div>
                      </div>

                      {/* 3. Active Providers */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Providers</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">
                              {Number(adminOverviewMetrics.metrics.active_providers).toLocaleString()}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-amber-400">
                            {adminOverviewMetrics.metrics.online_providers} Online Now • {adminOverviewMetrics.metrics.pending_providers} Pending Verification
                          </span>
                          <span className="text-[11px] text-slate-400">Registered & vetted in system database</span>
                        </div>
                      </div>
                    </div>

                    {/* Platform Operations & Officers Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-white">Officer Hierarchy & Coverage</h3>
                            <p className="text-xs text-slate-400">Active personnel managing platform modules in real-time from database</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => fetchAdminData()}
                              className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                              title="Refresh real-time data"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${adminIsLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              onClick={() => setAdminActiveTab('users')}
                              className="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              Manage Officers
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-400 uppercase">HR Officers</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            </div>
                            <p className="text-2xl font-black text-white">{adminOverviewMetrics.officers.hr_officers} Active</p>
                            <p className="text-xs text-slate-500 mt-1">{adminOverviewMetrics.officers.hr_pending_verifications} Pending Verifications</p>
                          </div>
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-400 uppercase">Field Supervisors</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            </div>
                            <p className="text-2xl font-black text-white">{adminOverviewMetrics.officers.field_supervisors} On-Site</p>
                            <p className="text-xs text-slate-500 mt-1">{adminOverviewMetrics.officers.field_active_audits} Active Audits in Progress</p>
                          </div>
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-400 uppercase">Finance Controllers</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            </div>
                            <p className="text-2xl font-black text-white">{adminOverviewMetrics.officers.finance_controllers} Active</p>
                            <p className="text-xs text-slate-500 mt-1">LKR {Number(adminOverviewMetrics.officers.finance_cleared_payouts || 0).toLocaleString()} Payouts Cleared</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">System Health</h3>
                          <p className="text-xs text-slate-400 mb-4">Core infrastructure status</p>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-slate-300">MySQL Database (InnoDB)</span>
                                <span className="text-emerald-400 font-bold">{adminOverviewMetrics.system_health.database}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full w-full"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-slate-300">REST API Gateway (Laravel 11)</span>
                                <span className="text-emerald-400 font-bold">{adminOverviewMetrics.system_health.api}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full w-[99.9%]"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-slate-300">PayHere Payment Gateway</span>
                                <span className="text-emerald-400 font-bold">{adminOverviewMetrics.system_health.payment_gateway}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full w-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                          <span>Server: {adminOverviewMetrics.system_health.server_url}</span>
                          <span className="text-indigo-400 font-semibold">{adminOverviewMetrics.system_health.version}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'users' && (
                  <div className="space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/60 p-4 border border-slate-800 rounded-2xl">
                      <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search users by name, email, or role..."
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <select
                          value={adminRoleFilter}
                          onChange={(e) => setAdminRoleFilter(e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                          <option value="all">All Roles</option>
                          <option value="customer">Customers</option>
                          <option value="provider">Providers (Laborers)</option>
                          <option value="supervisor">Field Supervisors</option>
                          <option value="hr">HR Officers</option>
                          <option value="finance">Finance Officers</option>
                          <option value="admin">Administrators</option>
                        </select>
                      </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/90 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {adminUsersList
                            .filter(u => {
                              const matchSearch = (u.name || '').toLowerCase().includes(adminSearchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(adminSearchQuery.toLowerCase());
                              const matchRole = adminRoleFilter === 'all' || u.role === adminRoleFilter;
                              return matchSearch && matchRole;
                            })
                            .map(user => (
                              <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                                      {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-white">{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                      user.role === 'hr' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                        user.role === 'supervisor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                          user.role === 'finance' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                            user.role === 'provider' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                              'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                                    }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{user.phone}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.status === 'active' || user.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      user.status === 'suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' || user.status === 'approved' ? 'bg-emerald-400' :
                                        user.status === 'suspended' ? 'bg-red-400' :
                                          'bg-amber-400'
                                      }`}></span>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">{user.joined}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  {user.role !== 'admin' && (
                                    <button
                                      onClick={() => handleAdminToggleUserStatus(user.id)}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${user.status === 'active' || user.status === 'approved' ? 'bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/50' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50'
                                        }`}
                                    >
                                      {user.status === 'active' || user.status === 'approved' ? 'Suspend' : 'Activate'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'disputes' && (
                  <div className="space-y-6">
                    <div className="bg-slate-950/60 p-6 border border-slate-800 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Escalated Case File Desk</h3>
                          <p className="text-xs text-slate-400">Disputes escalated by Field Supervisors requiring administrative or financial intervention</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                          {adminDisputesList.length} Active Escalations
                        </span>
                      </div>

                      {adminDisputesList.length > 0 ? (
                        <div className="space-y-4">
                          {adminDisputesList.map(dispute => (
                            <div key={dispute.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-slate-700 transition-all">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{dispute.id}</span>
                                  <h4 className="font-bold text-white text-base">{dispute.task}</h4>
                                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${dispute.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}>
                                    {dispute.priority} Priority
                                  </span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{dispute.issue}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
                                  <span><strong className="text-slate-300">Client:</strong> {dispute.client}</span>
                                  <span><strong className="text-slate-300">Provider:</strong> {dispute.provider}</span>
                                  <span><strong className="text-slate-300">Supervisor:</strong> {dispute.supervisor}</span>
                                  <span className="text-indigo-400 font-bold">Disputed Amount: {dispute.amount}</span>
                                </div>
                              </div>

                              <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                <button
                                  onClick={() => handleResolveDispute(dispute.task_id || Number(dispute.id.replace('DIS-', '')), 'release')}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                                >
                                  Release Escrow
                                </button>
                                <button
                                  onClick={() => handleResolveDispute(dispute.task_id || Number(dispute.id.replace('DIS-', '')), 'refund')}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                  Refund Client
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                          <h4 className="text-white font-bold text-base mb-1">No Active Escalated Disputes</h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">All jobs are proceeding smoothly with supervisor audits. Any field escalations will appear here immediately.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {adminActiveTab === 'logs' && (
                  <div className="space-y-6">
                    {/* Sub Navigation Bar inside Security & Audit Logs */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-indigo-400" />
                          Security, Inbound Inquiries & Audit Control
                        </h3>
                        <p className="text-xs text-slate-400">Manage real-time customer contact inquiries and review immutable audit events</p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                        <button
                          onClick={() => setAdminLogsSubTab('messages')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${adminLogsSubTab === 'messages'
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                          <Inbox className="w-3.5 h-3.5" />
                          Inbound Messages
                          <span className="ml-1 bg-black/40 text-indigo-200 text-[10px] px-1.5 py-0.2 rounded-full">
                            {adminContactMessages.length}
                          </span>
                        </button>
                        <button
                          onClick={() => setAdminLogsSubTab('audit')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${adminLogsSubTab === 'audit'
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          System Audit Trail
                        </button>
                      </div>
                    </div>

                    {/* Messages Sub Tab */}
                    {adminLogsSubTab === 'messages' && (
                      <div className="space-y-4">
                        {/* Filter and Search Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={adminMessageSearch}
                                onChange={(e) => setAdminMessageSearch(e.target.value)}
                                placeholder="Search by name, email, subject..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <button
                              onClick={() => fetchAdminData()}
                              title="Refresh Messages"
                              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                            {(['all', 'unread', 'read'] as const).map((filter) => (
                              <button
                                key={filter}
                                onClick={() => setAdminMessageFilter(filter)}
                                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${adminMessageFilter === filter
                                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                                  }`}
                              >
                                {filter} {filter === 'unread' ? `(${adminContactMessages.filter(m => m.status === 'unread').length})` : ''}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Messages List */}
                        {(() => {
                          const filtered = adminContactMessages.filter(msg => {
                            const matchFilter = adminMessageFilter === 'all' || msg.status === adminMessageFilter;
                            const query = adminMessageSearch.toLowerCase();
                            const matchSearch = !query ||
                              msg.name?.toLowerCase().includes(query) ||
                              msg.email?.toLowerCase().includes(query) ||
                              msg.subject?.toLowerCase().includes(query) ||
                              msg.message?.toLowerCase().includes(query);
                            return matchFilter && matchSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="bg-slate-950/60 p-12 border border-slate-800 rounded-2xl text-center space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                                  <Inbox className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-white">No Contact Messages</h4>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                  {adminContactMessages.length === 0
                                    ? "Any message submitted via the public Contact Us page will be recorded in the database and appear here automatically."
                                    : "No messages match your selected search or filter criteria."}
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {filtered.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`p-5 rounded-2xl border transition-all ${msg.status === 'unread'
                                      ? 'bg-slate-950/80 border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                                      : 'bg-slate-950/50 border-slate-800'
                                    }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                                        {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                                          {msg.status === 'unread' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                              Unread
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                          <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:underline flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {msg.email}
                                          </a>
                                          <span>&bull;</span>
                                          <span className="text-slate-500">
                                            {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Recent'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-medium">
                                        {msg.subject || 'General Inquiry'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Message Body */}
                                  <div className="bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-200 leading-relaxed font-sans mb-3">
                                    {msg.message}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                                    <div className="text-[11px] text-slate-500">
                                      Message ID: <span className="font-mono text-slate-400">#MSG-{String(msg.id).padStart(4, '0')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: [TaskLink Support] ${msg.subject || 'Inquiry'}`)}`}
                                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                      >
                                        <Send className="w-3 h-3" />
                                        Reply via Email
                                      </a>
                                      <button
                                        onClick={() => handleUpdateMessageStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                      >
                                        <Check className="w-3 h-3" />
                                        {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (window.confirm('Are you sure you want to delete this message?')) {
                                            handleDeleteAdminMessage(msg.id);
                                          }
                                        }}
                                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors cursor-pointer"
                                        title="Delete Message"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Audit Trail Sub Tab */}
                    {adminLogsSubTab === 'audit' && (
                      <div className="bg-slate-950/60 p-6 border border-slate-800 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white">Cryptographic Immutable Audit Trail</h4>
                            <p className="text-xs text-slate-400">Strict system logging compliant with Sri Lanka PDPA No. 09 of 2022</p>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Active Audit Engine
                          </span>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-bold">[AUTH-SUCCESS]</span>
                              <span>Admin session initialized for <strong>admin@tasklink.com</strong></span>
                            </div>
                            <span className="text-slate-500">Just now</span>
                          </div>
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="text-indigo-400 font-bold">[CONTACT-MSG]</span>
                              <span>Contact inquiry relay listener registered for public submissions</span>
                            </div>
                            <span className="text-slate-500">5 mins ago</span>
                          </div>
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="text-indigo-400 font-bold">[MIGRATION]</span>
                              <span>MySQL schema validated: contact_messages table registered</span>
                            </div>
                            <span className="text-slate-500">20 mins ago</span>
                          </div>
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="text-amber-400 font-bold">[ESCROW-HOLD]</span>
                              <span>Milestone payment locked for verified contract booking</span>
                            </div>
                            <span className="text-slate-500">45 mins ago</span>
                          </div>
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="text-blue-400 font-bold">[HR-VERIFY]</span>
                              <span>Worker NIC and credentials verified: TaskLink Field Operations</span>
                            </div>
                            <span className="text-slate-500">1 hour ago</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSupervisorEscalateModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsSupervisorEscalateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">Escalate Dispute</h2>
                <button onClick={() => setIsSupervisorEscalateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Describe the issue (e.g., safety hazards, pricing arguments, severe connectivity drops) to alert Admin and Finance officers immediately.</p>

              <textarea
                value={supervisorEscalateDescription}
                onChange={(e) => setSupervisorEscalateDescription(e.target.value)}
                placeholder="Enter details..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none h-32 mb-4"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsSupervisorEscalateModalOpen(false)}
                  className="py-3 px-4 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (supervisorSelectedJob) {
                      handleSupervisorEscalate(supervisorSelectedJob.id);
                    }
                  }}
                  disabled={!supervisorEscalateDescription.trim()}
                  className="py-3 px-4 font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 rounded-xl shadow-md transition-colors text-sm cursor-pointer"
                >
                  Halt & Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Task Options Modal */}
      <AnimatePresence>
        {isPostTaskOptionsOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsPostTaskOptionsOpen(false)}
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md mx-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsPostTaskOptionsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 mb-2 mt-2">How would you like to hire?</h2>
              <p className="text-sm text-slate-500 mb-6">Choose how you want to connect with providers.</p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setCurrentPage('directHireList');
                    setIsPostTaskOptionsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 text-left rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">Direct Hire</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Browse providers and invite them directly to discuss your task.</p>
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('postTask');
                    setIsPostTaskOptionsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 text-left rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-purple-900 transition-colors">Broadcast Job (Global Search)</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Post your task publicly and let qualified providers apply.</p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Incoming Job Alert Modal */}
      <AnimatePresence>
        {incomingJobAlert && (
          <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-indigo-200/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-indigo-600 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-[0%] left-[0%] w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    <Zap className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">New Job Matching Your Profile!</h2>
                  <p className="text-indigo-100 text-sm font-medium">Accept quickly before another provider takes it.</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Time Remaining</p>
                    <p className="text-xs text-slate-500 text-left">Reserving slot for</p>
                  </div>
                </div>
                <div className="text-4xl font-black tabular-nums text-amber-500 tracking-tighter">
                  00:{jobAlertCountdown.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{incomingJobAlert.title}</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md mt-2 inline-block">{incomingJobAlert.category}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-indigo-700 text-xl">LKR {incomingJobAlert.budget.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mt-1 ${incomingJobAlert.isNegotiable ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {incomingJobAlert.isNegotiable ? 'Negotiable' : 'Fixed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-indigo-500" /> {incomingJobAlert.location || incomingJobAlert.neighborhood || 'Your Area'}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Scope</h4>
                  <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-200 pl-3">{incomingJobAlert.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (incomingJobAlert?.id) {
                      handleDeclineTask(Number(incomingJobAlert.id));
                    }
                    setIncomingJobAlert(null);
                  }}
                  className="py-3.5 px-4 text-sm font-bold text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  Pass Job
                </button>
                <button
                  onClick={async () => {
                    if (incomingJobAlert?.id) {
                      await handleAcceptTask(Number(incomingJobAlert.id));
                    }
                    setIncomingJobAlert(null);
                  }}
                  className="py-3.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all cursor-pointer"
                >
                  Accept Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg mx-4 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Job Completed!</h2>
              <p className="text-sm text-slate-500 mb-8 text-center px-4">Your task has been successfully completed. Please leave a review for your provider to help others.</p>

              <div className="flex flex-col items-center gap-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Rate the Provider</h3>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`p-2 rounded-full transition-all hover:scale-110 cursor-pointer ${feedbackRating >= star ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                    >
                      <Star className="w-10 h-10 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Write a Review</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Share your experience working with this provider..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 resize-none transition-all"
                />
              </div>

              <button
                disabled={feedbackRating === 0}
                onClick={async () => {
                  const token = localStorage.getItem('tasklink_token');
                  const taskId = trackingTask?.rawId || (typeof trackingTask?.id === 'string' ? parseInt(trackingTask.id.replace('TASK-', '')) : trackingTask?.id);
                  if (token && taskId) {
                    try {
                      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/tasks/${taskId}/review`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          rating: feedbackRating,
                          comment: feedbackText
                        })
                      });
                    } catch (err) {
                      console.error('Failed to submit review:', err);
                    }
                  }
                  if (taskId) {
                    reviewedTaskIdsRef.current.add(taskId);
                  }
                  showToast('Review Submitted', 'Thank you for rating your service provider!', 'success');
                  setCompletedTasksCount(prev => prev + 1);
                  setIsFeedbackModalOpen(false);
                  setFeedbackRating(0);
                  setFeedbackText('');
                  setTrackingTask(null);
                  setMilestoneIndex(0);
                  await fetchCustomerTasks();
                  setCurrentPage('customerDashboard');
                }}
                className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${feedbackRating > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Submit Review
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {isReportIssueModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsReportIssueModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Escalate / Report Issue</h2>
                <button onClick={() => setIsReportIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-6">Please describe the issue you are facing on-site. This alert will be sent immediately to the administrative dashboard and your assigned Field Supervisor.</p>

              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="e.g., Additional plumbing materials needed, or Customer requested extra work outside original scope..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none h-32 text-sm"
              ></textarea>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsReportIssueModalOpen(false)}
                  className="w-full py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsReportIssueModalOpen(false);
                    setIssueDescription('');
                    showToast('Issue Reported', 'Field Supervisor and Administration have been notified.', 'warning');
                  }}
                  disabled={!issueDescription.trim()}
                  className={`w-full py-3 text-sm font-bold text-white rounded-2xl transition-colors ${!issueDescription.trim() ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'}`}
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Custom Toast Notification System */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] max-w-md w-full px-4 pointer-events-auto"
          >
            <div className={`p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border backdrop-blur-2xl flex items-start gap-3.5 transition-all ${activeToast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/20'
                : activeToast.type === 'error'
                  ? 'bg-slate-900/95 text-white border-red-500/40 shadow-red-950/20'
                  : activeToast.type === 'warning'
                    ? 'bg-slate-900/95 text-white border-amber-500/40 shadow-amber-950/20'
                    : 'bg-slate-900/95 text-white border-indigo-500/40 shadow-indigo-950/20'
              }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${activeToast.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : activeToast.type === 'error'
                    ? 'bg-red-500/20 text-red-400'
                    : activeToast.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                {activeToast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {activeToast.type === 'error' && <XCircle className="w-5 h-5" />}
                {activeToast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {activeToast.type === 'info' && <Zap className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-white leading-snug">{activeToast.title}</h4>
                {activeToast.message && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeToast.message}</p>
                )}
              </div>

              <button
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {(currentUserRole !== 'supervisor' && currentUserRole !== 'hr' && currentUserRole !== 'finance' && currentUserRole !== 'admin') && (
        <footer className="relative z-10 border-t border-slate-200/60 bg-white/30 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-xl text-slate-800 tracking-tight">TaskLink</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-600">
                <button
                  onClick={(e) => { e.preventDefault(); setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-indigo-600 hover:bg-white/50 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-indigo-600 hover:bg-white/50 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Contact Us
                </button>
                <a href="https://www.termsfeed.com/live/25fdcf14-89f3-4873-9c8f-bbacfa91592b" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:bg-white/50 px-4 py-2 rounded-xl transition-all">Terms & Conditions</a>
                <a href="https://www.termsfeed.com/live/25fdcf14-89f3-4873-9c8f-bbacfa91592b" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:bg-white/50 px-4 py-2 rounded-xl transition-all">Privacy Policy</a>
              </div>

              <div className="text-sm text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} TaskLink Inc. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      )}
      <Analytics />
    </div>
  );
}
