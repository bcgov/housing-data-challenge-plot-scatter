import React from 'react';
import DataSelector from './data-selector';
import HousingIndexSelector from './housing-index-selector';
import MapViz from './map-viz';
import RankGraph from './rank-graph.js';
import MapDetail from './map-detail.js';
import Constants from '../constants';

/*

MapGraphDisplay component
=========================

A component that displays a variable selector (either a `DataSelector` or
`HousingIndexSelector`) and manages the boundary- and layer-based data that
the user selects. It passes this data to `MapViz`, `MapDetail`, and, optionally,
`RankGraph` components.

This component is a good candidate for refactoring, to enable a greater variety
of combinations of  variable selector and visualization.

Currently, the `MapGraphDisplay` component requires a `type` prop. If this prop
is set to `housingIndex`, the `HousingIndexSelector` and `RankGraph` components
are displayed; if not, we assume the `MapGraphDisplay` is being used to 'map
other data'.

*/
class MapGraphDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boundaryData: {
                dataSource: {},
                dataDictionary: {},
                scaleQuantiles: [],
                scaleColors: []
            },
            layerData: {},
            highlightedItem: {
                id: '',
                name: 'British Columbia'
            }
        };

        this.changeBoundaryData = this.changeBoundaryData.bind(this);
        this.addLayerData = this.addLayerData.bind(this);
        this.removeLayerData = this.removeLayerData.bind(this);
        this.highlightedItemCallback = this.highlightedItemCallback.bind(this);
        this.panToFeatureCallback = this.panToFeatureCallback.bind(this);
    }

    changeBoundaryData(data) {
        this.setState({ boundaryData: data });
    }

    addLayerData(dataSource, data) {
        this.setState((prevState) => {
            const updatedLayerData = Object.assign({}, prevState.layerData);
            updatedLayerData[dataSource.file] = { dataSource, data };
            return {
                layerData: updatedLayerData
            };
        });
    }

    removeLayerData(dataSource) {
        this.setState((prevState) => {
            const updatedLayerData = Object.assign({}, prevState.layerData);
            delete(updatedLayerData[dataSource.file]);
            return {
                layerData: updatedLayerData
            };
        });
    }

    highlightedItemCallback(highlightedItem) {
        let item = Object.assign({}, highlightedItem);
        const matchedItem = this.state.boundaryData.dataDictionary[+item.id];
        item.displayItems = matchedItem;
        item.dataKeyMapping = this.state.boundaryData.dataKeyMapping;
        this.setState({ highlightedItem: item });
    }

    panToFeatureCallback(lat, lng, zoomLevel, featureId, featureName) {
        this.mapViz.panToLatLng(lat, lng, zoomLevel, featureId);
        this.mapViz.highlightFeature(null, featureId, featureName);
    }

    render() {
        const highlightedItemId = this.state.highlightedItem.id;

        if (this.props.type === 'housing-index') {

            let values = [];
            let bedroomCountScores = [];
            let ownershipScores = [];
            let commuteTimeScores = [];
            let householdIncomeScores = [];

            if (this.state.boundaryData) {
                const data = Object.keys(this.state.boundaryData.dataDictionary).map((key) =>
                    this.state.boundaryData.dataDictionary[key]
                );
                data.forEach((item) => {
                    const id = item.geography;
                    const color = item.color;
                    values.push({ id, color, value: +item.value });
                    bedroomCountScores.push({ id, color, value: item.bedroomCountScore });
                    ownershipScores.push({ id, color, value: item.ownershipScore });
                    commuteTimeScores.push({ id, color, value: item.commuteTimeScore });
                    householdIncomeScores.push({ id, color, value: item.householdIncomeScore });
                });
            }

            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div>
                                <HousingIndexSelector
                                    changeBoundaryData={this.changeBoundaryData}
                                    addLayerData={this.addLayerData}
                                    removeLayerData={this.removeLayerData}
                                    panToFeatureCallback={this.panToFeatureCallback} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9 col-xs-12">
                            <MapViz
                                ref={(mapViz) => this.mapViz = mapViz}
                                boundaryData={this.state.boundaryData}
                                layerData={this.state.layerData}
                                highlightedItemCallback={this.highlightedItemCallback} />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <MapDetail highlightedItem={this.state.highlightedItem} />
                            <div className="row">
                                {this.state.highlightedItem.displayItems &&
                                    <div className="col-xs-12">
                                        <h4>Households
                                            <small>
                                                &nbsp;
                                                {Constants.formatNumber(this.state.highlightedItem.displayItems.households, 0, true)}
                                            </small>
                                        </h4>
                                    </div>
                                }
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Total score"
                                        data={values}
                                        highlightedId={highlightedItemId}
                                        metadataPopupContent={`
                                        <div><p>We have created a simple housing-area suitability index based on four inputs:</p>
                                            <ul>
                                            <li>Home size</li>
                                            <li>Ownership</li>
                                            <li>Commute</li>
                                            <li>Pre-tax household income</li>
                                            </ul>
                                            <p>Each municipality is given an aggregated score for all four components,
                                    which is scaled to give the final score provided. Note that the legend intervals
                                    adjust dynamically depending on the housing criteria selected.</p>
                                    <strong>Data source:</strong>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p></div>`} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Home size score"
                                        grayscale={true}
                                        data={bedroomCountScores}
                                        highlightedId={highlightedItemId}
                                        metadataPopupContent={`<div><h3>Home size</h3>
                <p>First, we look at which desired home size (1 to 4+ bedrooms) has been selected.
                    Next, we identify the municipalities with the highest proportion of total homes
                    of the selected size. These municipalities are then ranked the highest. For
                    example, if a user selects '1 bedroom', municipalities with the highest
                    proportion of one bedroom homes will rank first.</p><strong>Data source:</strong>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p></div>`} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Ownership score"
                                        grayscale={true}
                                        data={ownershipScores}
                                        highlightedId={highlightedItemId}
                                        metadataPopupContent={`<div><h3>Ownership</h3>
                <p>Based on the user's selection of either 'rent' or 'own', we identify the
                    proportion of households with that ownership status for each municipality.
                    Municipalities with the highest proportion of the selected ownership status are
                    then ranked highest.</p><strong>Data source:</strong>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p></div>`} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Commute score"
                                        grayscale={true}
                                        data={commuteTimeScores}
                                        highlightedId={highlightedItemId}
                                        metadataPopupContent={`<div><h3>Commute</h3>
                <p>For this input, every municipality initially gets a score of 100. Then, based on
                    the desired commute time selected, if the median commute time of a municipality
                    is less the commute time specified, the score remains at 100. However, 1 point
                    is subtracted for every minute that a municipality's median commute time is
                    greater than the specified commute time.</p><strong>Data source:</strong>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p></div>`} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Income score"
                                        grayscale={true}
                                        data={householdIncomeScores}
                                        highlightedId={highlightedItemId}
                                        metadataPopupContent={`<div><h3>Pre-tax household income</h3>
                <p>When the user selects an income band, the average of the band's end-points is
                    taken. Then, the median income for every municipality is scaled to create a
                    range from 0 to 100. The municipality with the the lowest median income is 0 and
                    the highest is 100. From there, the selected income bracket gets a scaled value.
                    The absolute difference between the municipality's scaled value and selected
                    income band is calculated to create a score. This income score is then double
                    weighted due to its perceived importance.</p><strong>Data source:</strong>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p></div>`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {

            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <DataSelector
                                changeBoundaryData={this.changeBoundaryData}
                                addLayerData={this.addLayerData}
                                removeLayerData={this.removeLayerData} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9 col-xs-12">
                            <MapViz
                                ref={(mapViz) => this.mapViz = mapViz}
                                boundaryData={this.state.boundaryData}
                                layerData={this.state.layerData}
                                highlightedItemCallback={this.highlightedItemCallback} />
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <MapDetail
                                highlightedItem={this.state.highlightedItem} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

MapGraphDisplay.propTypes = {
    type: React.PropTypes.string
};

module.exports = MapGraphDisplay;