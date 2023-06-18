const fastify = require('fastify')();
const mysql = require('mysql');

const task = mysql.createTask({
  host: '',
  user: '',
  password: '',
  database: ''
});

fastify.get('/task', (request, reply) => {
  task.getConnection((error, connection) => {
    if (error) {
      reply.code(500).send({ error: 'Database connection error' });
    } else {
      const query = 'SELECT * FROM tasks';

      connection.query(query, (error, results) => {
        connection.release();
          if (error) {
            reply.code(500).send({ error: 'Failed to get tasks' });
          } else {
            reply.code(200).send(results);
          }
      });
    }
  });
});

fastify.delete('/:taskId', (request, reply) => {
  const task_id = request.params.task_id;

  pool.getConnection((error, connection) => {
    if (error) {
      reply.code(500).send({ error: 'Database connection error' });
    } else {
      const query = 'DELETE FROM tasks WHERE task_id = ?';
      const values = [task_id];

      connection.query(query, values, (error, results) => {
        connection.release();

        if (error) {
          reply.code(500).send({ error: 'Failed to delete task' });
        } else if (results.affectedRows === 0) {
          reply.code(404).send({ error: 'Task not found' });
        } else {
          reply.code(200).send({ message: 'Task deleted successfully' });
        }
      });
    }
  });
});