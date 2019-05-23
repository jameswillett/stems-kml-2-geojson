# stems-kml-2-geojson

merges many KML files into a single geojson file to be used as onfleet
overlay.

# HOW TO USE IT

`node index.js [remove altitude] [optional filename without extension]`

when `[remove altitude]` is `true` we simply dont include the z
coordinate. eventually this might serve as a flag to differentiate
between using this for an onfleet overlay or for working with our
delivery areas but for now this is all it does


