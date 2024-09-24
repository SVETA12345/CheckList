import React, {useState} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddFieldDialog({active, setActive, customer_id, fullData, setFullData, isDisabledAddDeposits, error, setError, textError, setTextError}) {
    const [field, setField] = useState("");
    const getCustomers = () => {
        fetch(process.env.REACT_APP_API+'full_data_customers/?format=json', { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token " + localStorage.getItem('id_token'),
         }
      }) 
        .then(response=>response.json())
        .then(data=>{
            setFullData(data);
        })
      }
    function onSubmitField(e){
        e.preventDefault()
        if (field){
            setError(false)
        fetch(process.env.REACT_APP_API+'fields/'+ customer_id +'?format=json',{
            method: 'POST',
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
                    setTextError('Ошибка: месторождение с таким именем уже существует')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
                }
        else {
            isDisabledAddDeposits.current=true
            getCustomers()
            setTextError('')
            
    }
    })
}
else{
    setTextError('')
    setError(true)
}
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Добавить месторождение</DialogTitle>
                <Form name="addfield">
                    <DialogContent>
                        <Form.Group>
                            <Form.Control
                            required
                            type="text"
                            id="add_field"
                            onChange={e => setField(e.target.value)} 
                            placeholder="Введите название месторождения"
                            />
                        </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={onSubmitField} style={{outline: "none"}}>Сохранить</Button>
                    
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

export default AddFieldDialog;