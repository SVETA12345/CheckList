import React, {useState} from 'react';

import {
    Button,
    Tooltip,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function AddMethodParamDialog({active, setActive, method, isDisabledAddParam, getMethodParametrs, textError, setTextError}) {
    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [curve_type, setCurve_type] = useState("");
    const [units, setUnits] = useState("");
    const [description, setDescription] = useState("");

    function onSubmitMethodParam(e){
        e.preventDefault();
        fetch(process.env.REACT_APP_API+'method_parametrs/' + method.id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": name,
                "abbreviation": abbreviation,
                "curve_type": curve_type,
                "units": units.split(' '),
                "description": description
            }) 
        }).then((res)=>{if (!res.ok)
            {
                if (res.status==400){
                    setTextError('Ошибка: параметр с таким именем уже существует')
                }
                else{
                    setTextError(`Ошибка ${res.status}`)
                }
                }
        else {
            isDisabledAddParam.current=true
            getMethodParametrs()
            setTextError('')
            
    }
    })
    };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="md" fullWidth>
                <DialogTitle>Добавить параметр для метода - {method.name}</DialogTitle>
                <Form name="addmethodparam">
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="name">Регистрируемый параметр</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="name"
                            name="name"
                            onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="abbreviation">Сокращение на латинице</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="abbreviation"
                            name="abbreviation"
                            onChange={e => setAbbreviation(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="curve_type">Тип кривой</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="curve_type"
                            name="curve_type"
                            onChange={e => setCurve_type(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="units">Единицы измерения</Form.Label>
                            <Tooltip
                                title="Ввод значений через пробел"
                                arrow
                            >
                                <Form.Control
                                required
                                type="text"
                                id="units"
                                name="units"
                                onChange={e => setUnits(e.target.value)}
                                />
                            </Tooltip>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="description">Описание</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="description"
                            name="description"
                            onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Text style={{fontSize: "14px", color: "red", paddingLeft:"10px", marginBottom:"20px"}}>
                                {textError}
                            </Form.Text>
                    </DialogContent>
                <DialogActions>
                    <Button type="submit" style={{outline: "none"}}  onClick={onSubmitMethodParam}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AddMethodParamDialog;