import React from 'react';
import Constants from '../constants';

class MapDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const displayItems = this.props.highlightedItem.displayItems;
        const dataKeyMapping = this.props.highlightedItem.dataKeyMapping;

        let listItems;
        if (displayItems && dataKeyMapping) {
            listItems = Object.keys(displayItems)
                .filter(key => dataKeyMapping[key])
                .map(key =>
                    <div key={dataKeyMapping[key]}>
                        <h4>{dataKeyMapping[key]}</h4>
                        { Constants.formatNumber(displayItems[key], 2, true) }
                    </div>
                );
        }

        let rank = false;
        if (displayItems) {
            rank = this.props.highlightedItem.displayItems.rank;
        }

        return (

            <div id="map-detail">
                <h3>
                    { this.props.highlightedItem.name }
                    { rank && '  (Rank #' + rank + ')' }
                </h3>
                { listItems }
            </div>
        );
    }
}

MapDetail.propTypes = {
    highlightedItem: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        id: React.PropTypes.any.isRequired,
        displayItems: React.PropTypes.object,
        dataKeyMapping: React.PropTypes.object
    })
};

module.exports = MapDetail;