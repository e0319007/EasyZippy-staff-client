import React, { useState, useEffect } from "react";
import CategoryDataService from "../services/categoryService2";
import { Link } from "react-router-dom";

const TestList = () => {
const [tests, setTests] = useState([]);
const [currentTest, setCurrentTest] = useState(null);
const [currentIndex, setCurrentIndex] = useState(-1);
const [searchTitle, setSearchTitle] = useState("");

useEffect(() => {
    retrieveTests();
}, []);

const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
};

const retrieveTests = () => {
    CategoryDataService.getAll()
    .then(response => {
        setTests(response.data);
        console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
};

const refreshList = () => {
    retrieveTests();
    setCurrentTest(null);
    setCurrentIndex(-1);
};

const setActiveTest = (test, index) => {
    setCurrentTest(test);
    setCurrentIndex(index);
};

const removeAllTests = () => {
    CategoryDataService.removeAll()
    .then(response => {
        console.log(response.data);
        refreshList();
    })
    .catch(e => {
        console.log(e);
    });
};

const findByTitle = () => {
    CategoryDataService.findByTitle(searchTitle)
    .then(response => {
        setTests(response.data);
        console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
};

return (
    <div className="list row">
    <div className="col-md-8">
        <div className="input-group mb-3">
        <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
        />
        <div className="input-group-append">
            <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={findByTitle}
            >
            Search
            </button>
        </div>
        </div>
    </div>
    <div className="col-md-6">
        <h4>Tests List</h4>

        <ul className="list-group">
        {tests &&
            tests.map((test, index) => (
            <li
                className={
                "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTest(test, index)}
                key={index}
            >
                {test.title}
            </li>
            ))}
        </ul>

        <button
        className="m-3 btn btn-sm btn-danger"
        onClick={removeAllTests}
        >
        Remove All
        </button>
    </div>
    <div className="col-md-6">
        {currentTest ? (
        <div>
            <h4>Test</h4>
            <div>
            <label>
                <strong>Name:</strong>
            </label>{" "}
            {currentTest.name}
            </div>
            <div>
            <label>
                <strong>Description:</strong>
            </label>{" "}
            {currentTest.description}
            </div>
            <div>
            <label>
                <strong>Status:</strong>
            </label>{" "}
            {currentTest.published ? "Published" : "Pending"}
            </div>

            <Link
            to={"/test/" + currentTest.id}
            className="badge badge-warning"
            >
            Edit
            </Link>
        </div>
        ) : (
        <div>
            <br />
            <p>Please click on a Tutorial...</p>
        </div>
        )}
    </div>
    </div>
);
};

export default TestList;