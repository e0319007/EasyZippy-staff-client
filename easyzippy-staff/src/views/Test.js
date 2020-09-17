import React, { useState, useEffect } from "react";
import CategoryDataService from "../services/categoryService2";

const Test = props => {
const initialTestState = {
    id: null,
    name: "",
    description: "",

};
const [currentTest, setCurrentTest] = useState(initialTestState);
const [message, setMessage] = useState("");

const getTest = id => {
    CategoryDataService.get(id)
    .then(response => {
        setCurrentTest(response.data);
        console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
};

useEffect(() => {
    getTest(props.match.params.id);
}, [props.match.params.id]);

const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentTest({ ...currentTest, [name]: value });
};

const updatePublished = status => {
    var data = {
    id: currentTest.id,
    title: currentTest.title,
    description: currentTest.description,
    published: status
    };

    CategoryDataService.update(currentTest.id, data)
    .then(response => {
        setCurrentTest({ ...currentTest, published: status });
        console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
};

const updateTest = () => {
    CategoryDataService.update(currentTest.id, currentTest)
    .then(response => {
        console.log(response.data);
        setMessage("The tutorial was updated successfully!");
    })
    .catch(e => {
        console.log(e);
    });
};

const deleteTest = () => {
    CategoryDataService.remove(currentTest.id)
    .then(response => {
        console.log(response.data);
        props.history.push("/test");
    })
    .catch(e => {
        console.log(e);
    });
};

return (
    <div>
    {currentTest ? (
        <div className="edit-form">
        <h4>Test</h4>
        <form>
            <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentTest.name}
                onChange={handleInputChange}
            />
            </div>
            <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTest.description}
                onChange={handleInputChange}
            />
            </div>

            <div className="form-group">
            <label>
                <strong>Status:</strong>
            </label>
            {currentTest.published ? "Published" : "Pending"}
            </div>
        </form>

        {currentTest.published ? (
            <button
            className="badge badge-primary mr-2"
            onClick={() => updatePublished(false)}
            >
            UnPublish
            </button>
        ) : (
            <button
            className="badge badge-primary mr-2"
            onClick={() => updatePublished(true)}
            >
            Publish
            </button>
        )}

        <button className="badge badge-danger mr-2" onClick={deleteTest}>
            Delete
        </button>

        <button
            type="submit"
            className="badge badge-success"
            onClick={updateTest}
        >
            Update
        </button>
        <p>{message}</p>
        </div>
    ) : (
        <div>
        <br />
        <p>Please click on a Tutorial...</p>
        </div>
    )}
    </div>
);
};

export default Test;