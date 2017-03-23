import React from 'react';
import { Button, Modal } from 'react-bootstrap';

/*

LoadOverlay component
=====================

Creates an overlay on load which gives an introduction to the project.

*/
class LoadOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    render() {

        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Welcome to the BC Housing Explorer!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This is a proof of concept that was developed in February 2017 for the <a href="http://bcic.ca/news/blog/75000-available-solve-provincial-governments-data-visualization-challenges/" target="_blank">BCIC data viz challenge</a>. There are two components to this prototype:</p>

                        <p>The first component is a very simple housing-area suitability index based on four inputs:</p>
                            <ul>
                                <li><strong>Home size</strong></li>
                                <li><strong>Ownership</strong></li>
                                <li><strong>Work commute</strong></li>
                                <li><strong>Pre-tax household income</strong></li>
                            </ul>
                        <p>Read how each variable has been transformed to create the index by clicking on each information icon for each score.</p>

                        <p><strong>* Please note that the model is imperfect, and for now is mainly for illustrative purposes &mdash; there are many more variables (and better transformations of existing variables!) that could be included.</strong></p>

                        <p>The second component allows you to explore and map either a single variable or a combination of two variables. </p>
                        <hr />
                        <p>We will make some more updates over the course of the next weeks. Please <a href="mailto:contact@plotandscatter.com?Subject=BCIC%20Prototype" target="_top">contact </a> us if you are interested in learning more about the prototype or how we might be able to adapt it to your needs and interests.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = LoadOverlay;
