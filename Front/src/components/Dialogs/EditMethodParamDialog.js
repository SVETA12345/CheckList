import React, {useState, useEffect} from 'react';

import {
    Button,
    Tooltip,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function EditMethodParamDialog({active, setActive, parametr, isDisabledEditMethod, setMethodParametrs, textError, setTextError, methodParametrs}) {
    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [curve_type, setCurve_type] = useState("");
    const [units, setUnits] = useState("");
    const [description, setDescription] = useState("");

    function onSubmitMethodParam(e){
        e.preventDefault();
        fetch(process.env.REACT_APP_API+'method_parametrs/id/' + parametr.id + '?format=json',{
            method: 'PUT',
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
            isDisabledEditMethod.current=true
            const newFullData=methodParametrs.map((item)=>{
                if (item.id==parametr.id){
                    item.name=name
                    item.abbreviation=abbreviation
                    item.curve_type=curve_type
                    item.units=units.split(' ')
                    item.description=description
                }
                return item
            })
            setMethodParametrs(newFullData)
            setTextError('')
            
    }
    })
    };

    useEffect(() => {
        if (Object.keys(parametr).length) {
            setName(parametr.name)
            setAbbreviation(parametr.abbreviation)
            setCurve_type(parametr.curve_type)
            setUnits(parametr.units.join(' '))
            setDescription(parametr.description)
        }
    }, [parametr])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="md" fullWidth>
                <DialogTitle>Редактировать параметр - {parametr.name}</DialogTitle>
                <Form name="addmethodparam">
                    <DialogContent>
                        <Form.Group>
                            <Form.Label htmlFor="name">Регистрируемый параметр</Form.Label>
                            <Form.Control
                            required
                            type="text"
                            id="name"
                            name="name"
                            value={name}
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
                            value={abbreviation}
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
                            value={curve_type}
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
                                value={units}
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
                            value={description}
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

export default EditMethodParamDialog;