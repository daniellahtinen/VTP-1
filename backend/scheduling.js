// scheduling.js

const db = require('./db');

function setupSchedulingRoute(app) {
  app.post('/api/scheduling', async (req, res) => {
    const { draft_id, event, person, week } = req.body;
    try {
      const result = await db.query('INSERT INTO scheduling (draft_id, event, person, week) VALUES (?, ?, ?, ?)', [draft_id, event, person, week]);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Error creating scheduling' });
    }
  });


  app.get('/api/scheduling/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM scheduling WHERE id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Scheduling not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving scheduling' });
    }
  });


  app.put('/api/scheduling/:id', async (req, res) => {
    const { id } = req.params;
    const { draft_id, event, person, week } = req.body;
    try {
      const result = await db.query('UPDATE scheduling SET draft_id = ?, event = ?, person = ?, week = ? WHERE id = ?', [draft_id, event, person, week, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Scheduling not found' });
      } else {
        res.status(200).json({ message: 'Scheduling updated successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error updating scheduling' });
    }
  });


  app.delete('/api/scheduling/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM scheduling WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Scheduling not found' });
      } else {
        res.status(200).json({ message: 'Scheduling deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error deleting scheduling' });
    }
  });

}

module.exports = setupSchedulingRoute;
