import React from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
} from "reactstrap";

function KioskDetails() {
    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardBody>
                                <CardTitle>KioskDetails title</CardTitle>
                                <CardText>This is the KioskDetails page</CardText>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default KioskDetails;