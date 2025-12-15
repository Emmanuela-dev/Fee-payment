import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { makePayment } from '../services/api';

function Payment() {
    const location = useLocation();
    const { invoice, studentId } = location.state || {};
    const { user } = useAuth();
    const [amount, setAmount] = useState(invoice?.balance?.toString() || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Load Paystack script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!invoice) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <div style={styles.errorIcon}>⚠️</div>
                    <h2 style={styles.errorTitle}>Invoice Not Found</h2>
                    <p style={styles.errorText}>Unable to load invoice details. Please return to dashboard.</p>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handlePayment = async () => {
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (paymentAmount > invoice.balance) {
            setError('Payment cannot exceed the balance.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // ========== TEST MODE: Simulate payment without actual money ==========
            // Uncomment the Paystack integration below when ready to accept real payments
            
            const testReference = `TEST-PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Record payment in backend
            await makePayment({
                studentId,
                invoiceId: invoice.id,
                amountPaid: paymentAmount,
                paystackReference: testReference
            });
            
            alert(`Payment successful! \nAmount: KES ${paymentAmount.toLocaleString()} \nReference: ${testReference}`);
            navigate('/dashboard');
            
            // ========== PAYSTACK INTEGRATION (COMMENTED FOR TESTING) ==========
            // Uncomment this section to enable real Paystack payments
            /*
            if (!window.PaystackPop) {
                throw new Error('Paystack library not loaded');
            }

            // Initialize Paystack payment
            const handler = window.PaystackPop.setup({
                key: 'pk_live_22a5dedc1ce53200ccc5fdd39fdfe3b76f3b9b6f',
                email: user.email,
                amount: paymentAmount * 100, // Paystack expects amount in kobo (multiply by 100 for NGN) or cents (multiply by 100 for KES)
                currency: 'KES', // Kenya Shillings
                ref: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                metadata: {
                    studentId: studentId,
                    invoiceId: invoice.id,
                    student_name: `${invoice.student.firstName} ${invoice.student.lastName}`,
                    admission_number: invoice.student.admissionNumber,
                    parent_name: `${user.firstName} ${user.lastName}`,
                    custom_fields: [
                        {
                            display_name: "Student",
                            variable_name: "student_name",
                            value: `${invoice.student.firstName} ${invoice.student.lastName}`
                        },
                        {
                            display_name: "Admission Number",
                            variable_name: "admission_number",
                            value: invoice.student.admissionNumber
                        }
                    ]
                },
                callback: async (response) => {
                    // Payment successful, now record it in our backend
                    try {
                        await makePayment({
                            studentId,
                            invoiceId: invoice.id,
                            amountPaid: paymentAmount,
                            paystackReference: response.reference
                        });
                        alert('Payment successful!');
                        navigate('/dashboard');
                    } catch (backendError) {
                        console.error('Backend payment recording failed:', backendError);
                        alert('Payment completed but recording failed. Please contact support with reference: ' + response.reference);
                        navigate('/dashboard');
                    } finally {
                        setLoading(false);
                    }
                },
                onClose: () => {
                    setLoading(false);
                    setError('Payment was cancelled.');
                }
            });
            handler.openIframe();
            */
        } catch (err) {
            console.error('Payment error:', err);
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Make Payment</h1>
                    <p style={styles.subtitle}>Complete your payment securely</p>
                </div>

                <div style={styles.invoiceCard}>
                    <div style={styles.invoiceHeader}>
                        <div style={styles.studentInfo}>
                            <div style={styles.studentAvatar}>
                                {invoice.student.firstName[0]}{invoice.student.lastName[0]}
                            </div>
                            <div>
                                <h3 style={styles.studentName}>
                                    {invoice.student.firstName} {invoice.student.lastName}
                                </h3>
                                <p style={styles.studentDetail}>
                                    Admission: {invoice.student.admissionNumber}
                                </p>
                            </div>
                        </div>
                        <span style={{
                            ...styles.statusBadge,
                            ...(invoice.status === 'PAID' ? styles.statusPaid :
                               invoice.status === 'PARTIAL' ? styles.statusPartial : styles.statusUnpaid)
                        }}>
                            {invoice.status}
                        </span>
                    </div>

                    <div style={styles.invoiceSummary}>
                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Total Amount:</span>
                            <span style={styles.summaryValue}>KES {invoice.amountDue.toLocaleString()}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Amount Paid:</span>
                            <span style={styles.summaryValue}>KES {invoice.amountPaid.toLocaleString()}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span style={styles.summaryLabel}>Outstanding Balance:</span>
                            <span style={{
                                ...styles.summaryValue,
                                color: 'var(--error-color)',
                                fontWeight: '700'
                            }}>
                                KES {invoice.balance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form style={styles.paymentForm} onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Payment Amount</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.currencySymbol}>$</span>
                            <input
                                style={styles.amountInput}
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                max={invoice.balance}
                                required
                            />
                        </div>
                        <p style={styles.inputHelp}>
                            Maximum amount: ${invoice.balance.toFixed(2)}
                        </p>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            style={{...styles.payButton, ...(loading ? styles.payButtonDisabled : {})}}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div style={styles.buttonSpinner}></div>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    💳 Pay Now
                                </>
                            )}
                        </button>

                        <button
                            style={styles.cancelButton}
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
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
        maxWidth: '500px',
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
    invoiceCard: {
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
    },
    invoiceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    studentInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    studentAvatar: {
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
    studentName: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 0.25rem 0',
    },
    studentDetail: {
        color: 'var(--text-secondary)',
        margin: 0,
        fontSize: '0.875rem',
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
    invoiceSummary: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--border)',
    },
    summaryLabel: {
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
    },
    summaryValue: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
    },
    error: {
        backgroundColor: '#fef2f2',
        color: 'var(--error-color)',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        fontSize: '0.875rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    paymentForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    inputLabel: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: 'var(--text-primary)',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    currencySymbol: {
        position: 'absolute',
        left: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        fontWeight: '600',
        zIndex: 1,
    },
    amountInput: {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 2.5rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
    },
    inputHelp: {
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        margin: 0,
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    payButton: {
        backgroundColor: 'var(--success-color)',
        color: 'white',
        border: 'none',
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    payButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    buttonSpinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    errorContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
    },
    errorCard: {
        background: 'var(--background)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    errorIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    errorTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    errorText: {
        color: 'var(--text-secondary)',
        margin: '0 0 2rem 0',
        fontSize: '1rem',
    },
    backButton: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default Payment;