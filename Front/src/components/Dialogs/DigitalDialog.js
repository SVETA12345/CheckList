import React, {useEffect, useState} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import ToggleButtonSizes from '../Buttons/ToggleButtonSizes/ToggleButtonSizes'
import {Form} from 'react-bootstrap';
import {calc_koef} from "../../pages/checklist/Scripts";

function DigitalDialog({active, setActive, digital, digitalData, setDigitalData}) {
    const role = localStorage.getItem('role');
    const [wellLas, setWellLas] = useState("")
    const [parameteresLas, setParameteresLas] = useState("")
    const [curveLas, setCurveLas] = useState("")
    const [log_dataLas, setLog_dataLas] = useState("")
    const [type, setType]=useState("")
    const [wellWitsml, setWellWitsml] = useState("")
    const [parameteresWitsml, setParameteresWitsml] = useState("")
    const [curveWitsml, setCurveWitsml] = useState("")
    const [log_dataWitsml, setLog_dataWitsml] = useState("")
    const [digital_count, setKoef] = useState(null)
    const [data_status, setData_status] = useState("");
    const [alignment, setAlignment] = React.useState('left');
    const [correctness_dataWitsml, setCorrectness_dataWitsml]=useState("");
    const delete_all_props = (obj) => {
        setWellLas("");
        setParameteresLas("");
        setCurveLas("");
        setLog_dataLas("")
        setWellWitsml("");
        setParameteresWitsml("");
        setCurveWitsml("");
        setLog_dataWitsml("")
        setCorrectness_dataWitsml("")
        setKoef(null);
        for (var key in obj){
            if (key !== "type")
                obj[key] = ""
        }
        const newDig={
            type: type,
            wellLas: "",
            parameteresLas: "",
            curveLas: "",
            log_dataLas: "",
            wellWitsml: "",
            parameteresWitsml: "",
            curveWitsml: "",
            log_dataWitsml: "",
            correctness_dataWitsml:"", 
            digital_count: 0
        }
        setDigitalData(newDig)
    }

    const push_all_full = (obj) => {
        let newDig={}
        if (alignment === "left"){
            setWellLas("Полная");
            setParameteresLas("Полная");
            setCurveLas("Полная");
            setLog_dataLas("Полная")
            newDig={
                type:"LAS",
                wellLas: "Полная",
                parameteresLas: "Полная",
                curveLas: "Полная",
                log_dataLas: "Полная",
                wellWitsml: "",
                parameteresWitsml: "",
                curveWitsml: "",
                log_dataWitsml: "",
                correctness_dataWitsml:""
            }
        }
        else if (alignment === "center"){
            setWellWitsml("Полная");
            setParameteresWitsml("Полная");
            setCurveWitsml("Полная");
            setLog_dataWitsml("Полная")
            setCorrectness_dataWitsml("Полная")
            newDig={
                type:"WITSML",
                wellLas: "",
                parameteresLas: "",
                curveLas: "",
                log_dataLas: "",
                wellWitsml: "Полная",
                parameteresWitsml: "Полная",
                curveWitsml: "Полная",
                log_dataWitsml: "Полная", 
                correctness_dataWitsml: "Полная"
            }
        }
        else{
            setWellLas("Полная");
            setParameteresLas("Полная");
            setCurveLas("Полная");
            setLog_dataLas("Полная")
            setWellWitsml("Полная");
            setParameteresWitsml("Полная");
            setCurveWitsml("Полная");
            setLog_dataWitsml("Полная")
            setCorrectness_dataWitsml("Полная")
            newDig={
                type:"LAS+WITSML",
                wellLas: "Полная",
                parameteresLas: "Полная",
                curveLas: "Полная",
                log_dataLas: "Полная",
                wellWitsml: "Полная",
                parameteresWitsml: "Полная",
                curveWitsml: "Полная",
                log_dataWitsml: "Полная",
                correctness_dataWitsml:"Полная"
            }
        }
        newDig.digital_count=calc_koef(newDig)
        setDigitalData(newDig)
    }
    function onUpdate(){
        
        const newDig={
            type:type,
            wellLas: wellLas,
            parameteresLas: parameteresLas,
            curveLas: curveLas,
            log_dataLas: log_dataLas,
            wellWitsml: wellWitsml,
            parameteresWitsml: parameteresWitsml,
            curveWitsml: curveWitsml,
            log_dataWitsml: log_dataWitsml,
            correctness_dataWitsml:correctness_dataWitsml
        }
        newDig.digital_count=calc_koef(newDig)
        setDigitalData(newDig)
    }
    function updateValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'wellLas'){
            setWellLas(inputValue);
        }
        else if(inputName === 'parameteresLas'){
            setParameteresLas(inputValue);
        }
        else if(inputName === 'curveLas'){
            setCurveLas(inputValue);
        }
        else if(inputName === 'log_dataLas'){
            setLog_dataLas(inputValue);
        }
        else if(inputName === 'wellWitsml'){
            setWellWitsml(inputValue)
        }
        else if (inputName === 'parameteresWitsml'){
            setParameteresWitsml(inputValue);
        }
        else if (inputName === 'curveWitsml'){
            setCurveWitsml(inputValue);
        }
        else if (inputName === 'log_dataWitsml'){
            setLog_dataWitsml(inputValue);
        }
        else if (inputName === 'correctness_dataWitsml'){
            setCorrectness_dataWitsml(inputValue);
        }
     }
     useEffect(() => {
         
            setWellLas("");
            setParameteresLas("");
            setCurveLas("");
            setLog_dataLas("")
            setWellWitsml("");
            setParameteresWitsml("");
            setCurveWitsml("");
            setLog_dataWitsml("")
        setCorrectness_dataWitsml("")

        if(alignment=='left'){
            setType(
                "LAS",
            )
        }
        else if (alignment=='center'){
            setType(
                "WITSML",
            )
        }
        else{
            setType(
                "LAS+WITSML",
            )
        }
     }, [alignment])
     
     useEffect(()=>{
        if(digitalData.type=='LAS'){
            setAlignment(
                "left",
            )
        }
        else if (digitalData.type=='WITSML'){
            setAlignment(
                "center",
            )
        }
        else{
            setAlignment(
                "right",
            )
        }
        setWellLas(digitalData.wellLas)
        setParameteresLas(digitalData.parameteresLas)
        setCurveLas(digitalData.curveLas)
        setLog_dataLas(digitalData.log_dataLas)
        setType(digitalData.type)
        setWellWitsml(digitalData.wellWitsml)
        setParameteresWitsml(digitalData.parameteresWitsml)
        setCurveWitsml(digitalData.curveWitsml)
        setLog_dataWitsml(digitalData.log_dataWitsml)
        setCorrectness_dataWitsml(digitalData.correctness_dataWitsml)
     }, [setActive])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Полнота предоставления
                    <div style={{float:"right"}}>
                    <ToggleButtonSizes 
                        alignment={alignment}
                        setAlignment={setAlignment}
                        />
                    </div>
                    <br/> цифровых данных
                </DialogTitle>
                <DialogContent>
                <Form>
                    <p style={{fontWeight:"700"}}>Параметры LAS</p>
                    <Form.Group>
                        <Form.Label htmlFor="wellLas">Секция «Well»</Form.Label>
                        <Form.Control disabled={!(alignment === "left" || alignment === "right")} as="select" id="wellLas" name="wellLas" value={wellLas} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="parameteresLas">Секция «Parameters»</Form.Label>
                        <Form.Control disabled={!(alignment === "left" || alignment === "right")} as="select" id="parameteresLas" name="parameteresLas" value={parameteresLas} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="curveLas">Секция «Curve»</Form.Label>
                        <Form.Control disabled={!(alignment === "left" || alignment === "right")} as="select" id="curveLas" name="curveLas" value={curveLas} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="log_dataLas">Секция «Log data»</Form.Label>
                        <Form.Control disabled={!(alignment === "left" || alignment === "right")} as="select" id="log_dataLas" name="log_dataLas" value={log_dataLas} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <p style={{marginTop:"30px", fontWeight:"700"}}>Параметры WITSML</p>
                    <Form.Group>
                        <Form.Label htmlFor="well">Секция «Well»</Form.Label>
                        <Form.Control disabled={!(alignment === "center" || alignment === "right")} as="select" id="well" name="wellWitsml" value={wellWitsml} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="parameteres">Секция «Parameters»</Form.Label>
                        <Form.Control disabled={!(alignment === "center" || alignment === "right")} as="select" id="parameteres" name="parameteresWitsml" value={parameteresWitsml} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="curve">Секция «Curve»</Form.Label>
                        <Form.Control disabled={!(alignment === "center" || alignment === "right")} as="select" id="curve" name="curveWitsml" value={curveWitsml} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="log_data">Секция «Log data»</Form.Label>
                        <Form.Control disabled={!(alignment === "center" || alignment === "right")} as="select" id="log_data" name="log_dataWitsml" value={log_dataWitsml} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="correctness_dataWitsml">Корректность загрузки данных на сервер WITSML</Form.Label>
                        <Form.Control disabled={!(alignment === "center" || alignment === "right")} as="select" id="correctness_dataWitsml" name="correctness_dataWitsml" value={correctness_dataWitsml} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {delete_all_props(digitalData);setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Удалить</Button>
                <Button onClick={() => {push_all_full(digitalData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Все полные</Button>
                <Button onClick={() => {onUpdate(); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DigitalDialog;