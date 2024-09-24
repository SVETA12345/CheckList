import React, {useState} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddMethodDialog({active, setActive, class_item, isDisabledAddMetod, getMethods, textError, setTextError}) {
    const [method, setMethod] = useState("");

    function onSubmitMethod(e){
        e.preventDefault();
        if (method){
        fetch(process.env.REACT_APP_API+'methods/class/' + class_item.id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": method,
                "method_class_id": class_item.id
            }) 
        }).then((res)=>{if (!res.ok)
            {
                if (res.status==400){
                    setTextError('Ошибка: метод с таким именем уже существует')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
                }
        else {
            isDisabledAddMetod.current=true
            getMethods()
            setTextError('')
            
    }
    })
}
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="md" fullWidth>
                <DialogTitle>Добавить метод ГИС для класса - {class_item.name}</DialogTitle>
                <Form name="addmethod">
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_method"
                            onChange={e => setMethod(e.target.value)} 
                            placeholder="Введите название метода"
                            />
                        </Form.Group>
                        <Form.Text style={{fontSize: "14px", color: "red", paddingLeft:"10px", marginBottom:"20px"}}>
                                {textError}
                            </Form.Text>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={(e) => onSubmitMethod(e)} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AddMethodDialog;