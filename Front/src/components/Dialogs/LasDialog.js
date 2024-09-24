import React, {useEffect, useState, useRef} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions,
} from "@material-ui/core";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import {Form} from 'react-bootstrap';
import {calc_koef} from "../../pages/checklist/Scripts";
import {FiUpload} from "react-icons/fi";

import "./stylesMaterial.css";

function LasDialog({active, setActive, las, onUpdate}) {
    const role = localStorage.getItem('role');
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const inputRef = useRef(null);
    const [cap, setCap] = useState("")
    const [parametres, setParametres] = useState("")
    const [mnemodescription, setMnemodescription] = useState("")
    const [tabledata, setTabledata] = useState("")
    const [las_file_count, setKoef] = useState(null)
    const [status, setStatus] = useState(true);
    const [lasData, setLasData] = useState({});


    const delete_all_props = (obj) => {
        setCap("");
        setParametres("");
        setMnemodescription("");
        setTabledata("");
        setKoef(null);
        for (var key in obj){
            obj[key] = ""
        }
    }

    const push_all_full = (obj) => {
        setCap("Полная");
        setParametres("Полная");
        setMnemodescription("Полная");
        setTabledata("Полная");
        for (var key in obj){
            if (key !== "las_file_count" && key !== "status"){
                obj[key] = "Полная"
            }
        }
    }

    function updateValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'cap'){
            setCap(inputValue);
        }
        else if(inputName === 'parametres'){
            setParametres(inputValue);
        }
        else if(inputName === 'mnemodescription'){
            setMnemodescription(inputValue);
        }
        else if(inputName === 'tabledata'){
            setTabledata(inputValue);
        }
     }

     useEffect(() => {
        setLasData({
            cap: cap,
            parametres: parametres,
            mnemodescription: mnemodescription,
            tabledata: tabledata,
            las_file_count: las_file_count,
            status: status
        })
     },[cap, parametres, mnemodescription, tabledata, status])

     useEffect(() => {
        setCap(las.cap);
        setParametres(las.parametres);
        setMnemodescription(las.mnemodescription);
        setTabledata(las.tabledata);
        setKoef(las.las_file_count);
        setStatus(las.status)
     }, [las])

      const handleUpload = () => {
        inputRef.current?.click();
      };
      const handleDisplayFileDetails = () => {
        inputRef.current?.files &&
        setUploadedFileName(inputRef.current.files[0].name);
      };

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Оформление Las-файла
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
                </DialogTitle>
                <DialogContent>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="cap">Шапка</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="cap" name="cap" value={cap} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="parametres">Параметры</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="parametres" name="parametres" value={parametres} onChange={e => updateValues(e)}>
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
                    <Form.Group>
                        <Form.Label htmlFor="tabledata">Таблица с данными</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="tabledata" name="tabledata" value={tabledata} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {delete_all_props(lasData); onUpdate(lasData); calc_koef(lasData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Удалить</Button>
                <Button onClick={() => {push_all_full(lasData); onUpdate(lasData); calc_koef(lasData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Все полные</Button>
                <Button onClick={() => {onUpdate(lasData); calc_koef(lasData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LasDialog;