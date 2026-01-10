// Centralized API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,

    // Alerts
    ALERTS: `${API_BASE_URL}/alerts`,
    ALERT_STATS: `${API_BASE_URL}/alerts/stats`,
    ALERT_BY_ID: (id: string) => `${API_BASE_URL}/alerts/${id}`,
    ALERT_STATUS: (id: string) => `${API_BASE_URL}/alerts/${id}/status`,

    // Analytics
    ANALYTICS_PREDICTIVE: `${API_BASE_URL}/analytics/predictive`,
    ANALYTICS_CLUSTERS: `${API_BASE_URL}/analytics/clusters`,
    ANALYTICS_REPORT: `${API_BASE_URL}/analytics/report`,

    // Vendors
    VENDORS: `${API_BASE_URL}/vendors`,
    VENDOR_BY_ID: (id: string) => `${API_BASE_URL}/vendors/${id}`,
    VENDOR_RISK_PROFILE: (id: string) => `${API_BASE_URL}/vendors/${id}/risk-profile`,

    // Network
    NETWORK: (id: string) => `${API_BASE_URL}/network/${id}`,

    // Audit
    AUDIT_LOGS: `${API_BASE_URL}/audit-logs`,

    // Schemes
    SCHEMES: `${API_BASE_URL}/schemes`,
};
