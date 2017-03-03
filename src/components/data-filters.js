import React from 'react';

class DataFilters extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2><i className="fa fa-filter"></i> Filters</h2>
                <h3>Year</h3>
                <p className="select-wrapper">
                    <select className="form-control">
                        <option value="">2016</option>
                    </select>
                    <label className="select-arrow">▼</label>
                </p>
            </div>
        );
    }
}

module.exports = DataFilters;