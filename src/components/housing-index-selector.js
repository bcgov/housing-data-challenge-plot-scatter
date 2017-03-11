import React from 'react';
import DataLayers from './data-layers';
import SelectDropdown from './select-dropdown';
import Constants from '../constants';

/*

HousingIndexSelector component
==============================

Permits a user to select variables used in constructing a housing index. One of
the two possible data selectors used in a `MapGraphDisplay` component, and
requires props (described in propTypes below) representing callback functions to
communicate with that component.

*/
class HousingIndexSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            boundaryDataSources: {},
            layerDataSources: {},
            householdIndexData: [],
            bedroomCount: 1,
            householdIncome: 10000,
            renterOwner: 'renter',
            commuteTime: 5,
            topLocations: []
        };

        this.handleBedroomCountChange = this.handleBedroomCountChange.bind(this);
        this.handleHouseholdIncomeChange = this.handleHouseholdIncomeChange.bind(this);
        this.handleRenterOwnerChange = this.handleRenterOwnerChange.bind(this);
        this.handleCommuteTimeChange = this.handleCommuteTimeChange.bind(this);

        this.addDataLayer = this.addDataLayer.bind(this);
        this.removeDataLayer = this.removeDataLayer.bind(this);

        this.loadHouseholdIndexData();
        this.loadLayerDataSources();
    }

    loadLayerDataSources() {
        d3.json(Constants.DATA_SOURCE_FILE, function (error, data) {

            const dataSources = data;
            const layerDataSources = {};

            for (const dataSourceKey in dataSources) {
                const dataSource = dataSources[dataSourceKey];
                if (dataSource.dataType !== Constants.BOUNDARY_DATA_TYPE) {
                    dataSource.active = false;
                    layerDataSources[dataSourceKey] = dataSource;
                }
            }

            this.setState({
                layerDataSources: layerDataSources
            });

        }.bind(this));
    }

    // Custom data for the household index; not in data-sources.json
    loadHouseholdIndexData() {
        d3.csv(Constants.HOUSEHOLD_INDEX_FILE, (error, data) => {
            let householdIndexData = data.map((datum) => {
                const geography = +datum['Geo_Code'];
                const geographyName = datum['CSD_Name'];
                const lat = +datum['Lat'];
                const lng = +datum['Lon'];
                const households = +datum['Owner'] + +datum['Renter'];
                const medianIncome = +datum['Private households Median household total income'];
                const medianMonthlyOwnerCosts = +datum['Median monthly shelter costs for owned dwellings ($)'];
                const medianMonthlyRenterCosts = +datum['Median monthly shelter costs for rented dwellings ($)'];
                const ownerProportion = +datum['Owner'] / households;
                const renterProportion = +datum['Renter'] / households;
                const bedroomCount1Proportion = +datum['0 to 1 bedroom'] / households;
                const bedroomCount2Proportion = +datum['2 bedrooms'] / households;
                const bedroomCount3Proportion = +datum['3 bedrooms'] / households;
                const bedroomCount4Proportion = +datum['4 or more bedrooms'] / households;
                const commuteTime = +datum['Median commuting duration'];

                const result = {
                    geography, geographyName, lat, lng, households, medianIncome, medianMonthlyOwnerCosts, medianMonthlyRenterCosts,
                    ownerProportion, renterProportion, bedroomCount1Proportion, bedroomCount2Proportion,
                    bedroomCount3Proportion, bedroomCount4Proportion, commuteTime
                };
                return result;
            });

            // Filter to only include items that have non-null values for keys
            householdIndexData = householdIndexData.filter((item) => {
                return Object.keys(item).every((key) => (key === 'geographyName' || !isNaN(item[key])));
            });

            this.setState({ householdIndexData: householdIndexData }, this.updateIndex);
        });
    }

    updateIndex() {
        const data = Array.from(this.state.householdIndexData);

        // The variables we want to build scales for
        const scaleKeys = ['medianIncome', 'ownerProportion', 'renterProportion', 'bedroomCount1Proportion',
            'bedroomCount2Proportion', 'bedroomCount3Proportion', 'bedroomCount4Proportion', 'commuteTime'];

        // Build linear scales for each of the items above
        const scaleMax = 100;

        let scaleDictionary = {};

        const buildScale = (items) => {
            // Given a data set, calculate the min, max, and build a linear scale
            const min = d3.min(items);
            const max = d3.max(items);
            const scale = d3.scaleLinear().domain([min, max]).range([0, scaleMax]);
            return { min, max, scale };
        };

        // Build a scale for each of the keys defined above
        scaleKeys.forEach(key => {
            const items = data.map(item => item[key]);
            scaleDictionary[key] = buildScale(items);
        });

        // Obtain the desired indicators
        const desiredIncomeScaled = scaleDictionary['medianIncome'].scale(this.state.householdIncome);
        const desiredBRCountAttr = 'bedroomCount' + this.state.bedroomCount + 'Proportion';
        const desiredOwnershipAttr = this.state.renterOwner + 'Proportion';
        const desiredCommuteTime = this.state.commuteTime;

        // Now scale each of the data items according to the user's desired settings.
        // For info on how the scores are calculated, see the info buttons in-app.
        data.forEach(item => {
            item.householdIncomeScore = scaleMax - Math.abs(desiredIncomeScaled - scaleDictionary['medianIncome'].scale(item.medianIncome));
            item.bedroomCountScore = scaleDictionary[desiredBRCountAttr].scale(item[desiredBRCountAttr]);
            item.ownershipScore = scaleDictionary[desiredOwnershipAttr].scale(item[desiredOwnershipAttr]);
            item.commuteTimeScore = scaleMax - Math.max(0, item.commuteTime - desiredCommuteTime);

            // Generate a total score; note income is double-weighted
            item.totalScore = 2*item.householdIncomeScore + item.bedroomCountScore + item.ownershipScore + item.commuteTimeScore;
        });

        // Scale the total scores
        const scoreScale = buildScale(data.map(item => item.totalScore));
        data.forEach(item => item.value = scoreScale.scale(item.totalScore));

        // Sort the data, and add a "rank" value
        data.sort((a, b) => b.value - a.value).forEach((item, index) => item.rank = index+1);

        // Get the top 10 locations
        const topLocations = data.slice(0, 5);
        this.setState({ topLocations });

        // Process the data
        let boundaryData = {
            data: data,
            dataSource: { geographyKey: 'geocode', geographyType: 'census_subdivisions' }
        };
        boundaryData = Constants.processBoundaryData(boundaryData);

        this.props.changeBoundaryData(boundaryData);
    }

    handleBedroomCountChange(event) {
        this.setState({ bedroomCount: +event.target.value }, this.updateIndex);
    }

    handleHouseholdIncomeChange(event) {
        this.setState({ householdIncome: +event.target.value }, this.updateIndex);
    }

    handleRenterOwnerChange(event) {
        this.setState({ renterOwner: event.target.value }, this.updateIndex);
    }

    handleCommuteTimeChange(event) {
        this.setState({ commuteTime: event.target.value }, this.updateIndex);
    }

    addDataLayer(dataSource, data) {
        dataSource.active = true;
        this.updateDataLayer(dataSource);
        this.props.addLayerData(dataSource, data);
    }

    removeDataLayer(dataSource) {
        dataSource.active = false;
        this.updateDataLayer(dataSource, false);
        this.props.removeLayerData(dataSource);
    }

    updateDataLayer(dataSource) {
        this.setState((prevState) => {
            var updatedLayerDataSources = Object.assign({}, prevState.layerDataSources);
            updatedLayerDataSources[dataSource.file] = dataSource;
            return updatedLayerDataSources;
        });
    }

    render() {

        const bedroomCountArray = [1, 2, 3, 4];
        const bedroomCountOptions = bedroomCountArray.map((item, index) => {
            // Build the bedroom count names. The last item just gets a +
            // appended, e.g. '4+'
            const name = item + ((index < bedroomCountArray.length-1) ? '' : '+') + ' bedroom';
            return { name: name, value: item };
        });

        const householdIncomeArray = [0, 20000, 40000, 60000, 80000, 100000, 120000, 140000, 160000];
        const householdIncomeOptions = householdIncomeArray.map((item, index) => {
            // Build the income range names, which are item[index] through
            // item[index+1]-1, i.e. $0-$19,999, $20,000-$39,999, etc. The last item
            // just gets a + appended, e.g. $160,000+
            const name = '$' + Constants.formatNumber(item, 0, true)
                            + ((index < householdIncomeArray.length-1)
                                ? '–' + Constants.formatNumber(householdIncomeArray[index+1]-1, 0, true)
                                : '+');
            const value = (index < householdIncomeArray.length-1)
                            ? (item + householdIncomeArray[index+1]) / 2
                            : item;
            return { name: name, value: value };
        });

        // Commute time thresholds; they are maximums, so their mapping is
        // straightforward
        const commuteTimeArray = [5, 10, 15, 20, 25, 30, 40, 50, 60, 90];
        const commuteTimeOptions = commuteTimeArray.map((item, index) => ({
            name: item + ' min.', value: item
        }));

        const renterOwnerOptions = [
            { name: 'Rent', value: 'renter' },
            { name: 'Own', value: 'owner' }
        ];

        // When a top item is clicked, pan to it on the map
        const defaultZoomLevel = 11;
        const topLocationsList = this.state.topLocations.map((item) =>
            <li className="matches" key={item.geography} tabIndex="0" aria-label="Top 5 matches">
                <a onClick={(event) => this.props.panToFeatureCallback(item.lat,
                                        item.lng,
                                        defaultZoomLevel,
                                        item.geography,
                                        item.geographyName)} tabIndex="0">
                    {item.geographyName}
                </a>
            </li>
        );

        return (
            <div id="data-selector">
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <h2><i className="fa fa-home"></i> Select housing criteria &nbsp;
                        <a tabIndex="0"
                            aria-label="Info"
                            aria-expanded="true"
                            role="button"
                            data-toggle="popover"
                            title="Housing index info"
                            data-trigger="focus"
                            data-html="true"
                            data-placement="bottom"
                            data-content={`<p>We have created a simple housing-area suitability index based on four inputs: <strong className=''>Home size, Ownership, Work commute and Pre-tax household income.</strong> Read how each variable has been transformed to create the index by clicking on each information icon for each score below. The model is
                            imperfect, and for now is mainly for illustrative purposes &mdash; there are many more variables (and better transformations of existing variables!) that could be included.</p>`} >
                            <i className="fa fa-md fa-info-circle"></i>
                        </a>
                        </h2>
                        <strong>Select your housing criteria from the four dropdowns below to see which areas are most suitable to your needs. </strong> <p>Then hover over the map or search for a location to see how those areas match your criteria.
                        Add additional layers to the map to see public services and spaces in that area.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 col-sm-12">
                        <div className="row">
                            <div className="col-xs-6 col-sm-3">
                                <h4>Home size</h4>
                                <SelectDropdown
                                    options={bedroomCountOptions}
                                    nameAccessor={(option) => option.name}
                                    valueAccessor={(option) => option.value}
                                    onChangeCallback={this.handleBedroomCountChange} />
                            </div>
                            <div className="col-xs-6 col-sm-2">
                                <h4>Ownership</h4>
                                <SelectDropdown
                                    options={renterOwnerOptions}
                                    nameAccessor={(option) => option.name}
                                    valueAccessor={(option) => option.value}
                                    onChangeCallback={this.handleRenterOwnerChange} />
                            </div>

                            <div className="col-xs-6 col-sm-3">
                                <h4>Work Commute</h4>

                                <SelectDropdown
                                    options={commuteTimeOptions}
                                    nameAccessor={(option) => option.name}
                                    valueAccessor={(option) => option.value}
                                    onChangeCallback={this.handleCommuteTimeChange} />
                            </div>
                            <div className="col-xs-6 col-sm-4">
                                <h4>Pre-tax household income</h4>
                                <SelectDropdown
                                    options={householdIncomeOptions}
                                    nameAccessor={(option) => option.name}
                                    valueAccessor={(option) => option.value}
                                    onChangeCallback={this.handleHouseholdIncomeChange} />
                            </div>
                            <div id="top-locations" className="col-xs-12">
                                <h2 className="header-color">Top 5 matches</h2>
                                <ul>
                                    { topLocationsList }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <DataLayers
                            dataSources={this.state.layerDataSources}
                            addDataLayer={this.addDataLayer}
                            removeDataLayer={this.removeDataLayer} />
                    </div>
                </div>
            </div>
        );
    }
}

HousingIndexSelector.propTypes = {
    changeBoundaryData: React.PropTypes.func.isRequired,
    addLayerData: React.PropTypes.func.isRequired,
    removeLayerData: React.PropTypes.func.isRequired,
    panToFeatureCallback: React.PropTypes.func.isRequired
};

module.exports = HousingIndexSelector;