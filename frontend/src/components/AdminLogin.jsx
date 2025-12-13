import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/admin/login', { email, password });
            login(response.data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Admin Login</h2>
                    <p style={styles.subtitle}>Access the admin panel</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter admin email"
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
                        {loading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Not an admin?{' '}
                        <Link to="/login" style={styles.link}>Parent Login</Link>
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
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
    },
    error: {
        background: '#fee2e2',
        color: '#991b1b',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.875rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    input: {
        padding: '0.875rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '0.875rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        marginTop: '0.5rem',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
    },
    footerText: {
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
    },
};

export default AdminLogin;
