import React from 'react';
import SupplementalGraph from './supplemental-graph';
import MapViz from './map-viz';

function BoundariesName(props) {
    return <h5>Map Boundaries: <a href="#">{props.name}</a></h5>;
}

function Datasets(props) {
    return <h5>Datasets: <a href="#">{props.name}</a></h5>
}

class MainDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
        console.log('MainDisplay component data:', this.state.data);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <MapViz data={this.state.data} />
                </div>
                <div className="col-md-12 margin-top">
                    <SupplementalGraph data={this.state.data} />
                </div>
            </div>
        );
    }
}

module.exports = MainDisplay;