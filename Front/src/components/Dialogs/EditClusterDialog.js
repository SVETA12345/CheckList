import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditClusterDialog({active, setActive, cluster_id, cluster_name, onUpdate}) {
    const [cluster, setCluster] = useState("");

    function onSubmitCluster(e){
        e.preventDefault()
        fetch(process.env.REACT_APP_API+'clusters/id/'+ cluster_id + '?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": cluster
            }) 
        })
        onUpdate();
    };

    useEffect(() => {
        setCluster(cluster_name);
    }, [cluster_name])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить название куста</DialogTitle>
                <Form name="editcluster" onSubmit={e => onSubmitCluster(e)}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="edit_cluster">Номер куста</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_cluster"
                            name="edit_cluster"
                            onChange={e => setCluster(e.target.value)}
                            value={cluster}
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

export default EditClusterDialog;