const assert = require('chai').assert;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db = require('../db');

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe('Target Timeframes API', () => {
    // Before each test, create a new target timeframe record in the database
    beforeEach(async () => {
        await db.query('INSERT INTO targettimeframes (target_id, planned_date, actual_date, comments, document_id) VALUES (1, "2022-01-01", "2022-01-02", "Test comments", 1)');
    });

    // After each test, delete all target timeframe records from the database
    afterEach(async () => {
        await db.query('DELETE FROM targettimeframes');
    });

    describe('POST /api/targettimeframes', () => {
        it('should create a new target timeframe record', async () => {
            const res = await request(app)
                .post('/api/targettimeframes')
                .send({ target_id: 2, planned_date: '2022-02-01', actual_date: '2022-02-02', comments: 'Test comments', document_id: 2 });
            assert.equal(res.status, 201);
            assert.isNumber(res.body.id);
            assert.equal(res.body.target_id, 2);
            assert.equal(res.body.planned_date, '2022-02-01');
            assert.equal(res.body.actual_date, '2022-02-02');
            assert.equal(res.body.comments, 'Test comments');
            assert.equal(res.body.document_id, 2);
        });

        it('should return an error when missing required fields', async () => {
            const res = await request(app)
                .post('/api/targettimeframes')
                .send({ planned_date: '2022-02-01', actual_date: '2022-02-02', comments: 'Test comments', document_id: 2 });
            assert.equal(res.status, 500);
            assert.equal(res.body.error, 'Error creating target timeframe');
        });
    });

    describe('GET /api/targettimeframes', () => {
        it('should retrieve all target timeframe records', async () => {
            const response = await chai.request(app).get('/api/targettimeframes');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(1);
            const targetTimeframe = response.body[0];
            expect(targetTimeframe).to.have.property('target_id', 1);
            expect(new Date(targetTimeframe.planned_date).toISOString().substr(0, 10)).to.equal('2022-01-01');
            expect(new Date(targetTimeframe.actual_date).toISOString().substr(0, 10)).to.equal('2022-01-02');
            expect(targetTimeframe).to.have.property('comments', 'Test comments');
            expect(targetTimeframe).to.have.property('document_id', 1);
        });
    });

    describe('DELETE /api/targettimeframes/:id', () => {
        it('should return a 404 error if the target timeframe does not exist', async () => {
            const response = await chai.request(app).delete('/api/targettimeframes/9999');
            expect(response).to.have.status(404);
            expect(response.body).to.deep.equal({ error: 'Target timeframe with id 9999 not found' });
        });

        it('should delete a target timeframe and return a 204 status code', async () => {
            // Insert a target timeframe to delete
            const insertResponse = await chai.request(app)
                .post('/api/targettimeframes')
                .send({ target_id: 1, planned_date: '2022-03-01', actual_date: '2022-03-03', comments: 'Test comment', document_id: 1 });
            const targetTimeframeId = insertResponse.body.id;

            // Delete the target timeframe
            const deleteResponse = await chai.request(app).delete(`/api/targettimeframes/${targetTimeframeId}`);
            expect(deleteResponse).to.have.status(204);

            // Check that the target timeframe was deleted
            const getResponse = await chai.request(app).get(`/api/targettimeframes/${targetTimeframeId}`);
            expect(getResponse).to.have.status(404);
            expect(getResponse.body).to.deep.equal({ error: `Target timeframe with id ${targetTimeframeId} not found` });
        });
    });

    describe('GET /api/targettimeframes/:id', () => {
        it('should return a 404 error if the target timeframe does not exist', async () => {
            const response = await chai.request(app).get('/api/targettimeframes/9999');
            expect(response).to.have.status(404);
            expect(response.body).to.deep.equal({ error: 'Target timeframe with id 9999 not found' });
        });

        it('should return the requested target timeframe', async () => {
            const insertResponse = await chai.request(app)
                .post('/api/targettimeframes')
                .send({ target_id: 1, planned_date: '2022-03-01', actual_date: '2022-03-03', comments: 'Test comment', document_id: 1 });
            const targetTimeframeId = insertResponse.body.id;

            const response = await chai.request(app).get(`/api/targettimeframes/${targetTimeframeId}`);
            expect(response).to.have.status(200);
            expect(response.body).to.deep.include({
                id: targetTimeframeId,
                target_id: 1,
                // planned_date: '2022-03-01',
                // actual_date: '2022-03-03',
                comments: 'Test comment',
                document_id: 1
            });
            expect(new Date(response.body.planned_date).toISOString().substr(0, 10)).to.equal('2022-03-01');
            expect(new Date(response.body.actual_date).toISOString().substr(0, 10)).to.equal('2022-03-03');
        });
    });
});


    describe('PUT /api/targettimeframes/:id', () => {
    // Create a target timeframe to update
        let targetTimeframeId;
        before(async () => {
            const result = await db.query(
                'INSERT INTO targettimeframes (target_id, planned_date, actual_date, comments, document_id) VALUES (?, ?, ?, ?, ?)',
                [1, '2022-01-01', null, 'Test comment', null]
            );
            targetTimeframeId = result.insertId;
        });



        // Test updating an existing target timeframe
        it('should update an existing target timeframe', async () => {
            const targetTimeframe = { target_id: 1, planned_date: '2022-01-01', actual_date: null, comments: 'Test comment', document_id: null };
            const insertResult = await db.query(
            'INSERT INTO targettimeframes (target_id, planned_date, actual_date, comments, document_id) VALUES (?, ?, ?, ?, ?)',
            [targetTimeframe.target_id, targetTimeframe.planned_date, targetTimeframe.actual_date, targetTimeframe.comments, targetTimeframe.document_id]
            );
            const updatedTargetTimeframe = { planned_date: '2022-02-01', actual_date: '2022-01-15', comments: 'Updated comment', document_id: 1 };
            const res = await request(app)
            .put(`/api/targettimeframes/${insertResult.insertId}`)
            .send(updatedTargetTimeframe);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Target timeframe updated successfully');
            const selectResult = await db.query('SELECT * FROM targettimeframes WHERE id = ?', [insertResult.insertId]);
            const updatedRecord = selectResult[0];
            expect(updatedRecord).toMatchObject({ target_id: targetTimeframe.target_id, ...updatedTargetTimeframe });
        });

        // Test updating a non-existent target timeframe
        it('should return a 404 error when updating a non-existent target timeframe', async () => {
            const res = await request(app)
            .put('/api/targettimeframes/999')
            .send({ planned_date: '2022-02-01', actual_date: '2022-01-15', comments: 'Updated comment', document_id: 1 });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Target timeframe not found');
        });

        // Test updating a target timeframe with invalid data
        it('should return a 400 error when updating a target timeframe with invalid data', async () => {
            const targetTimeframe = { target_id: 1, planned_date: '2022-01-01', actual_date: null, comments: 'Test comment', document_id: null };
            const insertResult = await db.query(
            'INSERT INTO targettimeframes (target_id, planned_date, actual_date, comments, document_id) VALUES (?, ?, ?, ?, ?)',
            [targetTimeframe.target_id, targetTimeframe.planned_date, targetTimeframe.actual_date, targetTimeframe.comments, targetTimeframe.document_id]
         );
            const res = await request(app)
            .put(`/api/targettimeframes/${insertResult.insertId}`)
            .send({ planned_date: 'invalid date' });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('message', 'Invalid data in request body');
        }); 

        
        // Clean up the test data
        after(async () => {
         await db.query('DELETE FROM targettimeframes WHERE id = ?', [targetTimeframeId]);
        });
    });


    describe('Target Timeframes API - Get by target_id', () => {
        beforeAll(async () => {
            // create a target timeframe to use for testing
            const results = await db.query(
                'INSERT INTO targettimeframes (target_id, planned_date, actual_date, comments, document_id) VALUES (?, ?, ?, ?, ?)',
                [1, '2023-04-01', '2023-04-05', 'Test comment', 1]
            );
        });
    
        afterAll(async () => {
            // delete the target timeframe used for testing
            await db.query('DELETE FROM targettimeframes WHERE target_id = ?', [1]);
        });
    
        it('should return all target timeframes with the given target_id', async () => {
            const res = await request(app).get('/api/targettimeframes/target/1');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body).toHaveLength(1);
        });
    
        it('should return an empty array if no target timeframes are found with the given target_id', async () => {
            const res = await request(app).get('/api/targettimeframes/target/2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body).toHaveLength(0);
        });
    
        it('should return a 500 status if an error occurs while fetching target timeframes', async () => {
            // override the db.query method to simulate an error
            jest.spyOn(db, 'query').mockImplementation(() => {
                throw new Error('Test error');
            });
    
            const res = await request(app).get('/api/targettimeframes/target/1');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error');
            
            // restore the original db.query method
            jest.spyOn(db, 'query').mockRestore();
        });
    });