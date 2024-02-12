
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'MySQL61.',
  database: 'TaskManager'
});


app.get('/tasks', (req, res) => {
  pool.query("SELECT TaskId, subject, category, severity, responsible, assignedBy, team, DATE_FORMAT(issuance_date, '%d-%m-%Y') as issuance_date, DATE_FORMAT(delivery_date, '%d-%m-%Y') as delivery_date, status, active, DATEDIFF(delivery_date, now()) AS remaining_time FROM tasks where active = 1 ORDER BY CASE WHEN status = 'Tamamlandı'  OR  status = 'Askıya Alındı' THEN 1 ELSE 0 END, remaining_time ASC, TaskId ASC;", (err, results) => {
    if (err) {
      return res.json(err);
    }
    return res.json(results);
  });
});


app.get('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params
  const sql = "SELECT TaskId, subject, category, severity, responsible, assignedBy, team, comment, DATE_FORMAT(issuance_date, '%d-%m-%Y') as issuance_date, DATE_FORMAT(delivery_date, '%d-%m-%Y') as delivery_date, status, active, DATEDIFF(delivery_date, now()) AS remaining_time, definition FROM tasks where TaskId=?;"; 

  pool.query(sql, [taskId], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.length > 0) {
      res.json(result[0]); 
    }
  });
});


app.post('/create_task', (req, res) => {
  const { subjectName, category, severity, responsible, deadline, comment, description } = req.body;
  const sql = `INSERT INTO tasks (subject, category, severity, responsible, delivery_date, assignedBy, team, comment,  definition, issuance_date, status, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'Pending', '1')`;
    
  pool.query(sql, [subjectName, category, severity, responsible, deadline, '', '', comment, description, ''], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ message: 'Task created successfully', id: result.insertId });
  });
});


app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const sql = `UPDATE tasks SET active = 0 WHERE TaskId = ?`;
  
  pool.query(sql, [taskId], (err, result) => {
    if (err) {
      return res.json(err);
    }
    res.send('The task has been deleted successfully.');
  });
});


app.put('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { subjectName, category, severity, responsible, status, assignedBy, team, deadline, definition } = req.body;

  const sql = `UPDATE tasks SET subject = ?, category = ?, severity = ?, responsible = ?, status = ?, assignedBy = ?, team = ?, delivery_date = ?, definition = ? WHERE TaskId = ?`;

  pool.query(sql, [subjectName, category, severity, responsible, status, assignedBy, team, deadline, definition, taskId], (err, result) => {
  
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task successfully updated', taskId });
    });
});


app.put('/tasks/:taskId/comments', (req, res) => {
  const { taskId } = req.params;
  const { comments } = req.body;
  const sql = `UPDATE tasks SET comment = ? WHERE TaskId = ?`;

  pool.query(sql, [comments, taskId], (err, result) => {
    if (err) {
      return res.json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Comments successfully updated', taskId });
  });
});


app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});

