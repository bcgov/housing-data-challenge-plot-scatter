// React files
import React from 'react';
import ReactDOM from 'react-dom';

// App components
import Header from './components/header';
import TabInterface from './components/tab-interface';
import Tab from './components/tab';
import MapGraphDisplay from './components/map-graph-display';

// fetch polyfill for e.g. Safari, see http://stackoverflow.com/a/35830329/715870
import 'whatwg-fetch';

// Include SCSS files
require('./scss/app.scss');

/*

App component
=============

A functional component that contains the Header and the main tabbed interface.
The first tab is for the housing index. The second is for the variable display.

*/
function App(props) {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                <TabInterface hideTextWhenSmall={true}>
                    <Tab name="Housing index" icon="fa-home">
                        <MapGraphDisplay type="housing-index" />
                    </Tab>
                    <Tab name="Map other data" icon="fa-map">
                        <MapGraphDisplay type="variables" />
                    </Tab>
                </TabInterface>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));