const express = require('express')
const cors = require('cors')
const knex = require('knex')
const fs=require('fs')
const {zipMature} = require('./functions')
var pg = require('pg');

require('dotenv').config()

const {PASSWORD, DATABASE, LOCATION, CONNECTION} = process.env

// Connect database
let db = {}

if (LOCATION === 'local'){
  console.log('local')
  db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : PASSWORD,
      database : DATABASE
    }
  });
}else{
  console.log('server')
  db = knex({
    client: 'pg',
    connection: CONNECTION
  });
}





const app=express();
app.use(express.json());
app.use(cors())



// Get mature for cards
app.get('/mature/:sortOrder', (req, res)=>{
  const sortOrder = req.params.sortOrder
  let order = 'asc';
  let orderby = 'predmet'
  if (sortOrder ==='A - Z'){
    order = 'asc'
    orderby = 'predmet'
  }else if (sortOrder ==='Z - A'){
    order = 'desc'
    orderby = 'predmet'
  }else{
    order = 'desc'
    orderby = 'clicks'
  }
  db.select('*').from('mature').orderBy(orderby, order)
    .then(data=>{
    res.json(data)
  })
    .catch(e => res.status('404').json("Couldn't find the Matura-s"))
})

// Iterate
app.post('/iterate/:predmeti', (req, res)=>{
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
app.post('/matured', (req,res)=>{
  const data = req.body;
  console.log(data)
  const matureDir = __dirname + '/Mature'

  zipMature(data, matureDir)

  

  const fsError = (err) => {
      if (err) {
          return console.error(err);
      }
  }

  // DOWNLOAD
  res.download(__dirname + '/Mature.zip', 'Mature.zip', (err)=>{
      if (err) console.log;
      fs.unlink(__dirname + '/Mature.zip', fsError)
  })
  fs.rmdir(matureDir,{ recursive: true }, fsError)

})


app.listen(5000)



