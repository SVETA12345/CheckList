import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';
import {well_types} from "../../pages/database/data.js"

function EditWellDialog({active, setActive, well_id, well_name, well_type, num_pad, onUpdate}) {
    const [well, setWell] = useState("");
    const [wellType, setWellType] = useState("");

    function onSubmitWell(e){
        e.preventDefault()
        fetch(process.env.REACT_APP_API+'wells/id/'+ well_id + '?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_well": well,
                "well_type": wellType,
                "num_pad": num_pad
            }) 
        })
        onUpdate();
    };

    useEffect(() => {
        setWell(well_name);
    }, [well_name])

    useEffect(() => {
        setWellType(well_type);
    }, [well_type])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить параметры скважины</DialogTitle>
                <Form name="editwell" onSubmit={e => onSubmitWell(e)}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="edit_well">Номер скважины</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_well"
                            name="edit_well"
                            onChange={e => setWell(e.target.value)}
                            value={well}
                            />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="well_type">Тип скважины</Form.Label>
                        <Form.Control as="select" id="well_type" name="well_type" value={wellType} onChange={e => setWellType(e.target.value)}>
                            <option hidden disabled></option>
                            {well_types.map(item => <option key={item} value={item} style={{fontSize:"20px"}}>{item}</option>)}
                        </Form.Control>
                    </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={setActive} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default EditWellDialog;