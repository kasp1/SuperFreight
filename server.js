'user strict'

const http = require('http')
const express = require('express')
const path = require('path')
const ip = require('ip')
const mime = require('mime')
const fs = require('fs')

let cli = {
  run: {
    usage: "superfreight [port]\n- Starts SuperFreight on port 6000 or the port specified.",
    handler (port) {
      if (!port) {
        port = 6100
      } else {
        port = parseInt(port)
        if (!port) {
          console.log('Seems like the specified port is not a number.')
          port = 6100
        }
      }

      let app = express()
      app.use('/', express.static(path.join(__dirname, 'dist')))

      app.get('/files/:name', (req, res, next) => {
        if (fs.existsSync(req.params.name)) {
          console.log('File download requested: ', req.params.name)

          res.status(200)
          res.setHeader('Content-Length', fs.statSync(req.params.name).size)
          res.setHeader('Content-Type', mime.lookup(req.params.name))
          res.setHeader('Content-Disposition', 'inline; filename="' + req.params.name + '"')
          res.send(fs.readFileSync(req.params.name))
        } else {
          res.status(400).send()
        }
      })

      app.get('/files', (req, res, next) => {
        let files = fs.readdirSync(process.cwd())

        let list = {}

        for (let file in files) {

          console.log(files[file])
          if (fs.lstatSync(files[file]).isFile()) {
            list[files[file]] = {
              size: fs.statSync(files[file]).size,
              mime: mime.lookup(files[file])
            }
          }
        }

        res.status(400)
        res.send(list)
      })

      let server = http.createServer(app)
      server.listen(port, () => {
        console.log('Listening @ ' + port)
        console.log('Connect any device to the same network as this one, open browser and go to http://' + ip.address() +  ':' + port + '/')
      })
    }
  }
}

cli.run.handler(process.argv[3])