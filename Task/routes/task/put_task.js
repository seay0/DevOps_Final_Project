const fastify = require('fastify')();
const mysql = require('mysql');

const task = mysql.createTask({
  host: '',
  user: '',
  password: '',
  database: ''
});

fastify.put('/:task_id', (request, reply) => {
  const task_id = request.params.taskId;
  const { task_name, task_content, task_status, deadline, PIC, supervisor } = request.body;

  task.getConnection((error, connection) => {
    if (error) {
      reply.code(500).send({ error: 'Database connection error' });
    } else {
      const query = `UPDATE tasks SET task_name = '${request.body.task_name}', task_content = '${request.body.task_content}', 
                     task_status = '${request.body.task_status}', deadline = '${request.body.deadline}', PIC = '${request.body.PIC}',
                     supervisor ='${request.body.supervisor}', WHERE task_id = '${request.body.task_id}'`;
      const values = [task_name, task_content, task_status, deadline, PIC, supervisor, task_id];

      connection.query(query, values, (error, results) => {
        connection.release();

        if (error) {
          reply.code(500).send({ error: 'Failed to update task' });
        } else if (results.affectedRows === 0) {
          reply.code(404).send({ error: 'Task not found' });
        } else {
          reply.code(200).send({ message: 'Task updated successfully' });
        }
      });
    }
  });
});