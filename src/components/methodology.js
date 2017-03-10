import React from 'react';

function Methodology(props) {
    return (
        <div className="row" id="methodology" tabIndex="0">
            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <h2>
                    <i className="fa fa-info" tabIndex="0" aria-label="Methodology"></i>
                    Housing index methodology
                </h2>
                <p>
                    We have created a simple housing-area suitability index based on four inputs:
                </p>
                <ul>
                    <li>Home size</li>
                    <li>Ownership</li>
                    <li>Commute</li>
                    <li>Pre-tax household income</li>
                </ul>
                <p>Here is how each variable has been transformed to make up the index. The model is
                    imperfect, and for now is mainly for illustrative purposes &mdash; there are
                    many more variables (and better transformations of existing variables!) that
                    could be included.</p>

               <h5>Data source:</h5>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E" target="_blank">NHS: Household 2011 (dwelling and household/occupants characteristics)</a></p>
                <p><a href="https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/help-aide/aboutdata-aproposdonnees.cfm?Lang=E"target="_blank">Notes and considerations</a></p>
                <h3>Home size</h3>
                <p>First, we look at which desired home size (1 to 4+ bedrooms) has been selected.
                    Next, we identify the municipalities with the highest proportion of total homes
                    of the selected size. These municipalities are then ranked the highest. For
                    example, if a user selects '1 bedroom', municipalities with the highest
                    proportion of one bedroom homes will rank first.</p>
                <h3>Ownership</h3>
                <p>Based on the user's selection of either "rent" or "own", we identify the
                    proportion of households with that ownership status for each municipality.
                    Municipalities with the highest proportion of the selected ownership status are
                    then ranked highest.</p>
                <h3>Commute</h3>
                <p>For this input, every municipality initially gets a score of 100. Then, based on
                    the desired commute time selected, if the median commute time of a municipality
                    is less the commute time specified, the score remains at 100. However, 1 point
                    is subtracted for every minute that a municipality's median commute time is
                    greater than the specified commute time.</p>
                <h3>Pre-tax household income</h3>
                <p>When the user selects an income band, the average of the band's end-points is
                    taken. Then, the median income for every municipality is scaled to create a
                    range from 0 to 100. The municipality with the the lowest median income is 0 and
                    the highest is 100. From there, the selected income bracket gets a scaled value.
                    The absolute difference between the municipality's scaled value and selected
                    income band is calculated to create a score. This income score is then double
                    weighted due to its perceived importance.</p>
                <p>Finally, each municipality is given an aggregated score for all four components,
                    which is scaled to give the final score provided. Note that the legend intervals
                    adjust dynamically depending on the housing criteria selected.</p>
            </div>
        </div>
    );
}

module.exports = Methodology;