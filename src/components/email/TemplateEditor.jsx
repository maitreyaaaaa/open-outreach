import React from 'react';
import { Sparkles, Tag, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function TemplateEditor({ template, setTemplate, availableVariables, onNext }) {

  const spamKeywordsList = ['100% free', 'click here', 'act now', 'urgent', 'guaranteed', 'no obligation', 'make money', 'risk-free', 'buy now', 'cheap', 'winner', 'cash bonus'];

  const detectSpamTriggerWords = () => {
    const combinedText = `${template.subject} ${template.body}`.toLowerCase();
    return spamKeywordsList.filter(word => combinedText.includes(word));
  };

  const foundSpamWords = detectSpamTriggerWords();

  const insertVariable = (varName, field = 'body') => {
    const tag = `{{${varName}}}`;
    if (field === 'subject') {
      setTemplate(prev => ({ ...prev, subject: prev.subject + ' ' + tag }));
    } else {
      setTemplate(prev => ({ ...prev, body: prev.body + ' ' + tag }));
    }
  };

  const applyTemplatePreset = (presetType) => {
    if (presetType === 'partnership') {
      setTemplate({
        subject: 'Strategic Partnership Proposal for {{Company}}',
        body: `Hi {{ContactPerson}},\n\nI’ve been following {{Company}}'s impressive trajectory in your industry and wanted to reach out directly.\n\nWe specialize in assisting high-growth companies streamline their operations and expand their market presence.\n\n{{CustomNote}}\n\nWould you be open to a brief 10-minute exploratory chat next Tuesday or Thursday?\n\nBest regards,\nSarah Jenkins`
      });
    } else if (presetType === 'outreach') {
      setTemplate({
        subject: 'Quick question regarding {{Company}}\'s tech stack',
        body: `Hello {{ContactPerson}},\n\nI hope your week is going well.\n\nI noticed {{Company}}'s work in your sector and thought this might be relevant. We recently helped a team similar to {{Company}} optimize their workflow efficiency by over 35%.\n\nI’d love to send over a short, customized PDF overview tailored for {{Company}}.\n\nLet me know if this sounds relevant to your current priorities.\n\nWarmly,\nMichael Chen`
      });
    }
  };

  const subjectCharCount = template.subject.length;

  return (
    <div>
      <div className="glass-enterprise-panel">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-enterprise badge-enterprise-white">Template Engine</span>
              <span className="badge-enterprise">Dynamic Merge</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '6px', color: '#ffffff' }}>
              Personalized Email Subject & Body
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Write outreach templates with placeholder tags like <code>{"{{Company}}"}</code>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => applyTemplatePreset('partnership')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> B2B Pitch
            </button>
            <button onClick={() => applyTemplatePreset('outreach')} className="btn-enterprise btn-enterprise-secondary" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={14} /> Cold Outreach
            </button>
          </div>
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
            <Tag size={14} color="#ffffff" /> CLICK TO INSERT PLACEHOLDER TAG:
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
              <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>Subject Line</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{subjectCharCount} characters</span>
            </div>
            <input
              type="text"
              className="input-enterprise"
              placeholder="e.g. Partnership opportunity for {{Company}}"
              value={template.subject}
              onChange={e => setTemplate({ ...template, subject: e.target.value })}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>Email Body Message</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Plain text / HTML</span>
            </div>
            <textarea
              className="textarea-enterprise"
              rows={12}
              style={{ lineHeight: '1.6', fontSize: '0.9rem' }}
              placeholder="Hi {{ContactPerson}},..."
              value={template.body}
              onChange={e => setTemplate({ ...template, body: e.target.value })}
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
