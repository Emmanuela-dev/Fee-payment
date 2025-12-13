import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyChildren, getMyInvoices } from '../services/api';

function ParentDashboard() {
    const { user, logout } = useAuth();
    const [children, setChildren] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [childrenRes, invoicesRes] = await Promise.all([
                getMyChildren(user.userId),
                getMyInvoices(user.userId)
            ]);
            setChildren(childrenRes.data);
            setInvoices(invoicesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = (invoice) => {
        navigate('/payment', { state: { invoice, studentId: invoice.student.id } });
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading your dashboard...</p>
            </div>
        );
    }

    const totalDue = invoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Parent Dashboard</h1>
                    <p style={styles.subtitle}>Welcome back, {user.firstName}!</p>
                </div>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* Stats Overview */}
            <div style={styles.statsGrid}>
                <div style={{...styles.statCard, ...styles.statCardBlue}}>
                    <div style={styles.statIcon}>👨‍👩‍👧‍👦</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>My Children</p>
                        <h2 style={styles.statValue}>{children.length}</h2>
                    </div>
                </div>
                <div style={{...styles.statCard, ...styles.statCardYellow}}>
                    <div style={styles.statIcon}>💰</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Total Due</p>
                        <h2 style={styles.statValue}>KES {totalDue.toLocaleString()}</h2>
                    </div>
                </div>
                <div style={{...styles.statCard, ...styles.statCardGreen}}>
                    <div style={styles.statIcon}>✅</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Total Paid</p>
                        <h2 style={styles.statValue}>KES {totalPaid.toLocaleString()}</h2>
                    </div>
                </div>
                <div style={{...styles.statCard, ...styles.statCardRed}}>
                    <div style={styles.statIcon}>⚠️</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Balance</p>
                        <h2 style={styles.statValue}>KES {totalBalance.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Children Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>My Children</h2>
                {children.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No children registered yet. Contact admin to add your children.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {children.map((child) => {
                            const childBalance = invoices
                                .filter(inv => inv.student.id === child.id)
                                .reduce((sum, inv) => sum + inv.balance, 0);
                            
                            return (
                                <div key={child.id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.childName}>{child.firstName} {child.lastName}</h3>
                                        <span style={styles.admissionNumber}>ID: {child.admissionNumber}</span>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <div style={styles.balanceInfo}>
                                            <span style={styles.balanceLabel}>Outstanding Balance</span>
                                            <span style={childBalance > 0 ? styles.balanceDue : styles.balancePaid}>
                                                KES {childBalance.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Invoices Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Invoices</h2>
                {invoices.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No invoices found.</p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Student</th>
                                    <th style={styles.th}>Student ID</th>
                                    <th style={styles.th}>Amount Due</th>
                                    <th style={styles.th}>Amount Paid</th>
                                    <th style={styles.th}>Balance</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            {invoice.student.firstName} {invoice.student.lastName}
                                        </td>
                                        <td style={styles.td}>{invoice.student.admissionNumber}</td>
                                        <td style={styles.td}>KES {invoice.amountDue.toLocaleString()}</td>
                                        <td style={styles.td}>KES {invoice.amountPaid.toLocaleString()}</td>
                                        <td style={styles.td}>KES {invoice.balance.toLocaleString()}</td>
                                        <td style={styles.td}>
                                            <span style={getStatusStyle(invoice.status)}>{invoice.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            {invoice.balance > 0 && (
                                                <button 
                                                    onClick={() => handlePay(invoice)} 
                                                    style={styles.payBtn}
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusStyle(status) {
    const baseStyle = {
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '600',
    };

    switch(status) {
        case 'PAID':
            return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
        case 'PARTIALLY_PAID':
            return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' };
        case 'UNPAID':
            return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
        default:
            return baseStyle;
    }
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        background: 'var(--background)',
        padding: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        marginTop: '0.5rem',
    },
    logoutBtn: {
        padding: '0.75rem 1.5rem',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: 'var(--shadow)',
    },
    statCardBlue: { borderLeft: '4px solid #3b82f6' },
    statCardYellow: { borderLeft: '4px solid #f59e0b' },
    statCardGreen: { borderLeft: '4px solid #10b981' },
    statCardRed: { borderLeft: '4px solid #ef4444' },
    statIcon: {
        fontSize: '2.5rem',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        marginBottom: '0.25rem',
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: 0,
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
    },
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
    },
    cardHeader: {
        marginBottom: '1rem',
    },
    childName: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    admissionNumber: {
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        backgroundColor: '#f3f4f6',
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
    },
    cardBody: {
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
    },
    balanceInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
    },
    balanceDue: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#ef4444',
    },
    balancePaid: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#10b981',
    },
    emptyState: {
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
    },
    tableContainer: {
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        background: '#f9fafb',
        fontWeight: '600',
        color: 'var(--text-primary)',
        borderBottom: '2px solid var(--border)',
    },
    tr: {
        borderBottom: '1px solid var(--border)',
    },
    td: {
        padding: '1rem',
        color: 'var(--text-primary)',
    },
    payBtn: {
        padding: '0.5rem 1rem',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    loadingContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginTop: '1rem',
        color: 'var(--text-secondary)',
    },
};

export default ParentDashboard;
