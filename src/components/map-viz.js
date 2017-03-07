import React from 'react';
import Constants from '../constants';
import MapLegend from './map-legend.js';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

require('leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.min.js');
require('drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.min.js');
require('drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css');

class MapViz extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeBoundaryLayer: null,
            activeLayers: {},
            highlightedItem: {
                name: '',
                id: ''
            }
        };
    }

    // NB. the below will NOT work with vector tiles as currently
    // constituted! Why not? Because with vector tiles, we don't
    // load all the features in advance. The user might want to pan
    // to a feature that hasn't been loaded as a vector tile yet.
    // panToFeatureByFeatureId(featureIdToPan) {
    //     let latlng;
    //     console.log('featureId', featureIdToPan);
    //     this.map.eachLayer((layer) => {
    //         if (layer.setFeatureStyle) {
    //             for (let tileId in layer._vectorTiles) {
    //                 let tile = layer._vectorTiles[tileId];
    //                 for (let featureId in tile._features) {
    //                     let feature = tile._features[featureId];
    //                     let id = feature.feature.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
    //                     console.log('id', id);
    //                     if (id === featureIdToPan) {
    //                         console.log(tile);
    //                         console.log('clicking', feature.feature._pxBounds.getCenter());
    //                         tile.fire('click');
    //                         return;
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }

    getFeatureId(feature) {
        return feature.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
    }

    invalidateSize() {
        this.map.invalidateSize();
    }

    getTileStyles(properties, zoom) {
        const id = properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
        let styles = Object.assign({}, Constants.MAP_BASE_FEATURE_STYLES);

        if (this.props.boundaryData.dataDictionary && this.props.boundaryData.dataDictionary[id]) {
            styles.fillColor = this.props.boundaryData.dataDictionary[id].color;
        }

        if (zoom < 12) {
            styles.weight = 0;
        }

        return styles;
    }

    buildBoundaryLayer(boundaryInfo) {
        let vectorTileOptions = {
            bounds: Constants.MAP_INITIAL_BOUNDS,
            vectorTileLayerStyles: {},
            getFeatureId: this.getFeatureId.bind(this),
            interactive: true
        };
        vectorTileOptions.vectorTileLayerStyles[boundaryInfo.layerName] = this.getTileStyles.bind(this);

        function highlightFeature(event) {

            const activeBoundaryLayerInfo = this.state.activeBoundaryLayer.boundaryInfo;

            const name = event.layer.properties[activeBoundaryLayerInfo.featureNameProperty];
            const id = event.layer.properties[activeBoundaryLayerInfo.featureIdProperty];

            let style = this.getTileStyles.bind(this)(event.layer.properties);
            style.fillOpacity = 0.9;
            style.weight = 2;
            event.target.setFeatureStyle(id, style);

            this.props.highlightedItemCallback({ name: name, id: id });
        }

        function resetHighlight(event) {
            let id = event.layer.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
            event.target.resetFeatureStyle(id);
            // this.props.highlightedItemCallback({ name: '', id: '', });
        }

        function clickFeature(event) {
            // this.highlightFeature(event);
            this.map.panTo([event.latlng.lat, event.latlng.lng]);
        }

        const boundaryLayer = L.vectorGrid.protobuf(
            boundaryInfo.url,
            vectorTileOptions
        );

        boundaryLayer.on('mouseover', highlightFeature.bind(this));
        boundaryLayer.on('mouseout', resetHighlight.bind(this));
        boundaryLayer.on('click', clickFeature.bind(this));
        boundaryLayer.boundaryInfo = boundaryInfo;

        return boundaryLayer;
    }

    componentDidMount() {
        // Listen for the 'shown' event, fired by the TabInterface
        window.addEventListener('shown', this.invalidateSize.bind(this));

        this.map = L.map(this.mapDiv, { minZoom: Constants.MAP_MIN_ZOOM, maxZoom: Constants.MAP_MAX_ZOOM });
        this.map.setView(Constants.MAP_INITIAL_CENTER, Constants.MAP_INITIAL_ZOOM);

        this.baseLayer = L.tileLayer(
            Constants.MAP_BASE_LAYER_URL, {
                attribution: Constants.MAP_BASE_LAYER_ATTRIBUTION
            }
        );
        this.baseLayer.addTo(this.map);

        const osmProvider = new OpenStreetMapProvider({
            params: {
                countrycodes: 'ca',
                viewbox: ['-139.052201', '60.000062', '-114.054221', '48.308916'],
                bounded: 1
            }
        });

        this.searchControl = new GeoSearchControl({
            provider: osmProvider,
            position: 'topleft',
            style: 'bar',
            autoComplete: false,
            showMarker: false,
        }).addTo(this.map);

        (function () {
            var control = new L.Control({ position: 'bottomleft' });
            control.onAdd = function (map) {
                var resetButton = L.DomUtil.create('a', 'resetzoom');
                resetButton.innerHTML =
                    `<button id="btn-reset" class="btn btn-default btn-sm">
                        <i class="fa fa-undo"></i>
                        Reset
                    </button>`;
                L.DomEvent.addListener(resetButton, 'click', function () {
                    map.setView(Constants.MAP_INITIAL_CENTER, Constants.MAP_INITIAL_ZOOM);
                }, resetButton);
                return resetButton;
            };
            return control;
        }()).addTo(this.map);

        this.boundaryLayers = {};
        this.layerGroups = {};
        let labeledBoundaryLayers = {};

        Object.keys(Constants.MAP_BOUNDARY_INFO).forEach(function (key) {
            const boundaryInfo = Constants.MAP_BOUNDARY_INFO[key];
            const boundaryLayer = this.buildBoundaryLayer.bind(this)(boundaryInfo);
            this.boundaryLayers[key] = boundaryLayer;
            labeledBoundaryLayers[boundaryInfo.label] = boundaryLayer;
        }, this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.boundaryData != this.props.boundaryData) {
            this.updateBoundaries(prevProps, prevState);
        }
        if (prevProps.layerData != this.props.layerData) {
            this.updateLayers(prevProps, prevState);
        }
    }

    updateBoundaries(prevProps, prevState) {
        const previousBoundaryLayer = prevState.activeBoundaryLayer;

        const boundaryLayerType = this.props.boundaryData.dataSource.geographyType;
        const boundaryLayer = this.boundaryLayers[boundaryLayerType];

        this.setState({activeBoundaryLayer: boundaryLayer });

        // Load a new layer
        if (previousBoundaryLayer && previousBoundaryLayer.boundaryInfo.layerName != boundaryLayer.boundaryInfo.layerName) {
            this.map.removeLayer(previousBoundaryLayer);
            this.map.addLayer(boundaryLayer);
        } else if (!previousBoundaryLayer) {
            this.map.addLayer(boundaryLayer);
        }

        // Refresh all the feature styles after receiving feature data.
        // Find all affected feature IDs
        let ids = [];
        this.map.eachLayer(function (layer) {
            if (layer.setFeatureStyle) {
                for (let tileId in layer._vectorTiles) {
                    let tile = layer._vectorTiles[tileId];
                    for (let featureId in tile._features) {
                        let feature = tile._features[featureId];
                        let id = feature.feature.properties[boundaryLayer.boundaryInfo.featureIdProperty];
                        ids.push(id);
                    }
                }
            }
        }.bind(this));

        // Get unique IDs
        let uniqueIds = Constants.getUniqueValues(ids);

        // Reset the feature style for all the unique IDs
        for (var id of uniqueIds) {
            boundaryLayer.resetFeatureStyle(id);
        }
        for (let id of uniqueIds) {
            boundaryLayer.resetFeatureStyle(id);
        }
    }

    updateLayers(prevProps, prevState) {

        // First, remove local layers that no longer appear in the props
        for (var layerGroupKey in this.layerGroups) {
            if (!this.props.layerData[layerGroupKey]) {
                this.map.removeLayer(this.layerGroups[layerGroupKey]);
                delete (this.layerGroups[layerGroupKey]);
            }
        }

        // Next, add layers that are in the props and not in the local layers
        for (var key in this.props.layerData) {
            var layerData = this.props.layerData[key];
            if (this.layerGroups[key]) {
                continue;
            } else {
                const geographyType = layerData.dataSource.geographyType;
                const layerGroupArray = [];
                const markerIcon = L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: layerData.dataSource.icon,
                    markerColor: layerData.dataSource.iconColor
                });
                const geoJSONStyle = {
                    color: 'red',
                    weight: 5,
                    opacity: 1
                };
                layerData.data.forEach(layerItem => {
                    switch (geographyType) {
                        case 'latlon':
                            var marker = L.marker(layerItem.geography, {icon: markerIcon }).bindPopup(layerItem.value);
                            layerGroupArray.push(marker);
                            break;
                        case 'feature':
                            var geoJSON = L.geoJSON(layerItem.geography, geoJSONStyle);
                            layerGroupArray.push(geoJSON);
                            break;
                    }
                });
                const layerGroup = L.layerGroup(layerGroupArray);
                this.layerGroups[key] = layerGroup;
                this.map.addLayer(layerGroup);
            }
        }
    }

    componentWillUnmount() {
        this.map = null;
    }

    render() {
        let scaleColors = [];
        let scaleQuantiles = [];

        if (this.props.boundaryData) {
            scaleColors = this.props.boundaryData.scaleColors;
            scaleQuantiles = this.props.boundaryData.scaleQuantiles;
        }

        return (
            <div>
                <div
                    id="my-map"
                    ref={(div) => this.mapDiv = div} >
                </div>
                <MapLegend
                    scaleColors={scaleColors}
                    scaleQuantiles={scaleQuantiles} />
            </div>
        );
    }
}

MapViz.propTypes = {
    highlightedItemCallback: React.PropTypes.func,
    boundaryData: React.PropTypes.shape({
        dataSource: React.PropTypes.object.isRequired,
        dataDictionary: React.PropTypes.object.isRequired,
        scaleColors: React.PropTypes.array.isRequired,
        scaleQuantiles: React.PropTypes.array.isRequired
    }).isRequired,
    layerData: React.PropTypes.objectOf(
        React.PropTypes.shape({
            dataSource: React.PropTypes.object.isRequired,
            data: React.PropTypes.array.isRequired
        })
    ).isRequired
};
module.exports = MapViz;