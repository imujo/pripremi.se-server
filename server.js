const express = require('express')
const cors = require('cors')
const knex = require('knex')
const fs=require('fs')
const fse = require('fs-extra');
const AdmZip = require('adm-zip');

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
const file = new AdmZip();


app.get('/mature', (req, res)=>{
    db.select('*').from('mature').then(data=>{
        res.json(data)
    })
})



app.post('/matured', (req,res)=>{
  const data = req.body;
  paths = []

  const matureDir = __dirname + '/Mature'
  const fsError = (err) => {
      if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
  }


  for (const predmet of Object.keys(data)){
    const {dvijerazine, razinaA, razinaB, years} = data[predmet]
    for (let i = years[0]; i <= years[1]; i++){
      if(dvijerazine){
        if (razinaA){
          paths.push({
            path: `/Predmeti/${predmet}/A/${predmet} - A - ${i}`,
            predmet: predmet,
            razina: 'A'
          })
        }
        if (razinaB) {
          paths.push({
            path: `/Predmeti/${predmet}/B/${predmet} - B - ${i}`,
            predmet: predmet,
            razina: 'B'
          })
      }
    }
    else{
      paths.push({
        path: `/Predmeti/${predmet}/${predmet} - ${i}`,
        predmet: predmet,
        razina: false
      })
    }
  }
  }

  
  for (const obj of paths){
    const {path, predmet, razina} = obj;
    if (razina == false){
      fse.copySync(__dirname + path, matureDir+`/${predmet}`)
    }else{
      fse.copySync(__dirname + path, matureDir+`/${predmet}/${razina}`)
    }
    
    console.log('folder added')
  }

  file.addLocalFolder(matureDir, 'Mature')
  fs.writeFileSync('Mature.zip', file.toBuffer());
  console.log('zipped')

  res.download(matureDir + '.zip', 'Mature.zip');
  console.log('download')


  fs.rmdir(matureDir,{ recursive: true }, fsError)
  fs.unlink(__dirname + '/Mature.zip', fsError)
  console.log('delete')

})


app.listen(5000)



