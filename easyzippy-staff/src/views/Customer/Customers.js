import React from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
} from "reactstrap";

function Customers() {
    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardBody>
                                <CardTitle>Customers title</CardTitle>
                                <CardText>This is the Customers page</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Customers;