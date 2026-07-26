import React, { useState, useEffect } from 'react';
import FlowStepper from './ui/FlowStepper';
import EmptyState from './ui/EmptyState';
import DirectAccountConnect from './linkedin/DirectAccountConnect';
import ProfileList from './linkedin/ProfileList';
import NoteComposer from './linkedin/NoteComposer';
import ModalInspector from './linkedin/ModalInspector';
import PlaywrightRunner from './linkedin/PlaywrightRunner';
import { generateDemoLinkedInProfiles, parseAnyFile } from '../utils/csvParser';
import { animateCardStagger } from '../utils/animationEngine';

export default function LinkedInModule({
  recipients,
  setRecipients,
  template,
  setTemplate
}) {
  const [subTab, setSubTab] = useState('recipients');
  const [connectedProfile, setConnectedProfile] = useState(null);
  const [showAddSingleModal, setShowAddSingleModal] = useState(false);

  useEffect(() => {
    animateCardStagger('.glass-enterprise-card, .glass-enterprise-panel');
  }, [subTab]);

  const flowSteps = [
    { id: 'recipients', label: '1. Profiles Directory' },
    { id: 'template', label: '2. 300-Char Note Composer' },
    { id: 'preview', label: '3. Modal Inspector' },
    { id: 'campaign', label: '4. Direct REST Dispatcher' }
  ];

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
      
      {/* Direct LinkedIn Account Connection Manager */}
      <DirectAccountConnect
        connectedProfile={connectedProfile}
        setConnectedProfile={setConnectedProfile}
      />

      {/* Progressive Disclosure Flow Stepper */}
      <FlowStepper
        steps={flowSteps}
        currentStep={subTab}
        onStepClick={(stepId) => setSubTab(stepId)}
      />

      {recipients.length === 0 && !showAddSingleModal && subTab === 'recipients' ? (
        <EmptyState
          title="No LinkedIn Profiles Loaded"
          description="Your target LinkedIn profiles list is currently empty. Load demo data, import a CSV/Excel file, or add a single profile manually."
          channel="LinkedIn"
          onLoadDemo={() => setRecipients(generateDemoLinkedInProfiles())}
          onImport={handleFileUpload}
          onAddSingle={() => setShowAddSingleModal(true)}
        />
      ) : (
        <>
          {subTab === 'recipients' && (
            <ProfileList
              recipients={recipients}
              setRecipients={(newRecs) => {
                setRecipients(newRecs);
                if (newRecs.length === 0) setShowAddSingleModal(false);
              }}
              onNext={() => setSubTab('template')}
              initialShowAddModal={showAddSingleModal}
            />
          )}

          {subTab === 'template' && (
            <NoteComposer
              template={template}
              setTemplate={setTemplate}
              onNext={() => setSubTab('preview')}
            />
          )}

          {subTab === 'preview' && (
            <ModalInspector
              recipients={recipients}
              template={template}
              onNext={() => setSubTab('campaign')}
            />
          )}

          {subTab === 'campaign' && (
            <PlaywrightRunner
              recipients={recipients}
              setRecipients={setRecipients}
              template={template}
              connectedProfile={connectedProfile}
            />
          )}
        </>
      )}

    </div>
  );
}
