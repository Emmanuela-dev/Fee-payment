import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyChildren, getMyInvoices } from '../services/api';


function Dashboard() {
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
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.title}>Dashboard</h1>
                        <p style={styles.subtitle}>Welcome back, {user.name}</p>
                    </div>
                    <button onClick={logout} style={styles.logoutButton}>
                        Sign Out
                    </button>
                </div>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>👨‍👩‍👧‍👦</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>{children.length}</h3>
                        <p style={styles.statLabel}>Children</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>📄</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>{invoices.length}</h3>
                        <p style={styles.statLabel}>Invoices</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>💰</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>${totalBalance.toFixed(2)}</h3>
                        <p style={styles.statLabel}>Outstanding</p>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>✅</div>
                    <div style={styles.statContent}>
                        <h3 style={styles.statNumber}>${totalPaid.toFixed(2)}</h3>
                        <p style={styles.statLabel}>Paid</p>
                    </div>
                </div>
            </div>

            <div style={styles.contentGrid}>
                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>My Children</h2>
                    </div>
                    {children.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>👨‍👩‍👧‍👦</div>
                            <h3 style={styles.emptyTitle}>No Children Registered</h3>
                            <p style={styles.emptyText}>Children will appear here once registered in the system.</p>
                        </div>
                    ) : (
                        <div style={styles.cardsGrid}>
                            {children.map((child) => (
                                <div key={child.id} style={styles.childCard}>
                                    <div style={styles.childAvatar}>
                                        {child.firstName[0]}{child.lastName[0]}
                                    </div>
                                    <div style={styles.childInfo}>
                                        <h3 style={styles.childName}>{child.firstName} {child.lastName}</h3>
                                        <p style={styles.childDetail}>Admission: {child.admissionNumber}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Outstanding Invoices</h2>
                    </div>
                    {invoices.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📄</div>
                            <h3 style={styles.emptyTitle}>No Invoices</h3>
                            <p style={styles.emptyText}>Invoice information will appear here.</p>
                        </div>
                    ) : (
                        <div style={styles.cardsGrid}>
                            {invoices.map((invoice) => (
                                <div key={invoice.id} style={styles.invoiceCard}>
                                    <div style={styles.invoiceHeader}>
                                        <h3 style={styles.invoiceStudent}>
                                            {invoice.student.firstName} {invoice.student.lastName}
                                        </h3>
                                        <span style={{
                                            ...styles.statusBadge,
                                            ...(invoice.status === 'PAID' ? styles.statusPaid :
                                               invoice.status === 'PARTIAL' ? styles.statusPartial : styles.statusUnpaid)
                                        }}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div style={styles.invoiceDetails}>
                                        <div style={styles.invoiceRow}>
                                            <span style={styles.invoiceLabel}>Amount Due:</span>
                                            <span style={styles.invoiceValue}>${invoice.amountDue.toFixed(2)}</span>
                                        </div>
                                        <div style={styles.invoiceRow}>
                                            <span style={styles.invoiceLabel}>Amount Paid:</span>
                                            <span style={styles.invoiceValue}>${invoice.amountPaid.toFixed(2)}</span>
                                        </div>
                                        <div style={styles.invoiceRow}>
                                            <span style={styles.invoiceLabel}>Balance:</span>
                                            <span style={{
                                                ...styles.invoiceValue,
                                                color: invoice.balance > 0 ? 'var(--error-color)' : 'var(--success-color)'
                                            }}>
                                                ${invoice.balance.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    {invoice.balance > 0 && (
                                        <button
                                            onClick={() => handlePay(invoice)}
                                            style={styles.payButton}
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        padding: '2rem',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
    },
    loadingSpinner: {
        width: '40px',
        height: '40px',
        border: '4px solid var(--border)',
        borderTop: '4px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginTop: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
    },
    header: {
        backgroundColor: 'var(--background)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '1.125rem',
    },
    logoutButton: {
        backgroundColor: 'var(--error-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
    },
    statCard: {
        backgroundColor: 'var(--background)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    statIcon: {
        fontSize: '2rem',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '12px',
        color: 'white',
    },
    statContent: {
        flex: 1,
    },
    statNumber: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.25rem 0',
    },
    statLabel: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '0.875rem',
        fontWeight: '500',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
    },
    section: {
        backgroundColor: 'var(--background)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
    },
    sectionHeader: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: 0,
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    emptyTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    emptyText: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '1rem',
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    childCard: {
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.2s ease',
    },
    childAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 0.25rem 0',
    },
    childDetail: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '0.875rem',
    },
    invoiceCard: {
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        transition: 'all 0.2s ease',
    },
    invoiceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    invoiceStudent: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: 0,
    },
    statusBadge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statusPaid: {
        backgroundColor: '#dcfce7',
        color: 'var(--success-color)',
    },
    statusPartial: {
        backgroundColor: '#fef3c7',
        color: 'var(--warning-color)',
    },
    statusUnpaid: {
        backgroundColor: '#fee2e2',
        color: 'var(--error-color)',
    },
    invoiceDetails: {
        marginBottom: '1.5rem',
    },
    invoiceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--border)',
    },
    invoiceLabel: {
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
    },
    invoiceValue: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
    },
    payButton: {
        width: '100%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default Dashboard;