// inspection_subjects.js

const db = require('./db');

function setupInspectionSubjectsRoute(app) {
    app.post('/api/inspection_subjects', async (req, res) => {
        const { name } = req.body;
        try {
            const result = await db.query('INSERT INTO inspection_subject (name) VALUES (?)', [name]);
            res.status(201).json({ id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error creating inspection_subject' });
        }
    });


    app.get('/api/inspection_subjects', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM inspection_subject');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving inspection_subjects' });
        }
    });


    app.put('/api/inspection_subjects/:id', async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const result = await db.query('UPDATE inspection_subject SET name = ? WHERE id = ?', [name, id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Inspection_subject not found' });
            } else {
                res.status(200).json({ message: 'Inspection_subject updated successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error updating inspection_subject' });
        }
    });



    app.delete('/api/inspection_subjects/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db.query('DELETE FROM inspection_subject WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Inspection_subject not found' });
            } else {
                res.status(200).json({ message: 'Inspection_subject deleted successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error deleting inspection_subject' });
        }
    });

}

module.exports = setupInspectionSubjectsRoute;
