import React from 'react';
import Constants from '../constants';

/*

MapDetail component
===================

A component that shows information on the currently-selected map item.

Properties include:

*   `name`, the name of the geographical feature selected;
*   `id`, the geographical feature's id;
*   `displayItems`, a dictionary of key-value pairs representing a variable and
    its value, respectively;
*   `dataKeyMapping`, a dictionary mapping variable keys in `displayItems` to
    their desired display names. If a variable key is present in `displayItems`
    but not in `dataKeyMapping`, that variable is *not* shown in the MapDetail.

For instance, if `displayItems` contains `{ var1: 1200, var2: '30 mins'}`,
`dataKeyMapping` might contain `{ var1: 'Population', var2: 'Commute time'}`.
The `MapDetail` would then show:

    Population: 1200
    Commute time: 30 mins

If a `rank` key is present in `displayItems`, `MapDetail` will show that as the
overall ranking in the `MapDetail` header.

*/
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