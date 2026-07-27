/**
 * Multi-Tenant Security & Data Isolation Service
 * Manages active tenant spaces, tenant switching, and isolated storage partitioning.
 */

const ACTIVE_TENANT_KEY = 'open_outreach_active_tenant_id';
const TENANT_LIST_KEY = 'open_outreach_tenant_list';

export function getActiveTenantId() {
  try {
    return localStorage.getItem(ACTIVE_TENANT_KEY) || 'tenant_personal';
  } catch (e) {
    return 'tenant_personal';
  }
}

export function setActiveTenantId(tenantId) {
  try {
    localStorage.setItem(ACTIVE_TENANT_KEY, tenantId);
  } catch (e) {}
}

export function getTenantList() {
  try {
    const raw = localStorage.getItem(TENANT_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return [
    { id: 'tenant_personal', name: 'Personal Vault', role: 'Owner' },
    { id: 'tenant_org_alpha', name: 'Organization Alpha', role: 'Admin' },
    { id: 'tenant_client_b', name: 'Client B Campaign Space', role: 'Operator' }
  ];
}

export function createNewTenant(name) {
  if (!name) return null;
  const list = getTenantList();
  const id = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const newTenant = { id, name, role: 'Owner' };

  const updated = [...list, newTenant];
  try {
    localStorage.setItem(TENANT_LIST_KEY, JSON.stringify(updated));
  } catch (e) {}

  return newTenant;
}
