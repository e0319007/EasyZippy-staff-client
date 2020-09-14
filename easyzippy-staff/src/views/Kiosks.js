import React, { useState } from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Button,
    Table,
    CardHeader
} from "reactstrap";
import CreateKioskForm from "./CreateKioskForm";


function Kiosks() {

    return(
        <>
            <div className="content">
                <CreateKioskForm />
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-4" tag="h4">Kiosks List</CardTitle>
                                <Form inline className="ml-auto, col-md-4">
                                    <FormGroup className={"no-border"}>
                                        <Input type="text" placeholder="Search"/>
                                    </FormGroup>
                                    <Button color="success" icon round>
                                        <i className="nc-icon nc-zoom-split"></i>
                                    </Button>
                                </Form>
                                <Button className="col-md-3" color="success">
                                    <i className="nc-icon nc-simple-add"></i> Create a New Kiosk
                                </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead className="text-success">
                                        <tr>
                                            <th>ID</th>
                                            <th>Location</th>
                                            <th>Description</th>
                                            <th>Date Installed</th>
                                            <th>Enabled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Seng Kang Compass One</td>
                                            <td>First level outside the sliding door</td>                                         
                                            <td>28/11/20</td>
                                            <td>Enabled</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Kiosks;