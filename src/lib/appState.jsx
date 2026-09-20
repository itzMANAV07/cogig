import { createContext, useContext, useState } from 'react';
import { DEMO_WORKERS, DEMO_COOP, DEMO_CITIES, DEMO_WORKER_TICKETS } from './demoData';

const AppStateContext = createContext(null);

const INITIAL_BOOKINGS = [
  {
    id: 'BK-1092',
    serviceName: 'AC Repair & Maintenance',
    category: 'Household',
    workersCount: 2,
    daysCount: 1,
    siteAddress: 'Prakruthi Twp - Horamavu Agara - Hennur, Bengaluru',
    startDate: '2026-09-14',
    totalCost: 1430,
    workerEarnings: 1330,
    welfareFund: 72,
    platformFee: 28,
    status: 'ACTIVE',
    coopName: 'Bengaluru Workers Labour Cooperative Society',
    assignedWorkers: ['Manjunath Gowda (AC Tech)', 'Suresh Yadav (Helper)'],
    approvalStatus: 'PENDING_APPROVAL',
    photos: {
      before: '/ac-before.png',
    },
  },
  {
    id: 'BK-1088',
    serviceName: 'Society Painting & Water-proofing',
    category: 'Community',
    workersCount: 4,
    daysCount: 3,
    siteAddress: 'Vidyanagar Main Road, Davangere, Karnataka',
    startDate: '2026-09-10',
    totalCost: 7590,
    workerEarnings: 7059,
    welfareFund: 380,
    platformFee: 151,
    status: 'COMPLETED',
    coopName: 'Sri Basaveshwara Labour Cooperative Society',
    assignedWorkers: ['Anita Devi (Supervisor)', 'Vikram Singh', 'Manoj Thakur', 'Deepak Rana'],
    approvalStatus: 'APPROVED',
    photos: {
      before: '/wall-before.png',
      after: '/wall-after.png',
    },
  },
];

const INITIAL_SURGING_JOBS = [
  {
    id: 'plumber',
    title: 'Plumbing & Pipe Leakage Repair',
    surgeReason: '+128% Pre-Monsoon Surge Demand in Bengaluru & Davangere',
    discountPill: 'High Demand',
    rate: 550,
  },
  {
    id: 'electrician',
    title: 'Emergency Electrical & Circuit Wiring',
    surgeReason: 'Priority Crew Available for Quick Dispatch',
    discountPill: 'Priority Available',
    rate: 600,
  },
];

const INITIAL_WORKERS = DEMO_COOP.workers;

export function AppStateProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(DEMO_CITIES[0]); // Bengaluru default
  const [customer, setCustomer] = useState({
    name: 'Anjali Mehta',
    phone: '98765 43210',
    place: DEMO_CITIES[0].defaultAddress,
  });
  const [selectedCategory, setSelectedCategory] = useState('household');
  const [selectedService, setSelectedService] = useState(null);
  const [requirement, setRequirement] = useState(null);

  // App-wide reactive state for real workflow interaction
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [surgingJobs, setSurgingJobs] = useState(INITIAL_SURGING_JOBS);
  const [workersList, setWorkersList] = useState(INITIAL_WORKERS);
  const [workerOnline, setWorkerOnline] = useState(true);
  const [ticketsList, setTicketsList] = useState(DEMO_COOP.tickets);

  // Worker-side support tickets
  const [workerTicketsList, setWorkerTicketsList] = useState(DEMO_WORKER_TICKETS);

  const changeCity = (cityObj) => {
    setSelectedCity(cityObj);
    setCustomer((prev) => ({ ...prev, place: cityObj.defaultAddress }));
  };

  const addBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const addWorker = (newWorker) => {
    setWorkersList((prev) => [{ ...newWorker, id: Date.now(), verified: true }, ...prev]);
  };

  const addTicket = (newTicket) => {
    setTicketsList((prev) => [{ ...newTicket, id: Date.now() }, ...prev]);
  };

  const addWorkerTicket = (newTicket) => {
    const id = Date.now();
    const created = { ...newTicket, id };
    setWorkerTicketsList((prev) => [created, ...prev]);
    // Also sync to ticketsList so Coop Admin can view and resolve it
    setTicketsList((prev) => [
      {
        id,
        ticketId: newTicket.ticketId || `TKT-W-${String(id).slice(-4)}`,
        reporterType: 'worker',
        worker: 'Manjunath Gowda',
        reporterName: 'Manjunath Gowda',
        preferredLanguage: 'kn',
        issue: newTicket.description || newTicket.issue,
        originalMessage: newTicket.description || newTicket.issue,
        aiSummary: newTicket.description
          ? `Worker reports ${newTicket.category || 'general'} issue: "${newTicket.description}"`
          : 'Issue reported by cooperative worker',
        aiViolationType:
          newTicket.category === 'payment'
            ? 'payment_dispute'
            : newTicket.category === 'safety'
            ? 'safety_hazard'
            : newTicket.category === 'harassment'
            ? 'harassment'
            : 'general',
        hasVoiceMessage: true,
        status: 'OPEN',
        category: newTicket.category,
        created_at: newTicket.createdAt || new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateTicketStatus = (ticketId, newStatus, adminNote) => {
    setTicketsList((prev) =>
      prev.map((t) =>
        (t.ticketId === ticketId || t.id === ticketId)
          ? { ...t, status: newStatus, adminNote: adminNote ?? t.adminNote }
          : t
      )
    );
    setWorkerTicketsList((prev) =>
      prev.map((t) =>
        (t.ticketId === ticketId || t.id === ticketId)
          ? {
              ...t,
              status: newStatus,
              resolvedBy: newStatus === 'RESOLVED' ? 'Shanti Labour Cooperative' : t.resolvedBy,
              adminNote: adminNote ?? t.adminNote,
            }
          : t
      )
    );
  };

  const value = {
    selectedCity,
    changeCity,
    customer,
    setCustomer,
    selectedCategory,
    setSelectedCategory,
    selectedService,
    setSelectedService,
    requirement,
    setRequirement,
    bookings,
    setBookings,
    addBooking,
    surgingJobs,
    setSurgingJobs,
    workersList,
    setWorkersList,
    addWorker,
    workerOnline,
    setWorkerOnline,
    ticketsList,
    setTicketsList,
    addTicket,
    workerTicketsList,
    setWorkerTicketsList,
    addWorkerTicket,
    updateTicketStatus,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
