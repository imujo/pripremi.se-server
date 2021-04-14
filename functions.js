const fs=require('fs')
const fse = require('fs-extra');
const AdmZip = require('adm-zip');



const zipMature = (data, matureDir) => {
    paths = []
  
    
    const file = new AdmZip();

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
    }
  
    file.addLocalFolder(matureDir, 'Mature')
    fs.writeFileSync('Mature.zip', file.toBuffer());
}

const download = (matureDir) => {
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
}

exports.download = download;
exports.zipMature = zipMature;