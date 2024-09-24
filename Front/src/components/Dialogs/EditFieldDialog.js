import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditFieldDialog({active, setActive, field_id, field_name, fullData, setFullData, isDisabledEditDeposits, error, setError, textError, setTextError}) {
    const [field, setField] = useState("");
    
    function onSubmitField(e){
        e.preventDefault()
        if(field){
            setError(false)
        fetch(process.env.REACT_APP_API+'fields/id/'+ field_id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": field
            }) 
        }).then((res)=>{if (!res.ok)
            {
               
                if (res.status==400){
                    setTextError('Ошибка: месторождение с таким названием уже существует')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
        }
        else {
            isDisabledEditDeposits.current=true
            let isName=false;
            const newFullData=fullData.map((item)=>{
                if(!isName){
                for (let i=0; i<item.field.length; i+=1){
                    if (item.field[i].id==field_id){
                        item.field[i].name=field
                        isName=true
                        break
                    }
                }
                }
                return item
            })
            setFullData(newFullData)
            setTextError('')
            
    }
    })
}
else{
    setTextError('')
    setError(true)
}
    };

    useEffect(() => {
        setField(field_name);
    }, [field_name])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить название месторождения</DialogTitle>
                <Form name="addfield">
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            type="text"
                            id="edit_field"
                            value={field}
                            onChange={e => setField(e.target.value)}
                            />
                        </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={onSubmitField} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                <Form.Text style={{fontSize: "14px", color: "red", paddingLeft:"10px", visibility: (error ? 'visible' : 'hidden')}}>
                        Поля не могут оставаться пустыми!
                </Form.Text>
                <Form.Text style={{fontSize: "14px", color: "red", paddingLeft:"10px", marginBottom:"20px"}}>
                        {textError}
                </Form.Text>
                </Form>
            </Dialog>   
        </>
    )
}

export default EditFieldDialog;