// documents.js

const db = require('./db');

function setupDocumentsRoute(app) {
  app.post('/api/documents', async (req, res) => {
    const { draft_id, title, handler, modified } = req.body;
    try {
      const results = await db.query(
        'INSERT INTO documents (draft_id, title, handler, modified) VALUES (?, ?, ?, ?)',
        [draft_id, title, handler, modified]
      );
      res.status(201).json({ id: results.insertId, draft_id, title, handler, modified });
    } catch (error) {
      res.status(500).json({ error: 'Error creating document' });
    }
  });


  app.get('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Document not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving document' });
    }
  });


  app.put('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    const { draft_id, title, handler, modified } = req.body;
    try {
      const result = await db.query('UPDATE documents SET draft_id = ?, title = ?, handler = ? WHERE id = ?', [draft_id, title, handler, id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Document not found' });
      } else {
        res.status(200).json({ message: 'Document updated successfully' });
      }
      await db.query(
        'UPDATE documents SET draft_id = ?, title = ?, handler = ?, modified = ? WHERE id = ?',
        [draft_id, title, handler, modified, id]
      );
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error updating document with id ${id}:`, error);
      res.status(500).json({ error: `Error updating document with id ${id}` });
    }
  });


  app.delete('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM documents WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Document not found' });
      } else {
        res.status(200).json({ message: 'Document deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error deleting document' });
    }
  });

}

module.exports = setupDocumentsRoute;
