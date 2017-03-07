import React from 'react';
import DataSelector from './data-selector';
import HousingIndexSelector from './housing-index-selector';
import MapViz from './map-viz';
import RankGraph from './rank-graph.js';
import MapDetail from './map-detail.js';

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
            minValue: null,
            maxValue: null,
            medianValue: null,
            highlightedItem: {
                id: '',
                name: 'British Columbia'
            }
        };

        this.changeBoundaryData = this.changeBoundaryData.bind(this);
        this.addLayerData = this.addLayerData.bind(this);
        this.removeLayerData = this.removeLayerData.bind(this);
        this.highlightedItemCallback = this.highlightedItemCallback.bind(this);
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
                                    removeLayerData={this.removeLayerData} />
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
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Total score"
                                        data={values}
                                        highlightedId={highlightedItemId} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Home size score"
                                        grayscale={true}
                                        data={bedroomCountScores}
                                        highlightedId={highlightedItemId} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Ownership score"
                                        grayscale={true}
                                        data={ownershipScores}
                                        highlightedId={highlightedItemId} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Commute score"
                                        grayscale={true}
                                        data={commuteTimeScores}
                                        highlightedId={highlightedItemId} />
                                </div>
                                <div className="col-xs-12">
                                    <RankGraph
                                        title="Income score"
                                        grayscale={true}
                                        data={householdIncomeScores}
                                        highlightedId={highlightedItemId} />
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