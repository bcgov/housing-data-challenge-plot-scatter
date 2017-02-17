import React from 'react';
import VectorGrid from 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.min.js';

class MapViz extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        }
        console.log('MapViz component data: ', this.state.data);
    }

    componentDidMount() {

        const bounds = new L.LatLngBounds(
            new L.LatLng(48.308916, -139.052201),
            new L.LatLng(60.000062, -114.054221)
        );

        const censusLayerUrls = {
            municipalities: 'http://plotandscatter.com:8080/data/municipalities/{z}/{x}/{y}.pbf',
            econregions: 'http://plotandscatter.com:8080/data/econregions/{z}/{x}/{y}.pbf',
            regdistricts: 'http://plotandscatter.com:8080/data/regdistricts/{z}/{x}/{y}.pbf'
        }

        const baseCensusLayerStyles = {
            weight: 1,
            fillOpacity: 0.75
        };

        const econRegionStyles = Object.assign({}, baseCensusLayerStyles);
        econRegionStyles.color = 'black';

        const municipalitiesStyles = Object.assign({}, baseCensusLayerStyles);
        municipalitiesStyles.color = 'black';

        const regDistrictsStyles = Object.assign({}, baseCensusLayerStyles);
        regDistrictsStyles.color = 'black';

        function getMedianTaxQuartileByCSDName(csdName) {
            for (var item of this.state.data) {
                if (item.Municipality === csdName) {
                    return item.quartile;
                }
            }
            return null;
        }

        function getMunicipalityStyles(properties, zoom) {

            var styles = Object.assign({}, municipalitiesStyles);
            styles.fill = true;
            styles.fillColor = 'grey';

            var quartile = getMedianTaxQuartileByCSDName.bind(this)(properties.CSDNAME);

            switch (quartile) {
                case '1':
                    styles.fillColor = 'green';
                    break;
                
                case '2':
                    styles.fillColor = 'yellow';
                    break;

                case '3':
                    styles.fillColor = 'orange';
                    break;
                
                case '4':
                    styles.fillColor = 'red';
                    break;
            }

            
            return styles;
        };

        function getRegionalDistrictStyles(properties, zoom) {
            var styles = Object.assign({}, regDistrictsStyles)
            if (properties.CDNAME === 'Greater Vancouver') {
                styles.fillColor = 'red';
                styles.fill = true;
            }
            return styles;
        };

        const vectorTileOptions = {
            vectorTileLayerStyles: {
                'EconRegions_geo': Object.assign({}, econRegionStyles),
                'Municipalities_geo': getMunicipalityStyles.bind(this),
                'RegDistricts_geo': getRegionalDistrictStyles
            },
            bounds: bounds
        }

        const initialMapViewCoordinates = [49.2, -122.9];
        const initialMapViewZoom = 10;

        var map = this.map = L.map(this.mapDiv);

        map.setView(initialMapViewCoordinates, initialMapViewZoom);

        var baseLayer = L.tileLayer(
            'https://api.mapbox.com/styles/v1/heatherarmstrong/ciy214g28005j2smno0nj2kyx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVhdGhlcmFybXN0cm9uZyIsImEiOiJjaXR4djd6dW0wMnZuMnRxbm44bWo3ankwIn0.9WZTjmVn07UmQ9EwI3awtg',
            {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                bounds: bounds
            }
        );

        baseLayer.addTo(map);

        // L.vectorGrid.protobuf(censusLayerUrls.econregions, vectorTileOptions).addTo(map);
        L.vectorGrid.protobuf(censusLayerUrls.municipalities, vectorTileOptions).addTo(map);
        // L.vectorGrid.protobuf(censusLayerUrls.regdistricts, vectorTileOptions).addTo(map);

    }

    componentWillUnmount() {
        this.map = null;
    }

    render() {

        return (
            <div id='my-map' ref={(div) => this.mapDiv = div}>
            </div>
        )
    }
}

module.exports = MapViz;