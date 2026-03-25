/**
 * Email Client using Resend
 * 
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get API key
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxx
 * 4. Verify your domain or use onboarding@resend.dev for testing
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: options.from || process.env.EMAIL_FROM || "SMM Panel <noreply@yourdomain.com>",
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[EMAIL] Error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log("[EMAIL] Sent successfully:", data.id);
    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("[EMAIL] Error sending:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, username: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to SMM Panel!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SMM Panel!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Thank you for joining SMM Panel! Your account has been created successfully.</p>
              <p>You can now:</p>
              <ul>
                <li>Browse our services</li>
                <li>Place orders</li>
                <li>Add funds to your wallet</li>
                <li>Track your orders</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/new-order" class="button">Start Ordering</a>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,<br>SMM Panel Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SMM Panel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderId: number;
    serviceName: string;
    quantity: number;
    charge: number;
    link: string;
  }
) {
  return sendEmail({
    to: email,
    subject: `Order #${orderDetails.orderId} Confirmed`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Your order has been placed successfully and is being processed.</p>
              <div class="order-details">
                <h3>Order Details</h3>
                <div class="detail-row">
                  <span>Order ID:</span>
                  <strong>#${orderDetails.orderId}</strong>
                </div>
                <div class="detail-row">
                  <span>Service:</span>
                  <strong>${orderDetails.serviceName}</strong>
                </div>
                <div class="detail-row">
                  <span>Quantity:</span>
                  <strong>${orderDetails.quantity}</strong>
                </div>
                <div class="detail-row">
                  <span>Link:</span>
                  <strong>${orderDetails.link}</strong>
                </div>
                <div class="detail-row">
                  <span>Charge:</span>
                  <strong>$${orderDetails.charge.toFixed(2)}</strong>
                </div>
              </div>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/orders" class="button">View Order</a>
              <p>You will receive another email when your order is completed.</p>
              <p>Best regards,<br>SMM Panel Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SMM Panel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  email: string,
  orderDetails: {
    orderId: number;
    serviceName: string;
    status: string;
  }
) {
  const statusMessages: Record<string, string> = {
    completed: "Your order has been completed successfully!",
    partial: "Your order has been partially completed.",
    cancelled: "Your order has been cancelled.",
    refunded: "Your order has been refunded.",
  };

  return sendEmail({
    to: email,
    subject: `Order #${orderDetails.orderId} - ${orderDetails.status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
            .status-completed { background: #10b981; color: white; }
            .status-partial { background: #f59e0b; color: white; }
            .status-cancelled { background: #ef4444; color: white; }
            .status-refunded { background: #6366f1; color: white; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Status Update</h1>
            </div>
            <div class="content">
              <p>${statusMessages[orderDetails.status] || "Your order status has been updated."}</p>
              <div class="status-badge status-${orderDetails.status}">
                ${orderDetails.status.toUpperCase()}
              </div>
              <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
              <p><strong>Service:</strong> ${orderDetails.serviceName}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/orders" class="button">View Order</a>
              <p>Thank you for using SMM Panel!</p>
              <p>Best regards,<br>SMM Panel Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SMM Panel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send fund approval email
 */
export async function sendFundApprovalEmail(
  email: string,
  details: {
    amount: number;
    newBalance: number;
  }
) {
  return sendEmail({
    to: email,
    subject: "Fund Request Approved",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 36px; font-weight: bold; color: #10b981; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Fund Request Approved!</h1>
            </div>
            <div class="content">
              <p>Great news! Your fund request has been approved.</p>
              <div class="amount">$${details.amount.toFixed(2)}</div>
              <p>has been added to your account.</p>
              <p><strong>New Balance:</strong> $${details.newBalance.toFixed(2)}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/new-order" class="button">Start Ordering</a>
              <p>Thank you for using SMM Panel!</p>
              <p>Best regards,<br>SMM Panel Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SMM Panel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send fund rejection email
 */
export async function sendFundRejectionEmail(
  email: string,
  details: {
    amount: number;
    reason: string;
  }
) {
  return sendEmail({
    to: email,
    subject: "Fund Request Rejected",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reason { background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Fund Request Rejected</h1>
            </div>
            <div class="content">
              <p>Unfortunately, your fund request of <strong>$${details.amount.toFixed(2)}</strong> has been rejected.</p>
              <div class="reason">
                <strong>Reason:</strong> ${details.reason}
              </div>
              <p>Please contact support if you have any questions or try submitting a new request with correct details.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/add-funds" class="button">Try Again</a>
              <p>Best regards,<br>SMM Panel Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SMM Panel. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
