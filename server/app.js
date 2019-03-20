const Koa = require('koa')
const app = new Koa()
// const fs = require('fs')
const path = require('path')
const STATIC = require('koa-static')
const router = require('./router')

// app.use(router.routes())
//   .use(router.allowedMethods())
app.use(router())
app.use(STATIC(path.join(__dirname, '../dist')))
app.listen(3000)