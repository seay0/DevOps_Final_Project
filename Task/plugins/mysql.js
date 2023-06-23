const fp = require('fastify-plugin')

//const { HOSTNAME, USERNAME, PASSWORD, DB_NAME } = process.env

module.exports = fp(async function (fastify, opts) {
    const url = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`
    fastify.register(require('@fastify/mysql'), {
        promise: true,
        connectionString: url
    })
})
