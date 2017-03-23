# BCIC-BC Stats Data Viz Challenge - Plot and Scatter Submission

This application is built using Bootstrap, Leaflet, D3, and React.

The purpose of each component is described in the source files, but a basic familiarity with React is essential. [The Quick Start guide](https://facebook.github.io/react/docs/hello-world.html) is very good.

The deployed prototype app can be viewed at http://plotandscatter.com:3001.

*NB. These instructions have not been tested on Windows.*

## To run the project locally

1. Clone the repository.
2. In the root project folder, run `npm install`.
3. Once npm finishes, run `npm run compile-vendors` to generate the DLL. The DLL contains dependencies that are static (e.g. `react` itself) and so don't need to be rebuilt every time the dev server starts. This improves local webpack performance. You don't need to build the DLL again unless you add additional static dependencies to `src/vendors.js`.
4. Once the DLL has been built, run `npm run dev`.

View the app at http://localhost:3000 in your browser. Note that this assumes that there is a production instance somewhere serving the regional vector tiles. If not, follow the instructions below under "Serving the regional vector tiles" to set up a tile server on your local machine.

## To deploy the project to production

### Serving the regional vector tiles

The various shape files representing the regional boundaries at different aggregation levels (e.g. census division, census area, economic region) have been converted to GeoJSON. In the steps below, [tippecanoe](https://github.com/mapbox/tippecanoe) is used to convert the GeoJSON to the [MBTiles](https://github.com/mapbox/mbtiles-spec) vector tile format. Compared to serving and rendering the GeoJSON directly, the tile format offers extremely good performance while retaining fine boundary details even at high zoom levels. A third-party Docker container, running concurrently with the main app, is responsible for serving the vector tiles.

#### Install dependencies

##### On a Mac:

* [Homebrew](https://brew.sh)
* [Docker for Mac](https://docs.docker.com/docker-for-mac/)
* tippecanoe: from a Terminal, run `brew install tippecanoe` once Homebrew is installed

##### On Linux:

These instructions may vary depending on the Linux distribution. The following has been tested on Ubuntu 14.04.

* [Docker for Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntu/)
* tippecanoe: follow the instructions in [this GitHub issue thread](https://github.com/mapbox/tippecanoe/issues/36)

#### Generate the vector tiles

1. From your root project directory, `cd src/data/boundaries/`
2. Check the `geo-json` subfolder, and unzip any files found there
3. Then run the following commands from the `src/data/boundaries/` folder, one at a time (each might take a few minutes):

    ```
    tippecanoe -o ./vector-tiles/municipalities.mbtiles ./geo-json/Municipalities_geo.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/econregions.mbtiles ./geo-json/EconRegions_geo.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/regdistricts.mbtiles ./geo-json/RegDistricts_geo.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/census-dissemination-areas.mbtiles ./geo-json/DisseminationAreas_clipped.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/census-dissemination-blocks.mbtiles ./geo-json/DisseminationBlocks_clipped.json --no-polygon-splitting
    tippecanoe -o ./vector-tiles/census-tracts.mbtiles ./geo-json/CensusTracts_geo.json --no-polygon-splitting
    ```

#### Serve the vector tiles

1. From the same folder as in the previous step (`src/data/boundaries`), run the following command:
    `docker run -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl --config vector-tiles/tileserver-gl-config.json`
2. This may take a few minutes to do a one-time install of the `tileserver-gl` docker image
3. Once you see the message `Listening at http://:::80/`, the tiles are available for use in the app; you can browse the tile server at `http://yourdomain.com:8080` (or, if deployed locally, `http://localhost:80`)
4. **NB Ensure you update the URLs in the `Constants.MAP_BOUNDARY_INFO` variable, found in `src/constants.js`**

### Setting up the main app in a Docker container

Adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/.

1. Make sure Docker is installed on your computer (https://www.docker.com/products/docker)
2. In Terminal, navigate to the root of this project
3. Build the Docker image: `docker build -t plotandscatter/ps-bcic-data-viz .`
4. Once the Docker image is built, run it: `docker run -p 3001:3000 -d plotandscatter/ps-bcic-data-viz`

You should now be able to access the Docker server at `http://yourdomain.com:3001` (or `http://localhost:3001` if running locally).

#### To kill a running Docker container

1. `docker ps`
2. Find the container ID for the image 'plotandscatter/ps-bcic-data-viz'
3. `docker kill <container-id>`

#### To clean up old Docker containers

Adapted from http://blog.yohanliyanage.com/2015/05/docker-clean-up-after-yourself/ and http://stackoverflow.com/questions/30604846/docker-error-no-space-left-on-device.

##### List all containers

`docker ps -a`

Then manually use `docker rm containerid` or `docker rmi image` as appropriate for stopped/dangling images.

##### Delete exited containers

`docker rmi $(docker images -f "dangling=true" -q)` (if using `sudo`, `sudo docker rmi $(sudo docker images -f "dangling=true" -q)`)

##### Delete 'dangling' images

`docker rmi $(docker images | grep "^<none>" | awk "{print $3}")`

### For a list of data sources, see the README.md in `src/data/`.