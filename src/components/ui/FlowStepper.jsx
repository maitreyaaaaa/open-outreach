import React from 'react';
import { Check } from 'lucide-react';

export default function FlowStepper({ steps, currentStep, onStepClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', background: 'rgba(8, 10, 15, 0.6)', padding: '12px 20px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '12px' }}>
      {steps.map((step, idx) => {
        const isCurrent = currentStep === step.id;
        const isPast = steps.findIndex(s => s.id === currentStep) > idx;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick(step.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: isCurrent || isPast ? 1 : 0.5,
                transition: 'all 0.2s ease',
                minHeight: '44px',
                padding: '0 6px'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isCurrent ? '#ffffff' : isPast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                color: isCurrent ? '#080a0f' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.78rem',
                border: isCurrent ? 'none' : '1px solid rgba(255,255,255,0.2)'
              }}>
                {isPast ? <Check size={14} color="#ffffff" /> : idx + 1}
              </div>

              <span style={{
                fontSize: '0.84rem',
                fontWeight: isCurrent ? '700' : '500',
                color: isCurrent ? '#ffffff' : 'var(--text-muted)'
              }}>
                {step.label}
              </span>
            </button>

            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)', minWidth: '20px', margin: '0 4px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
