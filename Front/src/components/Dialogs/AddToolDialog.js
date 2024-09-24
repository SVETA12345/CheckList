import React, {useState, useEffect} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddToolDialog({active, setActive, service_id}) {
    const constant = false;
    const [tool, setTool] = useState("");
    const [method, setMethod] = useState("");
    const [allMethodsData, setAllMethodsData]= useState([]);

    function onSubmitTool(e){
        fetch(process.env.REACT_APP_API+'service_methods/' + service_id + '/' + allMethodsData.find(item => item.name === method).id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "tool_type": tool
            }) 
        })
    };

    const getAllMethods = () => {
        fetch(process.env.REACT_APP_API+'methods/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setAllMethodsData(data);
        })
    }

    useEffect(() => {
        getAllMethods();
    }, [constant])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить инструмент</DialogTitle>
                <Form name="addtool" onSubmit={onSubmitTool}>
                    <DialogContent>
                        <Form.Group controlId="chooseMethod">
                            <Form.Label>Выберите метод</Form.Label>
                            <Form.Control required as="select" controlId="choose_method" name="choose_method" value={method} onChange={event => setMethod(event.target.value)}>
                                <option hidden disabled></option>
                                {allMethodsData.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_tool"
                            onChange={e => setTool(e.target.value)} 
                            placeholder="Введите название инструмента"
                            />
                        </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AddToolDialog;