# Email Integration Instructions

## Quick Integration Guide

Since the automated string replacement had issues, here's the manual integration guide:

### 1. Update `src/lib/actions/orders.ts`

Add import at the top:
```typescript
import { sendOrderConfirmationEmail } from "@/lib/email/client";
```

Add this code BEFORE the return statement (around line 218):
```typescript
  // Send order confirmation email (non-blocking)
  sendOrderConfirmationEmail(user.email!, {
    orderId: order.id,
    serviceName: service.name,
    quantity,
    charge,
    link: link.trim(),
  }).catch((err) => {
    console.error("Failed to send order confirmation email:", err);
  });
```

### 2. Update `src/lib/actions/wallet.ts`

Add imports at the top:
```typescript
import { sendFundApprovalEmail, sendFundRejectionEmail } from "@/lib/email/client";
```

In `approveFundRequest` function, add BEFORE the return statement:
```typescript
  // Get user email
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", transaction.user_id)
    .single();

  // Send approval email (non-blocking)
  if (userProfile?.email) {
    sendFundApprovalEmail(userProfile.email, {
      amount: transaction.amount,
      newBalance,
    }).catch((err) => {
      console.error("Failed to send fund approval email:", err);
    });
  }
```

In `rejectFundRequest` function, add BEFORE the return statement:
```typescript
  // Get transaction and user details
  const { data: txData } = await supabase
    .from("transactions")
    .select("*, user:profiles(email)")
    .eq("id", transactionId)
    .single();

  // Send rejection email (non-blocking)
  if (txData?.user?.email) {
    sendFundRejectionEmail(txData.user.email, {
      amount: txData.amount,
      reason,
    }).catch((err) => {
      console.error("Failed to send fund rejection email:", err);
    });
  }
```

### 3. Update `src/lib/cron/update-order-status.ts`

Add import at the top:
```typescript
import { sendOrderStatusEmail } from "@/lib/email/client";
```

In the main loop where status is updated (around line 60), add AFTER status update:
```typescript
        // Send status update email for completed/partial/cancelled/refunded
        if (["completed", "partial", "cancelled", "refunded"].includes(newStatus)) {
          // Get user email
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", order.user_id)
            .single();

          if (userProfile?.email) {
            sendOrderStatusEmail(userProfile.email, {
              orderId: order.id,
              serviceName: order.service.name,
              status: newStatus,
            }).catch((err) => {
              console.error("Failed to send status update email:", err);
            });
          }
        }
```

## Already Integrated

✅ `src/lib/actions/auth.ts` - Welcome email on signup (DONE)

## Testing

After integration, test each email:

1. **Welcome Email**: Register a new account
2. **Order Confirmation**: Place an order
3. **Status Update**: Wait for cron job or manually update order status
4. **Fund Approval**: Admin approves fund request
5. **Fund Rejection**: Admin rejects fund request

Check Resend dashboard for delivery status.

## Environment Variables Required

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=SMM Panel <noreply@yourdomain.com>
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Time Required

- Manual integration: 15-20 minutes
- Testing: 10-15 minutes
- Total: 30 minutes

## Alternative: Automated Script

If you prefer, I can create a Node.js script to automatically apply these changes.
