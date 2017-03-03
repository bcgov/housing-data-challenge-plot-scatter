import React from 'react';
import DataSelect from './data-select';
import Constants from '../constants';

class DataLayers extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddLayerButtonClick = this.handleAddLayerButtonClick.bind(this);
    }

    handleAddLayerButtonClick(event) {
        const layerSelectValue = this.layerSelect.getValue();
        const selectedDataSource = this.props.dataSources[layerSelectValue];
        this.loadData(selectedDataSource);
    }

    handleDeleteLayerButtonClick(dataSource) {
        this.props.removeDataLayer(dataSource);
    }

    loadData(dataSource) {
        const filePath = Constants.DATA_DIRECTORY + dataSource.dataType + '/' + dataSource.file;

        let parseGeography = (item) => {
            const geographyKey = dataSource.geographyKey;
            switch (dataSource.geographyType) {
                case 'latlon':
                    // geographyKey will be an array of length 2, with
                    // column names for lat and lon in positions 0 and 1
                    return [item[geographyKey[0]], item[geographyKey[1]]];
                default:
                    return item;
            }
        };

        let dataResponseFunction = (data) => {
            const values = data.map((item) => {
                return {
                    geography: parseGeography(item),
                    value: item[dataSource.labelKey]
                };
            });
            this.props.addDataLayer(dataSource, values);
        };

        dataSource.fileType === 'csv'
            ? d3.csv(filePath, (error, data) => dataResponseFunction(data))
            : d3.json(filePath, (error, data) => dataResponseFunction(data.features));
    }

    render() {

        const dataSources = this.props.dataSources;

        // Filter out items that *are* in the activeLayers list, because
        // we don't want them in the select list any longer
        const activeDataSourcesArray = Object.keys(dataSources)
                                      .map((key) => dataSources[key])
                                      .filter((item) => !(item.active));

        const inactiveDataSourcesArray = Object.keys(dataSources)
                                      .map((key) => dataSources[key])
                                      .filter((item) => item.active);

        const activeLayerListItems = inactiveDataSourcesArray.map(dataSource => {
            return (<li key={dataSource.file}>
                <i className={'big-icon fa fa-' + dataSource.icon} style={{color: dataSource.iconColor}}></i>
                {dataSource.name}
                <button
                    className="btn btn-default inline"
                    onClick={() => this.handleDeleteLayerButtonClick(dataSource)} >
                    <i className="fa fa-times-circle"></i>
                </button>
            </li>);
        });

        return (
            <div>
            <div className="row">
                <div className="col-md-12">
                    <h3>Select and add additional layers</h3>
                </div>
                <div className="col-md-12">
                    <DataSelect
                        ref={(layerSelect) => this.layerSelect = layerSelect}
                        options={activeDataSourcesArray}
                        nameAccessor={(dataSource) => dataSource.name}
                        valueAccessor={(dataSource) => dataSource.file}
                        truncate={true}
                        classNames="inline" />

                    <button
                        className="btn btn-default add-layer"
                        onClick={this.handleAddLayerButtonClick} >
                        <i className="fa fa-plus"></i>Add layer
                    </button>
                </div>
            </div>
            <div className="col-md-12">
            <ul id="data-layers">
                { activeLayerListItems }
            </ul>
            </div>
         </div>
        );
    }
}

DataLayers.propTypes = {
    dataSources: React.PropTypes.object.isRequired,
    addDataLayer: React.PropTypes.func.isRequired,
    removeDataLayer: React.PropTypes.func.isRequired
};

module.exports = DataLayers;