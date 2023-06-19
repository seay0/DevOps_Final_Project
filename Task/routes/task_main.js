'use strict'

const fastify = require('fastify')();
const mysql = require('mysql');

const task = mysql.createPool({
  host: 'task-db.cnbepfnuujfk.ap-northeast-2.rds.amazonaws.com',
  user: 'team5',
  password: '12345678',
  database: 'task_db'
});

module.exports = async function (fastify, opts) {
  fastify.get('/task', (request, reply) => {
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = 'SELECT * FROM Task';
  
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
  
  fastify.post('/task', (request, reply) => {
    const Task_id = request.params.taskId;
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
    
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = `INSERT INTO Task (Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email) 
                       VALUES ('${Task_name}','${Task_contents}','${Task_status}', '${Deadline}', '${PIC_email}', '${Supervisor_email}')`;
  
        const values = [Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email, Task_id];
    
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
  
  fastify.put('/:task_id', (request, reply) => {
    const Task_id = request.params.taskId;
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
  
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = `UPDATE Task SET task_name = '${Task_name}','${Task_contents}','${Task_status}', '${Deadline}', '${PIC_email}', '${Supervisor_email}'`;
        const values = [Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email, Task_id];
  
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
  
  fastify.delete('/:Task_id', (request, reply) => {
    const Task_id = request.params.task_id;
  
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = 'DELETE FROM Task WHERE Task_id = ?';
        const values = [Task_id];
  
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
}
