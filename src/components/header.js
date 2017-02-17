import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <header className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3 col-sm-10">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a className="navbar-brand" href="#">Housing Data Explorer</a>
                            </div>
                        </div>

                        {/*Collect the nav links, forms, and other content for toggling*/}
                        {/*<div className="col-md-6 col-sm-12">
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <form className=" navbar-form navbar-centre">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search" />
                                    </div>
                                    <button type="submit" className="btn btn-default">Search</button>
                                </form>
                            </div>
                        </div>*/}

                        <div className="col-sm-3"></div>
                    </div>
                </div>
            </header>
        );
    }
}

module.exports = Header;