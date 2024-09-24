import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';
import ErrorToast from "../../components/Toasts/ErrorToast";

function EditServiceDialog({active, setActive, service_id, service_name, service_short, servicesData, setServicesData}) {
    const [service, setService] = useState("");
    const [serviceShort, setServiceShort] = useState("");
    const [error, setError] = useState(false)
    const [isErrorToast, setIsErrorToast] = useState(false)
    const [statusError, setStatusError] = useState(0)

    function onSubmitService(e){
        e.preventDefault()
        if (!!service && !!serviceShort) {
            setError(false)
            fetch(process.env.REACT_APP_API+'services/'+ service_id +'?format=json',{
                method: 'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization': "Token " + localStorage.getItem('id_token')
                },
                body: JSON.stringify({
                    "name": service,
                    "short": serviceShort
                }) 
            }).then((res)=>{
                if (!res.ok){
                    setIsErrorToast(true)
                }
                else {
                    const newFullData=servicesData.map((item)=>{
                        if (item.id==service_id){
                            item.name=service
                            item.short=serviceShort
                        }
                        return item
                    })
                    setServicesData(newFullData)
                    setActive(false)
                }
            })
        }   
        else {
            setError(true)
        }
    };
    const handleErrorToast = () => {
        setIsErrorToast(!isErrorToast);
      }
    useEffect(() => {
        setService(service_name);
        setServiceShort(service_short)
    }, [service_name, service_short])

    return (
        <>
            <ErrorToast active={isErrorToast} setActive={handleErrorToast} statusError={statusError}/>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Изменить название сервисной компании</DialogTitle>
                <Form name="editservice" onSubmit={onSubmitService}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="edit_service">Полное название</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_service"
                            onChange={e => setService(e.target.value)}
                            value={service}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit_service_short">Сокращенное название</Form.Label>
                            <Form.Control
                            type="text"
                            id="edit_service_short"
                            onChange={e => setServiceShort(e.target.value)}
                            value={serviceShort}
                            />
                            <Form.Text style={{fontSize: "14px", color: "red", visibility: (error ? 'visible' : 'hidden')}}>
                                Поля не могут оставаться пустыми!
                            </Form.Text>
                        </Form.Group>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default EditServiceDialog;