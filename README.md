# Sahayak - Public Fraud & Anomaly Detection System

## 📖 Overview
**Sahayak** is an AI-powered fraud detection system designed to monitor government procurement and welfare distribution schemes. It uses machine learning to identify suspicious transactions in real-time, providing officials with actionable alerts and comprehensive audit trails.

## 🎯 Core Features

### ✅ Implemented & Operational
- **AI-Driven Fraud Detection**: Isolation Forest ML model with statistical analysis
- **Real-Time Alert Generation**: Automatic risk scoring (0-100) for all transactions
- **Alert Management Dashboard**: Filter, sort, and manage fraud alerts
- **Alert Feedback Loop**: Officers can verify or dismiss alerts with audit logging
- **Live Statistics Dashboard**: Real-time KPIs and recent transaction monitoring
- **Comprehensive Audit Logging**: Immutable record of all system actions
- **Backend API Testing**: Full test coverage for core endpoints
- **Context-Aware Analysis**: Agency-specific spending pattern recognition
- **Forensic Heuristics**: Round number detection and statistical outlier identification

### 🏗 System Architecture

**Frontend**: Next.js 14 (React) with TypeScript & Tailwind CSS
- Dashboard with live updates (10s polling)
- Alert management with status updates
- Real-time statistics visualization

**API Gateway**: Node.js/Express
- RESTful API endpoints
- MongoDB integration
- ML service orchestration
- Audit logging

**ML Engine**: Python (FastAPI)
- Isolation Forest algorithm
- Statistical baseline analysis
- Agency-specific risk profiling
- Training on Singapore government procurement data

**Database**: MongoDB
- Schemes, Vendors, Alerts, Audit Logs
- Flexible schema for evolving requirements

**Event Bus**: Apache Kafka (Optional)
- Asynchronous event processing
- System operates with fallback if unavailable

## 📂 Project Structure

```
NSUT_HACK/
├── client/                 # Next.js Frontend
│   ├── src/app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Main dashboard with stats
│   │   │   ├── alerts/page.tsx    # Alert management
│   │   │   ├── schemes/page.tsx   # Scheme registry
│   │   │   ├── vendors/page.tsx   # Vendor intelligence
│   │   │   └── simulator/page.tsx # Transaction simulator
│   │   └── page.tsx               # Login/Landing page
│   └── src/components/            # Reusable UI components
│
├── api-gateway/           # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── alert.controller.ts    # Alert CRUD + ML integration
│   │   │   └── resource.controller.ts # Schemes/Vendors/Health
│   │   ├── routes/                    # API route definitions
│   │   ├── services/
│   │   │   └── ml.service.ts          # ML API client
│   │   ├── models/index.ts            # Mongoose schemas
│   │   └── server.ts                  # App initialization + DB seeding
│   └── tests/api.test.ts              # Backend integration tests
│
├── ml-service/            # Python ML Engine
│   ├── ml_model.py                    # FastAPI app + ML logic
│   ├── requirements.txt               # Python dependencies
│   ├── government-procurement-via-gebiz.csv  # Training data
│   └── tests/test_model.py            # ML service tests
│
└── package.json           # Monorepo root config
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+
- **MongoDB** (local or cloud instance)
- **Docker** (optional, for Kafka)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd NSUT_HACK
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This installs packages for all workspaces (client, api-gateway, common).

3. **Set up MongoDB**:
   - Ensure MongoDB is running on `mongodb://localhost:27017`
   - Or update connection string in `api-gateway/src/server.ts`

### Running the Application

**Start all services with one command**:
```bash
npm run dev
```

This launches:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **ML Service**: http://localhost:8000 (FastAPI)

**Individual service commands**:
```bash
npm run dev:client    # Frontend only
npm run dev:api       # API Gateway only
npm run dev:ml        # ML Service only
```

### Testing

**Backend API Tests**:
```bash
cd api-gateway
npm test
```

**ML Service Tests**:
```bash
cd ml-service
pytest tests/
```

## 🔄 Core Workflows

### 1. Transaction Processing Flow
```
User submits payment → API Gateway → ML Service (risk scoring) 
→ Alert created (if risky) → Audit log → Response to user
```

### 2. Alert Management Flow
```
Officer views alerts → Filters by status → Reviews details 
→ Marks as "Verified" or "False Positive" → Audit log updated
```

### 3. ML Risk Scoring
```
Transaction data → Agency encoding → Isolation Forest prediction 
→ Statistical analysis → Forensic heuristics → Final risk score (0-100)
```

## 🛠 API Endpoints

### Alerts
- `POST /alerts` - Create new alert (triggers ML analysis)
- `GET /alerts` - Fetch all alerts
- `GET /alerts/stats` - Dashboard statistics
- `PUT /alerts/:id/status` - Update alert status

### Resources
- `GET /schemes` - List all schemes
- `GET /vendors` - List all vendors
- `GET /audit-logs` - Audit trail
- `GET /health` - System health check

### ML Service
- `POST /predict` - Fraud risk prediction
- `GET /` - Service health

## 📊 Data Models

### Alert Schema
```typescript
{
  id: string,           // ALT-2026-XXXX
  date: string,         // ISO date
  timestamp: string,    // ISO datetime
  status: string,       // "New" | "Verified" | "False Positive"
  riskScore: number,    // 0-100
  mlReasons: string[],  // AI-generated reasons
  amount: number,
  scheme: string,
  vendor: string,
  hierarchy: object[]   // Status change history
}
```

## 🔒 Security & Compliance

- **Audit Logging**: Every action logged with timestamp and actor
- **Context-Aware ML**: Reduces false positives via agency-specific baselines
- **Immutable Records**: Audit logs cannot be modified
- **Fallback Logic**: System operates even if ML service is unavailable

## 🐛 Known Issues & Limitations

1. **Kafka Connection**: Optional event bus may fail to connect (system has HTTP fallback)
2. **Authentication**: Currently uses role selection only (no real auth implemented)
3. **Test Timing**: One backend test occasionally times out (non-critical)

## 📝 Development Notes

### Database Seeding
On first run, the API Gateway automatically seeds the database with:
- Sample schemes (Singapore government agencies)
- Sample vendors
- Initial test alerts

### ML Model Training
The ML service trains on startup using `government-procurement-via-gebiz.csv`:
- 800+ historical procurement records
- Agency-specific spending patterns
- Statistical baselines for anomaly detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run `npm test` in api-gateway
5. Submit a pull request

## 📄 License

[Add your license here]

---

**Built for NSUT Hackathon 2026** | Powered by AI & Modern Web Technologies
