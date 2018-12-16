const DOMParser = require('xmldom').DOMParser;
const finder = require('fs-finder');
const fs = require('fs');
const R = require('ramda');
const tj = require('togeojson');

//grabs ALL files in ./kml
const files = finder.in(`${__dirname}/kml`).findFiles();

const stringifiedGeoJSON = R.pipe(

  // only grab kml files
  R.filter(R.test(/.*\.kml/)),

  //where the magic happens. kml to geojson here and we only care about the features property
  R.map(
    R.pipe(
      f => tj.kml(new DOMParser().parseFromString(fs.readFileSync(f, 'utf8'))),
      R.prop('features'),
    )
  ),

  //flattens array (because some cities have multiple features)
  R.flatten,

  //removes 'point' features because theyre stupid
  R.filter(
    R.pathSatisfies(
      R.complement(R.equals('Point')),
      ['geometry', 'type'],
    )
  ),

  //this is just to remove altitude.
  R.map(
    R.over(
      R.lensPath(['geometry','coordinates']),
      R.map(R.map(R.take(2)))
    )
  ),

  // remove properties object. maybe change this if we want to keep styling later
  R.map(R.assoc("properties", {})),

  // nest into object
  R.assoc('features', R.__, { type: 'FeatureCollection' }),

  // strigify that shit
  R.toString,
)(files)


//writes itttttttttt
fs.writeFile('master.geojson', stringifiedGeoJSON, (err) => {
  if (err) console.log(err)
})
