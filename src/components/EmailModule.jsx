import React, { useState, useEffect } from 'react';
import FlowStepper from './ui/FlowStepper';
import EmptyState from './ui/EmptyState';
import RecipientList from './email/RecipientList';
import TemplateEditor from './email/TemplateEditor';
import EmailPreviewer from './email/EmailPreviewer';
import SmtpSettings from './email/SmtpSettings';
import CampaignMonitor from './email/CampaignMonitor';
import { generateDemoCompanies, parseAnyFile } from '../utils/csvParser';
import { animateCardStagger } from '../utils/animationEngine';

export default function EmailModule({
  recipients,
  setRecipients,
  template,
  setTemplate,
  smtpConfig,
  setSmtpConfig,
  isSmtpConnected,
  setIsSmtpConnected
}) {
  // Start with SMTP configuration first as step 1
  const [subTab, setSubTab] = useState('smtp');
  const [showAddSingleModal, setShowAddSingleModal] = useState(false);

  useEffect(() => {
    animateCardStagger('.glass-enterprise-card, .glass-enterprise-panel');
  }, [subTab]);

  const flowSteps = [
    { id: 'smtp', label: '1. SMTP Security Config' },
    { id: 'recipients', label: '2. Directory & CSV Import' },
    { id: 'template', label: '3. Sequence Composer' },
    { id: 'preview', label: '4. 1-by-1 Preview' },
    { id: 'campaign', label: '5. Batch Dispatcher' }
  ];

  const availableVariables = recipients.length > 0 
    ? Object.keys(recipients[0]).filter(k => !['id', 'Status', 'SentAt', 'Error'].includes(k))
    : ['Company', 'Email', 'ContactPerson', 'CustomNote'];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = await parseAnyFile(file);
      setRecipients(parsed);
      setShowAddSingleModal(false);
    } catch (err) {
      alert(err.message || 'File import failed.');
    }
  };

  return (
    <div className="container-enterprise">
      
      {/* Progressive Disclosure Flow Stepper */}
      <FlowStepper
        steps={flowSteps}
        currentStep={subTab}
        onStepClick={(stepId) => setSubTab(stepId)}
      />

      {subTab === 'smtp' && (
        <div>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '14px 20px', borderRadius: '8px', marginBottom: '20px', color: '#60a5fa', fontSize: '0.88rem' }}>
            ⚡ <strong>Step 1: Connect your SMTP Account first.</strong> Once connected, you can import your CSV directory and dispatch initial or follow-up campaigns smoothly.
          </div>
          <SmtpSettings
            smtpConfig={smtpConfig}
            setSmtpConfig={setSmtpConfig}
            isSmtpConnected={isSmtpConnected}
            setIsSmtpConnected={setIsSmtpConnected}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button onClick={() => setSubTab('recipients')} className="btn-enterprise btn-enterprise-primary">
              Proceed to Directory & CSV Import &rarr;
            </button>
          </div>
        </div>
      )}

      {subTab === 'recipients' && (
        recipients.length === 0 && !showAddSingleModal ? (
          <EmptyState
            title="No Email Recipients Loaded"
            description="Your email target directory is currently empty. Load demo data, import a CSV/Excel file, or add a single entry manually."
            channel="Email"
            onLoadDemo={() => setRecipients(generateDemoCompanies())}
            onImport={handleFileUpload}
            onAddSingle={() => setShowAddSingleModal(true)}
          />
        ) : (
          <RecipientList
            recipients={recipients}
            setRecipients={(newRecs) => {
              setRecipients(newRecs);
              if (newRecs.length === 0) setShowAddSingleModal(false);
            }}
            onNext={() => setSubTab('template')}
            initialShowAddModal={showAddSingleModal}
          />
        )
      )}

      {subTab === 'template' && (
        <TemplateEditor
          template={template}
          setTemplate={setTemplate}
          availableVariables={availableVariables}
          onNext={() => setSubTab('preview')}
        />
      )}

      {subTab === 'preview' && (
        <EmailPreviewer
          recipients={recipients}
          template={template}
          smtpConfig={smtpConfig}
          isSmtpConnected={isSmtpConnected}
          onNext={() => setSubTab('campaign')}
        />
      )}

      {subTab === 'campaign' && (
        <CampaignMonitor
          recipients={recipients}
          setRecipients={setRecipients}
          template={template}
          smtpConfig={smtpConfig}
          isSmtpConnected={isSmtpConnected}
        />
      )}

    </div>
  );
}
