# School Payment System - Complete API Documentation

## Base URL
```
http://localhost:8080
```

## Overview
REST API for school payment system with JWT authentication supporting parent and admin roles. This system manages students, invoices, and payments with secure access control.

---

## 🔐 Authentication

### Token-Based Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Token Structure
The JWT token contains:
- `email`: User's email address
- `role`: User role (PARENT or ADMIN)
- `userId`: User's unique ID
- `exp`: Token expiration (24 hours from creation)

### Token Expiration
- **Duration:** 24 hours
- **Renewal:** Re-login required after expiration
- **Storage:** Store securely in AsyncStorage (React Native) or localStorage (Web)

---

## 📋 Quick Start Guide

### For Parents (Mobile App):
1. Register → `POST /api/auth/parent/register`
2. Login → `POST /api/auth/parent/login` (save token)
3. View children → `GET /api/parent/{parentId}/students`
4. View invoices → `GET /api/parent/{parentId}/invoices`
5. Make payment → `POST /api/pay`

### For Admins:
1. Create admin → `POST /api/auth/admin/create`
2. Login → `POST /api/auth/admin/login` (save token)
3. Create students → `POST /api/students`
4. Generate invoices → `POST /api/admin/invoices/bulk`
5. View dashboard → `GET /api/admin/dashboard`

---

## Common Response Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input or already exists |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 🔑 Authentication Endpoints

### 1. Register Parent

Register a new parent account.

**Endpoint:** `POST /api/auth/parent/register`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PARENT",
    "userId": 1
}
```

**Errors:**
- `400` - Email already registered

---

### 2. Parent Login

Authenticate an existing parent.

**Endpoint:** `POST /api/auth/parent/login`

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PARENT",
    "userId": 1
}
```

**Errors:**
- `400` - Invalid email or password

---

### 3. Admin Login

Authenticate an admin user.

**Endpoint:** `POST /api/auth/admin/login`

**Request Body:**
```json
{
    "email": "admin@school.com",
    "password": "AdminPass123"
}
```

**Response:** `200 OK`
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@school.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "userId": 1
}
```

---

### 4. Create Admin Account

Create initial admin account (for setup only).

**Endpoint:** `POST /api/auth/admin/create`

**Request Body:**
```json
{
    "email": "admin@school.com",
    "password": "AdminPass123"
}
```

**Response:** `200 OK`
```json
"Admin created successfully with email: admin@school.com"
```

**Note:** Secure or remove this endpoint in production after initial setup.

---

## 👨‍👩‍👧‍👦 Parent Endpoints

### 1. Get Parent's Children

Retrieve all students linked to a parent.

**Endpoint:** `GET /api/parent/{parentId}/students`

**Path Parameters:**
- `parentId` (number, required): Parent's ID from login response

**Example:** `GET /api/parent/1/students`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "firstName": "Alice",
        "lastName": "Doe",
        "admissionNumber": "ADM001",
        "invoices": [],
        "payments": []
    },
    {
        "id": 2,
        "firstName": "Bob",
        "lastName": "Doe",
        "admissionNumber": "ADM002",
        "invoices": [],
        "payments": []
    }
]
```

---

### 2. Get All Invoices for Parent's Children

Retrieve all invoices across all children of a parent.

**Endpoint:** `GET /api/parent/{parentId}/invoices`

**Path Parameters:**
- `parentId` (number, required): Parent's ID

**Example:** `GET /api/parent/1/invoices`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "student": {
            "id": 1,
            "firstName": "Alice",
            "lastName": "Doe",
            "admissionNumber": "ADM001"
        },
        "amountDue": 1000.00,
        "amountPaid": 500.00,
        "balance": 500.00,
        "status": "PARTIAL",
        "createdAt": "2025-12-11T13:30:00",
        "payments": []
    }
]
```

---

### 3. Get All Payments by Parent's Children

Retrieve payment history for all children.

**Endpoint:** `GET /api/parent/{parentId}/payments`

**Path Parameters:**
- `parentId` (number, required): Parent's ID

**Example:** `GET /api/parent/1/payments`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "amountPaid": 500.00,
        "paymentDate": "2025-12-11T13:45:00",
        "student": {
            "id": 1,
            "firstName": "Alice",
            "lastName": "Doe"
        },
        "invoice": {
            "id": 1,
            "amountDue": 1000.00,
            "balance": 500.00
        }
    }
]
```

---

### 4. Get Parent Profile

Retrieve parent profile information.

**Endpoint:** `GET /api/parent/{parentId}`

**Example:** `GET /api/parent/1`

**Response:** `200 OK`
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "students": [
        {
            "id": 1,
            "firstName": "Alice",
            "lastName": "Doe",
            "admissionNumber": "ADM001"
        }
    ]
}
```

---

## 👨‍💼 Admin Endpoints

### 1. Bulk Generate Invoices

Create invoices for multiple students at once.

**Endpoint:** `POST /api/admin/invoices/bulk`

**Request Body:**
```json
{
    "studentIds": [1, 2, 3, 4, 5],
    "amountDue": 1000.00
}
```

**Field Descriptions:**
- `studentIds` (array, required): List of student IDs to generate invoices for
- `amountDue` (number, required): Invoice amount for each student

**Response:** `200 OK`
```json
{
    "message": "Invoices created successfully",
    "count": 5,
    "invoices": [
        {
            "id": 1,
            "student": {
                "id": 1,
                "firstName": "Alice",
                "lastName": "Doe"
            },
            "amountDue": 1000.00,
            "amountPaid": 0.00,
            "balance": 1000.00,
            "status": "UNPAID",
            "createdAt": "2025-12-11T14:00:00"
        }
    ]
}
```

---

### 2. Get Dashboard Statistics

Retrieve comprehensive dashboard statistics.

**Endpoint:** `GET /api/admin/dashboard`

**Response:** `200 OK`
```json
{
    "totalStudents": 150,
    "totalInvoices": 450,
    "totalPayments": 320,
    "invoiceStats": {
        "unpaid": 80,
        "partiallyPaid": 50,
        "paid": 320
    },
    "financialStats": {
        "totalAmountDue": 450000.00,
        "totalAmountPaid": 380000.00,
        "totalBalance": 70000.00
    }
}
```

---

### 3. Get All Invoices with Filters

Retrieve all invoices with optional status filter.

**Endpoint:** `GET /api/admin/invoices?status={status}`

**Query Parameters:**
- `status` (string, optional): Filter by status (PAID, UNPAID, PARTIAL)

**Example:** `GET /api/admin/invoices?status=UNPAID`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "student": {
            "id": 1,
            "firstName": "Alice",
            "lastName": "Doe"
        },
        "amountDue": 1000.00,
        "amountPaid": 0.00,
        "balance": 1000.00,
        "status": "UNPAID",
        "createdAt": "2025-12-11T14:00:00"
    }
]
```

**Status Values:**
- `UNPAID` - No payments made
- `PARTIAL` - Partially paid
- `PAID` - Fully paid

---

### 4. Get All Students (Admin View)

Retrieve all students in the system.

**Endpoint:** `GET /api/admin/students`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "firstName": "Alice",
        "lastName": "Doe",
        "admissionNumber": "ADM001",
        "parent": null,
        "invoices": [],
        "payments": []
    }
]
```

---

## 👥 Student Endpoints

### 1. Create Student

Creates a new student in the system.

**Endpoint:** `POST /api/students`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "admissionNumber": "ADM12345"
}
```

**Field Descriptions:**
- `firstName` (string, required): Student's first name
- `lastName` (string, required): Student's last name
- `admissionNumber` (string, required, unique): Student's admission number

**Response:** `200 OK`
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "admissionNumber": "ADM12345",
    "invoices": [],
    "payments": []
}
```

---

### 2. Get All Students

Retrieves a list of all students.

**Endpoint:** `GET /api/students`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "admissionNumber": "ADM12345",
        "invoices": [],
        "payments": []
    },
    {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "admissionNumber": "ADM12346",
        "invoices": [],
        "payments": []
    }
]
```

---

### 3. Get Student by ID

Retrieves a specific student by their ID.

**Endpoint:** `GET /api/students/{id}`

**Path Parameters:**
- `id` (number, required): Student ID

**Example:** `GET /api/students/1`

**Response:** `200 OK`
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "admissionNumber": "ADM12345",
    "invoices": [
        {
            "id": 1,
            "amountDue": 1000.00,
            "amountPaid": 500.00,
            "balance": 500.00,
            "status": "PARTIAL",
            "createdAt": "2025-12-11T13:30:00"
        }
    ],
    "payments": []
}
```

---

### 4. Update Student

Updates an existing student's information.

**Endpoint:** `POST /api/students/{id}`

**Path Parameters:**
- `id` (number, required): Student ID

**Request Body:**
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "admissionNumber": "ADM12345"
}
```

**Response:** `200 OK`
```json
{
    "id": 1,
    "firstName": "Jane",
    "lastName": "Doe",
    "admissionNumber": "ADM12345",
    "invoices": [],
    "payments": []
}
```

---

### 5. Delete Student

Deletes a student from the system.

**Endpoint:** `DELETE /api/students/{id}`

**Path Parameters:**
- `id` (number, required): Student ID

**Example:** `DELETE /api/students/1`

**Response:** `200 OK`
```json
"Student deleted Successfully"
```

---

## 📄 Invoice Endpoints

### 1. Create Invoice

Creates a new invoice for a specific student.

**Endpoint:** `POST /api/invoices/{studentId}`

**Path Parameters:**
- `studentId` (number, required): ID of the student for whom the invoice is created

**Request Body:**
```json
{
    "amountDue": 1000.00
}
```

**Response:** `200 OK`
```json
{
    "id": 1,
    "student": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "admissionNumber": "ADM12345"
    },
    "amountDue": 1000.00,
    "amountPaid": 0.00,
    "balance": 1000.00,
    "status": "UNPAID",
    "createdAt": "2025-12-11T13:30:00",
    "payments": []
}
```

**Invoice Status Values:**
- `UNPAID` - No payments made
- `PARTIAL` - Some payments made but balance remains
- `PAID` - Fully paid

---

### 2. Get Invoices for Student

Retrieves all invoices for a specific student.

**Endpoint:** `GET /api/invoices/student/{studentId}`

**Path Parameters:**
- `studentId` (number, required): Student ID

**Example:** `GET /api/invoices/student/1`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "amountDue": 1000.00,
        "amountPaid": 500.00,
        "balance": 500.00,
        "status": "PARTIAL",
        "createdAt": "2025-12-11T13:30:00"
    },
    {
        "id": 2,
        "amountDue": 500.00,
        "amountPaid": 500.00,
        "balance": 0.00,
        "status": "PAID",
        "createdAt": "2025-12-11T14:00:00"
    }
]
```

---

### 3. Get Single Invoice

Retrieves a specific invoice by its ID.

**Endpoint:** `GET /api/invoices/{invoiceId}`

**Path Parameters:**
- `invoiceId` (number, required): Invoice ID

**Example:** `GET /api/invoices/1`

**Response:** `200 OK`
```json
{
    "id": 1,
    "student": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "admissionNumber": "ADM12345"
    },
    "amountDue": 1000.00,
    "amountPaid": 500.00,
    "balance": 500.00,
    "status": "PARTIAL",
    "createdAt": "2025-12-11T13:30:00",
    "payments": [
        {
            "id": 1,
            "amountPaid": 500.00,
            "paymentDate": "2025-12-11T13:45:00"
        }
    ]
}
```

---

## 💰 Payment Endpoints

### 1. Create Payment

Creates a payment for an invoice.

**Endpoint:** `POST /api/pay`

**Request Body:**
```json
{
    "studentId": 1,
    "invoiceId": 1,
    "amountPaid": 500.00
}
```

**Field Descriptions:**
- `studentId` (number, required): ID of the student making the payment
- `invoiceId` (number, required): ID of the invoice being paid
- `amountPaid` (number, required): Amount being paid

**Response:** `200 OK`
```json
{
    "id": 1,
    "student": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "admissionNumber": "ADM12345"
    },
    "invoice": {
        "id": 1,
        "amountDue": 1000.00,
        "amountPaid": 500.00,
        "balance": 500.00,
        "status": "PARTIAL"
    },
    "amountPaid": 500.00,
    "paymentDate": "2025-12-11T13:45:00"
}
```

**Business Rules:**
- Payment amount cannot exceed the invoice balance
- Invoice must belong to the specified student
- Invoice status is automatically updated after payment

**Error Responses:**
```json
// Student not found
{
    "timestamp": "2025-12-11T13:45:00.000+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "Student not found"
}

// Invoice not found
{
    "timestamp": "2025-12-11T13:45:00.000+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "Invoice Not Found"
}

// Invoice doesn't belong to student
{
    "timestamp": "2025-12-11T13:45:00.000+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "Invoice does not belong to the student"
}

// Payment exceeds amount due
{
    "timestamp": "2025-12-11T13:45:00.000+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "Payment exceeds amount due"
}
```

---

## 🔄 Typical Workflow

### Complete User Journey

#### 1. Admin Setup & Student Creation
```bash
# Create admin account
POST /api/auth/admin/create
Body: {"email": "admin@school.com", "password": "admin123"}

# Admin login
POST /api/auth/admin/login
Body: {"email": "admin@school.com", "password": "admin123"}
# Save token and adminId

# Create students
POST /api/students
Body: {"firstName": "Alice", "lastName": "Smith", "admissionNumber": "ADM001"}

POST /api/students
Body: {"firstName": "Bob", "lastName": "Smith", "admissionNumber": "ADM002"}
```

#### 2. Parent Registration
```bash
# Register parent
POST /api/auth/parent/register
Body: {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "password": "parent123"
}
# Save parentId from response
```

#### 3. Generate Invoices
```bash
# Admin generates invoices for all students
POST /api/admin/invoices/bulk
Body: {"studentIds": [1, 2], "amountDue": 1000.00}
```

#### 4. Parent Views and Pays
```bash
# Parent login
POST /api/auth/parent/login
Body: {"email": "john@example.com", "password": "parent123"}

# View children
GET /api/parent/1/students

# View invoices
GET /api/parent/1/invoices

# Make payment
POST /api/pay
Body: {"studentId": 1, "invoiceId": 1, "amountPaid": 500.00}

# View payment history
GET /api/parent/1/payments
```

#### 5. Admin Monitors
```bash
# View dashboard
GET /api/admin/dashboard

# Filter unpaid invoices
GET /api/admin/invoices?status=UNPAID
```

---

## 📱 React Native Integration

### Setup with Axios

#### Install Dependencies
```bash
npm install axios @react-native-async-storage/async-storage
```

#### API Service (`services/api.js`)
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests automatically
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication
export const registerParent = (data) => api.post('/api/auth/parent/register', data);
export const loginParent = (data) => api.post('/api/auth/parent/login', data);
export const loginAdmin = (data) => api.post('/api/auth/admin/login', data);

// Parent endpoints
export const getMyChildren = (parentId) => api.get(`/api/parent/${parentId}/students`);
export const getMyInvoices = (parentId) => api.get(`/api/parent/${parentId}/invoices`);
export const getMyPayments = (parentId) => api.get(`/api/parent/${parentId}/payments`);
export const getParentProfile = (parentId) => api.get(`/api/parent/${parentId}`);

// Admin endpoints
export const generateBulkInvoices = (data) => api.post('/api/admin/invoices/bulk', data);
export const getDashboard = () => api.get('/api/admin/dashboard');
export const getAllInvoices = (status) => 
    api.get('/api/admin/invoices', { params: { status } });
export const getAllStudents = () => api.get('/api/admin/students');

// Student endpoints
export const createStudent = (data) => api.post('/api/students', data);
export const getStudents = () => api.get('/api/students');

// Invoice endpoints
export const createInvoice = (studentId, data) => 
    api.post(`/api/invoices/${studentId}`, data);
export const getStudentInvoices = (studentId) => 
    api.get(`/api/invoices/student/${studentId}`);

// Payment
export const makePayment = (data) => api.post('/api/pay', data);

export default api;
```

### Example Login Screen

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginParent } from './services/api';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await loginParent({ email, password });
            const { token, userId, firstName, lastName, role } = response.data;
            
            // Store token and user info
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userId', userId.toString());
            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('userName', `${firstName} ${lastName}`);
            
            // Navigate to dashboard
            navigation.navigate('ParentDashboard', { parentId: userId });
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button 
                title={loading ? "Logging in..." : "Login"} 
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default LoginScreen;
```

### Example Parent Dashboard

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, RefreshControl } from 'react-native';
import { getMyChildren, getMyInvoices } from './services/api';

function ParentDashboard({ route, navigation }) {
    const { parentId } = route.params;
    const [children, setChildren] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [childrenRes, invoicesRes] = await Promise.all([
                getMyChildren(parentId),
                getMyInvoices(parentId)
            ]);
            setChildren(childrenRes.data);
            setInvoices(invoicesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handlePay = (invoice) => {
        navigation.navigate('Payment', { 
            invoice,
            studentId: invoice.student.id 
        });
    };

    if (loading) return <Text style={styles.loading}>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Children</Text>
            <FlatList
                data={children}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text>Admission: {item.admissionNumber}</Text>
                    </View>
                )}
            />

            <Text style={styles.title}>Invoices</Text>
            <FlatList
                data={invoices}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {item.student.firstName} {item.student.lastName}
                        </Text>
                        <Text>Amount Due: ${item.amountDue.toFixed(2)}</Text>
                        <Text>Balance: ${item.balance.toFixed(2)}</Text>
                        <Text style={styles.status}>Status: {item.status}</Text>
                        {item.balance > 0 && (
                            <Button 
                                title="Pay Now" 
                                onPress={() => handlePay(item)}
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    status: {
        marginTop: 5,
        fontWeight: '500',
        color: '#666',
    },
});

export default ParentDashboard;
```

---

## 🧪 Testing with Postman

### Environment Variables
Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:8080`
- `adminToken`: (set after admin login)
- `parentToken`: (set after parent login)
- `adminId`: (set after admin login)
- `parentId`: (set after parent login)

### Test Sequence
1. Create admin account
2. Admin login (save token)
3. Create students
4. Register parent
5. Generate invoices
6. Parent login
7. View invoices
8. Make payment
9. Check dashboard

---

## 🔒 Security Notes

### For Production:

1. **JWT Secret Key**
   - Change the secret key in `JwtUtil.java`
   - Store in environment variables
   - Use a strong, random key

2. **HTTPS Only**
   - Enable SSL/TLS
   - Redirect HTTP to HTTPS

3. **Authentication**
   - Currently all endpoints are public for testing
   - Enable authentication in `SecurityConfig.java`
   - Implement role-based access control

4. **Rate Limiting**
   - Add rate limiting for login endpoints
   - Prevent brute force attacks

5. **Input Validation**
   - Add validation annotations
   - Sanitize user inputs

6. **Database**
   - Switch from H2 to production database (MySQL/PostgreSQL)
   - Use connection pooling
   - Enable SSL for database connections

---

## 💾 Database Configuration

### Current Setup (Development)
- **Type:** H2 In-Memory Database
- **Data Persistence:** None (resets on restart)
- **Access:** H2 Console at `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** (empty)

### For Production
Update `application.properties`:
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/school_payment
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 🌐 CORS Configuration

Currently configured for:
- React Web: `http://localhost:3000`
- React Native: `http://localhost:19006`

To add more origins, update `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:19006",
    "https://your-production-domain.com"
));
```

---

## 📊 Data Models

### Invoice Status
- `UNPAID` - No payments made
- `PARTIAL` - Partially paid
- `PAID` - Fully paid

### User Roles
- `PARENT` - Parent users (mobile app)
- `ADMIN` - Admin users (web dashboard)

### Relationships
- Parent → Students (One-to-Many)
- Student → Invoices (One-to-Many)
- Student → Payments (One-to-Many)
- Invoice → Payments (One-to-Many)

---

## ❓ Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure your frontend URL is added to `SecurityConfig.java`
- Check that CORS is enabled

**2. 401 Unauthorized**
- Check token is being sent in Authorization header
- Verify token hasn't expired (24 hours)
- Ensure token format: `Bearer <token>`

**3. Database Resets on Restart**
- Expected behavior with H2 in-memory database
- For persistence, configure MySQL/PostgreSQL

**4. Connection Refused**
- Ensure backend is running on port 8080
- Check firewall settings
- Verify `baseURL` in frontend matches backend

**5. Invalid Credentials**
- Passwords are case-sensitive
- Ensure email is correct
- Check user exists in database

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review error messages and stack traces
3. Verify request/response format
4. Test with Postman first
5. Check application logs

---

**Last Updated:** December 11, 2025

**API Version:** 1.0

**Spring Boot Version:** 3.5.8
