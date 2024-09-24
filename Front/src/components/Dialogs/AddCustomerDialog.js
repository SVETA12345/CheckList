import React, {useState, useEffect} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";
import {Form} from 'react-bootstrap';

function AddCustomerDialog({active, setActive, setFullData, isDisabledAddCustomer, error, setError, textError, setTextError}) {
    const [customer, setCustomer] = useState("");
    const [customerShort, setCustomerShort] = useState("");
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
    function onSubmitCustomer(e){
        e.preventDefault()
        if(customer && customerShort){
            setError(false) 
        fetch(process.env.REACT_APP_API+'customers/?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": customer,
                "short": customerShort
            }) 
        }).then((res)=>{if (!res.ok)
            {
                if (res.status==400){
                    setTextError('Ошибка: сокращённое или полное название совпадает с названием другого общества')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
        }
        else {
            isDisabledAddCustomer.current=true
            getCustomers()
            setTextError('')
            setCustomer('');
            setCustomerShort('')
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
                <DialogTitle>Добавить общество группы</DialogTitle>
                <Form name="addcustomer">
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="add_customer">Полное название</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="add_customer"
                            value={customer}
                            onChange={e => setCustomer(e.target.value)} 
                            placeholder="Введите полное название общества"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add_customer_short">Сокращенное название</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="add_customer_short"
                            value={customerShort}
                            onChange={e => setCustomerShort(e.target.value)} 
                            placeholder="Введите сокращенное название общества"
                            />
                            <Form.Text style={{fontSize: "14px", color: "red", visibility: (error ? 'visible' : 'hidden')}}>
                                Поля не могут оставаться пустыми!
                            </Form.Text>
                            <Form.Text style={{fontSize: "14px", color: "red", margin: "0 auto"}}>
                                {textError}
                            </Form.Text>
                        </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={onSubmitCustomer} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog> 
       
        </>
    )
}

export default AddCustomerDialog;