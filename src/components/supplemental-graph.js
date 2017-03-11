import React from 'react';
import Constants from '../constants';

/*

SupplementalGraph component
===========================

NB. Not currently used in the app.

A component that will draw a horizontal bar graph given some data. The `data`
must be an array of objects with `value` and `geography` keys, as described
in PropTypes.

*/
class SupplementalGraph extends React.Component {

    constructor(props) {
        super(props);

        this.handleBarClick = this.handleBarClick.bind(this);
    }

    componentDidMount() {
        this.buildGraphic();
    }

    componentDidUpdate() {
        this.updateGraphic();
    }

    buildGraphic() {
        let svg = d3.select(this.supplementalGraph);
        this.margin = { top: 0, right: 0, bottom: 20, left: 100 };

        let height = 700 - this.margin.top - this.margin.bottom;

        let g = svg.append('g')
            .attr('class', 'parent')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')');

        g.append('g')
            .attr('class', 'y axis');

        this.updateGraphic();
    }

    updateGraphic() {

        var data = Object.keys(this.props.data.dataDictionary).map((key) =>
            this.props.data.dataDictionary[key]
        );

        if (data.length && data.length < 100) {

            let g = d3.select(this.supplementalGraph).select('g.parent');

            let filterData = (datum) => (!isNaN(datum.value) && isFinite(datum.value));

            data = data.filter(filterData);
            data = data.sort((a, b) => a.value - b.value);

            let x = d3.scaleLinear().range([0, 400]);
            let y = d3.scaleBand().range([680, 0]);

            x.domain([0, d3.max(data, (d) => d.value )]);
            y.domain(data.map((d) => d.geography)).padding(0.1);

            g.select('.x.axis').call(d3.axisBottom(x).ticks(5));
            g.select('.y.axis').call(d3.axisLeft(y));

            g.selectAll('.bar').remove();
            g.selectAll('.label').remove();

            let bars = g.selectAll('.bar')
                    .data(data)
                .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', 0)
                    .attr('height', y.bandwidth())
                    .attr('fill', (d) => d.color)
                    .attr('opacity', 0.5)
                    .attr('y', (d) => y(d.geography))
                    .attr('width', (d) => x(d.value));

            bars.on('mouseover', this.handleBarMouseover);
            bars.on('mouseout', this.handleBarMouseout);

            let labels = g.selectAll('.label')
                    .data(data)
                .enter().append('text')
                    .text((d) => Constants.formatNumber(d.value))
                    .attr('class', 'label')
                    .attr('x', (d) => x(d.value) + 2)
                    .attr('fill', 'black')
                    .attr('y', (d) => y(d.geography) + y.bandwidth()/2 + 4);
        }
    }

    handleBarMouseover(datum, index) {
        d3.select(this).attr('opacity', 0.9);
    }

    handleBarMouseout(datum, index) {
        d3.select(this).attr('opacity', 0.5);
    }

    render() {
        return (
            <div>
                <svg
                    id="supplemental-graph"
                    ref={(supplementalGraph) => { this.supplementalGraph = supplementalGraph; }}>
                </svg>
            </div>
        );
    }
}

SupplementalGraph.propTypes = {
    data: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            value: React.PropTypes.number,
            geography: React.PropTypes.string
        })
    )
};

module.exports = SupplementalGraph;