const express = require('express')
const cors = require('cors')
const knex = require('knex')
const fs=require('fs')


const {zipMature} = require('./functions')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'IvoMujo2003',
      database : 'pripremise'
    }
  });


const app=express();
app.use(express.json());
app.use(cors())



app.get('/mature', (req, res)=>{
    db.select('*').from('mature').then(data=>{
        res.json(data)
    })
})



app.post('/matured', (req,res)=>{
  const data = req.body;
  const matureDir = __dirname + '/Mature'

  zipMature(data, matureDir)
  const fsError = (err) => {
      if (err) {
          return console.error(err);
      }
  }

  res.download(__dirname + '/Mature.zip', 'Mature.zip', (err)=>{
      if (err) console.log;
      fs.unlink(__dirname + '/Mature.zip', fsError)
  })

  fs.rmdir(matureDir,{ recursive: true }, fsError)

})


app.listen(5000)



