import React from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
} from "reactstrap";

function Merchants() {
    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardBody>
                                <CardTitle>Merchants title</CardTitle>
                                <CardText>This is the Merchants page</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Merchants;