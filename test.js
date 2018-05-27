const test = require(`ava`)
const fetch = require(`node-fetch`)
const http = require(`http`)
const port = require(`pick-port`)

class Server {
  constructor () {
    this.hits = 0
    this.server = http.createServer(
      (request, response) => {
        response.end(JSON.stringify(this.hits++))
      }
    )
  }
  async listen () {
    const tcp = await port({type: 'tcp'})
    this.server.listen(tcp)
    return tcp
  }
}

test.beforeEach(async t => {
  const server = new Server()
  t.context.port = await server.listen()
})

test.afterEach.always(async t => {
  const response = await fetch(`http://localhost:${t.context.port}`).then(response => response.text())
  t.is(response, '1')
})

test(`add one`, async t => {
  t.plan(1)
  const response = await fetch(`http://localhost:${t.context.port}`).then(response => response.text())
  t.is(response, '0')
})

test(`add two`, async t => {
  t.plan(1)
  const response = await fetch(`http://localhost:${t.context.port}`).then(response => response.text())
  t.is(response, '0')
})
