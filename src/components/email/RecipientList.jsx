import React, { useState } from 'react';
import { Upload, Plus, Trash2, Search, CheckCircle, Clock, AlertTriangle, Sparkles, Building2, ShieldCheck, Check } from 'lucide-react';
import { parseAnyFile, generateDemoCompanies } from '../../utils/csvParser';

export default function RecipientList({ recipients, setRecipients, onNext }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg(null);
    try {
      const parsed = await parseAnyFile(file);
      setRecipients(parsed);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to parse file.');
    }
  };

  const handleLoadDemo = () => {
    const demoCompanies = generateDemoCompanies();
    setRecipients(demoCompanies);
  };

  const handleAddRecipient = (e) => {
    e.preventDefault();
    if (!newEmail) return;

    const newItem = {
      id: recipients.length + 1,
      Company: newCompany || 'Company',
      Email: newEmail.trim(),
      ContactPerson: newName || 'Hiring Manager',
      Status: 'Pending',
      SentAt: null,
      Error: null
    };

    setRecipients([...recipients, newItem]);
    setNewCompany('');
    setNewEmail('');
    setNewName('');
    setShowAddModal(false);
  };

  const handleRemove = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all email recipients?')) setRecipients([]);
  };

  const isValidEmailSyntax = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const invalidEmails = recipients.filter(r => !isValidEmailSyntax(r.Email));

  const filteredRecipients = recipients.filter(r => {
    const matchesSearch = 
      (r.Company && r.Company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.Email && r.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.ContactPerson && r.ContactPerson.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'INVALID') return matchesSearch && !isValidEmailSyntax(r.Email);
    return matchesSearch && r.Status === filterStatus;
  });

  const pendingCount = recipients.filter(r => r.Status === 'Pending').length;

  return (
    <div>
      
      {/* Panel Header */}
      <div className="glass-enterprise-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Enterprise Directory</span>
              <span className="badge-enterprise">{recipients.length} Loaded</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Email Outreach Directory
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Manage recipients, run syntax validation, and prepare company emails for batch outreach.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleLoadDemo} className="btn-enterprise btn-enterprise-primary">
              <Sparkles size={15} /> Load Demo Companies
            </button>

            <label className="btn-enterprise btn-enterprise-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={15} /> Import CSV / Excel
              <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            <button onClick={() => setShowAddModal(true)} className="btn-enterprise btn-enterprise-secondary">
              <Plus size={15} /> Add Single
            </button>

            {recipients.length > 0 && (
              <button onClick={handleClearAll} className="btn-enterprise btn-enterprise-danger">
                <Trash2 size={15} /> Clear All
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="glass-enterprise-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '6px' }}>
              <Building2 size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Loaded Companies</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>{recipients.length}</h3>
            </div>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '6px' }}>
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Syntax Valid</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>{recipients.length - invalidEmails.length}</h3>
            </div>
          </div>

          <div className="glass-enterprise-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '6px' }}>
              <Clock size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Pending Queue</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>{pendingCount}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="glass-enterprise-card" style={{ padding: '14px 20px', marginBottom: '18px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-enterprise"
            style={{ paddingLeft: '38px' }}
            placeholder="Search company, email, or contact name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'Pending', 'Sent', 'Failed', 'INVALID'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="btn-enterprise"
              style={{
                fontSize: '0.78rem',
                padding: '5px 12px',
                background: filterStatus === status ? '#ffffff' : 'rgba(255,255,255,0.06)',
                color: filterStatus === status ? '#080a0f' : 'var(--text-muted)',
                border: filterStatus === status ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {status === 'INVALID' ? `Invalid Syntax (${invalidEmails.length})` : status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-enterprise-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(8, 10, 15, 0.95)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <tr>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600', width: '60px' }}>#</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Company Name</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Target Email</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Contact Person</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No companies match your search query. Click <strong>"Load Demo Companies"</strong> or upload a file.
                  </td>
                </tr>
              ) : (
                filteredRecipients.map((item, idx) => {
                  const validSyntax = isValidEmailSyntax(item.Email);

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 18px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 18px', fontWeight: '600', color: '#ffffff' }}>{item.Company}</td>
                      <td style={{ padding: '12px 18px', color: '#ffffff', fontFamily: 'monospace' }}>{item.Email}</td>
                      <td style={{ padding: '12px 18px', color: 'var(--text-muted)' }}>{item.ContactPerson}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {item.Status === 'Sent' && <span className="badge-enterprise badge-enterprise-white"><Check size={11} /> Sent</span>}
                          {item.Status === 'Pending' && <span className="badge-enterprise"><Clock size={11} /> Pending</span>}
                          {item.Status === 'Failed' && <span className="badge-enterprise"><AlertTriangle size={11} /> Failed</span>}
                          {!validSyntax && <span className="badge-enterprise">Invalid</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <button onClick={() => handleRemove(item.id)} className="btn-enterprise btn-enterprise-secondary" style={{ padding: '4px 8px' }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {recipients.length > 0 && (
          <div style={{ padding: '16px 24px', background: 'rgba(8, 10, 15, 0.9)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredRecipients.length}</strong> of <strong>{recipients.length}</strong> recipients ready.
            </span>
            <button onClick={onNext} className="btn-enterprise btn-enterprise-primary">
              Next: Customize Template &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 10, 15, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-enterprise-panel" style={{ width: '460px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Add Target Recipient</h3>
            <form onSubmit={handleAddRecipient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Company Name</label>
                <input type="text" className="input-enterprise" placeholder="Apex Tech" value={newCompany} onChange={e => setNewCompany(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Target Email Address</label>
                <input type="email" className="input-enterprise" placeholder="sarah@apextech.io" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Contact Person Name</label>
                <input type="text" className="input-enterprise" placeholder="Sarah Chen" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-enterprise btn-enterprise-secondary">Cancel</button>
                <button type="submit" className="btn-enterprise btn-enterprise-primary">Add Recipient</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
