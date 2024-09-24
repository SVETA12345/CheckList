import React, { useState, useEffect } from "react";

import {
  Button, TextField, 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Tooltip,
  OutlinedInput,
  Grid,
  Card,
  CardContent
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  NotInterested as NotInterestedIcon
} from "@material-ui/icons";

import { Form, Row, Col } from "react-bootstrap";

import { calc_value_rt, calc_value_memory, calc_value_memory_azimut, calc_value_rt_azimut,  } from "../../pages/calcScripts";

import { MenuProps, petrophysic_names } from "../../pages/checklist/data";
import { styleBlueInput, styleGrayInput } from "../../pages/checklist/styles";
import { drawRow, styleControlRow } from "./scripts";

const useStyles = makeStyles({
  input: {
    color: "white", 
    fontSize: "20px"
  }
});

function FillDataDialog({
  props,
  active,
  setActive,
  methodsData,
  devicesData,
  mainData,
  row,
  secondrow,
  fullnessAct,
  service_id,
  lqc,
  onUpdate,
  onDelete,
  digitalData_type,
  full_inf_count,
  digital_count,
  data_type,
  interval_fact
}) {
  const classes = useStyles();
  const role = localStorage.getItem('role');
  const [id, setId] = useState(null);
  const [inform_for_method_id, setInform_for_method_id] = useState(null);
  const [index, setIndex] = useState(null);
  const [method, setMethod] = useState("");
  const [tool_type, setTool_type] = useState("");
  const [tool_num, setTool_num] = useState("");
  const [calibr_date, setCalibr_date] = useState(null);
  //const [start_date, setStart_date] = useState(null);
  //const [end_date, setEnd_date] = useState(null);
  const [interval_shod_start, setInterval_shod_start] = useState(null);
  const [interval_shod_end, setInterval_shod_end] = useState(null);
  const [koef_shod, setKoef_shod] = useState(null);
  const [method_value, setMethod_value] = useState(null);
  const [reason_rashod, setReason_rashod] = useState("");
  const [koef_fail, setKoef_fail] = useState(null);
  const [petrophysic_task, setPetrophysic_task] = useState(null);
  const [petrophysic_selected, setPetrophysic_selected] = useState([]);
  const [petroInformation, setPetroInformation]=useState({})
  //const [act, setAct] = useState("");
  const [linkage, setLinkage] = useState("");
  const [emissions, setEmissions] = useState("");
  const [noise, setNoise] = useState("");
  const [control, setControl] = useState("");
  const [distribute_support, setDistribute_support] = useState("");
  const [distribute_palet, setDistribute_palet] = useState("");
  const [dash, setDash] = useState("");
  const [corresponse, setCorresponse] = useState("");
  const [correlation, setCorrelation] = useState("");
  const [device_tech_condition, setDevice_tech_condition] = useState("");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (row !== undefined && Object.keys(row).length) {
      setId(row.id);
      setIndex(row.index);
      setMethod(row.method);
      setTool_type(row.tool_type);
      setTool_num(row.tool_num);
      setCalibr_date(row.calibr_date);
      //setStart_date(row.start_date);
      //setEnd_date(row.end_date);
      setInterval_shod_start(row.interval_shod_start);
      setInterval_shod_end(row.interval_shod_end);
      setKoef_shod(row.koef_shod);
      setMethod_value(row.method_value);
      setReason_rashod(row.reason_rashod);
      if (mainData.data_type === "Реального времени") {
        setReason_rashod("");
        setKoef_shod(null);
      }
      setKoef_fail(row.koef_fail);
      setPetrophysic_task(row.petrophysic_task);
      setPetrophysic_selected(row.petrophysic_selected);
    } else deleteAllLocalData();
  }, [row]);

  useEffect(() => {
    if (secondrow !== undefined && Object.keys(secondrow).length) {
      setInform_for_method_id(secondrow.inform_for_method_id);
      //setAct(secondrow.act);
      setLinkage(secondrow.linkage);
      setEmissions(secondrow.emissions);
      setNoise(secondrow.noise);
      setControl(secondrow.control);
      setDistribute_palet(secondrow.distribute_palet);
      setDistribute_support(secondrow.distribute_support);
      setDash(secondrow.dash);
      setDevice_tech_condition(secondrow.device_tech_condition);
      if (!lqc || lqc == "Не имеется")
        setDevice_tech_condition("");
      setCorresponse(secondrow.corresponse);
      setCorrelation(secondrow.correlation);
      setNotes(secondrow.notes);
    } else deleteAllLocalData();
  }, [secondrow]);

  const deleteAllLocalData = () => {
    setId(null);
    setInform_for_method_id(null);
    setIndex(null);
    setMethod("");
    setTool_type("");
    setTool_num("");
    setCalibr_date(null);
    //setStart_date(null);
    //setEnd_date(null);
    setInterval_shod_start(null);
    setInterval_shod_end(null);
    setKoef_shod(null);
    setMethod_value(null);
    setReason_rashod("");
    setKoef_fail(null);
    setPetrophysic_task(null);
    setPetrophysic_selected([]);
    //setAct("");
    setLinkage("");
    setEmissions("");
    setNoise("");
    setControl("");
    setDistribute_palet("");
    setDistribute_support("");
    setDash("");
    setDevice_tech_condition("");
    setCorresponse("");
    setCorrelation("");
    setNotes("");
  };

  const setPetrophysic = (petro_sel) => {
    var petro_koef = 0;
    setPetrophysic_selected(petro_sel);
    var petro_select = petro_sel;
    petro_select.forEach((task) => {
      if (task == "Выделение коллекторов"){
        if (petroInformation['Выделение коллекторов'] !== undefined){
          petro_koef += Number(petroInformation['Выделение коллекторов'])
        }
        else{
          petro_koef += 0.35
        }
      }
      else if (task == "Определение характера насыщения"){
        if (petroInformation["Определение характера насыщения"] !== undefined){
          petro_koef += Number(petroInformation['Определение характера насыщения'])
        }
        else{
          petro_koef += 0.25
        }
      }
      else if (task == "Определение Кп"){
        if (petroInformation["Определение Кп"] !== undefined){
          petro_koef += Number(petroInformation['Определение Кп'])
        }   
        else{
          petro_koef += 0.2
        }
      }
      else if (task == "Определение Кнг"){
        if (petroInformation["Определение Кнг"] !== undefined){
          petro_koef += Number(petroInformation['Определение Кнг'])
        }
        else{
          petro_koef += 0.1
        }
      }
      else if (task == "Литологическое расчленение"){
        if (petroInformation["Литологическое расчленение"] !== undefined){
          petro_koef += Number(petroInformation['Литологическое расчленение'])
        }
        else{
          petro_koef += 0.1
        }
      }
  })
    setPetrophysic_task(petro_koef.toFixed(2));
  };

  const getPetroInformation = () => {
    petrophysic_task === null && 
    fetch(process.env.REACT_APP_API+'petrophysics/'+ mainData.field_id + '/' + methodsData.find(item => item.name === method).id +'?format=json', { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token')
       }
    }) 
    .then(response=>response.json())
    .then(data=>{
        if (data.length !== 0) {
            var petro_select = {}
            if (data.separation_of_reservoirs !== null) petro_select["Выделение коллекторов"] = data.separation_of_reservoirs
            if (data.determination_nature_saturation !== null) petro_select["Определение характера насыщения"] = data.determination_nature_saturation
            if (data.determination_Kp !== null) petro_select["Определение Кп"] = data.determination_Kp
            if (data.determination_Kng !== null) petro_select["Определение Кнг"] = data.determination_Kng
            if (data.determination_lithotype !== null) petro_select["Литологическое расчленение"] = data.determination_lithotype
            setPetroInformation(petro_select)
        }  
    })
}
  
  const firstRow = {
    id: id,
    index: index,
    method: method,
    tool_type: tool_type,
    tool_num: tool_num,
    calibr_date: calibr_date,
    //start_date: start_date,
    //end_date: end_date,
    interval_shod_start: interval_shod_start,
    interval_shod_end: interval_shod_end,
    koef_shod: koef_shod,
    method_value: method_value,
    reason_rashod: reason_rashod,
    koef_fail: koef_fail,
    petrophysic_task: petrophysic_task,
    petrophysic_selected: petrophysic_selected,
  }

  const secondRow = {
    inform_for_method_id: inform_for_method_id,
    index: index,
    method: method,
    //act: act,
    linkage: linkage,
    emissions: emissions,
    noise: noise,
    control: control,
    distribute_palet: distribute_palet,
    distribute_support: distribute_support,
    dash: dash,
    device_tech_condition: device_tech_condition,
    corresponse: corresponse,
    correlation: correlation,
    notes: notes,
  }
  useEffect(() => {
    method !== "" && getPetroInformation()
  }, [method])

  useEffect(() => {
    setInterval_shod_start(mainData.section_interval_start)
    setInterval_shod_end(mainData.section_interval_end)
  }, [mainData])
  useEffect(() => {
    if (mainData.data_type === "Реального времени")
     if (secondRow.method.split(" ")[0] !== "Азимутальный")
        setMethod_value(parseFloat(calc_value_rt(secondRow, lqc, digitalData_type).toFixed(2)))
      else
        setMethod_value(parseFloat(calc_value_rt_azimut(secondRow, lqc, petrophysic_task).toFixed(2)))
    if (mainData.data_type === "Из памяти прибора")
      if (secondRow.method.split(" ")[0] !== "Азимутальный")
        setMethod_value(parseFloat(calc_value_memory(secondRow, lqc, koef_shod).toFixed(2)))
      else
        setMethod_value(parseFloat(calc_value_memory_azimut(secondRow, lqc, koef_shod, digitalData_type).toFixed(2)))
      }, [mainData, method, linkage, emissions, noise, control, distribute_palet, distribute_support, dash, corresponse, correlation, device_tech_condition, koef_shod])
  return (
    <>
      <Dialog open={active} onClose={setActive} maxWidth="xl" fullWidth>
        <DialogTitle style={{ backgroundColor: "#34547A", color: "white"}}>
          Заполнение информации по методу
        </DialogTitle>
        <DialogContent
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #34547A 0%, #34547A 50%, #fff 50%, #fff 100%)",
          }}
        >
          <Grid container spacing={4}>
          <Grid item xs={12}>
          <Card
                sx={{ minWidth: 275 }}
                elevation={4}
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#3F6694",
                  color: "#fff",
                }}
              >
            <CardContent style={{ paddingBottom: "0", color:"white"}}>
                <Form.Group as={Row}>
                    <Col xs="2">
                        <FormControl fullWidth variant="standard">
                            <TextField disabled inputProps={{ className: classes.input }}  id="customer" name="customer" label="Общество" variant="standard" defaultValue={mainData.customer}/>
                        </FormControl>
                    </Col>
                    <Col xs="2">
                        <FormControl fullWidth variant="standard">
                            <TextField disabled inputProps={{ className: classes.input }} id="field" name="field" label="Месторождение" variant="standard" defaultValue={mainData.field}/>
                        </FormControl>
                    </Col>
                    <Col xs="1">
                        <FormControl fullWidth variant="standard">
                            <TextField disabled inputProps={{ className: classes.input }} id="num_pad" name="num_pad" label="Куст" variant="standard" defaultValue={mainData.num_pad}/>
                        </FormControl>
                    </Col>
                    <Col xs="2">
                        <FormControl fullWidth variant="standard">
                            <TextField disabled inputProps={{ className: classes.input }} id="num_well" name="num_well" label="Скважина" variant="standard" defaultValue={mainData.num_well}/>
                        </FormControl>
                    </Col>
                    <Col xs="2">
                        <FormControl fullWidth variant="standard">
                            <TextField disabled inputProps={{ className: classes.input }} id="num_wellbore" name="num_wellbore" label="Ствол" variant="standard" defaultValue={mainData.num_wellbore}/>
                        </FormControl>
                    </Col>
                    <Form.Label column xs="3" style={{textAlign:"left", paddingTop: "1.25rem", fontSize: "22px", fontWeight:"700"}}>
                      <NotInterestedIcon style={{fontSize:"30px"}}/> долота, {mainData.diametr} мм
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs="2">
                        <FormControl fullWidth variant="outlined" size="small">
                            <TextField disabled inputProps={{ className: classes.input }} id="service" name="service" label="Сервисная компания" variant="outlined" size="small" defaultValue={mainData.service}/>
                        </FormControl>
                    </Col>
                    <Col xs="2">
                        <FormControl fullWidth variant="outlined" size="small">
                            <TextField disabled inputProps={{ className: classes.input }} id="data_type" name="data_type" label="Вид данных" variant="outlined" size="small" defaultValue={mainData.data_type}/>
                        </FormControl>
                    </Col>
                    <Form.Label column xs="3" style={{textAlign:"left", fontSize: "22px", fontWeight:"700"}}>
                      Интервал секции: {mainData.section_interval_start} - {mainData.section_interval_end} м
                    </Form.Label>
                    <Form.Label column xs="3" style={{textAlign:"left", fontSize: "22px", fontWeight:"700"}}>
                      Дата ГИС: c {mainData.start_date !== null ? mainData.start_date : "..."} по {mainData.end_date !== null ? mainData.end_date : "..."}
                    </Form.Label>
                    <Form.Label column xs="2" style={{textAlign:"right", verticalAlign:"top", fontSize: "22px", fontWeight:"700"}}>
                      Общая оценка - {method_value !== null ? method_value + "%" : "%"}
                    </Form.Label>
                </Form.Group>
            </CardContent>
        </Card>
          </Grid>
            <Grid item xs={12}>
              <Card
                sx={{ minWidth: 275 }}
                elevation={4}
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#3F6694",
                  color: "#fff",
                }}
              >
                <CardContent style={{ paddingBottom: "0", paddingTop:"1rem", fontWeight:"600" }}>
                  <Form.Group as={Row} style={{marginBottom:"1rem"}}>
                    <Form.Label column sm="4" style={{textAlign:"center", fontSize:"22px"}}>
                      Метод
                    </Form.Label>
                    <Col sm="8" style={{verticalAlign:"middle"}}>
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="method"
                        name="method"
                        as="select"
                        placeholder="Выберите значение из списка"
                        style={{backgroundColor: "#3F6694", borderColor: "#fff", color: "#fff", height:"100%", fontSize:"20px"}}
                        value={method}
                        onChange={(e) => {
                          setPetrophysic_task(null);
                          setPetrophysic_selected([]);
                          setTool_num("");
                          setTool_type("");
                          if (e.target.value.split(" ")[0] === "Азимутальный" || e.target.value.split(" ")[1] === "каверномер") {
                            setDistribute_palet("")
                            setDistribute_support("")
                            setCorresponse("")
                          }
                          setMethod(e.target.value);
                        }}
                      >
                        <option hidden disabled></option>
                        {methodsData.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{ minWidth: 275 }}
                elevation={4}
                style={{ borderRadius: "15px", height: "100%" }}
              >
                <CardContent style={{ paddingBottom: "0", fontWeight:"600" }}>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Тип прибора
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="tool_type"
                        name="tool_type"
                        as="select"
                        value={tool_type}
                        onChange={(e) => setTool_type(e.target.value)}
                      >
                        <option hidden disabled></option>
                        {devicesData.map(
                          (item) =>
                            item.method === method && (
                              <option
                                key={item.tool_type}
                                value={item.tool_type}
                              >
                                {item.tool_type}
                              </option>
                            ),
                        )}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Номер прибора
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="tool_num"
                        name="tool_num"
                        style={styleBlueInput}
                        value={tool_num}
                        onChange={(e) => setTool_num(e.target.value)}
                        type="number"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Дата калибровки прибора
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="calibr_date"
                        name="calibr_date"
                        value={calibr_date}
                        onChange={(e) => setCalibr_date(e.target.value)}
                        style={styleBlueInput}
                        type="date"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Интервал записи (факт), м
                    </Form.Label>
                    <Col sm="6">
                    <div style={{whiteSpace:"nowrap", minWidth: "100%"}}>
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="interval_shod_start"
                        name="interval_shod_start"
                        value={interval_shod_start}
                        type="number"
                        step="0.01"
                        style={{
                          display: "inline-block",
                          backgroundColor: "#6985AF",
                          color: "#fff",
                          width:"46%",
                          textAlign: "center",
                          fontWeight: "700",
                          fontSize: "18px"
                        }}
                        onChange={(e) => 
                            e.target.value === ""
                              ? setInterval_shod_start(null)
                              : setInterval_shod_start(e.target.value)
                        }
                      />
                      <div style={{ display: "inline-block" }}>
                        &ensp;&ndash;&ensp;
                      </div>
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="interval_shod_end"
                        name="interval_shod_end"
                        value={interval_shod_end}
                        type="number"
                        step="0.01"
                        style={{
                          display: "inline-block",
                          backgroundColor: "#6985AF",
                          color: "#fff",
                          width:"46%",
                          textAlign: "center",
                          fontWeight: "700",
                          fontSize: "18px"
                        }}
                        onChange={(e) =>
                          e.target.value === ""
                            ? setInterval_shod_end(null)
                            : setInterval_shod_end(e.target.value)
                        }
                      />
                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Коэффициент сходимости данных, %
                    </Form.Label>
                    <Col sm="6">
                      <Tooltip
                        title={mainData.data_type === "Из памяти прибора" ? "Значение должно быть в диапазоне от 0 до 100" : "Недоступно для ввода"}
                        arrow
                      >
                        <Form.Control
                        disabled={!((role === "user" || role === "superuser") && mainData.data_type === "Из памяти прибора")}
                          id="koef_shod"
                          name="koef_shod"
                          value={koef_shod}
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          style={mainData.data_type === "Из памяти прибора" ? styleBlueInput : styleGrayInput}
                          onChange={(e) =>
                            setKoef_shod(
                              Math.max(
                                e.target.min,
                                Math.min(e.target.max, e.target.value),
                              ) || null
                            )
                          }
                        />
                      </Tooltip>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Причина расхождения данных
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control
                      disabled={!((role === "user" || role === "superuser") && mainData.data_type === "Из памяти прибора")}
                        id="reason_rashod"
                        name="reason_rashod"
                        as="select"
                        value={reason_rashod}
                        onChange={(e) => setReason_rashod(e.target.value)}
                      >
                        <option></option>
                        <option key="1">
                          Низкая плотность данных реального времени
                        </option>
                        <option key="2">
                          Проблема с передачей данных реального времени
                        </option>
                        <option key="3">
                          Перерасчет данных из памяти прибора
                        </option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  {/*<Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Коэффициент отсутствия данных, %
                    </Form.Label>
                    <Col sm="6">
                      <Tooltip
                        title="Значение должно быть в диапазоне от 0 до 100"
                        arrow
                      >
                        <Form.Control
                        disabled={!(role === "user" || role === "superuser")}
                          id="koef_fail"
                          name="koef_fail"
                          type="number"
                          min="0"
                          max="100"
                          value={koef_fail}
                          style={styleBlueInput}
                          onChange={(e) =>
                            setKoef_fail(
                              Math.max(
                                e.target.min,
                                Math.min(e.target.max, e.target.value),
                              ),
                            )
                          }
                        />
                      </Tooltip>
                    </Col>
                        </Form.Group>*/}
                  <Form.Group as={Row}>
                    <Form.Label column sm="6">
                      Петрофизическая задача
                    </Form.Label>
                    <Col sm="6">
                      <FormControl
                        id="petrophysic_task"
                        name="petrophysic_task"
                        style={{minWidth: "100%"}}
                      >
                        <Select
                          disabled={!(role === "user" || role === "superuser")}
                          id="petrophysic_task"
                          name="petrophysic_task"
                          multiple
                          value={petrophysic_selected}
                          onChange={(e) => setPetrophysic(e.target.value)}
                          input={
                            <OutlinedInput
                              style={{ height: "38px" }}
                            />
                          }
                          renderValue={(selected) => petrophysic_task}
                          MenuProps={MenuProps}
                        >
                          {petrophysic_names.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox
                                checked={
                                  petrophysic_selected.indexOf(name) > -1
                                }
                              />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Col>
                  </Form.Group>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card
                sx={{ minWidth: 275 }}
                elevation={4}
                style={{ borderRadius: "15px", height: "100%" }}
              >
                <CardContent style={{ paddingBottom: "10px", fontWeight:"600" }}>
                  <Row style={{backgroundColor:(drawRow(linkage)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Увязка кривых ГИС по глубине
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="linkage"
                        name="linkage"
                        value={linkage}
                        as="select"
                        onChange={(e) => setLinkage(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>Выберите значение из списка</option>
                        <option key="1">Увязан</option>
                        <option key="2">Частично неувязан</option>
                        <option key="3">Неувязан</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(emissions)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Выбросы
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="emissions"
                        name="emissions"
                        value={emissions}
                        as="select"
                        onChange={(e) => setEmissions(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>Выберите значение из списка</option>
                        <option key="1">Отсутствуют</option>
                        <option key="2">Единичные</option>
                        <option key="3">Регулярные</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(noise)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Зашумленность
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="noise"
                        name="noise"
                        value={noise}
                        as="select"
                        onChange={(e) => setNoise(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>Выберите значение из списка</option>
                        <option key="1">Отсутствует</option>
                        <option key="2">Незначительная</option>
                        <option key="3">Высокая</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(control)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Контрольная запись
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="control"
                        name="control"
                        value={control}
                        as="select"
                        onChange={(e) => setControl(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>Выберите значение из списка</option>
                        <option key="1">Соответствует основному замеру</option>
                        <option key="2">Отменена по согласованию сторон</option>
                        <option key="3">
                          Не соответствует основной записи
                        </option>
                        <option key="4">Не произведена</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(distribute_support)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Распределение данных ГИС при бурении на гистограммах
                      относительно опорных скважин
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!((role === "user" || role === "superuser") && (method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер"))}
                        id="distribute_support"
                        name="distribute_support"
                        value={distribute_support}
                        as="select"
                        onChange={(e) => setDistribute_support(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoiceAzimut" hidden value>{ method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер" ? "Выберите значение из списка" : "Недоступно для ввода"}</option>
                        <option key="1">
                          Соответствует данным опорных скважин
                        </option>
                        <option key="2">
                          Занижено. Данные могут быть использованы в оценке ФЕС
                        </option>
                        <option key="3">
                          Занижено. Данные некондиционные
                        </option>
                        <option key="4">
                          Завышено. Данные могут быть использованы в оценке ФЕС
                        </option>
                        <option key="5">
                          Завышено. Данные некондиционные
                        </option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(distribute_palet)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Распределение данных ГИС при бурении на кросс-плотах
                      относительно палеток
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!((role === "user" || role === "superuser") && (method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер"))}
                        id="distribute_palet"
                        name="distribute_palet"
                        value={distribute_palet}
                        as="select"
                        onChange={(e) => setDistribute_palet(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoiceAzimut" hidden value>{ method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер" ? "Выберите значение из списка" : "Недоступно для ввода"}</option>
                        <option key="1">
                          Лежат в области ожидаемых значений
                        </option>
                        <option key="2">
                          Не лежат в области ожидаемых значений
                        </option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(dash)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Показания прибора в исследуемом разрезе
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!(role === "user" || role === "superuser")}
                        id="dash"
                        name="dash"
                        as="select"
                        value={dash}
                        onChange={(e) => setDash(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>Выберите значение из списка</option>
                        <option key="1">Соответствуют</option>
                        <option key="2">Не соответствуют</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(corresponse)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Соответствие абсолютных петрофизических значений в
                      реперных горизонтах
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                      disabled={!((role === "user" || role === "superuser") && (method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер"))}
                        id="corresponse"
                        name="corresponse"
                        as="select"
                        value={corresponse}
                        onChange={(e) => setCorresponse(e.target.value)}
                        style={styleControlRow}
                      >
                        <option key="blankChoiceAzimut" hidden value>{ method.split(" ")[0] !== "Азимутальный" && method.split(" ")[1] !== "каверномер" ? "Выберите значение из списка" : "Недоступно для ввода"}</option>
                        <option key="1">Соответствуют</option>
                        <option key="2">Занижены</option>
                        <option key="3">Завышены</option>
                        <option key="4">Реперные горизонты не вскрыты</option>
                        <option key="5">Свойства реперного горизонта отсутствуют</option>
                        <option key="6">Свойства реперного горизонта расходятся</option>
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(correlation)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Корреляция с другими методами ГИС при бурении
                    </Form.Label>
                    <Col sm="4">
                        <Form.Control
                        disabled={!(role === "user" || role === "superuser")}
                          id="correlation"
                          name="correlation"
                          as="select"
                          placeholder="Введите значение"
                          value={correlation}
                          style={styleControlRow}
                          onChange={(e) => setCorrelation(e.target.value)}
                        >
                          <option key="blankChoice" hidden value>Выберите значение из списка</option>
                          <option key="1">Коррелируют</option>
                          <option key="2">Частично коррелируют</option>
                          <option key="3">Не коррелируют</option>
                        </Form.Control>
                    </Col>
                  </Row>
                  <Row style={{backgroundColor:(drawRow(device_tech_condition)), padding:"0.5rem"}}>
                    <Form.Label column sm="8">
                      Техническое состояние прибора по кривым и флагам LQC
                    </Form.Label>
                    <Col sm="4">
                      <Form.Control
                        disabled={!((role === "user" || role === "superuser") && (lqc === "Имеется"))}
                        id="device_tech_condition"
                        name="device_tech_condition"
                        as="select"
                        value={device_tech_condition}
                        onChange={(e) =>
                          setDevice_tech_condition(e.target.value)
                        }
                        style={styleControlRow}
                      >
                        <option key="blankChoice" hidden value>{ lqc === "Имеется" ? "Выберите значение из списка" : "Недоступно для ввода"}</option>
                        <option key="1">Хорошее</option>
                        <option key="2">Удовлетворительное</option>
                        <option key="3">Неудовлетворительное</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{ minWidth: 275 }}
                elevation={4}
                style={{ borderRadius: "15px" }}
              >
                <CardContent style={{ paddingBottom: "0" }}>
                  <Form.Group>
                    <Form.Control
                    disabled={!(role === "user" || role === "superuser")}
                      id="notes"
                      name="notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Введите примечания..."
                      style={{ border: "0" }}
                    />
                  </Form.Group>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onDelete(index);
              deleteAllLocalData();
              setActive();
            }}
            style={{ outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
          >
            Удалить
          </Button>
          <Button
            onClick={() => {
              onUpdate(firstRow, secondRow);
              deleteAllLocalData();
              setActive();
            }}
            style={{ outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            disabled={method && tool_type ? false : true}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FillDataDialog;
