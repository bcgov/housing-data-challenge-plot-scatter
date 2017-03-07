import React from 'react';
import Constants from '../constants';

class MapLegend extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.scaleQuantiles === nextProps.scaleQuantiles
            && this.props.scaleColors === nextProps.scaleColors)
        {
            return false;
        }
        return true;
    }

    render() {
        const legendValues = this.props.scaleQuantiles.reverse().map((quantile, index) =>
            <div key={index}>
                { Constants.formatNumber(quantile) }
            </div>
        );
        const legendColors = this.props.scaleColors.reverse().map((color, index) =>
            <div key={color} style={{ backgroundColor: color }}></div>
        );

        return (
            <div id="map-legend">
                <div className="colors">
                    <div className="half-height"></div>
                    {legendColors}
                    <div className="half-height"></div>
                </div>
                <div className="values">
                    {legendValues}
                </div>
            </div>
        );
    }
}

MapLegend.propTypes = {
    scaleQuantiles: React.PropTypes.array.isRequired,
    scaleColors: React.PropTypes.array.isRequired
};

module.exports = MapLegend;