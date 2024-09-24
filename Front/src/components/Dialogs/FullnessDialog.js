import React, {useState , useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';
import {calc_koef} from "../../pages/checklist/Scripts"

function FullnessDialog({active, setActive, fullness, fullnessData, setFullnessData}) {
    const role = localStorage.getItem('role');
    const [act, setAct] = useState("")
    const [titul_list, setTitul_list] = useState("")
    const [well_construction, setWell_construction] = useState("")
    const [wellbore_sizes, setWellbore_sizes] = useState("")
    const [chrono_data, setChrono_data] = useState("")
    const [sol_data, setSol_data] = useState("")
    const [dash_comp, setDash_comp] = useState("")
    const [summary_data, setSummary_data] = useState("")
    const [inklino_data, setInklino_data] = useState("")
    const [main_record, setMain_record] = useState("")
    const [parametr, setParametr] = useState("")
    const [control_record, setControl_record] = useState("")
    const [lqc, setLqc] = useState("")
    const [calibration, setCalibration] = useState("")
    const [full_inf_count, setKoef] = useState(null)

    const push_data = ()=>{
        const obj={act: act,
        titul_list: titul_list,
        well_construction: well_construction,
        wellbore_sizes: wellbore_sizes,
        chrono_data: chrono_data,
        sol_data: sol_data,
        dash_comp: dash_comp,
        summary_data: summary_data,
        inklino_data: inklino_data,
        main_record: main_record,
        parametr: parametr,
        control_record: control_record,
        lqc: lqc,
        calibration: calibration,
        full_inf_count: full_inf_count}
        const full_inf_count_new=calc_koef(obj)
        setKoef(full_inf_count_new)
    }

    const push_all_full = (obj) => {
        setAct("Имеется")
        setTitul_list("Полная")
        setWell_construction("Полная")
        setWellbore_sizes("Полная")
        setChrono_data("Полная")
        setSol_data("Полная")
        setDash_comp("Полная")
        setSummary_data("Полная")
        setInklino_data("Полная")
        setMain_record("Полная")
        setParametr("Полная")
        setControl_record("Полная")
        setLqc("Имеется")
        setCalibration("Полная")
        for (var key in obj){
            if (key !== "full_inf_count"){
                if (key !== "act"
                && key !== "lqc")
                    obj[key] = "Полная"
                else
                    obj[key] = "Имеется"
            }
        }
        const full_inf_count_new=calc_koef(obj)
        setKoef(full_inf_count_new)
    }


    const push_all_none = (obj) => {
        setAct("Не имеется")
        setTitul_list("Отсутствует")
        setWell_construction("Отсутствует")
        setWellbore_sizes("Отсутствует")
        setChrono_data("Отсутствует")
        setSol_data("Отсутствует")
        setDash_comp("Отсутствует")
        setSummary_data("Отсутствует")
        setInklino_data("Отсутствует")
        setMain_record("Отсутствует")
        setParametr("Отсутствует")
        setControl_record("Отсутствует")
        setLqc("Не имеется")
        setCalibration("Отсутствует")
        for (var key in obj){
            if (key !== "full_inf_count"){
                if (key !== "act"
                && key !== "lqc")
                    obj[key] = "Отсутствует"
                else
                    obj[key] = "Не имеется"
            }
        }
        const full_inf_count_new=calc_koef(obj)
        setKoef(full_inf_count_new)
    }

    function updateValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'titul_list'){
            setTitul_list(inputValue);
        }else if(inputName === 'well_construction'){
            setWell_construction(inputValue);
        }
        else if(inputName === 'welbore_sizes'){
            setWellbore_sizes(inputValue);
        }
        else if(inputName === 'chrono_data'){
            setChrono_data(inputValue);
        }
        else if(inputName === 'sol_data'){
            setSol_data(inputValue);
        }
        else if(inputName === 'dash_comp'){
            setDash_comp(inputValue);
        }
        else if(inputName === 'summary_data'){
            setSummary_data(inputValue);
        }
        else if(inputName === 'inklino_data'){
            setInklino_data(inputValue);
        }
        else if(inputName === 'main_record'){
            setMain_record(inputValue);
        }
        else if(inputName === 'parametr'){
            setParametr(inputValue);
        }
        else if(inputName === 'control_record'){
            setControl_record(inputValue);
        }
        else if(inputName === 'lqc'){
            setLqc(inputValue);
        }
        else if(inputName === 'calibration'){
            setCalibration(inputValue);
        }
        else if(inputName === 'act'){
            setAct(inputValue);
        }
     }

     useEffect(() => {

        setFullnessData({
            act: act,
            titul_list: titul_list,
            well_construction: well_construction,
            wellbore_sizes: wellbore_sizes,
            chrono_data: chrono_data,
            sol_data: sol_data,
            dash_comp: dash_comp,
            summary_data: summary_data,
            inklino_data: inklino_data,
            main_record: main_record,
            parametr: parametr,
            control_record: control_record,
            lqc: lqc,
            calibration: calibration,
            full_inf_count: full_inf_count
        });
     }, [full_inf_count])
     useEffect(()=>{
        setAct(fullnessData.act)
        setTitul_list(fullnessData.titul_list)
        setWell_construction(fullnessData.well_construction)
        setWellbore_sizes(fullnessData.wellbore_sizes)
        setChrono_data(fullnessData.chrono_data)
        setSol_data(fullnessData.sol_data)
        setDash_comp(fullnessData.dash_comp)
        setSummary_data(fullnessData.summary_data)
        setInklino_data(fullnessData.inklino_data)
        setMain_record(fullnessData.main_record)
        setParametr(fullnessData.parametr)
        setControl_record(fullnessData.control_record)
        setLqc(fullnessData.lqc)
        setCalibration(fullnessData.calibration)
     }, [setActive])
    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="sm" fullWidth>
                <DialogTitle>Полнота предоставления данных на планшете</DialogTitle>
                <DialogContent>
                    <Form>
                        <Form.Group>
                        <Form.Label htmlFor="act">Акт промера бурового инструмента с указанием длины свечей и порядка их спуска</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="act" name="act" value={act} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Имеется</option>
                            <option>Не имеется</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="titul_list">Титульный лист</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="titul_list" name="titul_list" value={titul_list} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="well_construction">Конструкция скважины</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="well_construction" name="well_construction" value={well_construction} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="welbore_sizes">Размеры ствола/колонны/НКТ</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="welbore_sizes" name="welbore_sizes" value={wellbore_sizes} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="chrono_data">Хронология, сводные данные по скважине</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="chrono_data" name="chrono_data" value={chrono_data} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="sol_data">Данные по буровому раствору</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="sol_data" name="sol_data" value={sol_data} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="dash_comp">Компоновка приборов и примечания</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="dash_comp" name="dash_comp" value={dash_comp} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="summary_data">Сводные данные контроля глубины</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="summary_data" name="summary_data" value={summary_data} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="inklino_data">Данные инклинометрии</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="inklino_data" name="inklino_data" value={inklino_data} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="main_record">Основная запись</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="main_record" name="main_record" value={main_record} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="parametr">Параметры обработки данных и параметры приборов</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="parametr" name="parametr" value={parametr} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="control_record">Контрольная запись</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="control_record" name="control_record" value={control_record} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="lqc">LQC планшеты</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="lqc" name="lqc" value={lqc} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Имеется</option>
                            <option>Не имеется</option>
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label htmlFor="calibration">Калибровка приборов</Form.Label>
                        <Form.Control disabled={!(role === "user" || role === "superuser")} as="select" id="calibration" name="calibration" value={calibration} onChange={e => updateValues(e)}>
                            <option></option>
                            <option>Полная</option>
                            <option>Частичная</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                        </Form.Group>
                    </Form>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {push_all_none(fullnessData);setActive() }} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Все отсутствует</Button>
                <Button onClick={() => {push_all_full(fullnessData); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Все полные</Button>
                <Button onClick={() => { push_data(); setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FullnessDialog;