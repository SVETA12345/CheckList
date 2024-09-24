import React, {useState} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddServiceDialog({active, setActive}) {
    const [service, setService] = useState("");
    const [serviceShort, setServiceShort] = useState("");

    function onSubmitService(){
        fetch(process.env.REACT_APP_API+'services/?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": service,
                "short": serviceShort
            }) 
        })
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить сервисную компанию</DialogTitle>
                <Form name="addservice" onSubmit={onSubmitService}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="add_service">Полное название</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="add_service"
                            value={service}
                            onChange={e => setService(e.target.value)} 
                            placeholder="Введите полное название"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add_service_short">Сокращенное название</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="add_service_short"
                            value={serviceShort}
                            onChange={e => setServiceShort(e.target.value)} 
                            placeholder="Введите сокращенное название"
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

export default AddServiceDialog;