/* ==========================================================================
   LINCONE FEDERAL CREDIT UNION - EMAILJS NOTIFICATION MODULE
   ========================================================================== */

const EmailService = {
  SERVICE_ID: 'service_trlvuws',
  TEMPLATE_ID: 'Sage1909',
  PUBLIC_KEY: '9zVEGau5i1yKnXZND',
  initialized: false,

  init() {
    if (typeof emailjs !== 'undefined' && !this.initialized) {
      try {
        emailjs.init(this.PUBLIC_KEY);
        this.initialized = true;
        console.log('EmailJS initialized successfully.');
      } catch (e) {
        console.error('EmailJS init error:', e);
      }
    }
  },

  generateProfessionalHTML(txn, recipientEmail) {
    const user = StorageManager.getUser();
    const formattedAmount = Helpers.formatCurrency(txn.amount);
    const dateStr = txn.date || new Date().toISOString().split('T')[0];
    const timeStr = txn.time || new Date().toLocaleTimeString();

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>LincOne FCU Transaction Advice</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; margin: 0; padding: 20px; }
    .email-card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .email-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 32px; border-bottom: 2px solid #10b981; text-align: center; }
    .brand-title { color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 1px; margin: 0; }
    .brand-sub { color: #10b981; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    .email-body { padding: 32px; }
    .heading { font-size: 18px; color: #f8fafc; font-weight: 700; margin-bottom: 12px; }
    .message-intro { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .amount-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .amount-label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .amount-value { color: #10b981; font-size: 32px; font-weight: 800; font-family: monospace; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #334155; font-size: 14px; }
    .details-table td.label { color: #94a3b8; width: 40%; }
    .details-table td.val { color: #f8fafc; font-weight: 600; text-align: right; }
    .status-badge { background: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; }
    .email-footer { background: #0f172a; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="email-header">
      <div class="brand-title">LINCONE FEDERAL CREDIT UNION</div>
      <div class="brand-sub">Official Transaction Advice</div>
    </div>
    <div class="email-body">
      <div class="heading">Transaction Notification</div>
      <p class="message-intro">This is an automated confirmation of a transaction processed through the LincOne Federal Credit Union digital banking system.</p>
      
      <div class="amount-box">
        <div class="amount-label">Transaction Amount</div>
        <div class="amount-value">${formattedAmount}</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Reference Number</td>
          <td class="val" style="font-family:monospace;">${txn.ref}</td>
        </tr>
        <tr>
          <td class="label">Beneficiary / Payee</td>
          <td class="val">${txn.beneficiary}</td>
        </tr>
        <tr>
          <td class="label">Sender / Account Holder</td>
          <td class="val">${user.name} (${user.accountType})</td>
        </tr>
        <tr>
          <td class="label">Transaction Type</td>
          <td class="val">${txn.type} (${txn.method || 'Direct Transfer'})</td>
        </tr>
        <tr>
          <td class="label">Date & Time</td>
          <td class="val">${dateStr} at ${timeStr}</td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="val"><span class="status-badge">${txn.status || 'Pending'}</span></td>
        </tr>
      </table>
    </div>
    <div class="email-footer">
      <p>Encrypted 256-bit SSL Banking Session • Member ID: ${user.id || 'L1FCU-610000'}</p>
      <p>© 2026 LincOne Federal Credit Union. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  },

  async sendTransferNotification(txn, recipientEmail) {
    this.init();
    const user = StorageManager.getUser();
    const targetEmail = recipientEmail || txn.recipientEmail || user.email || 'Jamieodlee@gmail.com';
    const emailHtml = this.generateProfessionalHTML(txn, targetEmail);
    const formattedAmount = Helpers.formatCurrency(txn.amount);

    const templateParams = {
      to_name: txn.beneficiary || user.name,
      to_email: targetEmail,
      recipient_name: txn.beneficiary || user.name,
      recipient_email: targetEmail,
      email: targetEmail,
      user_email: targetEmail,
      from_name: 'LincOne Federal Credit Union',
      sender_name: user.name || 'Jamie Odle',
      bank_name: 'LincOne Federal Credit Union',
      amount: formattedAmount,
      transfer_amount: formattedAmount,
      ref_number: txn.ref,
      reference_number: txn.ref,
      txn_ref: txn.ref,
      transaction_id: txn.ref,
      date: txn.date || new Date().toISOString().split('T')[0],
      time: txn.time || new Date().toLocaleTimeString(),
      purpose: txn.purpose || 'Bank Transfer',
      status: txn.status || 'Pending',
      method: txn.method || 'Wire Transfer',
      message: emailHtml,
      html_message: emailHtml,
      email_message: emailHtml,
      subject: `LincOne FCU Transfer Advice: ${formattedAmount} (Ref: ${txn.ref})`
    };

    console.log('Sending EmailJS notification with params:', templateParams);

    if (typeof emailjs !== 'undefined') {
      try {
        const response = await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams, this.PUBLIC_KEY);
        console.log('EmailJS notification sent successfully!', response.status, response.text);
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('Transfer email notification dispatched!', 'success');
        }
        return { success: true, response };
      } catch (err) {
        console.error('EmailJS notification failed to send:', err);
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast('Note: Email notification dispatch attempted.', 'info');
        }
        return { success: false, error: err };
      }
    } else {
      console.warn('EmailJS SDK not available on window object.');
      return { success: false, error: 'EmailJS SDK not loaded' };
    }
  }
};
