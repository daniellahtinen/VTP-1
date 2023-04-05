// inspection_information.js

const db = require('./db');

function setupInspectionInformationRoute(app) {
    app.post('/api/inspection_information', async (req, res) => {
        const { draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person } = req.body;
        try {
            const [result] = await db.query('INSERT INTO inspection_information (draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person]);
            res.status(201).json({ id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error creating inspection information' });
        }
    });


    app.get('/api/inspection_information/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM inspection_information WHERE id = ?', [id]);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Inspection information not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving inspection information' });
        }
    });


    app.put('/api/inspection_information/:id', async (req, res) => {
        const { id } = req.params;
        const { draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person } = req.body;
        try {
            const [result] = await db.query('UPDATE inspection_information SET draft_id = ?, subject_of_inspection = ?, issue = ?, risk_area = ?, official_duration_period = ?, total_duration_period = ?, participants = ?, responsible_inspector = ?, office = ?, department = ?, subject_contact_information = ?, inspection_contact_person = ? WHERE id = ?', [draft_id, subject_of_inspection, issue, risk_area, official_duration_period, total_duration_period, participants, responsible_inspector, office, department, subject_contact_information, inspection_contact_person, id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Inspection information not found' });
            } else {
                res.status(200).json({ message: 'Inspection information updated successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error updating inspection information' });
        }
    });


    app.delete('/api/inspection_information/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM inspection_information WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Inspection information not found' });
            } else {
                res.status(200).json({ message: 'Inspection information deleted successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error deleting inspection information' });
        }
    });

}

module.exports = setupInspectionInformationRoute;
