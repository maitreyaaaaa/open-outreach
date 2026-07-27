import React, { useState } from 'react';
import { Puzzle, CheckCircle, ExternalLink, Key, Plus, Trash2, Zap, Shield, Mail, Linkedin, MessageSquare, Github, Slack, Database, Cpu } from 'lucide-react';
import { logSystemEvent } from '../services/loggerService';
import { executeLinkedInMcpTool } from '../services/linkedInMcpService';

export default function PluginSpace() {
  const [composioApiKey, setComposioApiKey] = useState(() => {
    try { return sessionStorage.getItem('composio_api_key') || ''; } catch (e) { return ''; }
  });

  const [activePlugins, setActivePlugins] = useState({
    gmail: true,
    linkedin: true,
    linkedin_mcp: true,
    whatsapp: true,
    github: false,
    hubspot: false,
    slack: false
  });

  const [customWebhooks, setCustomWebhooks] = useState([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [mcpTestResult, setMcpTestResult] = useState(null);

  const togglePlugin = (pluginId) => {
    const nextState = !activePlugins[pluginId];
    setActivePlugins(prev => ({ ...prev, [pluginId]: nextState }));
    logSystemEvent('PLUGIN_SPACE', `${nextState ? 'ENABLED' : 'DISABLED'}_PLUGIN`, { pluginId }, 'info');
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('composio_api_key', composioApiKey.trim());
      alert('Composio API Key connected!');
      logSystemEvent('PLUGIN_SPACE', 'CONNECTED_COMPOSIO_KEY', {}, 'success');
    } catch (e) {}
  };

  const handleTestLinkedInMcp = async () => {
    try {
      const res = await executeLinkedInMcpTool('linkedin_search_profile', { keyword: 'Venture Partner', company: 'Sequoia' });
      setMcpTestResult({ success: true, message: `LinkedIn MCP tool test passed! Found ${res.profiles?.length} lead bindings.` });
    } catch (err) {
      setMcpTestResult({ success: false, message: err.message });
    }
  };

  const handleAddWebhook = (e) => {
    e.preventDefault();
    if (!newWebhookUrl) return;
    setCustomWebhooks(prev => [...prev, { id: Date.now(), url: newWebhookUrl.trim(), status: 'Active' }]);
    setNewWebhookUrl('');
  };

  const pluginsCatalog = [
    {
      id: 'linkedin_mcp',
      name: 'LinkedIn Model Context Protocol (MCP) Server',
      category: 'Model Context Protocol',
      icon: Cpu,
      desc: 'Native MCP bindings for search, 300-char connection invites, and thread history (felipfr/linkedin-mcpserver).'
    },
    {
      id: 'gmail',
      name: 'Composio Gmail Action Plugin',
      category: 'Email Outreach',
      icon: Mail,
      desc: 'Enables direct agentic email outreach and thread reading via Composio Gmail tool.'
    },
    {
      id: 'linkedin',
      name: 'Composio LinkedIn Voyager Plugin',
      category: 'Social Outreach',
      icon: Linkedin,
      desc: 'Enables contact search and note invitation dispatches over Composio LinkedIn gateway.'
    },
    {
      id: 'whatsapp',
      name: 'Composio WhatsApp MCP Plugin',
      category: 'Messaging',
      icon: MessageSquare,
      desc: 'Managed WhatsApp gateway with phone pairing to eliminate account ban risks.'
    },
    {
      id: 'github',
      name: 'Composio GitHub Actions Plugin',
      category: 'Developer Tools',
      icon: Github,
      desc: 'Automates repository management, pull requests, and commit change tracking.'
    },
    {
      id: 'hubspot',
      name: 'Composio HubSpot CRM Sync',
      category: 'CRM Integration',
      icon: Database,
      desc: 'Syncs outreach status and contact records directly into HubSpot CRM pipelines.'
    },
    {
      id: 'slack',
      name: 'Composio Slack Alert Plugin',
      category: 'Notifications',
      icon: Slack,
      desc: 'Sends instant Slack channel notifications when outreach targets respond or fail.'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Header Banner */}
      <div className="glass-enterprise-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#ffffff', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Puzzle color="#080a0f" size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff' }}>
                  Plugin Space & MCP Extensions
                </h2>
                <span className="badge-enterprise badge-enterprise-white">LinkedIn MCP Protocol</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Plug in Composio tools (`composio.dev`), LinkedIn MCP Server bindings, and custom webhooks into OpenOutreach.
              </p>
            </div>
          </div>

          <a
            href="https://composio.dev/tools"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enterprise btn-enterprise-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Explore 1,000+ Composio Plugins <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Composio Credentials Card */}
      <div className="glass-enterprise-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="#ffffff" /> Composio Plugin API Gateway (`composio.dev`)
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Provide your Composio API Key (`ak_...`) to activate all plugged-in Composio tools across your workspace.
        </p>

        <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="password"
            className="input-enterprise"
            style={{ flex: 1, minWidth: '280px', fontFamily: 'monospace' }}
            placeholder="Enter Composio API Key (ak_...)"
            value={composioApiKey}
            onChange={e => setComposioApiKey(e.target.value)}
          />
          <button type="submit" className="btn-enterprise btn-enterprise-primary">
            Save Composio Credentials
          </button>
        </form>
      </div>

      {/* LinkedIn MCP Testing Panel */}
      <div className="glass-enterprise-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>LinkedIn Model Context Protocol (MCP) Server Test</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Verify Model Context Protocol tool bindings for profile search & invitation dispatches.</p>
          </div>
          <button onClick={handleTestLinkedInMcp} className="btn-enterprise btn-enterprise-secondary">
            Test LinkedIn MCP Binding
          </button>
        </div>

        {mcpTestResult && (
          <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="#4ade80" />
            {mcpTestResult.message}
          </div>
        )}
      </div>

      {/* Plugins Catalog Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginBottom: '18px' }}>
          Available MCP & Extension Plugins
        </h3>

        <div className="grid-enterprise grid-enterprise-3">
          {pluginsCatalog.map(plugin => {
            const Icon = plugin.icon;
            const isPluggedIn = activePlugins[plugin.id];
            return (
              <div
                key={plugin.id}
                className="glass-enterprise-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  border: isPluggedIn ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isPluggedIn ? 'rgba(255, 255, 255, 0.05)' : 'rgba(8, 10, 15, 0.4)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ background: '#ffffff', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="#080a0f" />
                    </div>
                    <span className="badge-enterprise" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                      {plugin.category}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                    {plugin.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                    {plugin.desc}
                  </p>
                </div>

                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className={`btn-enterprise ${isPluggedIn ? 'btn-enterprise-primary' : 'btn-enterprise-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isPluggedIn ? '✓ Plugged In (Active)' : '+ Plug In Tool'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Webhook Plugins Registration */}
      <div className="glass-enterprise-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#ffffff" /> Register Custom Plugin Webhook
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Add custom webhook endpoints (n8n, Activepieces, or self-hosted HTTP endpoints) to extend outreach capabilities.
        </p>

        <form onSubmit={handleAddWebhook} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input
            type="url"
            className="input-enterprise"
            style={{ flex: 1, minWidth: '300px' }}
            placeholder="https://your-custom-webhook-endpoint.com/api/outreach"
            value={newWebhookUrl}
            onChange={e => setNewWebhookUrl(e.target.value)}
          />
          <button type="submit" className="btn-enterprise btn-enterprise-secondary">
            <Plus size={15} /> Add Custom Webhook
          </button>
        </form>

        {customWebhooks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {customWebhooks.map(wh => (
              <div key={wh.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.84rem' }}>
                <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>{wh.url}</span>
                <span className="badge-enterprise" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
