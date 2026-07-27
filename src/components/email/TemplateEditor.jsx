import React, { useState } from 'react';
import { Sparkles, Tag, ShieldCheck, AlertTriangle, Layers, RotateCcw } from 'lucide-react';

export default function TemplateEditor({ template, setTemplate, availableVariables, onNext }) {
  const [activeStep, setActiveStep] = useState('initial'); // 'initial', 'followUp1', 'followUp2'

  const spamKeywordsList = ['100% free', 'click here', 'act now', 'urgent', 'guaranteed', 'no obligation', 'make money', 'risk-free', 'buy now', 'cheap', 'winner', 'cash bonus'];

  const getActiveSubject = () => {
    if (activeStep === 'followUp1') return template.followUp1?.subject || `Re: ${template.subject || ''}`;
    if (activeStep === 'followUp2') return template.followUp2?.subject || `Final check-in: ${template.subject || ''}`;
    return template.subject || '';
  };

  const getActiveBody = () => {
    if (activeStep === 'followUp1') return template.followUp1?.body || `Hi {{ContactPerson}},\n\nFollowing up on my previous note regarding {{Company}}.\n\nI wanted to see if you had 5 minutes to connect this week?\n\nBest regards,\nSarah`;
    if (activeStep === 'followUp2') return template.followUp2?.body || `Hi {{ContactPerson}},\n\nOne final check-in on this! I know things get busy at {{Company}}.\n\nIf now isn't the right time, feel free to reach out whenever timing aligns.\n\nBest regards,\nSarah`;
    return template.body || '';
  };

  const updateActiveSubject = (val) => {
    if (activeStep === 'followUp1') {
      setTemplate(prev => ({
        ...prev,
        followUp1: { ...(prev.followUp1 || {}), subject: val, body: prev.followUp1?.body || getActiveBody() }
      }));
    } else if (activeStep === 'followUp2') {
      setTemplate(prev => ({
        ...prev,
        followUp2: { ...(prev.followUp2 || {}), subject: val, body: prev.followUp2?.body || getActiveBody() }
      }));
    } else {
      setTemplate(prev => ({ ...prev, subject: val }));
    }
  };

  const updateActiveBody = (val) => {
    if (activeStep === 'followUp1') {
      setTemplate(prev => ({
        ...prev,
        followUp1: { ...(prev.followUp1 || {}), subject: prev.followUp1?.subject || getActiveSubject(), body: val }
      }));
    } else if (activeStep === 'followUp2') {
      setTemplate(prev => ({
        ...prev,
        followUp2: { ...(prev.followUp2 || {}), subject: prev.followUp2?.subject || getActiveSubject(), body: val }
      }));
    } else {
      setTemplate(prev => ({ ...prev, body: val }));
    }
  };

  const currentSubject = getActiveSubject();
  const currentBody = getActiveBody();

  const detectSpamTriggerWords = () => {
    const combinedText = `${currentSubject} ${currentBody}`.toLowerCase();
    return spamKeywordsList.filter(word => combinedText.includes(word));
  };

  const foundSpamWords = detectSpamTriggerWords();

  const insertVariable = (varName, field = 'body') => {
    const tag = `{{${varName}}}`;
    if (field === 'subject') {
      updateActiveSubject(currentSubject + ' ' + tag);
    } else {
      updateActiveBody(currentBody + ' ' + tag);
    }
  };

  const applyTemplatePreset = (presetType) => {
    if (presetType === 'partnership') {
      setTemplate({
        subject: 'Strategic Partnership Proposal for {{Company}}',
        body: `Hi {{ContactPerson}},\n\nI’ve been following {{Company}}'s impressive trajectory in your industry and wanted to reach out directly.\n\nWe specialize in assisting high-growth companies streamline their operations and expand their market presence.\n\n{{CustomNote}}\n\nWould you be open to a brief 10-minute exploratory chat next Tuesday or Thursday?\n\nBest regards,\nSarah Jenkins`,
        followUp1: {
          subject: 'Re: Strategic Partnership Proposal for {{Company}}',
          body: `Hi {{ContactPerson}},\n\nFollowing up on my note from last week regarding {{Company}}.\n\nI wanted to see if you had 5 minutes to connect or if there is someone else on your team I should reach out to?\n\nBest,\nSarah`
        },
        followUp2: {
          subject: 'Final check-in: Partnership with {{Company}}',
          body: `Hi {{ContactPerson}},\n\nOne final check-in on this! I know things get busy at {{Company}}.\n\nIf now isn't the right time, no worries at all. Feel free to reach out whenever timing aligns.\n\nBest regards,\nSarah`
        }
      });
    } else if (presetType === 'outreach') {
      setTemplate({
        subject: 'Quick question regarding {{Company}}\'s tech stack',
        body: `Hello {{ContactPerson}},\n\nI hope your week is going well.\n\nI noticed {{Company}}'s work in your sector and thought this might be relevant. We recently helped a team similar to {{Company}} optimize their workflow efficiency by over 35%.\n\nI’d love to send over a short, customized PDF overview tailored for {{Company}}.\n\nLet me know if this sounds relevant to your current priorities.\n\nWarmly,\nMichael Chen`,
        followUp1: {
          subject: 'Re: Quick question regarding {{Company}}\'s tech stack',
          body: `Hi {{ContactPerson}},\n\nJust bumping this in your inbox in case it got buried!\n\nWould love 5 minutes to share our benchmark data for {{Company}}.\n\nBest,\nMichael`
        },
        followUp2: {
          subject: 'Closing thoughts for {{Company}}',
          body: `Hi {{ContactPerson}},\n\nPassing this along one last time. If this isn't a priority for {{Company}} right now, no problem at all.\n\nHave a great rest of your week!\n\nBest,\nMichael`
        }
      });
    }
  };

  return (
    <div>
      <div className="glass-enterprise-panel">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Template Sequence Engine</span>
              <span className="badge-enterprise">Multi-Stage Follow-Ups</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Outreach Email Sequence Composer
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Configure your Initial Cold Email and Follow-Up sequences for previously sent targets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => applyTemplatePreset('partnership')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> B2B Pitch Sequence
            </button>
            <button onClick={() => applyTemplatePreset('outreach')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> Cold Outreach Sequence
            </button>
          </div>
        </div>

        {/* Sequence Step Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveStep('initial')}
            className={`btn-enterprise ${activeStep === 'initial' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
            style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={15} /> 1. Initial Email (Step 1)
          </button>

          <button
            onClick={() => setActiveStep('followUp1')}
            className={`btn-enterprise ${activeStep === 'followUp1' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
            style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} /> 2. Follow-Up #1 (Targets Sent Emails)
          </button>

          <button
            onClick={() => setActiveStep('followUp2')}
            className={`btn-enterprise ${activeStep === 'followUp2' ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
            style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} /> 3. Follow-Up #2 (Final Check-In)
          </button>
        </div>

        {/* Spam Deliverability Card */}
        <div className="glass-enterprise-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {foundSpamWords.length > 0 ? <AlertTriangle size={18} color="#ffffff" /> : <ShieldCheck size={18} color="#ffffff" />}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                  Deliverability Audit: {foundSpamWords.length > 0 ? 'Spam Words Detected' : 'Clean & Deliverable ✓'}
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {foundSpamWords.length > 0 
                    ? `Found trigger words (${foundSpamWords.join(', ')}). Consider editing.`
                    : 'No high-risk spam keywords detected.'}
                </p>
              </div>
            </div>
            <span className="badge-enterprise">{foundSpamWords.length > 0 ? 'Review Text' : 'Spam Safe'}</span>
          </div>
        </div>

        {/* Tag Insert Chips */}
        <div className="glass-enterprise-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Tag size={14} color="#ffffff" /> CLICK TO INSERT PLACEHOLDER TAG INTO {activeStep === 'initial' ? 'INITIAL' : activeStep === 'followUp1' ? 'FOLLOW-UP #1' : 'FOLLOW-UP #2'}:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {availableVariables.map(varName => (
              <button
                key={varName}
                onClick={() => insertVariable(varName, 'body')}
                className="btn-enterprise btn-enterprise-secondary"
                style={{ padding: '4px 10px', fontSize: '0.76rem' }}
              >
                + {`{{${varName}}}`}
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Subject Line {activeStep !== 'initial' && <span className="badge-enterprise" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>Auto-Threaded</span>}
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentSubject.length} characters</span>
            </div>
            <input
              type="text"
              className="input-enterprise"
              placeholder={activeStep === 'initial' ? "e.g. Partnership opportunity for {{Company}}" : "e.g. Re: Partnership opportunity for {{Company}}"}
              value={currentSubject}
              onChange={e => updateActiveSubject(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                {activeStep === 'initial' ? 'Initial Email Message Body' : activeStep === 'followUp1' ? 'Follow-Up #1 Message Body' : 'Follow-Up #2 Message Body'}
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Plain text / Dynamic Merge</span>
            </div>
            <textarea
              className="textarea-enterprise"
              rows={12}
              style={{ lineHeight: '1.6', fontSize: '0.9rem' }}
              placeholder="Hi {{ContactPerson}},..."
              value={currentBody}
              onChange={e => updateActiveBody(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={onNext} className="btn-enterprise btn-enterprise-primary">
              Next: 1-by-1 Preview &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
