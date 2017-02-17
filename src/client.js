// React files
import React from 'react';
import ReactDOM from 'react-dom';

// App components
import Header from './components/header';
import SideNav from './components/side-nav';
import MainDisplay from './components/main-display';

// fetch polyfill for e.g. Safari, see http://stackoverflow.com/a/35830329/715870
import 'whatwg-fetch';

// Initial data
import DATA_PTT_JUNE from './data/PTT_june.js';

// Application CSS
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require('./scss/app.scss');

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data: DATA_PTT_JUNE
        }
        console.log('App component data', this.state.data);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container-fluid">
                    {/* <SideNav /> */}
                    <div className="row natural-language-selects">
                        <div className="col-sm-9">
                            <p>
                                Displaying                                
                                <select className="form-control">
                                    <option value="">Property Transfer Tax</option>
                                </select>
                                <label className="select-arrow">▼</label>
                                <select className="form-control">
                                    <option value="">Median Revenue</option>
                                </select>
                                <label className="select-arrow">▼</label>
                                data for
                                <select className="form-control">
                                    <option value="">June 2016</option>
                                </select>
                                <label className="select-arrow">▼</label>
                                at the
                                <select className="form-control">
                                    <option value="">Municipal</option>
                                </select>
                                <label className="select-arrow">▼</label>
                                grouping level.
                            </p>
                        </div>
                        <div className="col-sm-3">
                            <button type="button" className="btn btn-default btn-md">
                                <i className="fa fa-eye"></i> View data sources
                            </button>
                        </div>
                    </div>
                    <div className="row explanation">
                        <div className="col-sm-9">
                            There are <strong>17</strong> items in this data set, covering <strong>less than 10%</strong> of all municipalities.
                            The maximum value is <strong>$13,033.01</strong> in <strong>Vancouver</strong>.
                            The minimum value is <strong>$4,060</strong> in <strong>Nanaimo</strong>.
                        </div>
                    </div>
                    <MainDisplay data={this.state.data} />
                </div>
            </div>
        )
    }
}





ReactDOM.render(<App />, document.getElementById('root'));