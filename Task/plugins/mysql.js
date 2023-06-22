const fp = require('fastify-plugin')

const { HOSTNAME, USERNAME, PASSWORD, DB_NAME } = process.env

module.exports = fp(async function (fastify, opts) {
    //const url = `mysql://${USERNAME}:${PASSWORD}@${HOSTNAME}:3306/${DB_NAME}`
    const url = `mysql://team5:12345678@testdb.cnbepfnuujfk.ap-northeast-2.rds.amazonaws.com:3306/task_db`
    fastify.register(require('@fastify/mysql'), {
        promise: true,
        connectionString: url
    })
})
