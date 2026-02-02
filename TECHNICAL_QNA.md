# Technical Interview Questions & Answers (Sahayak PFMS)

## 1. Frontend: Next.js & React
**Q: Why did you choose Next.js over plain React?**
*A: We needed **Server-Side Rendering (SSR)** for the dashboard to ensure fast initial load times and better SEO availability for government transparency portals. Next.js also handles routing and API integration out-of-the-box, which sped up development.*

**Q: How are you managing state in the complex dashboard?**
*A: We use a mix of **React Context API** for global state (like User Auth and Map Updates) and local state for individual components. This avoids prop-drilling without the overhead of Redux.*

**Q: Why Tailwind CSS instead of Bootstrap or Material UI?**
*A: Tailwind allows for lower-level customization and smaller bundle sizes (it purges unused styles). It gave us the flexibility to build a bespoke "Government/Pro" look without fighting framework defaults.*

## 2. Backend: Node.js & Express
**Q: Why standard Express over NestJS?**
*A: Express is lightweight and unopinionated, allowing us to build a custom **Microservices Architecture** quickly. For this hackathon/MVP scope, the boilerplate of NestJS was unnecessary, though we implemented strict Controller-Service-Repository patterns in Express to maintain clean code.*

**Q: How do you handle high-load transaction processing?**
*A: We use an **Event-Driven Architecture** with Kafka. The API Gateway doesn't process heavy tasks synchronously. It validates the request, pushes an event to Kafka, and immediately responds to the client. Background workers (consumers) then handle the heavy lifting.*

## 3. Database: MongoDB
**Q: Why NoSQL (MongoDB) for a Financial System? Usually, SQL is preferred.**
*A: While SQL is standard for banking, our specific use case involves diverse welfare schemes with **varying data structures** (some have 5 fields, some have 50). MongoDB's flexible schema allows us to onboard new schemes without database migrations. We strictly enforce data integrity using **Zod** validation at the API level and Mongoose schemas.*

**Q: Strategies for fast querying on millions of transactions?**
*A: We use **Compound Indexes** on frequently queried fields like `(vendorId, timestamp)`. We also use MongoDB's Aggregation Pipeline for generating the dashboard analytics, which is much faster than processing data in Node.js.*

## 4. Machine Learning & Python
**Q: Why Random Forest? Why not a Deep Neural Network?**
*A: **Interpretability** is crucial for government audits. Random Forest provides feature importance (e.g., "Why was this flagged?"), whereas Deep Learning is a "black box." Random Forest also performs exceptionally well on tabular transaction data specifically.*

**Q: How does the Node.js backend talk to the Python ML service?**
*A: They communicate via **REST API** (HTTP). The Node.js service sends a JSON payload to the FastAPI Python service, which returns the prediction. In the future, we plan to move this to gRPC for lower latency.*

## 5. Infrastructure: Kafka & Microservices
**Q: What happens if the ML Service goes down? Does the whole app crash?**
*A: No. We designed it for **Fail-Safe** operation. If the ML service is unreachable, the API Gateway catches the error, flags the transaction as "Pending Analysis," and allows the payment to proceed (or queues it), ensuring the main system never stops.*

**Q: Why separate the ML Service into its own container?**
*A: **Independent Scaling**. The ML inference is CPU-heavy, while the API Gateway is I/O-heavy. By separating them, we can deploy 5 instances of the ML service and only 2 of the API Gateway, optimizing resource usage.*
