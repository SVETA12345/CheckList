import React, {useState} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddMethodClassDialog({active, setActive, isDisabledAddClass, getMethodClasses, textError, setTextError}) {
    const [methodClass, setMethodClass] = useState("");
    
    function onSubmitMethodClass(e){
        e.preventDefault();
        if (methodClass) {
        fetch(process.env.REACT_APP_API+'method_class/?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": methodClass
            }) 
        }).then((res)=>{if (!res.ok)
            {
                if (res.status==400){
                    setTextError('Ошибка: класс с таким именем уже существует')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
                }
        else {
            isDisabledAddClass.current=true
            getMethodClasses()
            setTextError('')
            
    }
    })
}
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить класс методов ГИС</DialogTitle>
                <Form name="addmethodclass">
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_methodclass"
                            onChange={e => setMethodClass(e.target.value)} 
                            placeholder="Введите название класса методов"
                            />
                        </Form.Group>
                        <Form.Text style={{fontSize: "14px", color: "red", paddingLeft:"10px", marginBottom:"20px"}}>
                                {textError}
                            </Form.Text>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={onSubmitMethodClass} type="submit" style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AddMethodClassDialog;