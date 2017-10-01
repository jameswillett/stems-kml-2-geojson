const DOMParser = require('xmldom').DOMParser;
const finder = require('fs-finder');
const fs = require('fs');
const tj = require('togeojson');

const jsonArray = [];

const files = finder.in(`${__dirname}/kml`).findFiles();

files.map(file => {
  if(/.*\.kml/.test(file)){
    jsonArray.push(
      tj.kml(
        new DOMParser().parseFromString(
          fs.readFileSync(file,'utf8')
        )
      )
    );
  }
})

const masterJson = {
  type: 'FeatureCollection',
  features: []
}

jsonArray.map(onfleetTeam => {
  onfleetTeam.features.map(feature => {
    if (feature.geometry.type != 'Point'){
      masterJson.features.push(feature)
    }
  })
})

fs.writeFile('master.geojson', JSON.stringify(masterJson), (err) => {
  if(err){
    console.log(err)
  }
})
