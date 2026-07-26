import React, { useState } from 'react';
import { Upload, Plus, Trash2, Search, CheckCircle, Clock, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { parseAnyFile, generateDemoLinkedInProfiles, isValidLinkedInUrl } from '../../utils/csvParser';

export default function ProfileList({ recipients, setRecipients, onNext }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');

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
    const demo = generateDemoLinkedInProfiles();
    setRecipients(demo);
  };

  const handleAddRecipient = (e) => {
    e.preventDefault();
    if (!newUrl) return;

    const newItem = {
      id: recipients.length + 1,
      Name: newName || 'Target Contact',
      LinkedInUrl: newUrl.trim(),
      Company: newCompany || 'Company',
      Role: newRole || 'Professional',
      CustomNote: '',
      Status: 'Pending',
      SentAt: null,
      Error: null
    };

    setRecipients([...recipients, newItem]);
    setNewName('');
    setNewUrl('');
    setNewCompany('');
    setNewRole('');
    setShowAddModal(false);
  };

  const handleRemove = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all LinkedIn profile entries?')) setRecipients([]);
  };

  const invalidUrls = recipients.filter(r => !isValidLinkedInUrl(r.LinkedInUrl));

  const filteredRecipients = recipients.filter(r => {
    const matchesSearch = 
      (r.Name && r.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.Company && r.Company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.Role && r.Role.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'INVALID') return matchesSearch && !isValidLinkedInUrl(r.LinkedInUrl);
    return matchesSearch && r.Status === filterStatus;
  });

  const sortedFilteredRecipients = [...filteredRecipients].sort((a, b) => {
    const aValid = isValidLinkedInUrl(a.LinkedInUrl);
    const bValid = isValidLinkedInUrl(b.LinkedInUrl);
    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;
    return 0;
  });

  return (
    <div>
      
      <div className="glass-enterprise-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">LinkedIn Profiles</span>
              <span className="badge-enterprise">{recipients.length} Targets</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              LinkedIn Target Profiles Directory
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Target LinkedIn profile URLs for automated connection request dispatches.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleLoadDemo} className="btn-enterprise btn-enterprise-primary">
              <Sparkles size={15} /> Load 50 Demo Profiles
            </button>

            <label className="btn-enterprise btn-enterprise-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={15} /> Import CSV
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} style={{ display: 'none' }} />
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

      </div>

      {/* Filter and Search Bar */}
      <div className="glass-enterprise-card" style={{ padding: '14px 20px', marginBottom: '18px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-enterprise"
            style={{ paddingLeft: '38px' }}
            placeholder="Search name, company, or role..."
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
              {status === 'INVALID' ? `Invalid Links (${invalidUrls.length})` : status}
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
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600', width: '50px' }}>#</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Role & Company</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>LinkedIn URL</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredRecipients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No profile entries found. Click <strong>"Load 50 Demo Profiles"</strong> or upload a CSV.
                  </td>
                </tr>
              ) : (
                sortedFilteredRecipients.map((item, idx) => {
                  const validLink = isValidLinkedInUrl(item.LinkedInUrl);

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 18px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 18px', fontWeight: '600', color: '#ffffff' }}>{item.Name}</td>
                      <td style={{ padding: '12px 18px', color: 'var(--text-muted)' }}>{item.Role} @ {item.Company}</td>
                      <td style={{ padding: '12px 18px', color: validLink ? '#ffffff' : '#f87171', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {validLink ? (
                          <a href={item.LinkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {item.LinkedInUrl.replace('https://www.linkedin.com/in/', '')} <ExternalLink size={12} color="var(--text-dim)" />
                          </a>
                        ) : (
                          <span style={{ color: '#ef4444', fontStyle: 'italic', fontWeight: '600' }}>Invalid</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {validLink && item.Status === 'Sent' && <span className="badge-enterprise badge-enterprise-white"><CheckCircle size={11} /> Sent</span>}
                          {validLink && item.Status === 'Pending' && <span className="badge-enterprise"><Clock size={11} /> Pending</span>}
                          {validLink && item.Status === 'Failed' && <span className="badge-enterprise"><AlertTriangle size={11} /> Failed</span>}
                          {!validLink && <span className="badge-enterprise" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>Invalid URL</span>}
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
              Showing <strong>{filteredRecipients.length}</strong> of <strong>{recipients.length}</strong> profiles ready.
            </span>
            <button onClick={onNext} className="btn-enterprise btn-enterprise-primary">
              Next: Customize 300-Char Note Template &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 10, 15, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-enterprise-panel" style={{ width: '460px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Add Target Profile</h3>
            <form onSubmit={handleAddRecipient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Name</label>
                <input type="text" className="input-enterprise" placeholder="e.g. Sarah Chen" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>LinkedIn Profile URL</label>
                <input type="url" className="input-enterprise" placeholder="https://www.linkedin.com/in/sarah-chen" value={newUrl} onChange={e => setNewUrl(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Company Name</label>
                <input type="text" className="input-enterprise" placeholder="Apex Tech" value={newCompany} onChange={e => setNewCompany(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Role / Headline</label>
                <input type="text" className="input-enterprise" placeholder="VP of Talent" value={newRole} onChange={e => setNewRole(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-enterprise btn-enterprise-secondary">Cancel</button>
                <button type="submit" className="btn-enterprise btn-enterprise-primary">Add Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
