const fp = require('fastify-plugin')

//const { HOSTNAME, USERNAME, PASSWORD, DB_NAME } = process.env

module.exports = fp(async function (fastify, opts) {
    const url = `mysql://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOSTNAME}:3306/${process.env.DB_NAME}`
    fastify.register(require('@fastify/mysql'), {
        promise: true,
        connectionString: url
    })
})
