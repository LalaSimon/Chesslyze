const socket = require('./socket/socket')
const Express = require('express')
const app = new Express()
const http = require('http')
const server = http.createServer(app)
const port = 3000
const cors = require('cors')

const main = () => {
  app.use(cors())
  socket(server)
  app.get('/', (req, res) => {})
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
main()
