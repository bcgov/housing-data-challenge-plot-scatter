import React from 'react';

class SupplementalGraph extends React.Component {

    constructor(props) {
        super(props);

        this.originalData = props.data;

        console.log('SupplementalGraph component data:', this.originalData);

        this.state = {
            minDate: new Date('2014-01-01'),
            maxDate: new Date('2014-01-15'),
            data: props.data.sort((a, b) => {
                if (a.Municipality < b.Municipality) { return -1 };
                if (a.Municipality > b.Municipality) { return 1 };
                return 0;
            }),
            sortAlphabetically: true
        };

        this.defaultDataGraphic = {
            title: "Median PTT Revenue by Municipality",
            description: "Median Property Transfer Tax revenue, broken down by municipality.",
            full_width: true,
            height: 400,
            left: 300,
            x_accessor: 'md_PPT',
            y_accessor: 'Municipality',
            chart_type: 'bar',
            rotate_x_labels: 30
        };

        // this.changeDateRange = this.changeDateRange.bind(this);
    }

    componentDidMount() {
        this.buildGraphic();
    }

    componentDidUpdate() {
        this.buildGraphic();
    }

    buildGraphic() {
        const graphic = Object.assign({
                target: this.supplementalGraphDiv,
                data: this.state.data
            },
            this.defaultDataGraphic);
        MG.data_graphic(graphic);
    }

    changeMaxDate(maxDate) {
        this.setState((prevState) => ({
            maxDate: maxDate,
            data: this.originalData.filter((d) => d.date <= maxDate)
        }));
    }

    toggleSort() {

        var sortFunction = (a, b) => {
            if (a.Municipality < b.Municipality) { return -1 };
            if (a.Municipality > b.Municipality) { return 1 };
            return 0;
        };

        if (!this.state.sortAlphabetically) {
            sortFunction = (a, b) => {
                return a.md_PPT - b.md_PPT;
            }
        }

        this.setState((prevState) => ({
            sortAlphabetically: !prevState.sortAlphabetically,
            data: this.originalData.sort(sortFunction)
        }));
    }

    render() {

        let buttonMessage = null;
        if (this.state.sortAlphabetically) {
            buttonMessage = "Sort by median PTT";
        } else {
            buttonMessage = "Sort by municipality";
        }

        return (
            <div>

                <div id="supplemental-graph" ref={(div) => { this.supplementalGraphDiv = div; }}>
                </div>

                {/*<div className="exampleToolBox col-md-2">

                    <button
                        className="btn btn-default"
                        onClick={ this.changeMaxDate.bind(this, new Date("2014-01-30")) }>
                        Set Max Date to 2014-01-30
					</button>
                    
                    <button className="btn btn-default"
                        onClick={ this.changeMaxDate.bind(this, new Date("2014-04-30")) }>
                        Reset
					</button>

                </div>*/}

                {/*<div className="exampleToolBox col-md-2">
                    <button
                        className="btn btn-default"
                        onClick={ this.toggleSort.bind(this) }>
                        { buttonMessage }
					</button>
                </div>*/}
                

            </div>
        );
    }
}

module.exports = SupplementalGraph;