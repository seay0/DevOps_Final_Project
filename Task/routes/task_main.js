'use strict'

const fastify = require('fastify')();
const mysql = require('mysql');
const AWS = require('aws-sdk');

//RDS 접속
const task = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

AWS.config.update({
  region: 'ap-northeast-2', 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const DynamoClient = new AWS.DynamoDB.DocumentClient();

//다이나모DB값 넣기
async function recordLog(LogType, Logcontent) {
  try {
    await DynamoClient.put({
      TableName: 'Dynamo_Log',
      Item: {
        Timestamp: new Date().toISOString(),
        LogType: LogType,
        Logcontent: Logcontent,
      },
    }).promise();
  } catch (error) {
    console.error("Error while writing to DynamoDB:", error);
  }
}

module.exports = async function (fastify, opts) {
  fastify.get('/', (request, reply) => {
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
        console.error('Database connection error:', error);
      } else {
        const query = 'SELECT * FROM Task';
  
        connection.query(query, (error, results) => {
          connection.release();
            if (error) {
              reply.code(500).send({ error: 'Failed to get tasks' });
              console.error('Failed to get tasks:', error);
            } else {
              reply.code(200).send(results);
            }
        });
      }
    });
  });

  fastify.post('/', async (request, reply) => {
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
  
    try {
      let LogType = 'create';
      let Logcontent = `Supervisor ${Supervisor_email} create Task ${Task_name} at ${new Date().toISOString()}`;
  
      await recordLog(LogType, Logcontent);
  
      task.getConnection((error, connection) => {
        if (error) {
          reply.code(500).send({ error: 'Database connection error' });
          console.error('Database connection error:', error);
        } else {
          const query = `INSERT INTO Task (Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
          const values = [Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email];
  
          connection.query(query, values, (error, results) => {
            connection.release();
            if (error) {
              reply.code(500).send({ error: 'Failed to create task' });
              console.error('Failed to create task:', error);
            } else {
              reply.code(201).send(results);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error in post request:", error);
    }
  });

  fastify.put('/:Task_id', async (request, reply) => {
    let Task_id = request.params.Task_id;
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
  
    try {
      let LogType = 'Update';
      let Logcontent = `Supervisor ${Supervisor_email} update Task ${Task_name} at ${new Date().toISOString()}`;
      
      if(Task_status == 'Done'){
        LogType = 'Done';
        Logcontent = `Supervisor ${Supervisor_email} Done Task ${Task_name} at ${new Date().toISOString()}`;
      }
  
      await recordLog(LogType, Logcontent);
  
      task.getConnection((error, connection) => {
        if (error) {
          reply.code(500).send({ error: 'Database connection error' });
          console.error('Database connection error:', error);
        } else {
          const query = `UPDATE Task 
                         SET Task_name = ?, Task_contents = ?, Task_status = ?, Deadline = ?, PIC_email = ?, Supervisor_email = ?
                         WHERE Task_id = ?`;
          const values = [Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email, Task_id];
  
          connection.query(query, values, (error, results) => {
            connection.release();
            if (error) {
              reply.code(500).send({ error: 'Failed to update task' });
              console.error('Failed to update task:', error);
            } else if (results.affectedRows === 0) {
              reply.code(404).send({ error: 'Task not found' });
            } else {
              reply.code(200).send({ message: 'Task updated successfully' });
            }
          });
        }
      });
    } catch (error) {
      console.error("Error in put request:", error);
    }
  });

  fastify.delete('/:Task_id', async (request, reply) => {
    let Task_id = request.params.Task_id;

    try {
      let LogType = 'Delete';
      let Logcontent = `Task with id ${Task_id} deleted at ${new Date().toISOString()}`;

      await recordLog(LogType, Logcontent);

      task.getConnection((error, connection) => {
        if (error) {
          reply.code(500).send({ error: 'Database connection error' });
          console.error('Database connection error:', error);
        } else {
          const query = `DELETE FROM Task WHERE Task_id = ?`;
          const values = [Task_id];

          connection.query(query, values, (error, results) => {
            connection.release();
  
            if (error) {
              reply.code(500).send({ error: 'Failed to delete task' });
              console.error('Failed to delete task:', error);
            } else if (results.affectedRows === 0) {
              reply.code(404).send({ error: 'Task not found' });
            } else {
              reply.code(200).send({ message: 'Task deleted successfully' });
            }
          });
        }
      });
    } catch (error) {
      console.error("Error in delete request:", error);
    }
  });
}
