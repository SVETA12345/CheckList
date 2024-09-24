import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';
import {pie_wells} from "../../pages/database/data.js"

function EditWellboreDialog({active, setActive, wellbore_id, wellbore_name, pie_well, diametr, onUpdate}) {
    const [wellbore, setWellbore] = useState("");
    const [pieWell, setPieWell] = useState("");
    const [diametrEdit, setDiametrEdit] = useState(null);

    function onSubmitWellbore(e){
        e.preventDefault()
        fetch(process.env.REACT_APP_API+'wellbores/id/'+ wellbore_id + '?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_wellbore": wellbore,
                "pie_well": pieWell,
                "diametr": diametrEdit
            }) 
        })
        onUpdate();
    };

    useEffect(() => {
        setWellbore(wellbore_name);
    }, [wellbore_name])

    useEffect(() => {
        setPieWell(pie_well);
    }, [pie_well])

    useEffect(() => {
        setDiametrEdit(diametr);
    }, [diametr])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить параметры ствола</DialogTitle>
                <Form name="editwellbore" onSubmit={e => onSubmitWellbore(e)}>
                    <DialogContent>
                        <Form.Group>
                        <Form.Label htmlFor="edit_wellbore">Номер ствола</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_wellbore"
                            name="edit_wellbore"
                            onChange={e => setWellbore(e.target.value)}
                            value={wellbore}
                            />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="pie_well">Участок ствола скважины</Form.Label>
                        <Form.Control as="select" id="pie_well" name="pie_well" value={pieWell} onChange={e => setPieWell(e.target.value)}>
                            <option hidden disabled></option>
                            {pie_wells.map(item => <option key={item} value={item} style={{fontSize:"20px"}}>{item}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="diametr">Диаметр</Form.Label>
                            <Form.Control
                            type="number"
                            id="diametr"
                            name="diametr"
                            onChange={e => setDiametrEdit(e.target.value)}
                            value={diametrEdit}
                            />
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

export default EditWellboreDialog;