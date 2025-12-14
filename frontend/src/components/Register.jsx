import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerParent } from '../services/api';
import api from '../services/api';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'PARENT', // Default to parent
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            if (formData.role === 'ADMIN') {
                // Register as admin
                const response = await api.post('/api/auth/admin/create', {
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Register as parent
                await registerParent({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password
                });
            }
            // Redirect to appropriate login page
            const loginPath = formData.role === 'ADMIN' ? '/admin/login' : '/login';
            navigate(loginPath, { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            console.error('Registration error:', err);
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to server. Please ensure the backend is running on port 8080.');
            } else if (err.response?.data) {
                // Handle string response or object with message
                const errorMsg = typeof err.response.data === 'string' 
                    ? err.response.data 
                    : err.response.data.message || 'Registration failed';
                setError(errorMsg);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Join our school payment system</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Register As</label>
                        <select
                            style={styles.input}
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="PARENT">Parent</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>First Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {formData.role === 'PARENT' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                                style={styles.input}
                                type="tel"
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required={formData.role === 'PARENT'}
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
    },
    card: {
        background: 'var(--background)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        width: '100%',
        maxWidth: '480px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: 'var(--text-primary)',
    },
    hint: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        marginTop: '0.25rem',
        fontStyle: 'italic',
    },
    input: {
        padding: '0.75rem 1rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
    },
    button: {
        backgroundColor: 'var(--success-color)',
        color: 'white',
        border: 'none',
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    error: {
        backgroundColor: '#fef2f2',
        color: 'var(--error-color)',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        fontSize: '0.875rem',
        textAlign: 'center',
    },
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
    },
    footerText: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '0.875rem',
    },
    link: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Register;