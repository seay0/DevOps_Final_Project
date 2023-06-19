const fastify = require('fastify')();
const mysql = require('mysql');

const task = mysql.createPool({
  host: 'task-db.cnbepfnuujfk.ap-northeast-2.rds.amazonaws.com',
  user: 'team5',
  password: '12345678',
  database: 'task-db'
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

  task.getConnection((error, connection) => {
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

fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server is running on port 3000');
});