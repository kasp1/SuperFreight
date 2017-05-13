'user strict'

const http = require('http')
const express = require('express')
const path = require('path')
const ip = require('ip')
const mime = require('mime')
const fs = require('fs')
const formidable = require('formidable')

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

      // file donwload
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

      // file listing
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

      // file upload
      app.post('/files', (req, res, next) => {
        let uploadedFiles = []

        // create an incoming form object
        let form = new formidable.IncomingForm()

        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true

        // store all uploads in the /uploads directory
        form.uploadDir = process.cwd() + path.sep

        // every time a file has been uploaded successfully,
        // insert it to the DB and rename the physical file
        // to its ID
        form.on('file', (field, file) => {
          uploadedFiles.push(file)
        })

        // log any errors that occur
        form.on('error', (err) => {
          console.log('Failed to upload file.', err)
          if (!res.headersSent) {
            res.status(500).send('The file upload failed. (whole)')
          }
        })

        // canceled by the client
        form.on('aborted', () => {
          res.status(400).send('The file upload has been aborted by the client (timeout or close event on the socket).')
        })

        // once all the files have been uploaded, send a response to the client
        form.on('end', () => {
          res.status(200)
          res.send(JSON.stringify(uploadedFiles))
        })

        // parse the incoming request containing the form data
        form.parse(req)
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