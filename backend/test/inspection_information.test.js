// test_inspection_information.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db = require('../db');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Inspection Information API Routes', () => {
    let subjectId;
    let draftId;
    let inspectionId;

    beforeEach(async () => {
        // Clean up the test database and set up initial data
        await db.query('DELETE FROM inspection_information');
        await db.query('DELETE FROM drafts');
        await db.query('DELETE FROM inspection_subject');

        // Insert a test subject and draft
        const [subjectResult] = await db.query("INSERT INTO inspection_subject (name) VALUES ('Test Subject')");
        subjectId = subjectResult.insertId;

        const [draftResult] = await db.query("INSERT INTO drafts (subject_id) VALUES (?)", [subjectId]);
        draftId = draftResult.insertId;

        // Create an inspection_information entry for testing
        const newInspection = {
            draft_id: draftId,
            subject_of_inspection: 'Test Subject',
            issue: 'Test Issue',
            risk_area: 'Test Risk Area',
            official_duration_period: '1 week',
            total_duration_period: '2 weeks',
            participants: 'John Doe, Jane Smith',
            responsible_inspector: 'John Doe',
            office: 'Test Office',
            department: 'Test Department',
            subject_contact_information: 'test@example.com',
            inspection_contact_person: 'Jane Smith'
        };

        const [result] = await db.query('INSERT INTO inspection_information SET ?', newInspection);
        inspectionId = result.insertId;
    });

    // Test cases go here
    describe('POST /api/inspection_information', () => {

        it('should create a new inspection information entry', async () => {
            const newInspection = {
                draft_id: draftId,
                subject_of_inspection: 'Test Subject',
                issue: 'Test Issue',
                risk_area: 'Test Risk Area',
                official_duration_period: '1 week',
                total_duration_period: '2 weeks',
                participants: 'John Doe, Jane Smith',
                responsible_inspector: 'John Doe',
                office: 'Test Office',
                department: 'Test Department',
                subject_contact_information: 'test@example.com',
                inspection_contact_person: 'Jane Smith'
            };

            const res = await chai.request(app).post('/api/inspection_information').send(newInspection);

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            inspectionId = res.body.id;
        });
    });

    describe('GET /api/inspection_information/:id', () => {
        it('should get inspection information by ID', async () => {
            const res = await chai.request(app).get(`/api/inspection_information/${inspectionId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('subject_of_inspection', 'Test Subject');
            // Add checks for other properties in the response
        });

        it('should return a 404 error when the inspection information is not found', async () => {
            const res = await chai.request(app).get('/api/inspection_information/9999');

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Inspection information not found');
        });
    });

    describe('PUT /api/inspection_information/:id', () => {
        it('should update the inspection information', async () => {
            const updatedInspection = {
                draft_id: draftId,
                subject_of_inspection: 'Updated Subject',
                issue: 'Updated Issue',
                risk_area: 'Updated Risk Area',
                official_duration_period: '2 weeks',
                total_duration_period: '3 weeks',
                participants: 'John Doe, Jane Smith, Joe Black',
                responsible_inspector: 'Joe Black',
                office: 'Updated Office',
                department: 'Updated Department',
                subject_contact_information: 'updated@example.com',
                inspection_contact_person: 'Joe Black'
            };

            const res = await chai.request(app).put(`/api/inspection_information/${inspectionId}`).send(updatedInspection);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Inspection information updated successfully');
        });

        it('should return a 404 error when the inspection information is not found', async () => {
            const updatedInspection = {
                draft_id: draftId,
                subject_of_inspection: 'Updated Subject',
                issue: 'Updated Issue',
                risk_area: 'Updated Risk Area',
                official_duration_period: '2 weeks',
                total_duration_period: '3 weeks',
                participants: 'John Doe, Jane Smith, Joe Black',
                responsible_inspector: 'Joe Black',
                office: 'Updated Office',
                department: 'Updated Department',
                subject_contact_information: 'updated@example.com',
                inspection_contact_person: 'Joe Black'
            };


            const res = await chai.request(app).put('/api/inspection_information/9999').send(updatedInspection);

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Inspection information not found');
        });
    });

    describe('DELETE /api/inspection_information/:id', () => {
        it('should delete the inspection information', async () => {
            const res = await chai.request(app).delete(`/api/inspection_information/${inspectionId}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Inspection information deleted successfully');
        });

        it('should return a 404 error when the inspection information is not found', async () => {
            const res = await chai.request(app).delete('/api/inspection_information/9999');

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Inspection information not found');
        });
    });
});