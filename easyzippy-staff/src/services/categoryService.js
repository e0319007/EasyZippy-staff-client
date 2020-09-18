import axios from "axios"; 

const api_url = "http://localhost:5000"

const createCategoryBackend = (name, description) => {
    return axios.post(api_url + '/category', {
        name: name,
        description: description
    })
    .then((response) => {
        console.log(response);
        
    })
}; 

const deleteCategoryBackend = (id) => {
    return axios.delete(api_url + `/category${id}`, {
        id:id
    })
    .then((response) => {
        console.log(response);
    })
    .catch(function(error) {
        console.log(error.response.data)
    })
}; 

const getAllCategoryBackend = () => {
    return axios.get(api_url + "/categories")
};

const updateCategoryBackend = (id) => {
    return axios.put(api_url + `/category/${id}`, {
        
    })
    .then((response) => {
        console.log(response);
    })
};

export default {
    createCategoryBackend,
    getAllCategoryBackend,
    updateCategoryBackend,
    deleteCategoryBackend
};