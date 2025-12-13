# Paystack Payment Integration Setup

## Getting Your Paystack API Keys

1. **Create a Paystack Account**
   - Go to [https://paystack.com](https://paystack.com)
   - Click "Get Started" to create an account
   - Complete the registration process

2. **Get Your Test API Keys**
   - Login to your Paystack Dashboard
   - Navigate to **Settings** → **API Keys & Webhooks**
   - You'll find two keys:
     - **Public Key** (starts with `pk_test_...`)
     - **Secret Key** (starts with `sk_test_...`)

3. **Update Your Application**
   
   **Frontend (Payment.jsx):**
   - Open `frontend/src/components/Payment.jsx`
   - Find line with: `key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxx'`
   - Replace with your actual **Public Key**
   
   ```javascript
   key: 'pk_test_your_actual_public_key_here',
   ```

## Important Notes

- **Test Mode**: Use test keys (starting with `pk_test_` and `sk_test_`) for development
- **Live Mode**: Only use live keys (starting with `pk_live_` and `sk_live_`) when going to production
- **Never Commit**: Never commit your secret keys to Git. Add them to `.env` file
- **Test Cards**: Use Paystack test cards for testing:
  - Card: `4084084084084081`
  - CVV: `408`
  - Expiry: Any future date
  - PIN: `0000`
  - OTP: `123456`

## Currency Configuration

Currently set to **KES (Kenya Shillings)**. To change:
- Edit `Payment.jsx`
- Change `currency: 'KES'` to your preferred currency (e.g., 'NGN' for Nigerian Naira)
- Adjust the amount multiplier if needed (×100 for kobo/cents)

## Testing Payments

1. Start the backend server
2. Start the frontend
3. Register/Login as a parent
4. Navigate to an invoice
5. Click "Pay Now"
6. Use test card details above
7. Payment will be processed through Paystack
8. Balance will update in your database

## Webhook Setup (Optional for Production)

For production, set up webhooks to receive real-time payment notifications:
1. Go to Paystack Dashboard → Settings → Webhooks
2. Add your webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Implement webhook handler in your backend to verify and process payments
