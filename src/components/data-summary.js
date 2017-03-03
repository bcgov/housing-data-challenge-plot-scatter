import React from 'react';

class DataSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const count = this.props.data.length;
        const min = d3.min(this.props.data, this.props.valueAccessor);
        const max = d3.max(this.props.data, this.props.valueAccessor);

        // TODO: use name accessor

        return (
            <div className="col-sm-12">
                There are <strong>{count}</strong> items in this data set.
                The minimum value is <strong>{min}</strong> in <strong>???</strong>.
                The maximum value is <strong>{max}</strong> in <strong>???</strong>.
            </div>
        );
    }
}

DataSummary.propTypes = {
    data: React.PropTypes.array.isRequired,
    nameAccessor: React.PropTypes.func,
    valueAccessor: React.PropTypes.func.isRequired
};

module.exports = DataSummary;