# Sahayak PFMS - System Functionalities, Features & USPs

## 1. System Overview
**Sahayak PFMS** is an enterprise-grade, AI-powered fraud detection system specifically designed to protect India's public financial management infrastructure. It shifts the paradigm from reactive, manual auditing to proactive, real-time intelligent monitoring, capable of analyzing 100% of transactions with sub-second latency.

---

## 2. Unique Selling Points (USPs)

### 🚀 Proactive vs. Reactive
- **Traditional**: Fraud is detected 30-90 days after payment during post-audits.
- **Sahayak**: Fraud is detected and **blocked in <1 second**, before money leaves the treasury.

### 🧠 Hybrid Detection Engine
Combines three distinct layers of defense:
1.  **Deterministic Rules**: Enforces strict constraints (e.g., max amounts, schemes).
2.  **Behavioral Analysis**: Validates payment patterns (e.g., "Regular" vs. "Milestone" payments).
3.  **Probabilistic ML**: Uses Random Forest to catch complex, non-linear fraud patterns (collusion, anomalies).

### 📍 Geospatial Intelligence
- Unlike standard dashboards, Sahayak visualizes **risk geographically**.
- Identifies "Fraud Hotspots" by overlaying payment density and risk scores on an interactive map of India.

### 🧪 Smart Fraud Simulator ("The Playground")
- A unique **White-Box Testing** environment.
- Allows officers to "test" the AI by running hypothetical scenarios without affecting production data.
- Builds trust by explaining *exactly* why a transaction would be flagged.

---

## 3. Core Functionalities

### A. Real-Time Transaction Monitoring
- **Speed**: Processes 10,000+ transactions per second.
- **Latency**: End-to-end analysis in under 100ms.
- **Coverage**: 100% of transactions are analyzed (vs. 5-10% in manual audits).

### B. Intelligent Payment Behavior Validation
The system understands *how* vendors should be paid based on their contracts:
- **REGULAR**: Enforces monthly cycles with configurable tolerance (e.g., ±5 days).
- **QUARTERLY**: Checks for 3-month intervals.
- **MILESTONE**: Validates project phases and minimum gaps (e.g., min 7 days).
- **IRREGULAR**: Flags suspicious high-frequency ad-hoc payments.

### C. Vendor Constraint Management
- **Max Transaction Limits**: Automatically flags payments exceeding vendor-specific caps.
- **Timing Tolerance**: Configurable deviation windows for payment schedules.
- **Dynamic Scoring**: Violation of these constraints directly increases the transaction's Risk Score.

---

## 4. Key Features

### 📊 Comprehensive Investigation Dashboard
- **360-View**: Combines transaction details, vendor history, and risk analysis in one screen.
- **Explainable AI**: Provides human-readable "ML Reasons" (e.g., "Payment too early: 10 days since last payment").
- **Related Alerts**: Automatically clusters similar suspicious alerts to detect networks.

### 🗺️ Live Geospatial Heatmap
- **Real-Time Updates**: Map updates instantly as transactions occur.
- **Risk Coding**:
    - 🔴 **Red**: High-risk zones.
    - 🟡 **Yellow**: Medium-risk / Warning zones.
    - 🟢 **Green**: Safe zones.
- **Drill-Down**: Click on any marker to see vendor details and specific alerts.

### 📜 Forensic Audit Trail
- **Immutable Logs**: Every action (login, view, approve, reject) is cryptographically logged.
- **Correlation IDs**: Traces a transaction's journey from API Gateway → ML Service → Database.
- **CAG Ready**: Format complies with government auditing standards.

### 🤖 AI Chatbot Assistant
- **Context-Aware**: Can answer questions about specific vendors, alerts, or system rules.
- **Natural Language**: "Show me all high-risk alerts in North Delhi from yesterday."

---

## 5. Technical Highlights

### Microservices Architecture
- **Decoupled**: Independent scaling of API Gateway, ML Service, and Frontend.
- **Resilient**: If the ML service is down, the core system stays up (graceful degradation).

### Event-Driven Design (Kafka)
- **Async Processing**: Uses Apache Kafka to decouple fraud analysis from notifications.
- **Scalable**: Can easily add new consumers (e.g., SMS Service, Analytics Lake) without changing the core.

### State-of-the-Art Stack
- **Frontend**: Next.js 16.1 (React 19) + Tailwind CSS 4.
- **Backend**: Node.js/Express + TypeScript.
- **ML Engine**: Python/FastAPI + Scikit-Learn (Random Forest).
- **Database**: MongoDB (NoSQL for flexible schema).
