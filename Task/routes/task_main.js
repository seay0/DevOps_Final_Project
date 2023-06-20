'use strict'

const fastify = require('fastify')();
const mysql = require('mysql');
const AWS = require('aws-sdk');

//RDS 접속
const task = mysql.createPool({
  host: 'task-db.cnbepfnuujfk.ap-northeast-2.rds.amazonaws.com',
  user: 'team5',
  password: '12345678',
  database: 'task_db'
});

AWS.config.update({
  region: 'ap-northeast-2', 
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey'
});

AWS.config.update({region: 'ap-northeast-2'});

//process.env.accessKeyId
const DynamoClient = new AWS.DynamoDB.DocumentClient();

//다이나모DB값 넣기
function recordLog(LogType, Logcontent) {
  return DynamoClient.put({
    TableName: 'Dynamo_Log',
    Item: {
      Timestamp: new Date().toISOString(),
      LogType: LogType,
      Logcontent: Logcontent,
    },
  }).promise();
}

//에러컨트롤
function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}


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
  
  //create task
  fastify.post('/task', async (request, reply) => {
    const Task_id = request.params.taskId;
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
    
    
    task.getConnection(async (error, connection) => {
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
    //log
    const LogType = 'create';
    const Logcontent = `Supervisor ${Supervisor_email} create Task ${Task_name} at ${new Date().toISOString()}`;

    try{
      await recordLog(LogType, Logcontent);

    }catch(e){
      console.log(e);
      return {
        statusCode: 500,
        body: 'Error occurred'
      }
    }
  });
  
  fastify.put('/task/:Task_id', async (request, reply) => {
    const Task_id = request.params.Task_id;
    const { Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email } = request.body;
  
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = `UPDATE Task 
                       SET Task_name = '${Task_name}',
                       Task_contents = '${Task_contents}',
                       Task_status = '${Task_status}',
                       Deadline = '${Deadline}',
                       PIC_email = '${PIC_email}',
                       Supervisor_email = '${Supervisor_email}'
                       WHERE Task_id = '${Task_id}'`;
        const values = [Task_name, Task_contents, Task_status, Deadline, PIC_email, Supervisor_email, Task_id];
  
        connection.query(query, values, (error, results) => {
          connection.release();
  
          if (error) {
            reply.code(500).send(error);
          } else if (results.affectedRows === 0) {
            reply.code(404).send({ error: 'Task not found' });
          } else {
            reply.code(200).send({ message: 'Task updated successfully' });
          }
        });
      }
    });
    //log
    const LogType = 'Update';
    const Logcontent = `Supervisor ${Supervisor_email} update Task ${Task_name} at ${new Date().toISOString()}`;
    
    //Done status
    if(Task_status == 'Done')
      LogType = 'Done';
      Logcontent = `Supervisor ${Supervisor_email} Done Task ${Task_name} at ${new Date().toISOString()}`;
    try{
      await recordLog(LogType, Logcontent);

    }catch(e){
      console.log(e);
      return {
        statusCode: 500,
        body: 'Error occurred'
      }
    }
    
  });
  
  fastify.delete('/task/:Task_id', async (request, reply) => {
    const Task_id = request.params.Task_id;
  
    task.getConnection((error, connection) => {
      if (error) {
        reply.code(500).send({ error: 'Database connection error' });
      } else {
        const query = `DELETE FROM Task WHERE Task_id = '${Task_id}'`;
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

    //log
    const LogType = 'Delete';
    const Logcontent = `Supervisor ${Supervisor_email} Delete Task ${Task_name} at ${new Date().toISOString()}`;

    try{
      await recordLog(LogType, Logcontent);

    }catch(e){
      console.log(e);
      return {
        statusCode: 500,
        body: 'Error occurred'
      }
    }
  });
}
