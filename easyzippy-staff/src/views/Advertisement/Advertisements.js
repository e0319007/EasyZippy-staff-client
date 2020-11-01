import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

import {
    Card,
    Row,
    Col,
    Alert,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    FormGroup,
    Button,
    Label,
    Input
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Advertisements() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const staffId = parseInt(Cookies.get('staffUser'))

    const history = useHistory()

    const[data, setData] = useState([])

    const [viewApprove, setViewApprove] = useState(true)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState()
    const [imageName, setImageName] = useState('Upload Image')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState()

    const [unapprovedData, setUnapprovedData] = useState([]) 

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false));

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Title", field:"title", editable: "never"},
        {title: "Description", field:"description", editable: "never"},
        {title: "Start Date", field:"startDate", editable: "never",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field:"endDate", editable: "never",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", editable: "never"} 
    ]

    useEffect(() => {
        console.log("retrieving approved advertisements // axios")
        axios.get("/approvedAdvertisements", {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            setData(res.data)

            axios.get("/unapprovedAdvertisements", {
                headers: {
                    AuthToken: authToken
                }
            }).then (res => {
                setUnapprovedData(res.data)
            }).catch(function (error) {
                console.log(error.response.data)
            })
        }).catch (function (error) {
            console.log(error.response.data)
        })
    }, [])

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteAdvertisement/"+oldData.id, {
            title: oldData.title
        },
        {
        headers: {
            AuthToken: authToken
        }
    }).then(res => {
            console.log("axios call went through")
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            isInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("Advertisement successfully deleted!")
            resolve()
        })
        .catch(function (error) {

            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }
            isInModal(false)
            isSuccessful(false)
            isError(true)
            setError(errormsg)
            console.log(error.response.data)
            resolve()
        })
    }   

    const createStaffAdvertisement = () => {

        if (image === undefined) {
            isInModal(true)
            isError(true)
            setError("Unable to create new advertisement. Please upload a photo.")
            isSuccessful(false)
            return;
        }

        //need to post the image first
        let formData = new FormData();
        formData.append(image.name, image)
        console.log('form data values: ')
        for (var v of formData.values()) {
            console.log(v)
        }

        axios.post("/advertisement/addImage", formData, {
            headers: {
                AuthToken: authToken
            }
        }).then( res => {
            console.log("image upload axios call went through")
            var imgString = res.data
            console.log("image string: " + imgString)

            //i think need to send back the dates in YYYY/MM/DD format
            //so need to format from YYYY-MM-DD to that

            var startd = startDate
            startd = startd.toString().replace('/-/g', '/')
            console.log(startd)

            var enddate = endDate
            enddate = enddate.toString().replace('/-/g', '/')
            console.log(enddate)

            if (title === undefined || title === "") {
                isInModal(true)
                isError(true)
                setError("Unable to create new advertisement. Please fill in the title field.")
                isSuccessful(false)
                return;
            }

            if (description === undefined || description === "") {
                isInModal(true)
                isError(true)
                setError("Unable to create new advertisement. Please fill in the description field.")
                isSuccessful(false)
                return;
            }

            if (startd === undefined || startd === "") {
                isInModal(true)
                isError(true)
                setError("Unable to create new advertisement. Please select a Start Date.")
                isSuccessful(false)
                return;
            }

            if (enddate === undefined || enddate === "") {
                isInModal(true)
                isError(true)
                setError("Unable to create new advertisement. Please select an End Date.")
                isSuccessful(false)
                return;
            }

            axios.post("/createAdvertisementAsStaff", {
                title: title,
                description: description,
                image: imgString,
                startDate: startd,
                endDate: enddate,
                staffId: staffId
            },
            {
            headers: {
                AuthToken: authToken
            },
            }).then(res => {
                console.log("create ad axios call went through")
                isInModal(true)
                isError(false)
                isSuccessful(true)
                setMsg("Advertisement successfully created!")
                // window.location.reload()
            }).catch (function (error) {
                let errormsg = error.response.data;
    
                if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                    errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
                }
                isInModal(true)
                isSuccessful(false)
                isError(true)
                setError(errormsg)
                console.log(error.response.data)
            })
        }).catch(function(error){
            let errormsg = error.response.data;
    
            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }

            isInModal(true)
            isSuccessful(false)
            console.log(error.response.data)
            isError(true)
            setError(errormsg)
        })
    }

    const onChangeTitle = e => {
        const title = e.target.value;
        setTitle(title)
    }

    const onChangeDescription = e => {
        const description = e.target.value;
        setDescription(description)
    }

    const onChangeStartDate = e => {
        const startDate = e.target.value;
        console.log(startDate)
        setStartDate(startDate)
    }

    const onChangeEndDate = e => {
        const endDate = e.target.value;
        console.log(endDate)
        setEndDate(endDate)
    }

    const onChangeImage = e => {
        if (e.target.files[0] !== undefined) {
            setImage(e.target.files[0])
            setImageName(e.target.files[0].name)
        }
    }

    // to use when viewing 
    function formatDate(d) {
        console.log(d)
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        let time = currDate.toLocaleTimeString('en-SG')

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year;
    }

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            {viewApprove &&
                                <MaterialTable 
                                title="Advertisements (Approved)"
                                columns={columns}
                                data={data}
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Search"
                                    }
                                }}
                                options={{   
                                    //sorting: true, 
                                    search: false,
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1',
                                        color: '#FFF',
                                        fontWeight: 1000,                                      
                                    },
                                    actionsColumnIndex: -1
                                    }}
                                    actions={[
                                            {
                                            icon: 'info',
                                            tooltip: 'View Advertisement Details',
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/advertisementDetails')
                                                localStorage.setItem('advertisementToView', JSON.stringify(rowData.id))
                                                }
                                            },          
                                            {
                                                icon: 'add',
                                                onClick: () => {
                                                    toggle()
                                                },
                                                isFreeAction: true,
                                                tooltip: 'Add',
                                            },
                                            {
                                                icon: 'sort',
                                                onClick: () => {
                                                    setViewApprove(false)
                                                },
                                                isFreeAction: true,
                                                tooltip: 'Click to view unapproved advertisements',
                                            }               
                                    ]}
                                    editable={{
                                        onRowDelete: (oldData) =>
                                            new Promise((resolve) => {
                                            handleRowDelete(oldData, resolve)
                                        })
                                    }}
                                />
                            }
                            {!viewApprove &&
                                <MaterialTable 
                                title="Advertisements (Not Approved)"
                                columns={columns}
                                data={unapprovedData}
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Search"
                                    }
                                }}
                                options={{   
                                    //sorting: true, 
                                    search: false,
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1',
                                        color: '#FFF',
                                        fontWeight: 1000,                                      
                                    },
                                    actionsColumnIndex: -1
                                    }}
                                    actions={[
                                            {
                                            icon: 'info',
                                            tooltip: 'View Advertisement Details',
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/advertisementDetails')
                                                localStorage.setItem('advertisementToView', JSON.stringify(rowData.id))
                                                }
                                            },
                                            {
                                                icon: 'sort',
                                                onClick: (event, rowData) => {
                                                    setViewApprove(true)
                                                },
                                                isFreeAction: true,
                                                tooltip: 'Click to view approved advertisements',
                                            }               
                                    ]}
                                    editable={{
                                        onRowDelete: (oldData) =>
                                            new Promise((resolve) => {
                                            handleRowDelete(oldData, resolve)
                                        })
                                    }}
                                />
                            }
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}
                        </Card>
                    </Col>
                </Row>
            </div>               
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Advertisement</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label for="inputTitle">Title</Label>
                                <Input 
                                    type="text" 
                                    id="inputTitle" 
                                    placeholder="Title"
                                    value={title}
                                    onChange={onChangeTitle}
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputDescription">Description</Label>
                                <Input 
                                    type="textarea" 
                                    id="inputDescription" 
                                    placeholder="Description"
                                    value={description}
                                    onChange={onChangeDescription}
                                />
                        </FormGroup>
                        <div className="form-row">
                            <FormGroup className="col-md-6">
                                <Label for="inputStartDate">Start Date</Label>
                                    <Input 
                                        type="date" 
                                        id="inputStartDate" 
                                        placeholder="Start Date"
                                        value={startDate}
                                        onChange={onChangeStartDate}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputEndDate">End Date</Label>
                                    <Input 
                                        type="date" 
                                        id="inputEndDate" 
                                        placeholder="End Date"
                                        value={endDate}
                                        onChange={onChangeEndDate}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>Choose Advertisement Image</Label>
                                    <div className='custom-file mb-4'>
                                        <Input
                                            type='file'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChangeImage}
                                        />
                                        <Label className='custom-file-label' htmlFor='customFile'>
                                            {imageName}
                                        </Label>
                                    </div>
                            </FormGroup>
                        </div>
                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={createStaffAdvertisement}>Create</Button>{' '}
                </ModalFooter>
            </Modal> 
            <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </ThemeProvider>     
    );
}

export default Advertisements;