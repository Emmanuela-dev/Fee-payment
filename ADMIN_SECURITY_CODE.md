# Admin Security Code

## Current Admin Security Code: `SCHOOL2025ADMIN`

This security code is required when registering as an admin.

### How to Use:

1. Go to the registration page
2. Select "Admin" from the "Register As" dropdown
3. Fill in your details
4. Enter the security code: `SCHOOL2025ADMIN`
5. Click "Create Account"

### To Change the Security Code:

Edit this file:
`backend/spring-payment/src/main/java/payment/project/spring_payment/controller/AdminAuthController.java`

Find the line:
```java
private static final String ADMIN_SECURITY_CODE = "SCHOOL2025ADMIN";
```

Change `SCHOOL2025ADMIN` to your preferred code.

### Security Note:

⚠️ Keep this code confidential. Only share it with authorized personnel who should have admin access.

For production, consider:
- Using environment variables instead of hardcoded values
- Implementing one-time use codes
- Adding email verification for admin registration
- Implementing multi-factor authentication
