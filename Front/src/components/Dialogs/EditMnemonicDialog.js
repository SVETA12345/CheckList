import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditMnemonicDialog({active, setActive, mnemonic_id, mnemonic_name}) {
    const [mnemonic, setMnemonic] = useState("");

    function onSubmitMnemonic(){
        fetch(process.env.REACT_APP_API+'mnemonic/id/'+ mnemonic_id +'?format=json',{
            method: 'PUT',
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

    useEffect(() => {
        setMnemonic(mnemonic_name);
    }, [mnemonic_name])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить название мнемоники</DialogTitle>
                <Form name="editmnemonic" onSubmit={onSubmitMnemonic}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            type="text"
                            id="edit_mnemonic"
                            onChange={e => setMnemonic(e.target.value)}
                            value={mnemonic}
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

export default EditMnemonicDialog;