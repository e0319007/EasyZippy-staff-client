import React from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
} from "reactstrap";

function Category() {
    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardBody>
                                <CardTitle>Category title</CardTitle>
                                <CardText>This is the Category page</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Category;