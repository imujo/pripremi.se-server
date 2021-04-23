const fs=require('fs')
const fse = require('fs-extra');
const AdmZip = require('adm-zip');



const zipMature = (data, matureDir) => {
    maturaObjects = []
    const file = new AdmZip();

    // For predmet in predmeti
    for (const predmet of Object.keys(data)){
      const {dvijerazine, razinaA, razinaB, years} = data[predmet]

      // For year in years
      for (let i = years[0]; i <= years[1]; i++){

        // If dvijerazine
        if(dvijerazine){
          if (razinaA){
            maturaObjects.push({
              path: `/Predmeti/${predmet}/A/${predmet} - A - ${i}`,
              predmet: predmet,
              razina: 'A'
            })
          }
          if (razinaB) {
            maturaObjects.push({
              path: `/Predmeti/${predmet}/B/${predmet} - B - ${i}`,
              predmet: predmet,
              razina: 'B'
            })
        }
      }

      // If !dvijerazine
      else{
        maturaObjects.push({
          path: `/Predmeti/${predmet}/${predmet} - ${i}`,
          predmet: predmet,
          razina: false
        })
      }
    }
    }
  
    
    for (const maturaObject of maturaObjects){
      const {path, predmet, razina} = maturaObject;

      if (razina == false){
        fse.copySync(__dirname + path, matureDir+`/${predmet}`)
      }else{
        fse.copySync(__dirname + path, matureDir+`/${predmet}/${razina}`)
      }
    }
  
    // ZIP FOLDER
    file.addLocalFolder(matureDir, 'Mature')
    fs.writeFileSync('Mature.zip', file.toBuffer());
}


exports.zipMature = zipMature;