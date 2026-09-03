/* ==========================================================================
   LINCONE FEDERAL CREDIT UNION - APP AUTHENTICATION & LOGIN LOGIC
   ========================================================================== */

const App = {
  initLogin() {
    // Check if user is already logged in
    if (sessionStorage.getItem('tunex_authenticated') === 'true') {
      window.location.href = 'dashboard.html';
    }
  },

  togglePasswordVisibility() {
    const pwdInput = document.getElementById('password');
    if (!pwdInput) return;
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
    } else {
      pwdInput.type = 'password';
    }
  },

  handleLogin(event) {
    event.preventDefault();
    const btn = document.getElementById('loginBtn');
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Defined valid credentials
    const VALID_ACCOUNTS = [
      { email: 'Jamieodlee@gmail.com', password: 'Redpuddin', name: 'Jamie Odle' },
      { email: 'Monifranc23@gmail.com', password: 'Monique@2026', name: 'Monique Franco' }
    ];

    if (!email) {
      UI.showToast('Please enter your email address', 'error');
      return;
    }

    if (!password) {
      UI.showToast('Please enter your password', 'error');
      return;
    }

    // Show simulated loading spinner on button
    btn.disabled = true;
    btn.innerHTML = `
      <div class="terminal-spinner" style="width: 18px; height: 18px; border-color: rgba(255,255,255,0.3); border-top-color: #fff;"></div>
      <span>Authenticating...</span>
    `;

    setTimeout(() => {
      // Validate credentials (case insensitive email check)
      const matchedUser = VALID_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (!matchedUser) {
        btn.disabled = false;
        btn.innerHTML = `
          <span>Secure Sign In</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        `;
        UI.showToast('Invalid email or password. Please check your credentials.', 'error');
        return;
      }

      // Save session state
      sessionStorage.setItem('tunex_authenticated', 'true');
      sessionStorage.setItem('tunex_active_user', matchedUser.email);

      UI.showToast('Authentication Successful. Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }, 1200);
  },

  handleForgot(event) {
    event.preventDefault();
    UI.showModal(
      'Account Recovery',
      `
      <p style="margin-bottom: 12px;">Use the following credentials to access your account:</p>
      <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--card-border); border-radius: 12px; padding: 16px; margin-bottom: 16px; font-size: 0.88rem;">
        <div style="margin-bottom: 8px;"><span style="color: var(--text-muted);">Email:</span> <strong style="color: var(--accent-blue);">Jamieodlee@gmail.com</strong></div>
        <div><span style="color: var(--text-muted);">Password:</span> <strong style="color: var(--accent-emerald);">Redpuddin</strong></div>
      </div>
      <div style="text-align: right;">
        <button class="btn btn-primary btn-sm" onclick="UI.closeModal()">Got it</button>
      </div>
      `
    );
  },

  logout() {
    sessionStorage.removeItem('tunex_authenticated');
    sessionStorage.removeItem('tunex_active_user');
    window.location.href = 'index.html';
  }
};
