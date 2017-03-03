import React from 'react';
import Constants from '../constants';
import MapLegend from './map-legend.js';
require('leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.min.js');
require('drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.min.js');
require('drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css');

class MapViz extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeBoundaryLayer: null,
            activeLayers: {},
            highlightedName: '',
            highlightedId: '',
            highlightedValue: ''
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

    panToClickedLatLng(event) {
        this.map.panTo([event.latlng.lat, event.latlng.lng]);
    }

    getFeatureId(feature) {
        return feature.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
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

            const name = event.layer.properties[this.state.activeBoundaryLayer.boundaryInfo.featureNameProperty];
            const id = event.layer.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
            const value = this.props.boundaryData.dataDictionary[id] ? this.props.boundaryData.dataDictionary[id].value : '???';

            let style = this.getTileStyles.bind(this)(event.layer.properties);
            style.fillOpacity = 0.9;
            style.weight = 2;
            event.target.setFeatureStyle(id, style);

            this.setState({ highlightedName: name, highlightedId: id, highlightedValue: value });
        }

        function resetHighlight(event) {
            let id = event.layer.properties[this.state.activeBoundaryLayer.boundaryInfo.featureIdProperty];
            event.target.resetFeatureStyle(id);
            this.setState({ highlightedName: '', highlightedId: '', highlightedValue: '' });
        }

        const boundaryLayer = L.vectorGrid.protobuf(
            boundaryInfo.url,
            vectorTileOptions
        );

        boundaryLayer.on('mouseover', highlightFeature.bind(this));
        boundaryLayer.on('mouseout', resetHighlight.bind(this));
        boundaryLayer.on('click', this.panToClickedLatLng.bind(this));
        boundaryLayer.boundaryInfo = boundaryInfo;

        return boundaryLayer;
    }

    componentDidMount() {

        this.map = L.map(this.mapDiv, { minZoom: Constants.MAP_MIN_ZOOM, maxZoom: Constants.MAP_MAX_ZOOM });
        this.map.setView(Constants.MAP_INITIAL_CENTER, Constants.MAP_INITIAL_ZOOM);

        this.baseLayer = L.tileLayer(
            Constants.MAP_BASE_LAYER_URL, {
                attribution: Constants.MAP_BASE_LAYER_ATTRIBUTION,
                bounds: Constants.MAP_INITIAL_BOUNDS
            }
        );
        this.baseLayer.addTo(this.map);

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
            // console.log('--> here');
            this.updateBoundaries(prevProps, prevState);
        }
        if (prevProps.layerData != this.props.layerData) {
            // console.log('--> there');
            this.updateLayers(prevProps, prevState);
        }
    }

    updateBoundaries(prevProps, prevState) {
        const previousBoundaryLayer = prevState.activeBoundaryLayer;

        const boundaryLayerType = this.props.boundaryData.dataSource.geographyType;
        const boundaryLayer = this.boundaryLayers[boundaryLayerType];

        this.setState({ activeBoundaryLayer: boundaryLayer });

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
        for (let id of uniqueIds) {
            boundaryLayer.resetFeatureStyle(id);
        }
    }

    updateLayers(prevProps, prevState) {

        // First, remove local layers that no longer appear in the props
        for (let layerGroupKey in this.layerGroups) {
            if (!this.props.layerData[layerGroupKey]) {
                this.map.removeLayer(this.layerGroups[layerGroupKey]);
                delete(this.layerGroups[layerGroupKey]);
            }
        }

        // Next, add layers that are in the props and not in the local layers
        for (let key in this.props.layerData) {
            let layerData = this.props.layerData[key];
            if (this.layerGroups[key]) {
                continue;
            } else {
                var geographyType = layerData.dataSource.geographyType;
                var layerGroupArray = [];
                var markerIcon = L.AwesomeMarkers.icon({
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
                        case 'latlon': {
                            let marker = L.marker(layerItem.geography, { icon: markerIcon }).bindPopup(layerItem.value);
                            layerGroupArray.push(marker);
                            break;
                        }
                        case 'feature': {
                            let geoJSON = L.geoJSON(layerItem.geography, geoJSONStyle);
                            layerGroupArray.push(geoJSON);
                            break;
                        }
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

        const highlightedValue = Constants.formatNumber(this.state.highlightedValue);

        return (
            <div className="row">
                {/*<ul className="col-md-4 nav">
                    <li role="presentation" className="active"><a href="#">Graphs</a></li>
                </ul>*/}
                <div className="col-sm-12">
                    <div id="my-map" ref={(div) => this.mapDiv = div}></div>
                    <MapLegend
                        scaleColors={scaleColors}
                        scaleQuantiles={scaleQuantiles} />
                </div>
                <div className="col-md-12">
                    <h3>{this.state.highlightedName} [{this.state.highlightedId}]: { highlightedValue }</h3>
                </div>
            </div>
        );
    }
}

MapViz.propTypes = {
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