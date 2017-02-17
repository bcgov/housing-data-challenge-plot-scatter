# BCIC-BC Stats Data Viz Challenge - Plot and Scatter Submission

This application is built using Bootstrap, Leaflet, D3, MetricsGraphics, and React.

The deployed draft app can be viewed at http://http://plotandscatter.com:3001.

*NB. These instructions have not yet been tested for Windows or Linux.*

## To run the project locally

1. Clone the repository.
2. In the root project folder, run: `npm install`.
3. Once npm finishes, run `npm run dev`.

View the app at http://localhost:3000/ in your browser.

## For deployed instances only – not necessary for local dev

### Serving GeoJSON as vector tiles

#### Install dependencies

* [Homebrew](https://brew.sh)
* [Docker for Mac](https://docs.docker.com/docker-for-mac/)
* tippecanoe: from a Terminal, run `brew install tippecanoe` once Homebrew is installed

#### Generate vector tiles

* From your root project directory, `cd src/data/boundaries/`
* Then run the following commands, one at a time (they may take a few minutes):
    ```
    tippecanoe -o ./vector-tiles/municipalities.mbtiles ./geo-json/Municipalities_geo.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/econregions.mbtiles ./geo-json/EconRegions_geo.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/regdistricts.mbtiles ./geo-json/RegDistricts_geo.json --no-polygon-splitting
    ```
#### Serve vector tiles 

* From the same folder (`src/data/boundaries`), run the following command:
    `docker run -it -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl --config tileserver-gl-config.json`
* This may take a few minutes to do a one-time install of the `tileserver-gl` docker image
* Once you see the message `Listening at http://:::80/`, the tiles are available for use in the app; you can browse the tile server at `http://localhost:8080` (not `:80`!)
* Kill the server with <kbd>CTRL+C</kbd>
* You can also run `npm run serve-vector-tiles` from the root project directory

### Boundary transformation instructions

#### To change the projection:

1. Download boundaries from source. (These come in a zipped folder with shapefile)
2. Open the .prj file that comes in folder downloaded. Look for the projection. (Usually “BC-Environment-Albers” if from BC)
3. Open the .shp file in QGIS.
4. Right click on the layer and click on “Set layer CRS”.
5. Set CRS to the original projection of the layer. (e.g. BC Albers)
6. Right click on layer again and click on “…save as”.
7. Save the layer as a ESRI Shapefile and select “WGS 84/ EPSG 4326” as the projection.

#### To convert .shp file to .geojson (Based on this tutorial: https://bost.ocks.org/mike/map/):
* ogr2ogr command is:
	```ogr2ogr -f GeoJSON new-file-name old-shapefile-name```
	(e.g. “ogr2ogr f GeoJSON boundaries_geojson.json boundaries.shp”)
* Note: Change into directory with the shapefile first

### Setting up the app in a Docker container

Adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/.

1. Make sure Docker is isntalled on your computer(https://www.docker.com/products/docker)
2. In Terminal, navigate to the root of this project
3. Build Docker image: `docker build -t plotandscatter/ps-bcic-data-viz .`
4. Run Docker image: `docker run -p 3001:3000 -d plotandscatter/ps-bcic-data-viz`

You should now be able to access the Docker server at http://localhost:3001.

#### To kill a running Docker container

1. `docker ps`
2. Find the container ID
3. `docker kill <container-id>`

## README TODOs

* Build a production webpack configuration and explain its usage
* More details around server deployment