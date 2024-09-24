import React, {useEffect, useState} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import {Form} from 'react-bootstrap';
import {calc_koef} from "../../pages/checklist/Scripts";

function WitsmlDialog({active, setActive, witsml, onUpdate}) {
    const role = localStorage.getItem('role');
    const [fullness_data, setFullness_data] = useState("")
    const [curvenames, setCurvenames] = useState("")
    const [mnemodescription, setMnemodescription] = useState("")
    const [witsml_count, setKoef] = useState(null)
    const [status, setStatus] = useState(true);
    const [witsmlData, setWitsmlData] = useState({});

    const delete_all_props = (obj) => {
        setFullness_data("");
        setCurvenames("");
        setMnemodescription("");
        setKoef(null);
        for (var key in obj){
            obj[key] = ""
        }
    }

    const push_all_full = (obj) => {
        setFullness_data("Полная");
        setCurvenames("Полная");
        setMnemodescription("Полная");
        for (var key in obj){
            if (key !== "witsml_count" && key !== "status"){
                obj[key] = "Полная"
            }
        }
    }

    function updateValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'fullness_data'){
            setFullness_data(inputValue);
        }else if(inputName === 'curvenames'){
            setCurvenames(inputValue);
        }
        else if(inputName === 'mnemodescription'){
            setMnemodescription(inputValue);
        }
     }

     useEffect(() => {
        setWitsmlData({
            fullness_data: fullness_data,
            curvenames: curvenames,
            mnemodescription: mnemodescription,
            witsml_count: witsml_count,
            status: status
        })
     }, [fullness_data, curvenames, mnemodescription, status])

     useEffect(() => {
        setFullness_data(witsml.fullness_data);
        setCurvenames(witsml.curvenames);
        setMnemodescription(witsml.mnemodescription);
        setKoef(witsml.witsml_count);
        setStatus(witsml.status);
     }, [witsml])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Корректность загрузки
                    <div style={{float:"right"}}>
                    <BootstrapSwitchButton 
                        checked={status} 
                        width={150}
                        onChange={(checked) => setStatus(checked)} 
                        onlabel="Присутствует" 
                        offlabel="Отсутствует" 
                        onstyle="success" 
                        offstyle="danger" />
                    </div>
                    <br/> данных реального времени (WITSML)
                </DialogTitle>
                <DialogContent>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="fullness_data">Полнота предоставляемых данных</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="fullness_data" name="fullness_data" value={fullness_data} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="curvenames">Название кривых</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="curvenames" name="curvenames" value={curvenames} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="mnemodescription">Описание мнемоник</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="mnemodescription" name="mnemodescription" value={mnemodescription} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {delete_all_props(witsmlData); onUpdate(witsmlData); calc_koef(witsmlData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Удалить</Button>
                <Button onClick={() => {push_all_full(witsmlData); onUpdate(witsmlData); calc_koef(witsmlData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Все полные</Button>
                <Button onClick={() => {onUpdate(witsmlData); calc_koef(witsmlData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default WitsmlDialog;