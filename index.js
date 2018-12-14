const DOMParser = require('xmldom').DOMParser;
const finder = require('fs-finder');
const fs = require('fs');
const R = require('ramda');
const tj = require('togeojson');

//grabs ALL files in ./kml
const files = finder.in(`${__dirname}/kml`).findFiles();

//initialize + filters array to only include *.kml files
const jsonArray = files.filter(file => /.*\.kml/.test(file))

  //where the magic happens. kml to geojson here and we only care about the features property
  .map(file => tj.kml(new DOMParser().parseFromString(fs.readFileSync(file,'utf8'))).features)

  //flattens array (because some cities have multiple features)
  .reduce(R.concat, [])

  //removes 'point' features because theyre stupid

  .filter(
    R.pathSatisfies(
      R.complement(R.equals('Point')),
      ['geometry', 'type'],
    )
  )

  //this is just to remove altitude. dont use for onfleet overlays.

  // .map(R.over(R.lensPath(['geometry','coordinates']), R.map(R.map(R.take(2)))))

  // remove properties object. maybe change this if we want to keep styling later

  .map(R.assoc("properties", {}));

//writes itttttttttt
fs.writeFile('master.geojson', `{"type":"FeatureCollection","features":${JSON.stringify(jsonArray)}}`, (err) => {
  if (err) console.log(err)
})
