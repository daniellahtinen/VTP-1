// drafts.js

const db = require('./db');

function setupDraftsRoute(app) {
  app.post('/api/drafts', async (req, res) => {
    const { subject_id } = req.body;
    try {
      const result = await db.query('INSERT INTO drafts (subject_id) VALUES (?)', [subject_id]);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Error creating draft' });
    }
  });


  app.get('/api/drafts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT drafts.id, drafts.subject_id, inspection_information.* FROM drafts JOIN inspection_information ON drafts.id = inspection_information.draft_id WHERE drafts.id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Draft not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving draft' });
    }
  });


  app.put('/api/drafts/:id', async (req, res) => {
    const { id } = req.params;
    const { subject_id } = req.body;
    try {
      const result = await db.query('UPDATE drafts SET subject_id = ? WHERE id = ?', [subject_id, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Draft not found' });
      } else {
        res.status(200).json({ message: 'Draft updated successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error updating draft' });
    }
  });


  app.delete('/api/drafts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM drafts WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Draft not found' });
      } else {
        res.status(200).json({ message: 'Draft deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error deleting draft' });
    }
  });


}

module.exports = setupDraftsRoute;
