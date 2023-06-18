const fastify = require('fastify')();
const mysql = require('mysql');

const task = mysql.createTask({
  host: '',
  user: '',
  password: '',
  database: ''
});

fastify.post('/task', (request, reply) => {
  const { task_name, task_content, task_status, deadline, PIC, supervisor } = request.body;
  
  pool.getConnection((error, connection) => {
    if (error) {
      reply.code(500).send({ error: 'Database connection error' });
    } else {
      const query = `INSERT INTO tasks (task_name, task_content, task_status, deadline, PIC, supervisor) 
                     VALUES ('${request.body.task_name}','${request.body.task_content}','${request.body.task_status}', 
                     '${request.body.deadline}', '${request.body.PIC}', '${request.body.supervisor}')`;

      const values = [task_name, task_content, task_content, deadline];
  
      connection.query(query, values, (error, results) => {
        connection.release();
          if (error) {
            reply.code(500).send({ error: 'Failed to create task' });
          } else {
            reply.code(201).send(results);
          }
      });
    }
  });
});