import React, {useState} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddStrataDialog({active, setActive, field_id, strataAll, setStrataAll}) {
    const [selectedFile, setSelectedFile] = useState();
    const [fileName, setFileName] = useState("");
    const [strata, setStrata] = useState("");

    function onSubmitStrata(e){
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', strata);
        selectedFile && formData.append('strata_file', selectedFile);
        formData.append('strata_file_name', fileName);
        fetch(process.env.REACT_APP_API+'strata/' + field_id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json, text/html',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: formData 
        }).then(response=>response.json())
        .then((data)=>{
            console.log('strataAll', strataAll)
            setStrataAll([data, ...strataAll])
            setActive(false)
            setFileName('')
            setStrata('')
        })
    };

    const handleFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить пласт</DialogTitle>
                <Form name="addstrata" onSubmit={onSubmitStrata}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_strata"
                            onChange={e => setStrata(e.target.value)} 
                            placeholder="Введите название пласта"
                            />
                        </Form.Group>
                        <Button
                            variant="contained"
                            component="label"
                            style={{width:"100%", fontSize:"20px"}}
                            color={fileName ? "success" : "primary"}
                            >
                            {fileName ? fileName : "Загрузить файл"}
                            <input
                                id="add-file"
                                type="file"
                                hidden
                                accept='.xlsx,.xls'
                                onChange={handleFile}
                            />
                        </Button>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AddStrataDialog;