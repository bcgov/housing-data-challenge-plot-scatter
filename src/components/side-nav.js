import React from 'react';

class SideNav extends React.Component {
    render() {
        return (
            <nav>
                <div className="col-md-2  sidebar-nav">
                    <div className="navbar navbar-default noborder" role="navigation">
                        <div className="navbar-collapse collapse sidebar-navbar-collapse" data-spy="affix">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#"><i className="fa fa-lg fa-home" aria-hidden="true"></i> Home</a></li>
                                <li><a href="#"> <i className="fa fa-table"></i> Datasets <span className="badge">3</span></a></li>
                                <li><a href="#filters"><i className="fa fa-filter" aria-hidden="true"></i> Filters</a></li>
                                <li><a href="#charts"><i className="fa fa-bar-chart" aria-hidden="true"></i> Graphs</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

        );
    }
}

module.exports = SideNav;