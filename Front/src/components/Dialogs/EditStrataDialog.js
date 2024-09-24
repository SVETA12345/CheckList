import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditStrataDialog({active, setActive, strata_id, strata_name, strata_file, strata_file_name, strataList, setStrataList}) {
    const [strata, setStrata] = useState("");
    const [selectedFile, setSelectedFile] = useState('');
    const [fileName, setFileName] = useState('');
    const onSubmitStrata = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', strata);
		formData.append('strata_file', selectedFile);
        fetch(process.env.REACT_APP_API+'strata/id/'+ strata_id + '?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json, text/html',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: formData 
        })
        .then(()=>{
            const strataNew=strataList.map((item)=>{
                if (item.id == strata_id){
                    const newItem=item
                    newItem.name=strata
                    newItem.strata_file_name=fileName
                    return newItem
                }
                return item
            })
            setStrataList(strataNew)
        })
        .catch((error)=>console.log(error))
    };

    const setNameStrata = (e) => {
        setStrata(e.target.value)
    }

    const handleFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name)
    }

    useEffect(() => {
        setStrata(strata_name);
    }, [strata_name])
    
    useEffect(()=>{
        setFileName(strata_file_name)

    }, [strata_file_name])
    

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить параметры пласта</DialogTitle>
                <Form name="editstrata" onSubmit={e => onSubmitStrata(e)}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="edit_strata">Название пласта</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_strata"
                            name="edit_strata"
                            onChange={(e) => {setNameStrata(e)}}
                            value={strata}
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
                                accept='.xlsx,.xls'
                                hidden
                                onChange={handleFile}
                            />
                        </Button>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={setActive} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default EditStrataDialog;