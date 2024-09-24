import React, {useState} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddMnemonicDialog({active, setActive, param_id}) {
    const [mnemonic, setMnemonic] = useState("");

    function onSubmitMnemonic(){
        fetch(process.env.REACT_APP_API+'mnemonic/' + param_id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": mnemonic
            }) 
        })
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить мнемонику</DialogTitle>
                <Form name="addmnemonic" onSubmit={onSubmitMnemonic}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_mnemonic"
                            onChange={e => setMnemonic(e.target.value)} 
                            placeholder="Введите название мнемоники"
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

export default AddMnemonicDialog;