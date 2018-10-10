const DOMParser = require('xmldom').DOMParser;
const finder = require('fs-finder');
const fs = require('fs');
const tj = require('togeojson');

//grabs ALL files in ./kml
const files = finder.in(`${__dirname}/kml`).findFiles();

//initialize + filters array to only include *.kml files
const jsonArray = files.filter(file => /.*\.kml/.test(file))

//where the magic happens. kml to geojson here and we only care about the features property
.map(file => tj.kml(new DOMParser().parseFromString(fs.readFileSync(file,'utf8'))).features)

//flattens array (because some cities have multiple features)
.reduce((acc, cur) => acc.concat(cur), [])

//removes 'point' features because theyre stupid
.filter(feature => feature.geometry.type != 'Point')

.map(x => ({
  ...x,
  geometry: {
    ...x.geometry,
    coordinates: [
      x.geometry.coordinates.map(y => y.map(z => z.filter((_, i) => i < 2)))
    ],
  },
}));
//writes itttttttttt
fs.writeFile('master.geojson', JSON.stringify(jsonArray), (err) => {
  if(err){
    console.log(err)
  }
})
