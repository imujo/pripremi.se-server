const express = require('express')
const cors = require('cors')
const knex = require('knex')
const fs = require('fs')
const { createMatureFolder } = require('./functions')
var pg = require('pg');
const path = require('path')
// const { fileURLToPath } = require('url')

const zip = require('zip-a-folder').zip
const COMPRESSION_LEVEL = require('zip-a-folder').COMPRESSION_LEVEL


require('dotenv').config()

const { PASSWORD, DATABASE, CONNECTION, DEPLOYMENT, PATH_TO_BUILD } = process.env


// Connect database
let db = {}

if (DEPLOYMENT === 'true') {
  console.log('server')
  db = knex({
    client: 'pg',
    connection: CONNECTION
  });
} else {
  console.log('local')
  db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: PASSWORD,
      database: DATABASE
    }
  });
}





const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static(PATH_TO_BUILD));



// Get mature for cards
app.get('/mature/:sortOrder', (req, res) => {
  console.log('download mature')
  const sortOrder = req.params.sortOrder
  let order = 'asc';
  let orderby = 'predmet'
  if (sortOrder === 'A - Z') {
    order = 'asc'
    orderby = 'predmet'
  } else if (sortOrder === 'Z - A') {
    order = 'desc'
    orderby = 'predmet'
  } else {
    order = 'desc'
    orderby = 'clicks'
  }
  db.select('*').from('mature').orderBy(orderby, order)
    .then(data => {
      res.json(data)
    })
    .catch(e => res.status('404').json("Couldn't find the Matura-s"))
})

// Iterate
app.post('/iterate/:predmeti', (req, res) => {
  const predmet = req.params.predmeti

  console.log('iterate', predmet)

  db('mature')
    .where('predmet', predmet)
    .update({
      clicks: db.raw('clicks + 1')
    })
    .then(data => res.json(data))
    .catch(e => res.status('404').json("Couldn't update the click count"))
})

// Download mature
app.post('/matured', (req, res) => {
  const data = req.body;
  console.log(data)
  const matureDir = __dirname + '/Mature'

  createMatureFolder(data, matureDir)



  const fsError = (err) => {
    if (err) {
      return console.error(err);
    }
  }


  const source = __dirname + '/Mature'
  const destination = __dirname + '/Mature.zip'


  async function zipFolder() {
    await zip(source, destination, {compression: COMPRESSION_LEVEL.uncompressed });
  }

  zipFolder().then(()=>{
    console.log('zipped')
    res.download(__dirname + '/Mature.zip', 'Mature.zip', (err) => {
      if (err) console.log;
      fs.unlink(__dirname + '/Mature.zip', fsError)
    })
    fs.rm(matureDir, { recursive: true }, fsError)
    console.log('done')
  })




  // DOWNLOAD
  


})

if (DEPLOYMENT === 'true') {
  console.log('sever')
  app.get('/*', function (req, res) {
    res.sendFile(path.join(PATH_TO_BUILD, 'index.html'));
  });
}



app.listen(9000)











