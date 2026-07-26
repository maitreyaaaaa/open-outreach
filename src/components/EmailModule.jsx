import React, { useState, useEffect } from 'react';
import FlowStepper from './ui/FlowStepper';
import EmptyState from './ui/EmptyState';
import RecipientList from './email/RecipientList';
import TemplateEditor from './email/TemplateEditor';
import EmailPreviewer from './email/EmailPreviewer';
import SmtpSettings from './email/SmtpSettings';
import CampaignMonitor from './email/CampaignMonitor';
import { generateDemoCompanies, parseCSVFile } from '../utils/csvParser';
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
  const [subTab, setSubTab] = useState('recipients');

  useEffect(() => {
    animateCardStagger('.glass-enterprise-card, .glass-enterprise-panel');
  }, [subTab]);

  const flowSteps = [
    { id: 'recipients', label: '1. Directory' },
    { id: 'template', label: '2. Template Composer' },
    { id: 'preview', label: '3. 1-by-1 Preview' },
    { id: 'smtp', label: '4. SMTP Security' },
    { id: 'campaign', label: '5. Batch Dispatcher' }
  ];

  const availableVariables = recipients.length > 0 
    ? Object.keys(recipients[0]).filter(k => !['id', 'Status', 'SentAt', 'Error'].includes(k))
    : ['Company', 'Email', 'ContactPerson', 'CustomNote'];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = await parseCSVFile(file);
      setRecipients(parsed);
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

      {recipients.length === 0 && subTab === 'recipients' ? (
        <EmptyState
          title="No Email Recipients Loaded"
          description="Your email target directory is currently empty. Load demo data or import a CSV/Excel file to prepare your enterprise email campaign."
          channel="Email"
          onLoadDemo={() => setRecipients(generateDemoCompanies())}
          onImport={handleFileUpload}
        />
      ) : (
        <>
          {subTab === 'recipients' && (
            <RecipientList
              recipients={recipients}
              setRecipients={setRecipients}
              onNext={() => setSubTab('template')}
            />
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

          {subTab === 'smtp' && (
            <SmtpSettings
              smtpConfig={smtpConfig}
              setSmtpConfig={setSmtpConfig}
              isSmtpConnected={isSmtpConnected}
              setIsSmtpConnected={setIsSmtpConnected}
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
        </>
      )}

    </div>
  );
}
