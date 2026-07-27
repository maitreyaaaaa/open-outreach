import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import OverviewHub from './components/OverviewHub';
import EmailModule from './components/EmailModule';
import LinkedInModule from './components/LinkedInModule';
import WhatsAppModule from './components/WhatsAppModule';
import IntegrationHub from './components/IntegrationHub';
import PluginSpace from './components/PluginSpace';
import DiagnosticsModal from './components/ui/DiagnosticsModal';
import SecurityVaultModal from './components/ui/SecurityVaultModal';
import { generateDemoCompanies } from './utils/csvParser';
import { getActiveTenantId } from './services/tenantSecurityService';

export default function App() {
  const [activeModule, setActiveModule] = useState('overview'); // overview, email, linkedin, whatsapp, plugins, integrations
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  // Security Vault State
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultSecrets, setVaultSecrets] = useState(null);
  const [activeTenantId, setActiveTenantIdState] = useState(getActiveTenantId());

  // Email State
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Strategic Partnership & Outreach for {{Company}}',
    body: `Hi {{ContactPerson}},\n\nI hope your week is going well.\n\nI’ve been following {{Company}}'s work in your sector and thought this might be relevant. We specialize in helping high-growth teams optimize operational efficiency.\n\nWould you be open to a brief 10-minute exploratory conversation next Tuesday or Thursday?\n\nBest regards,\nSarah Jenkins`,
    followUp1: {
      subject: 'Re: Strategic Partnership & Outreach for {{Company}}',
      body: `Hi {{ContactPerson}},\n\nFollowing up on my note from last week regarding {{Company}}.\n\nI wanted to see if you had 5 minutes to connect or if there is someone else on your team I should reach out to?\n\nBest,\nSarah`
    },
    followUp2: {
      subject: 'Final check-in: {{Company}}',
      body: `Hi {{ContactPerson}},\n\nOne final check-in on this! I know things get busy at {{Company}}.\n\nIf now isn't the right time, no worries at all. Feel free to reach out whenever timing aligns.\n\nBest regards,\nSarah`
    }
  });
  const [smtpConfig, setSmtpConfig] = useState({
    fromName: 'Outreach Manager',
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: { user: '', pass: '' }
  });
  const [isSmtpConnected, setIsSmtpConnected] = useState(false);

  // LinkedIn State
  const [linkedinRecipients, setLinkedinRecipients] = useState([]);
  const [linkedinTemplate, setLinkedinTemplate] = useState({
    body: `Hi {{FirstName}}, noticed your work at {{Company}} as {{Role}}. I’m also in this space and would love to connect and follow your updates!`
  });

  const handleVaultUnlocked = (secrets) => {
    setIsVaultUnlocked(true);
    setVaultSecrets(secrets);
  };

  const handleVaultLocked = () => {
    setIsVaultUnlocked(false);
    setVaultSecrets(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080a0f', color: '#ffffff' }}>
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        emailCount={emailRecipients.length}
        linkedinCount={linkedinRecipients.length}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenDiagnostics={() => setShowDiagnostics(true)}
        onOpenVaultModal={() => setShowVaultModal(true)}
        isVaultUnlocked={isVaultUnlocked}
        activeTenantId={activeTenantId}
        setActiveTenantIdState={setActiveTenantIdState}
      />

      {/* Right Spacious Main Canvas */}
      <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0, paddingBottom: '60px' }}>
        {activeModule === 'overview' && (
          <OverviewHub
            emailRecipients={emailRecipients}
            linkedinRecipients={linkedinRecipients}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        )}

        {activeModule === 'email' && (
          <EmailModule
            recipients={emailRecipients}
            setRecipients={setEmailRecipients}
            template={emailTemplate}
            setTemplate={setEmailTemplate}
            smtpConfig={smtpConfig}
            setSmtpConfig={setSmtpConfig}
            isSmtpConnected={isSmtpConnected}
            setIsSmtpConnected={setIsSmtpConnected}
          />
        )}

        {activeModule === 'linkedin' && (
          <LinkedInModule
            recipients={linkedinRecipients}
            setRecipients={setLinkedinRecipients}
            template={linkedinTemplate}
            setTemplate={setLinkedinTemplate}
          />
        )}

        {activeModule === 'whatsapp' && (
          <WhatsAppModule
            recipients={emailRecipients.length > 0 ? emailRecipients : generateDemoCompanies()}
            setRecipients={setEmailRecipients}
          />
        )}

        {activeModule === 'plugins' && (
          <PluginSpace />
        )}

        {activeModule === 'integrations' && (
          <IntegrationHub />
        )}
      </main>

      {/* System Diagnostics & Audit Modal */}
      <DiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />

      {/* Security Vault Modal */}
      <SecurityVaultModal
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        onVaultUnlocked={handleVaultUnlocked}
        onVaultLocked={handleVaultLocked}
        isUnlocked={isVaultUnlocked}
      />

    </div>
  );
}
