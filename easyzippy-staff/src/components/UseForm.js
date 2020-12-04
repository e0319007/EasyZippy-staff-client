import React, { useState } from 'react'

export function UseForm(initialValues) {

    const [values, setValues] = useState(initialValues);

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues ({
            ...values,
            [name]: value
        })
       
    }

    const resetForm = () => {
        setValues(initialValues);
   
    }

    return {
        values, 
        setValues,
        handleInputChange,
        resetForm
    }
}


export function Form(props) { 
    const { children, ...other } = props
    return (
        <form {...other}>
            {props.children}
        </form>
    )
}

