// test/test_inspection_subjects.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db = require('../db');

chai.use(chaiHttp);
const { expect } = chai;

describe('Inspection Subjects API', () => {
    // Clean up the test database before and after each test
    beforeEach(async () => {
        await db.query('DELETE FROM inspection_subject');
    });

    afterEach(async () => {
        await db.query('DELETE FROM inspection_subject');
    });

    describe('POST /api/inspection_subjects', () => {
        it('should create a new inspection_subject', async () => {
            const res = await chai.request(app)
                .post('/api/inspection_subjects')
                .send({ name: 'Test Subject' });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('id');
        });
    });

    describe('GET /api/inspection_subjects', () => {
        it('should retrieve all inspection_subjects', async () => {
            // Insert a test subject into the database
            const [result] = await db.query('INSERT INTO inspection_subject (name) VALUES (?)', ['Test Subject']);

            const res = await chai.request(app).get('/api/inspection_subjects');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('id', result.insertId);
            expect(res.body[0]).to.have.property('name', 'Test Subject');
        });
    });

    describe('PUT /api/inspection_subjects/:id', () => {
        it('should update an existing inspection_subject', async () => {
            // Insert a test subject into the database
            const [result] = await db.query('INSERT INTO inspection_subject (name) VALUES (?)', ['Test Subject']);

            const res = await chai.request(app)
                .put(`/api/inspection_subjects/${result.insertId}`)
                .send({ name: 'Updated Subject' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Inspection_subject updated successfully');
        });

        it('should return 404 for non-existent inspection_subject', async () => {
            const res = await chai.request(app)
                .put('/api/inspection_subjects/9999')
                .send({ name: 'Updated Subject' });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Inspection_subject not found');
        });
    });

    describe('DELETE /api/inspection_subjects/:id', () => {
        it('should delete an existing inspection_subject', async () => {
            // Insert a test subject into the database
            const [result] = await db.query('INSERT INTO inspection_subject (name) VALUES (?)', ['Test Subject']);

            const res = await chai.request(app).delete(`/api/inspection_subjects/${result.insertId}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Inspection_subject deleted successfully');
        });

        it('should return 404 for non-existent inspection_subject', async () => {
            const res = await chai.request(app).delete('/api/inspection_subjects/9999');
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Inspection_subject not found');
        });
    });
});


