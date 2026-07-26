import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OverviewHub from './components/OverviewHub';
import EmailModule from './components/EmailModule';
import LinkedInModule from './components/LinkedInModule';
import { generateDemo198Companies, generateDemoLinkedInProfiles } from './utils/csvParser';

export default function App() {
  const [activeModule, setActiveModule] = useState('overview'); // overview, email, linkedin

  // Email State
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Strategic Partnership & Outreach for {{Company}}',
    body: `Hi {{ContactPerson}},\n\nI hope your week is going well.\n\nI’ve been following {{Company}}'s work in your sector and thought this might be relevant. We specialize in helping high-growth teams optimize operational efficiency.\n\nWould you be open to a brief 10-minute exploratory conversation next Tuesday or Thursday?\n\nBest regards,\nSarah Jenkins`
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        emailCount={emailRecipients.length}
        linkedinCount={linkedinRecipients.length}
        isSmtpConnected={isSmtpConnected}
        smtpUser={smtpConfig.auth?.user}
      />

      {/* Main Views */}
      <main style={{ flex: 1 }}>
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
      </main>

    </div>
  );
}
