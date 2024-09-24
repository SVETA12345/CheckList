import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditCustomerDialog({active, setActive, customer_id, customer_name, customer_short, fullData, setFullData, isDisabledEditCustomer, error, setError, textError, setTextError}) {
    const [customer, setCustomer] = useState("");
    const [customerShort, setCustomerShort] = useState("");
    const [isDisabled, setIsDisabled]=useState(false)
    function onSubmitCustomer(e){
        e.preventDefault()
        if (!!customer && !!customerShort) {
            setError(false)
            fetch(process.env.REACT_APP_API+'customers/'+ customer_id +'?format=json',{
                method: 'PUT',
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
                isDisabledEditCustomer.current=true
                const newFullData=fullData.map((item)=>{
                    if (item.id==customer_id){
                        item.name=customer
                        item.short=customerShort
                    }
                    return item
                })
                setIsDisabled(true)
                setFullData(newFullData)
                setTextError('')
                
        }
        })
        }   
        else {
            setTextError('')
            setError(true)
        }
    };

    useEffect(() => {
        setCustomer(customer_name);
        setCustomerShort(customer_short);
    }, [customer_name, customer_short])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить название общества</DialogTitle>
                <Form name="editcustomer">
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="edit_customer">Полное название</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_customer"
                            value={customer}
                            onChange={e => setCustomer(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit_customer_short">Сокращенное название</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_customer_short"
                            value={customerShort}
                            onChange={e => setCustomerShort(e.target.value)} 
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

export default EditCustomerDialog;