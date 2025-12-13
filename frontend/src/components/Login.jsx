import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginParent } from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await loginParent({ email, password });
            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                {successMessage && <div style={styles.success}>{successMessage}</div>}
                {error && <div style={styles.error}>{error}</div>}

                <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>Create one</Link>
                    </p>
                    <p style={styles.footerText}>
                        <Link to="/admin/login" style={styles.link}>Admin Login</Link>
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
        maxWidth: '420px',
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
        backgroundColor: 'var(--primary-color)',
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
    success: {
        backgroundColor: '#f0fdf4',
        color: '#166534',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
        fontSize: '0.875rem',
        textAlign: 'center',
        marginBottom: '1rem',
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

export default Login;