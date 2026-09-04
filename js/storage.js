/* ==========================================================================
   LINCONE FEDERAL CREDIT UNION - LOCALSTORAGE DATA MANAGER & DEFAULT STATE SEEDER
   ========================================================================== */

const STORAGE_KEY = 'lincone_fcu_banking_system_v11';

const DEFAULT_STATE = {
  user: {
    name: 'Jamie Odle',
    id: 'L1FCU-610000',
    accountType: 'Premier Checking',
    memberSince: 'Sep 2026',
    status: 'Verified',
    email: 'Jamieodlee@gmail.com',
    phone: '283-218-9384',
    address: '742 Evergreen Terrace, New York, NY 10001'
  },
  accounts: {
    checking: {
      name: 'Premier Checking Account',
      balance: 0.00,
      accountNumber: '********5625',
      routingNumber: '********3632'
    },
    savings: {
      name: 'High-Yield Share Savings',
      balance: 0.00,
      accountNumber: '********9012',
      routingNumber: '********3632'
    },
    investment: {
      name: 'Credit Union Share Certificates',
      balance: 250000.00,
      firm: 'LincOne Federal Credit Union',
      dayReturnPercent: 0.71,
      dayReturnAmount: 1775.00,
      ytdReturnPercent: 14.2
    }
  },
  beneficiary: {
    name: 'Jason Murphy',
    bank: 'JPMorgan Chase Bank',
    accountNumber: '596225808',
    routingNumber: '021000021',
    investmentBond: 'UNHCR',
    disbursementMethods: ['Bank Transfer', 'Check']
  },
  card: {
    number: '4532 8912 3456 5625',
    expiry: '08/29',
    holder: 'JAMIE ODLE',
    cvv: '882',
    frozen: false,
    contactless: true,
    dailyLimit: 50000
  },
  transactions: [
    {
      ref: 'TXN-610002',
      beneficiary: 'Jason Murphy',
      bank: 'JPMorgan Chase Bank',
      accountNumber: '596225808',
      routingNumber: '021000021',
      amount: 610000.00,
      type: 'Transfer',
      method: 'Bank Transfer',
      status: 'Pending',
      date: '2026-09-04',
      time: '00:43:10',
      bond: 'Wire Node 021000021',
      purpose: 'Full Available Balance Transfer'
    },
    {
      ref: 'TXN-610001',
      beneficiary: 'Jamie Odle',
      bank: 'LincOne FCU',
      amount: 610000.00,
      type: 'Deposit',
      method: 'Direct Credit',
      status: 'Completed',
      date: '2026-09-03',
      time: '10:41:00',
      bond: 'UNHCR Financial Allocation',
      purpose: 'Initial Account Deposit'
    }
  ],
  notifications: [
    {
      id: 'notif-4',
      title: 'Transfer Pending',
      message: '$610,000.00 transfer to Jason Murphy (Acct: 596225808, Routing: 021000021) is pending.',
      time: 'Just now',
      read: false
    },
    {
      id: 'notif-1',
      title: 'Welcome to LincOne Federal Credit Union',
      message: 'Your Premier Checking account balance is $610,000.00.',
      time: 'Just now',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Initial Account Deposit Credited',
      message: '$610,000.00 received from LincOne FCU.',
      time: '1 hour ago',
      read: true
    },
    {
      id: 'notif-3',
      title: 'Security Verification Successful',
      message: 'Beneficiary Jason Murphy verified for transfers.',
      time: '1 day ago',
      read: true
    }
  ],
  preferences: {
    theme: 'dark',
    language: 'en',
    emailAlerts: true,
    pushAlerts: true,
    twoFactor: true
  }
};

const StorageManager = {
  // Get entire state tree
  getStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveStore(DEFAULT_STATE);
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
      const parsed = JSON.parse(data);
      if (!parsed.user || parsed.user.name !== 'Jamie Odle' || !parsed.transactions || parsed.transactions.length < 1) {
        this.saveStore(DEFAULT_STATE);
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
      return parsed;
    } catch (e) {
      console.error('Error loading LocalStorage state:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  },

  // Save entire state tree
  saveStore(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving LocalStorage state:', e);
    }
  },

  // Specific Getters & Modifiers
  getUser() {
    return this.getStore().user;
  },

  updateUser(userData) {
    const store = this.getStore();
    store.user = { ...store.user, ...userData };
    this.saveStore(store);
  },

  getAccounts() {
    return this.getStore().accounts;
  },

  updateCheckingBalance(newBalance) {
    const store = this.getStore();
    store.accounts.checking.balance = newBalance;
    this.saveStore(store);
  },

  getBeneficiary() {
    return this.getStore().beneficiary;
  },

  getCard() {
    return this.getStore().card;
  },

  updateCard(cardData) {
    const store = this.getStore();
    store.card = { ...store.card, ...cardData };
    this.saveStore(store);
  },

  getTransactions() {
    return this.getStore().transactions || [];
  },

  addTransaction(txn) {
    const store = this.getStore();
    if (!Array.isArray(store.transactions)) {
      store.transactions = [];
    }
    store.transactions.unshift(txn);
    this.saveStore(store);
  },

  getNotifications() {
    return this.getStore().notifications || [];
  },

  addNotification(title, message) {
    const store = this.getStore();
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false
    };
    store.notifications.unshift(newNotif);
    this.saveStore(store);
  },

  getPreferences() {
    return this.getStore().preferences;
  },

  savePreferences(prefs) {
    const store = this.getStore();
    store.preferences = { ...store.preferences, ...prefs };
    this.saveStore(store);
  },

  resetToDefaults() {
    this.saveStore(DEFAULT_STATE);
  }
};
