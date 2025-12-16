import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateInvoice, setShowCreateInvoice] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [showEditStudent, setShowEditStudent] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [invoiceForm, setInvoiceForm] = useState({ studentId: '', amountDue: '' });
    const [studentForm, setStudentForm] = useState({ 
        firstName: '', 
        lastName: '', 
        admissionNumber: '',
        parentEmail: ''
    });
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        admissionNumber: '',
        parentEmail: ''
    });
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsRes, invoicesRes] = await Promise.all([
                api.get('/api/students'),
                api.get('/api/invoices')
            ]);
            setStudents(studentsRes.data);
            setInvoices(invoicesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/invoices/${invoiceForm.studentId}`, {
                amountDue: parseFloat(invoiceForm.amountDue)
            });
            alert('Invoice created successfully!');
            setInvoiceForm({ studentId: '', amountDue: '' });
            setShowCreateInvoice(false);
            loadData();
        } catch (error) {
            alert('Error creating invoice: ' + (error.response?.data || error.message));
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/students', {
                firstName: studentForm.firstName,
                lastName: studentForm.lastName,
                admissionNumber: studentForm.admissionNumber
            });
            
            // Extract student ID from response
            const studentId = response.data.id;
            
            // If parent email is provided, link the student to the parent
            if (studentForm.parentEmail && studentId) {
                try {
                    await api.post(`/api/students/${studentId}/link-parent`, {
                        parentEmail: studentForm.parentEmail
                    });
                    alert('Student added and linked to parent successfully!');
                } catch (linkError) {
                    alert('Student added, but linking to parent failed: ' + (linkError.response?.data || 'Parent not found'));
                }
            } else {
                alert('Student added successfully!');
            }
            
            setStudentForm({ firstName: '', lastName: '', admissionNumber: '', parentEmail: '' });
            setShowAddStudent(false);
            loadData();
        } catch (error) {
            alert('Error adding student: ' + (error.response?.data?.error || error.response?.data || error.message));
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setEditForm({
            firstName: student.firstName,
            lastName: student.lastName,
            admissionNumber: student.admissionNumber,
            parentEmail: student.parentEmail
        });
        setShowEditStudent(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/students/${editingStudent.id}`, editForm);
            alert('Student updated successfully!');
            setShowEditStudent(false);
            setEditingStudent(null);
            loadData();
        } catch (error) {
            alert('Error updating student: ' + (error.response?.data?.error || error.response?.data || error.message));
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student? This will also delete all their invoices and payments.')) {
            try {
                await api.delete(`/api/admin/students/${studentId}`);
                alert('Student deleted successfully!');
                loadData();
            } catch (error) {
                alert('Error deleting student: ' + (error.response?.data?.error || error.response?.data || error.message));
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading admin dashboard...</p>
            </div>
        );
    }

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Admin Dashboard</h1>
                    <p style={styles.subtitle}>Welcome back, {user.firstName} {user.lastName}!</p>
                </div>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* Stats Overview */}
            <div style={styles.statsGrid}>
                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)', borderLeft: '4px solid #3b82f6', color: 'black'}}>
                    <div style={styles.statIcon}>👨‍🎓</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Total Students</p>
                        <h2 style={styles.statValue}>{students.length}</h2>
                    </div>
                </div>
                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)', borderLeft: '4px solid #8b5cf6'}}>
                    <div style={styles.statIcon}>👨‍👩‍👧‍👦</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Total Parents</p>
                        <h2 style={styles.statValue}>{parents.length}</h2>
                    </div>
                </div>
                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)', borderLeft: '4px solid #10b981', color: 'black'}}>
                    <div style={styles.statIcon}>💰</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Total Revenue</p>
                        <h2 style={styles.statValue}>KES {totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>
                <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)', borderLeft: '4px solid #ef4444', color: 'black'}}>
                    <div style={styles.statIcon}>⚠️</div>
                    <div style={styles.statContent}>
                        <p style={styles.statLabel}>Outstanding</p>
                        <h2 style={styles.statValue}>KES {totalOutstanding.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionBar}>
                <button onClick={() => setShowAddStudent(true)} style={styles.actionBtn}>
                    + Add Student
                </button>
                <button onClick={() => setShowCreateInvoice(true)} style={styles.actionBtnSecondary}>
                    + Create Invoice
                </button>
            </div>

            {/* Create Invoice Modal */}
            {showCreateInvoice && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Create New Invoice</h2>
                        <form onSubmit={handleCreateInvoice} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Student ID</label>
                                <input
                                    type="number"
                                    value={invoiceForm.studentId}
                                    onChange={(e) => setInvoiceForm({...invoiceForm, studentId: e.target.value})}
                                    style={styles.input}
                                    placeholder="Enter student ID"
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Amount Due (KES)</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={invoiceForm.amountDue}
                                    onChange={(e) => setInvoiceForm({...invoiceForm, amountDue: e.target.value})}
                                    style={styles.input}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowCreateInvoice(false)} style={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddStudent && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Add New Student</h2>
                        <form onSubmit={handleAddStudent} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <input 
                                    type="text"
                                    value={studentForm.firstName}
                                    onChange={(e) => setStudentForm({...studentForm, firstName: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input 
                                    type="text"
                                    value={studentForm.lastName}
                                    onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Admission Number</label>
                                <input 
                                    type="text"
                                    value={studentForm.admissionNumber}
                                    onChange={(e) => setStudentForm({...studentForm, admissionNumber: e.target.value})}
                                    style={styles.input}
                                    placeholder="e.g., STU001"
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Parent Email</label>
                                <input
                                    type="email"
                                    value={studentForm.parentEmail}
                                    onChange={(e) => setStudentForm({...studentForm, parentEmail: e.target.value})}
                                    style={styles.input}
                                    placeholder="parent@example.com"
                                    required
                                />
                                <small style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem'}}>When the parent registers with this email, they'll be automatically linked to this student.</small>
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowAddStudent(false)} style={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditStudent && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Edit Student</h2>
                        <form onSubmit={handleUpdateStudent} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <input 
                                    type="text"
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input 
                                    type="text"
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Admission Number</label>
                                <input 
                                    type="text"
                                    value={editForm.admissionNumber}
                                    onChange={(e) => setEditForm({...editForm, admissionNumber: e.target.value})}
                                    style={styles.input}
                                    placeholder="e.g., STU001"
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Parent Email</label>
                                <input
                                    type="email"
                                    value={editForm.parentEmail}
                                    onChange={(e) => setEditForm({...editForm, parentEmail: e.target.value})}
                                    style={styles.input}
                                    placeholder="parent@example.com"
                                    required
                                />
                                <small style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem'}}>Changing the email will update the parent link when they register.</small>
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowEditStudent(false)} style={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    Update Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invoices Table */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>All Invoices</h2>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Admission Number</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Parent Email</th>
                                <th style={styles.th}>Parent Name</th>
                                <th style={styles.th}>Outstanding Balance</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => {
                                const balance = invoices.filter(inv => inv.student?.id === student.id).reduce((sum, inv) => sum + inv.balance, 0);
                                return (
                                    <tr key={student.id} style={styles.tr}>
                                        <td style={styles.td}>{student.admissionNumber}</td>
                                        <td style={styles.td}>{student.firstName} {student.lastName}</td>
                                        <td style={styles.td}>{student.parentEmail}</td>
                                        <td style={styles.td}>{student.parent ? `${student.parent.firstName} ${student.parent.lastName}` : 'Pending'}</td>
                                        <td style={styles.td}>KES {balance.toLocaleString()}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => handleEditStudent(student)} style={styles.actionBtn}>Edit</button>
                                            <button onClick={() => handleDeleteStudent(student.id)} style={styles.actionBtn}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoices Table */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>All Invoices</h2>
                <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Invoice ID</th>
                                    <th style={styles.th}>Student</th>
                                    <th style={styles.th}>Amount Due</th>
                                    <th style={styles.th}>Amount Paid</th>
                                    <th style={styles.th}>Balance</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '2rem'}}>
                                            No invoices found. Create an invoice to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.filter(invoice => invoice.student).map(invoice => (
                                        <tr key={invoice.id} style={styles.tr}>
                                            <td style={styles.td}>#{invoice.id}</td>
                                            <td style={styles.td}>
                                                {invoice.student.firstName} {invoice.student.lastName} ({invoice.student.admissionNumber})
                                            </td>
                                            <td style={styles.td}>KES {invoice.amountDue.toLocaleString()}</td>
                                            <td style={styles.td}>KES {invoice.amountPaid.toLocaleString()}</td>
                                            <td style={styles.td}>KES {invoice.balance.toLocaleString()}</td>
                                            <td style={styles.td}>
                                                <span style={getStatusStyle(invoice.status)}>{invoice.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        padding: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'white',
        margin: '0',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: '0.5rem',
    },
    logoutBtn: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'transform 0.3s ease',
    },
    statCardBlue: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' },
    statCardPurple: { background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white' },
    statCardGreen: { background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', color: 'white' },
    statCardRed: { background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', color: 'white' },
    statIcon: {
        fontSize: '2.5rem',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: '0.875rem',
        color: '#64748b',
        marginBottom: '0.25rem',
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    actionBar: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
    },
    actionBtn: {
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    },
    actionBtnSecondary: {
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'white',
    },
    tableContainer: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        fontWeight: '600',
        color: 'white',
        borderBottom: 'none',
    },
    tr: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    td: {
        padding: '1rem',
        color: '#1f2937',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
    },
    modalContent: {
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#1f2937',
    },
    input: {
        padding: '0.75rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'border 0.3s ease',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    cancelBtn: {
        flex: 1,
        padding: '0.75rem',
        background: '#e5e7eb',
        color: '#1f2937',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    submitBtn: {
        flex: 1,
        padding: '0.75rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    submitBtn: {
        flex: 1,
        padding: '0.75rem',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
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

export default AdminDashboard;
