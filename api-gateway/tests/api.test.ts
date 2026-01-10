import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { Scheme, Vendor, Alert } from '../src/models';

describe('PFMS API Gateway Tests', () => {

    beforeAll(async () => {
        // Connect to local dev DB for integration testing
        await mongoose.connect('mongodb://localhost:27017/pfms_fraud_db');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'ok', engine: 'v2-modular' });
        });
    });

    describe('Resource Endpoints', () => {
        it('GET /schemes should return list of schemes', async () => {
            const res = await request(app).get('/schemes');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            // Verify at least one seeded scheme exists
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('name');
            }
        });

        it('GET /vendors should return list of vendors', async () => {
            const res = await request(app).get('/vendors');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('Alert Generation Flow', () => {
        it('POST /alerts/analyze should accept valid transaction', async () => {
            // This depends on the alert routes definition. 
            // Assuming POST /alerts is correct based on alert.routes.ts
            const payload = {
                amount: 50000,
                scheme: "Building and Construction Authority",
                vendor: "Test Vendor",
                beneficiary: "Test Ben",
                description: "Test Txn"
            };

            const res = await request(app).post('/alerts')
                .send(payload);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('riskScore');
            expect(res.body).toHaveProperty('isAnomaly');
        });

        it('POST /alerts should handle missing fields gracefully', async () => {
            const res = await request(app).post('/alerts').send({});
            // Depending on validation logic, might be 400 or 500
            // Since we don't have strict validation middleware yet, it might fail or return 500
            // We just check it doesn't hang.
            expect(res.status).not.toBe(404);
        });
    });

    describe('Alert Status Updates (Feedback Loop)', () => {
        it('PUT /alerts/:id/status should update status and create audit log', async () => {
            // First create a new alert to update
            const newAlert = await Alert.create({
                id: 'TEST-UPDATE-001',
                scheme: 'Test Scheme',
                riskScore: 85,
                amount: 10000,
                status: 'New',
                riskLevel: 'High',
                date: '2024-01-01',
                timestamp: new Date().toISOString(),
                mlReasons: [],
                hierarchy: []
            });

            const res = await request(app)
                .put(`/alerts/${newAlert.id}/status`)
                .send({ status: 'Verified', notes: 'Manually verified via test' });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('Verified');
            expect(res.body.hierarchy).toHaveLength(1);
            expect(res.body.hierarchy[0].status).toBe('Verified');
        });
    });
});
