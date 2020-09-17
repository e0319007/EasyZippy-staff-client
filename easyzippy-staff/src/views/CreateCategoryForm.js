import React, { useEffect } from 'react'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { UseForm, Form } from '../components/UseForm';


const initialValues = {
    id: '0',
    name: '',
    description: '',
};

function CreateCategoryForm(props) {
    const {addOrEdit, recordForEdit} = props


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
        addOrEdit(values, resetForm);
    }

    useEffect(() => { 
        if(recordForEdit != null) 
            setValues({
                ...recordForEdit
        })
    }, [recordForEdit])

    return (
        
        <div className="content">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardBody>
                                <form>
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="inputName">Name</Label>
                                            <Input 
                                                type="text" 
                                                id="inputName" 
                                                name="name" 
                                                value={values.name} 
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

export default CreateCategoryForm
