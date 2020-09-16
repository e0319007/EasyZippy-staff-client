import axios from "axios";
import React, { useState, useEffect } from "react";

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
    CardHeader, InputGroup, InputGroupText, InputGroupAddon
} from "reactstrap";
import CreateKioskForm from "./CreateKioskForm";
import UseTable from "../components/UseTable";
import * as KioskService from "../services/kioskService";
import Popup from "../components/Popup"

const headCells = [
    {id:'id', label:'ID'},
    {id:'location', label:'Location'},
    {id:'description', label:'Description'},
    {id:'dateInstalled', label:'Date Installed'},
    {id:'enabled', label:'Enabled'},
    //if want to disable sorting for a particular column 
    //{id:'enabled', label:'Enabled', disableSorting:true},
]

function Kiosks() {

    const [records, setRecords] = useState(KioskService.getAllKiosks())
    const [filterFunction, setFilterFunction] = useState({fn: items => { return items; }})
    const [openPopup, setOpenPopup] = useState(false)

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = UseTable(records, headCells, filterFunction);

    const handleSearch = e => {
        let target = e.target;
        setFilterFunction({
            fn: items => {
                if (target.value === "")
                    return items;
                else 
                    return items.filter(x => x.location.toLowerCase().includes(target.value))
            }
        })
    }

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
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="nc-icon nc-zoom-split"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" placeholder="Search Location" 
                                         onChange={handleSearch}></Input>
                                    </InputGroup>
                                    <Button onClick={() => setOpenPopup(true)}>Add New</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <TblContainer>
                                    <TblHead />
                                    <tbody>
                                        {
                                            recordsAfterPagingAndSorting().map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.dateInstalled}</td>
                                                    <td>{item.enabled}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </TblContainer>
                                <TblPagination />
                                {/* <Table responsive>
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
                                </Table> */}
                            </CardBody>
                            <Popup openPopup = {openPopup}
                            setOpenPopup = {setOpenPopup}>

                            </Popup>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Kiosks;