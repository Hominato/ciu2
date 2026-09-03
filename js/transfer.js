/* ==========================================================================
   LINCONE FEDERAL CREDIT UNION - THREE-STAGE TRANSFER WIZARD MODULE
   ========================================================================== */

const TransferWizard = {
  currentStage: 1,
  currentTxnData: null,
  isVerified: false,

  init() {
    this.resetWizard();
  },

  resetWizard() {
    this.currentStage = 1;
    this.isVerified = false;
    this.currentTxnData = null;

    // Reset Stepper
    this.updateStepperUI(1);

    // Reset Stage Panels
    document.querySelectorAll('.transfer-stage-panel').forEach(p => p.classList.remove('active'));
    const stage1 = document.getElementById('transferStage1');
    if (stage1) stage1.classList.add('active');

    // Reset Form Fields
    const terminal = document.getElementById('verificationTerminal');
    if (terminal) {
      terminal.classList.remove('show');
      document.getElementById('terminalLogContent').innerHTML = '';
    }

    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = `
        <span>Verify Beneficiary</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      `;
    }

    const amountInput = document.getElementById('transferAmountInput');
    if (amountInput) amountInput.value = '';

    const refInput = document.getElementById('transferRefInput');
    if (refInput) refInput.value = Helpers.generateTxnRef();

    this.updateLiveCalculations();
  },

  startTransferWithPreset() {
    Dashboard.switchView('transfer');
    this.resetWizard();
  },

  onBeneficiaryChange() {
    const sel = document.getElementById('transferBeneficiarySelect').value;
    const nameEl = document.getElementById('benName');
    const emailEl = document.getElementById('benEmailInput');
    const bankEl = document.getElementById('benBank');
    const accEl = document.getElementById('benAccount');
    const routEl = document.getElementById('benRouting');
    const bondEl = document.getElementById('benBond');

    if (sel === 'custom') {
      [nameEl, emailEl, bankEl, accEl, routEl, bondEl].forEach(el => {
        if (el) {
          el.removeAttribute('readonly');
          el.value = '';
        }
      });
      if (nameEl) nameEl.placeholder = 'Enter Beneficiary Name';
      if (emailEl) emailEl.placeholder = 'Enter Recipient Email';
      if (bankEl) bankEl.placeholder = 'Enter Bank Name';
      if (accEl) accEl.placeholder = 'Enter Account Number';
      if (routEl) routEl.placeholder = 'Enter Routing Number';
      if (bondEl) bondEl.placeholder = 'Enter Funding Source / Bond';

      UI.showToast('Custom beneficiary mode enabled. Please enter beneficiary details.', 'info');
    } else {
      if (nameEl) { nameEl.value = 'Jamie Odle'; nameEl.setAttribute('readonly', 'true'); }
      if (emailEl) { emailEl.value = 'Jamieodlee@gmail.com'; }
      if (bankEl) { bankEl.value = 'LincOne FCU'; bankEl.setAttribute('readonly', 'true'); }
      if (accEl) { accEl.value = '********5625'; accEl.setAttribute('readonly', 'true'); }
      if (routEl) { routEl.value = '********3632'; routEl.setAttribute('readonly', 'true'); }
      if (bondEl) { bondEl.value = 'UNHCR'; bondEl.setAttribute('readonly', 'true'); }
    }
  },

  // ------------------------------------------------------------------------
  // STAGE 1: BENEFICIARY VERIFICATION TERMINAL SIMULATION
  // ------------------------------------------------------------------------
  runVerificationStage1() {
    const btn = document.getElementById('verifyBtn');
    const terminal = document.getElementById('verificationTerminal');
    const logBox = document.getElementById('terminalLogContent');

    const benName = (document.getElementById('benName') && document.getElementById('benName').value.trim()) || '';
    const benAccount = (document.getElementById('benAccount') && document.getElementById('benAccount').value.trim()) || '';
    const benRouting = (document.getElementById('benRouting') && document.getElementById('benRouting').value.trim()) || '';

    if (!benName || !benAccount) {
      UI.showToast('Please enter the beneficiary name and account number.', 'error');
      return;
    }

    btn.disabled = true;
    terminal.classList.add('show');
    logBox.innerHTML = '';

    const logs = [
      'Connecting to LincOne FCU secure clearing network...',
      `Querying Receiving Routing Node (${benRouting || '********3632'})...`,
      `Verifying beneficiary account ${benAccount} (${benName})...`,
      'Checking funding source link...',
      `SUCCESS: Beneficiary ${benName} Verified & Active`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'terminal-log-line';
        if (index === logs.length - 1) {
          line.innerHTML = `<span style="color:#10B981">✔</span> <strong>${log}</strong>`;
        } else {
          line.innerHTML = `<div class="terminal-spinner"></div> <span>${log}</span>`;
        }
        logBox.appendChild(line);

        if (index === logs.length - 1) {
          this.isVerified = true;
          UI.showToast('Beneficiary verified successfully!', 'success');
          
          btn.innerHTML = `
            <span>Beneficiary Verified</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          `;

          setTimeout(() => {
            this.goToStage(2);
          }, 600);
        }
      }, (index + 1) * 600);
    });
  },

  // ------------------------------------------------------------------------
  // STAGE 2: LIVE CALCULATIONS & VALIDATION
  // ------------------------------------------------------------------------
  updateLiveCalculations() {
    const accounts = StorageManager.getAccounts();
    const currentBalance = accounts.checking.balance;

    const amountInput = document.getElementById('transferAmountInput');
    const amountVal = parseFloat(amountInput ? amountInput.value : 0) || 0;

    const remaining = currentBalance - amountVal;

    const availEl = document.getElementById('stage2AvailBalance');
    const remEl = document.getElementById('stage2RemainingBalance');

    if (availEl) availEl.textContent = Helpers.formatCurrency(currentBalance);
    if (remEl) {
      remEl.textContent = Helpers.formatCurrency(remaining);
      if (remaining < 0) {
        remEl.style.color = 'var(--accent-danger)';
      } else {
        remEl.style.color = 'var(--accent-emerald)';
      }
    }
  },

  proceedToStage3() {
    const accounts = StorageManager.getAccounts();
    const currentBalance = accounts.checking.balance;
    const amountInput = document.getElementById('transferAmountInput').value;
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount <= 0) {
      UI.showToast('Please enter a valid transfer amount greater than $0.00', 'error');
      return;
    }

    if (amount > currentBalance) {
      UI.showToast(`Transfer amount cannot exceed available balance (${Helpers.formatCurrency(currentBalance)})`, 'error');
      return;
    }

    // Build Current Txn Data Object
    const ref = document.getElementById('transferRefInput').value || Helpers.generateTxnRef();
    const purpose = document.getElementById('transferPurposeSelect').value;
    const method = document.getElementById('benMethod').value;
    const benName = document.getElementById('benName').value;
    const benBank = document.getElementById('benBank').value;
    const benAccount = document.getElementById('benAccount').value;
    const benRouting = document.getElementById('benRouting').value;
    const benBond = document.getElementById('benBond').value;
    const recipientEmail = (document.getElementById('benEmailInput') && document.getElementById('benEmailInput').value) || 'Jamieodlee@gmail.com';

    this.currentTxnData = {
      ref,
      beneficiary: benName,
      bank: benBank,
      accountNumber: benAccount,
      routingNumber: benRouting,
      bond: benBond,
      method,
      purpose,
      amount,
      recipientEmail,
      type: 'Transfer',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    // Populate Stage 3 Review UI
    document.getElementById('revBenName').textContent = benName;
    document.getElementById('revBenBank').textContent = benBank;
    document.getElementById('revBenAccount').textContent = benAccount;
    document.getElementById('revBenRouting').textContent = benRouting;
    document.getElementById('revBenBond').textContent = benBond;
    document.getElementById('revBenMethod').textContent = method;
    document.getElementById('revPurpose').textContent = purpose;
    document.getElementById('revRef').textContent = ref;
    document.getElementById('revAmount').textContent = Helpers.formatCurrency(amount);

    this.goToStage(3);
  },

  // ------------------------------------------------------------------------
  // STAGE 3: EXECUTE & SIMULATED PROCESSING MODAL
  // ------------------------------------------------------------------------
  executeFinalTransfer() {
    if (!this.currentTxnData) return;

    // Show Processing Modal
    const modalContent = `
      <div class="processing-modal-content">
        <h4 style="margin-bottom: 12px;">Dispatched to LincOne FCU Network</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">Please do not refresh. Encrypted transfer in progress...</p>
        
        <div class="progress-bar-track">
          <div id="processingProgressFill" class="progress-bar-fill"></div>
        </div>

        <div id="processingStepText" class="processing-step-status">Initializing transfer...</div>
      </div>
    `;

    UI.showModal('Processing Wire Transfer', modalContent);

    const fill = document.getElementById('processingProgressFill');
    const stepText = document.getElementById('processingStepText');

    const steps = [
      { pct: 20, text: 'Initializing transfer sequence...' },
      { pct: 40, text: 'Encrypting transaction payload (AES-256)...' },
      { pct: 60, text: 'Connecting to LincOne FCU network...' },
      { pct: 80, text: 'Sending payment to beneficiary account...' },
      { pct: 100, text: 'Awaiting ledger authorization...' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        if (fill) fill.style.width = `${step.pct}%`;
        if (stepText) stepText.textContent = step.text;

        if (index === steps.length - 1) {
          setTimeout(() => {
            UI.closeModal();
            this.completeTransferSuccess();
          }, 600);
        }
      }, (index + 1) * 700);
    });
  },

  completeTransferSuccess() {
    const txn = this.currentTxnData;
    txn.status = 'Pending';
    const accounts = StorageManager.getAccounts();
    const newBalance = accounts.checking.balance - txn.amount;

    // Persist to LocalStorage
    StorageManager.updateCheckingBalance(newBalance);
    StorageManager.addTransaction(txn);
    StorageManager.addNotification(
      'Transfer Pending',
      `${Helpers.formatCurrency(txn.amount)} sent to ${txn.beneficiary} (${txn.ref}) - Status: Pending.`
    );

    // Trigger EmailJS Notification
    if (typeof EmailService !== 'undefined') {
      EmailService.sendTransferNotification(txn, txn.recipientEmail);
    }

    // Save for receipt generator module
    ReceiptManager.setCurrentReceipt(txn);

    // Update Dashboard UI Balances
    Dashboard.renderBalances();

    // Show Success Panel
    document.querySelectorAll('.transfer-stage-panel').forEach(p => p.classList.remove('active'));
    const successPanel = document.getElementById('transferSuccessPanel');
    if (successPanel) successPanel.classList.add('active');

    const refBadge = document.getElementById('successRefBadge');
    if (refBadge) refBadge.textContent = txn.ref;

    UI.showToast('Transfer submitted! Status: Pending', 'info');
  },

  // ------------------------------------------------------------------------
  // Stepper Controller Helper
  // ------------------------------------------------------------------------
  goToStage(stageNum) {
    this.currentStage = stageNum;
    this.updateStepperUI(stageNum);

    document.querySelectorAll('.transfer-stage-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`transferStage${stageNum}`);
    if (target) target.classList.add('active');
  },

  updateStepperUI(stageNum) {
    const lineFill = document.getElementById('stepperProgressFill');
    if (lineFill) {
      if (stageNum === 1) lineFill.style.width = '0%';
      if (stageNum === 2) lineFill.style.width = '50%';
      if (stageNum === 3) lineFill.style.width = '100%';
    }

    [1, 2, 3].forEach(num => {
      const stepEl = document.getElementById(`stepIndicator${num}`);
      if (stepEl) {
        stepEl.classList.remove('active', 'completed');
        if (num === stageNum) stepEl.classList.add('active');
        if (num < stageNum) stepEl.classList.add('completed');
      }
    });
  }
};
