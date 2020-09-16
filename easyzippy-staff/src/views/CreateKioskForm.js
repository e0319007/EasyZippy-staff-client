import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { UseForm, Form } from '../components/UseForm';
import * as kioskService from "../services/kioskService";

const initialValues = {
    location: '',
    description: '',
    dateInstalled: new Date(),
    enabled: 'false',

};

function CreateKioskForm() {

    // const validate=(fieldValues = values) => {
    //     let temp = {...errors}
    //     if ('location' in fieldValues)
    //         temp.location = fieldValues.location ? "" : "This field is required."
    //     if ('description' in fieldValues) 
    //         temp.description = fieldValues.description ? "" : "This field is required."
    //     if ('dateInstalled' in fieldValues) 
    //         temp.dateInstalled = fieldValues.dateInstalled ? "" : "This field is required."
    //     if ('enabled' in fieldValues)
    //         temp.enabled = fieldValues.enabled ? "" : "This field is required." 
    //     setErrors({
    //         ...temp
    //     })

    //     if (fieldValues === values) 
    //         return Object.values(temp).every(x => x === ""  )
    //} 

    const {
        values,
        setValues,
        //errors,
        //setErrors,
        handleInputChange, 
        resetForm
    } = UseForm(initialValues);

    const handleSubmit = e => {
        e.preventDefault()
        kioskService.insertKiosk(values)
        window.alert("submitted!")
        resetForm()
        // if (validate()) {
        //     window.alert('submitted')
        //     resetForm()
        // }
        
    }

    return (
        
        <div className="content">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle tag="h5">Create a New Kiosk</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="inputLocation">Location</Label>
                                            <Input 
                                                type="text" 
                                                id="inputLocation" 
                                                name="location" 
                                                value={values.location} 
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="inputDescription">Description</Label>
                                            <Input 
                                                type="text" 
                                                id="inputDescription" 
                                                name="description" 
                                                value={values.description} 
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup> 
                                    </div>    
                                    <div className="form-row"> 
                                        <FormGroup className="col-md-3">
                                            <Label for="inputDate">Date Installed</Label>
                                            <Input 
                                                type="date" 
                                                id="inputDate" 
                                                name="dateInstalled" 
                                                value={values.dateInstalled} 
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-3">
                                            <Label for="enabled">Enabled?</Label>
                                            <div check className="form-check-radio">
                                                <Label className="form-check-label">
                                                <Input 
                                                    type="radio" 
                                                    name="enabled" 
                                                    id="inputYes" 
                                                    value="{values.enabled}" 
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                Yes
                                                <span className="form-check-sign"></span>
                                                </Label>
                                            </div>
                                            <div check className="form-check-radio">
                                                <Label className="form-check-label">
                                                <Input 
                                                    type="radio" 
                                                    name="enabled" 
                                                    id="inputNo" 
                                                    value="{values.enabled}" 
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                No
                                                <span className="form-check-sign"></span>
                                                </Label>
                                            </div>                                     
                                        </FormGroup>                          
                                    </div>
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button className="btn-round" color="success" type="submit">Submit</Button>
                                                <Button className="btn-round" type="reset" onClick={resetForm}>Reset</Button>
                                            </div>
                                        </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    
    )
}

export default CreateKioskForm
