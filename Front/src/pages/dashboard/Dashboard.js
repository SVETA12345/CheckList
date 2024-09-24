import React, { useRef, useState, useEffect } from "react";
import { styleCell, styleInput, styleSelect, styleTextfield, styleBlueInput } from "./styles";
import { Col, Form, Row } from 'react-bootstrap';
import {
  Grid,
  ListItemText,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  TextField,
  Input,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  BarChart,
  Legend,
  Tooltip,
  Bar,
  Pie,
  Cell,
  YAxis,
  XAxis,
  LabelList
} from "recharts";
import { useHistory } from "react-router";

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle";
import CustomBarChart from "./components/CustomChart/CustomBarChart";
import EscortBarChart from "./components/CustomChart/EscortBarChart";
import OperationsBarChart from "./components/CustomChart/OperationsBarChart"
import SocietyBarChart from "./components/CustomChart/SocietyBarChart"
import ControlBarChart from "./components/CustomChart/ControlBarChart"
import ServicesBarChart from "./components/CustomChart/ServicesBarChart"
import Loading from "../../components/Loading/Loading";
import SuccessToast from "../../components/Toasts/SuccessToast";
import ErrorToast from "../../components/Toasts/ErrorToast";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {font} from './Arial'

const months = [
  "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
]

export default function Dashboard(props) {
  // для pdf файла
  const chartRefPlan = useRef();
  const chartRefEscort = useRef();
  const chartRefOperations = useRef();
  const chartRefSociety = useRef();
  const chartRefControl = useRef();
  const chartRefServices = useRef()
  const refFilterCard = useRef();
  var classes = useStyles()
  var theme = useTheme()
  const [inputFile, setInputFile] = useState('')
  const history = useHistory()
  const constant = false
  const [customersData, setCustomersData] = useState([]);
  const [dataPlan, setDataPlan] = useState([])
  let [isLoading, setIsLoading] = useState(true);
  const [listNakopPlan, setListNakopPlan] = useState([])
  const [listNakopFact, setListNakopFact] = useState([])
  const [monthsNakopPlan, setMonthsNakopPlan] = useState([])
  const [plan, setPlan] = useState([])
  const [fact, setFact] = useState([])
  const [dataOperations, setDataOperations]=useState({
    countWells:[],
    years:[]
  });
  const [stringYears, setStringYears] = useState('')
  const [servicesData, setServicesData] = useState([]);
  const [filterDataBisnes, setFilterDataBisnes]=useState({
    data_start:null,
    data_end:null,
    customer:[],
    service_company:[],
    wellbore:"",
    accompaniment_type:[],
    status_wellbore:[],
    well_operation:false
  })
  const [dataSociety, setDataSociety]=useState({
    "ООО «РН-Юганскнефтегаз»":[],
    "ООО «РН-Пурнефтегаз»": [],
    "АО «Тюменнефтегаз»": [],
    "АО «РОСПАН ИНТЕРНЕШНЛ»":[],
    "АО «Верхнечонскнефтегаз»":[],
    "АО «Сибнефтегаз»":[],
    "АО «НК «Конданефть»":[],
    'ООО "АнгараНефть"': [],
    "АО «Востсибнефтегаз»":[]
  })
  const [monthSociety, setMonthSociety]=useState([])
  const [dataEscort, setdataEscort]=useState({
    dataAroundClock:[],
    dataTZ:[],
    month:[]
  })
  const [dataControl, setDataControl] = useState({
    detaineesWell: [],
    completedWell: [],
    month:[]
  })
  // local
  const [isLoadingGrafik, setIsLoadingGrafik]=useState(false)
  const [filterStvol, setFilterStvol]=useState('')
  const escort=[{name:'Круглосуточно'}, {name:'ТЗ'}]
  const statusWell=[{name:'Должна начаться'}, {name:'В бурении'}, {name:'В ожидании'}, {name:'Добурена'}, {name:'Отчёт отправлен'}, {name:'Отличные качества ГИС'}, {name:'Особенности литологии'}, {name:'Особенности ГИС'}, {name:'Специальные методы ГИС'}, {name:'Сопровождалась с WITSML'}, {name:'Проблема с данными'}, {name:'Отсутствие данных'}, {name:'КПД<1'}]
  const [isSuccessToast, setIsSuccessToast] = useState(false)
  const [isErrorToast, setIsErrorToast] = useState(false)
  const [statusError, setStatusError] = useState(0)
  const [saveGrapfiks, setSaveGrapfiks] = useState({
    bisnesPlan: true,
    escort: true,
    operation: true,
    society: true,
    control:true,
    services: true
  })
  //данные для грвфика 
  const [dataServices, setDataServices] = useState({
    services:{},
    month:[]
  })

  const getCustomers = () => {
    fetch(process.env.REACT_APP_API+'customers/?format=json', { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token')
       }
    }) 
    .then(response=>response.json())
    .then(data=>{
        setCustomersData(data);
        setIsLoading(false)
    })
}
const getServices = () => {
  fetch(process.env.REACT_APP_API+'services/?format=json', { headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Token " + localStorage.getItem('id_token')
     }
  }) 
  .then(response=>response.json())
  .then(data=>{
      setServicesData(data);
  })
}

  const updatebisnesFile=(data)=>{
    setIsLoadingGrafik(false)
    setDataPlan(data)
    const years = new Set()
    let newstringYears = ''
    const newListNakopPlan = [];
    const newMonthsNakopPlan = [];
    const newListNakopFact = [];
    const newListAroundClock=[]
    const newMonthsAroundClock=[]
    const newOperations=[]
    const newListTZ=[]
    const newFact = [];
    const newPlan = [];
    const newYears=[]
    const newSociety={}
    const newMonthSociety=[]
    const newDetaineesWell=[]
    const newService = {}
    for (let i = 0; i < data['бизнес-план']['Накопл. План'].length; i += 1) {
      newListNakopPlan.push(data['бизнес-план']['Накопл. План'][i].obj)
      years.add(data['бизнес-план']['Накопл. План'][i].year)
      newMonthsNakopPlan.push(months[data['бизнес-план']['Накопл. План'][i].month - 1])
    }
    for (let i = 0; i < data['бизнес-план']['Накопл. Факт'].length; i += 1) {
      newListNakopFact.push(data['бизнес-план']['Накопл. Факт'][i].obj)
    }
    for (let i = 0; i < data['бизнес-план']['Факт'].length; i += 1) {
      newFact.push(data['бизнес-план']['Факт'][i].obj)
      newDetaineesWell.push(data['бизнес-план']['План'][i].obj-data['бизнес-план']['Факт'][i].obj)
    }
    for (let i = 0; i < data['бизнес-план']['План'].length; i += 1) {
      newPlan.push(data['бизнес-план']['План'][i].obj)
    }
    for (let i = 0; i < data['секции по месяцам']['Круглосуточно'].length; i += 1) {
      newListAroundClock.push(data['секции по месяцам']['Круглосуточно'][i].obj)
      newMonthsAroundClock.push(months[data['секции по месяцам']['Круглосуточно'][i].month - 1])
    }
    for (let i = 0; i < data['секции по месяцам']['Т3'].length; i += 1) {
      newListTZ.push(data['секции по месяцам']['Т3'][i].obj)
    }
    for (let i = 0; i < data['скважинные операции'].length; i += 1) {
      newOperations.push(data['скважинные операции'][i].obj)
      newYears.push(data['скважинные операции'][i].year)
    }
    for (let j = 0; j < data['скважины по обществу'].length; j += 1) {
      const keys = Object.keys(data['скважины по обществу'][j].obj)
      newMonthSociety.push(months[data['скважины по обществу'][j].month - 1])
      for (var i = 0, l = keys.length; i < l; i++){
        if (typeof newSociety[keys[i]] !== "undefined"){
          newSociety[keys[i]].push(data['скважины по обществу'][j].obj[keys[i]])
        }
        else{
          newSociety[keys[i]]=[data['скважины по обществу'][j].obj[keys[i]]]
        }
      }
    }
    for (let j = 0; j < data['скважины по сервису'].length; j += 1) {
      const keys = Object.keys(data['скважины по сервису'][j].obj)
      for (var i = 0, l = keys.length; i < l; i++){
        if (typeof newService[keys[i]] !== "undefined"){
          newService[keys[i]].push(data['скважины по сервису'][j].obj[keys[i]])
        }
        else{
          newService[keys[i]]=[data['скважины по сервису'][j].obj[keys[i]]]
        }
      }
    }
    setDataServices({
      services: newService,
      month: newMonthSociety
    })
    setMonthSociety(newMonthSociety)
    setDataSociety(newSociety)
    setDataOperations({
      countWells:newOperations,
      years:newYears
    });
    setdataEscort({
      dataAroundClock:newListAroundClock,
      dataTZ:newListTZ,
      month:newMonthsAroundClock
    })
    years.forEach(function (value1) {
      newstringYears = newstringYears + value1.toString() + 'г. '
    })
    setDataControl({
      detaineesWell: newDetaineesWell,
      completedWell: newFact,
      month:newMonthsAroundClock
    })
    setStringYears(newstringYears)
    setPlan(newPlan)
    setFact(newFact)
    setListNakopFact(newListNakopFact)
    setMonthsNakopPlan(newMonthsNakopPlan)
    setListNakopPlan(newListNakopPlan)
  }
  
  const get_percent_well = async () => {
    await fetch(process.env.REACT_APP_API+'dashboard/?format=json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token')
      }
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false)
        updatebisnesFile(data)
      })
  }

  const postFilterBisnesPlan = async (filterBisness)=>{
    setIsLoadingGrafik(true)
    await fetch(process.env.REACT_APP_API+'dashboard/?format=json', { headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Token " + localStorage.getItem('id_token')
     },
     method: "POST",
    body: JSON.stringify({filterBisness}),
  }) 
  .then(response=>response.json())
  .then((data)=>{
    updatebisnesFile(data)
  })
  }
  
  const postFileBisnes= async (data) => {
    setIsLoadingGrafik(true)
    await fetch(process.env.REACT_APP_API + 'plan/upload_excel', { headers : { 
      'Authorization': "Token " + localStorage.getItem('id_token')
     },
     method: "POST",
    body: data,
  }) 
  .then(response=>{
    if(!response.ok) {setStatusError(response.status); setIsErrorToast(true)}
    else {setIsSuccessToast(true);}
    get_percent_well()
  })
  .catch(error=>{
      console.log(error)
  })
  }
  
  const OnSumbitFileBisnes = (event) => {
    event.preventDefault();
    const myData = new FormData();
    myData.append('plan', event.target.files[0]);
    
    postFileBisnes(myData)
    setInputFile('')
  };

  //обнавление чекбоксов в карточке сохранения pdf
  function updateValuesPdf(e){
    var inputName = e.target.name;
    const newSaveGrapfiks= saveGrapfiks
    if(inputName === 'bisnes_plan_pdf'){
      newSaveGrapfiks.bisnesPlan=!newSaveGrapfiks.bisnesPlan
    }
    else if(inputName === 'escort_pdf'){
      newSaveGrapfiks.escort=!newSaveGrapfiks.escort
    }
    else if(inputName === 'operation_pdf'){
      newSaveGrapfiks.operation=!newSaveGrapfiks.operation
    }
    else if(inputName === 'society_pdf'){
      newSaveGrapfiks.society=!newSaveGrapfiks.society
    }
    else if(inputName === 'control_pdf'){
      newSaveGrapfiks.control=!newSaveGrapfiks.control
    }
    else if(inputName === 'servises_pdf'){
      newSaveGrapfiks.services=!newSaveGrapfiks.services
    }
    setSaveGrapfiks(newSaveGrapfiks)
  }

  function updateBaseValues(e){
    var inputName = e.target.name;
    var inputValue = e.target.value;
    const newFilterDataBisnes=filterDataBisnes
    if(inputName === 'end_date'){
      newFilterDataBisnes.data_end=inputValue
    }
    else if(inputName === 'start_date'){
      newFilterDataBisnes.data_start=inputValue
    }
    else if (inputName==='customers_select'){
      newFilterDataBisnes.customer=inputValue
    }  
    else if (inputName==='services_select'){
      newFilterDataBisnes.service_company=inputValue
    } 
    else if (inputName==='escort_select'){
      newFilterDataBisnes.accompaniment_type=inputValue
    }
    else if (inputName==='statusWell_select'){
      newFilterDataBisnes.status_wellbore=inputValue
    }
    else if (inputName==='well_operation'){
      newFilterDataBisnes.well_operation=!newFilterDataBisnes.well_operation
    }
    setFilterDataBisnes(newFilterDataBisnes)
    postFilterBisnesPlan(newFilterDataBisnes)
  }


  const handleBlur =()=>{
    const newFilterDataBisnes=filterDataBisnes
    newFilterDataBisnes.wellbore=filterStvol


    
    setFilterDataBisnes(newFilterDataBisnes)
    postFilterBisnesPlan(newFilterDataBisnes)
  }

  const setStvolFun = (stvol)=>{
    setFilterStvol(stvol)
  }
  const handleSuccessToast = () => {
    setIsSuccessToast(!isSuccessToast);
  }
  const handleErrorToast = () => {
    setIsErrorToast(!isErrorToast);
  }

  function coordinatesGraphick (pdf, countGraphiks){
    let yText = 140
    let yImg = 150
    if ( countGraphiks % 2 ==0){
        pdf.addPage();
        yText=10
        yImg=20
      }
    return [yText, yImg]
  };

  const saveAsPdf = (e) => {
    e.preventDefault();
    let countGraphiks=0
    const pdf = new jsPDF();
    const myFont = font // загрузить файл шрифта *.ttf в виде двоичной строки 

    // добавить шрифт в jsPDF 
    pdf.addFileToVFS("MyFont.ttf", myFont);
    pdf.addFont("MyFont.ttf", "MyFont", "normal");
    pdf.setFont("MyFont");
    html2canvas(document.querySelector("#cardFilter")).then(canvas => {
      const chartImage = canvas.toDataURL('image/png');
      pdf.text('Фильтры', 10, 10);
      pdf.text('Сопровождение:', 10, 20);
      pdf.setFontSize(10)
      pdf.text(filterDataBisnes.accompaniment_type.length>0 ? filterDataBisnes.accompaniment_type.join(',') : 'Круглосуточно, ТЗ', 60, 20);
      pdf.addImage(chartImage, 'PNG', 10, 30, 180, 70);
      pdf.setFontSize(18)
      pdf.text('Сервисные компании: ', 10, 110);
      pdf.setFontSize(10)
      pdf.text(12, 112, filterDataBisnes.service_company.length>0 ? ('\n'+filterDataBisnes.service_company.join('\n')) : '\nвсе');
      pdf.setFontSize(18)
      pdf.text('Общества: ', 100, 110);
      pdf.setFontSize(10)
      pdf.text(101, 112, filterDataBisnes.customer.length>0 ? ('\n'+filterDataBisnes.customer.join('\n')) : '\nвсе');
      pdf.setFontSize(18)
      pdf.text('Статус скважины: ', 10, 210);
      pdf.setFontSize(10)
      pdf.text(12, 212, filterDataBisnes.status_wellbore.length>0 ? ('\n'+filterDataBisnes.status_wellbore.join('\n')) : '\nвсе');
    }).then(()=>{
      pdf.setFontSize(20)
    if (saveGrapfiks.bisnesPlan){
      html2canvas(chartRefPlan.current.canvas).then(canvas => {
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Выполнение бизнес-плана', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
      });
    }
    if (saveGrapfiks.escort){
      html2canvas(chartRefEscort.current.canvas).then(canvas => {
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Количество секций в сопровождении по месяцам', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
    });
  }
    
    if (saveGrapfiks.operation){
      html2canvas(chartRefOperations.current.canvas).then(canvas => {
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Количество скважинных операций в год', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
      });
    }
    if (saveGrapfiks.society){
      html2canvas(chartRefSociety.current.canvas).then(canvas => {
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Количество скважин по Обществам', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
      });
    }
    if (saveGrapfiks.control){
      html2canvas(chartRefControl.current.canvas).then(canvas => {
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Количество отправленных отчётов по месяцам', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
      });
    }
    html2canvas(chartRefServices.current.canvas).then(canvas => {
      if ( saveGrapfiks.services ){
        const [yText, yImg] = coordinatesGraphick(pdf, countGraphiks);
        countGraphiks+=1
        const chartImage = canvas.toDataURL('image/png');
        pdf.text('Количество скважин по порядчикам', 10, yText);
        pdf.addImage(chartImage, 'PNG', 10, yImg, 180, 100);
      }
      pdf.save('statistics.pdf');
    
  })
})
    //pdf.save('statistics.pdf');
  };

  useEffect(() => {
    get_percent_well()
    getCustomers()
    getServices()
  }, [constant])
  if (!isLoading)
    return (
      <>
        <SuccessToast active={isSuccessToast} setActive={handleSuccessToast}/>
        <ErrorToast active={isErrorToast} setActive={handleErrorToast} statusError={statusError}/>
        <PageTitle title="Статистика" button={<Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => { history.push({ pathname: "/app/reports" }) }}
        >
          Список отчетов
    </Button>} />
        <Grid container spacing={4}>
        <Grid item xs={6}>
        {isLoadingGrafik ? (
          <Loading />
        ) :(
          <CustomBarChart
            xs={12}
            listNakopPlan={listNakopPlan}
            listNakopFact={listNakopFact}
            monthsNakopPlan={monthsNakopPlan}
            chartRefPlan={chartRefPlan}
            plan={plan}
            fact={fact}
            name="short"
            yax="wells_count"
            title={'Выполнение бизнес-плана ' + stringYears}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid>
          <Grid xs={6}>
            <Form.Group >
              <Col xs="8">
              </Col>
              <Col xs="4">
              <Form>
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  accept=".xlsx,.xls"
                  multiple
                  type="file"
                  value={inputFile}
                  onChange={OnSumbitFileBisnes}
                />
                <label htmlFor="contained-button-file" style={{}}>
                  <Button variant="contained" color="primary" component="span">
                    Загрузить бизнес-план
        </Button>
                </label>
                </Form>
              </Col>
            </Form.Group>
            <CardContent id="cardFilter" style={{ padding: "0.5rem 1.5rem 0 1.5rem", backgroundColor:"white"}}>
            <Form.Group as={Row}>
            <Col xs="4" style={{borderRight:"1px solid blue"}}>
            <Form.Label column sm="12" style={{fontWeight:"700",  marginBottom: '20px',}}>
            Период (дата по первому замеру)
                    </Form.Label>
                        <Form.Control
                            id="start_date"
                            name="start_date"
                            style={{backgroundColor: "#6985AF",
                            marginTop: '1000px',
                            borderColor: "#6985AF",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "700",
                            fontSize: "20px",
                            margin: "auto"}}
                            type="date"
                            onChange={(e) => updateBaseValues(e)}
                        />
                        </Col>
            <Col xs="4" style={{borderRight:"1px solid blue"}}>
            <Form.Label column sm="12" style={{fontWeight:"700",}}>
            Период (дата по последнему замеру)
                    </Form.Label>
                        <Form.Control
                            id="end_date"
                            name="end_date"
                            style={{backgroundColor: "#6985AF",
                            borderColor: "#6985AF",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "700",
                            fontSize: "20px",
                            margin: "auto"}}
                            type="date"
                            onChange={(e) => updateBaseValues(e)}
                        />
                        </Col>
              
              <Col xs="4">
              <Form.Label column sm="12" style={{fontWeight:"700", marginBottom:"20px"}}>Сервисная компания</Form.Label>
              <Col xs="12">
              <FormControl
                        style={{minWidth: "100%", backgroundColor: "#6985AF"}}
                      >
                        <Select
                          id="services_select"
                          name="services_select"
                          multiple
                          value={filterDataBisnes.service_company}
                          onChange={(e) => updateBaseValues(e)}
                          input={
                            <OutlinedInput
                              style={{ height: "38px" }}
                            />
                          }
                         renderValue={(selected) => ""}
                        >
                          {servicesData.map((item) => (
                            <MenuItem key={item.name} value={item.name}>
                              <Checkbox
                                checked={
                                  filterDataBisnes.service_company.indexOf(item.name) > -1
                                }
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                        </Col>
              </Col>
              </Form.Group>
              <Form.Group as={Row} style={{marginTop:"30px"}}>
              <Col xs="4" style={{borderRight:"1px solid blue"}}>
              <Form.Label column sm="12" style={{fontWeight:"700"}}>Ствол (по первому стволу)</Form.Label>
              <TextField value={filterStvol} onBlur={handleBlur} onChange={(e) => setStvolFun(e.target.value)} placeholder="Ствол"/>
              </Col>
              <Col xs="4" style={{borderRight:"1px solid blue"}}>
              <Form.Label column sm="12" style={{fontWeight:"700", marginBottom:"20px"}}>Сопровождение</Form.Label>
              <Col xs="12">
              <FormControl
                        id="escort_select"
                        name="escort_select"
                        style={{minWidth: "100%", backgroundColor: "#6985AF"}}
                      >
                        <Select
                          id="escort_select"
                          name="escort_select"
                          multiple
                          value={filterDataBisnes.accompaniment_type}
                          onChange={(e) => updateBaseValues(e)}
                          input={
                            <OutlinedInput
                              style={{ height: "38px" }}
                            />
                          }
                         renderValue={(selected) => ""}
                        >
                          {escort.map((item) => (
                            <MenuItem key={item.name} value={item.name}>
                              <Checkbox
                                checked={
                                  filterDataBisnes.accompaniment_type.indexOf(item.name) > -1
                                }
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                        </Col>
              </Col>
              <Col xs="4">
              <Form.Label column sm="12" style={{fontWeight:"700", marginBottom:"20px"}}>Статус скважины</Form.Label>
              <Col xs="12">
              <FormControl
                        id="statusWell_select"
                        name="statusWell_select"
                        style={{minWidth: "100%", backgroundColor: "#6985AF"}}
                      >
                        <Select
                          id="statusWell_select"
                          name="statusWell_select"
                          multiple
                          value={filterDataBisnes.status_wellbore}
                          onChange={(e) => updateBaseValues(e)}
                          input={
                            <OutlinedInput
                              style={{ height: "38px" }}
                            />
                          }
                         renderValue={(selected) => ""}
                        >
                          {statusWell.map((item) => (
                            <MenuItem key={item.name} value={item.name}>
                              <Checkbox
                                checked={
                                  filterDataBisnes.status_wellbore.indexOf(item.name) > -1
                                }
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                        </Col>
              </Col>
              </Form.Group>
              <Form.Group as={Row} style={{ paddingBottom:"20px"}}>
              <Col xs="4" style={{borderRight:"1px solid blue"}}>
                <Form.Label column sm="12" style={{fontWeight:"700", marginBottom:"20px"}}>
                      Общество
                    </Form.Label>
                                
              <Col xs="12">
              <FormControl
                        id="customers_select"
                        name="customers_select"
                        style={{minWidth: "100%", backgroundColor: "#6985AF"}}
                      >
                        <Select
                          id="customers_select"
                          name="customers_select"
                          multiple
                          value={filterDataBisnes.customer}
                          onChange={(e) => updateBaseValues(e)}
                          input={
                            <OutlinedInput
                              style={{ height: "38px" }}
                            />
                          }
                         renderValue={(selected) => ""}
                        >
                          {customersData.map((item) => (
                            <MenuItem key={item.name} value={item.name}>
                              <Checkbox
                                checked={
                                  filterDataBisnes.customer.indexOf(item.name) > -1
                                }
                              />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                        </Col>
              </Col>
              <Col xs="6">
              <MenuItem >
                          <Checkbox id="well_operation" name="well_operation" onChange={(e) => updateBaseValues(e)}/>
                          <Form.Label column sm="12" style={{fontWeight:"700"}}>Скважинные операции</Form.Label>
                              </MenuItem>

              </Col>
              </Form.Group>
            </CardContent>
            <CardContent style={{ padding: "0.5rem 1.5rem 0 1.5rem", backgroundColor:"white"}}>
            <Form.Group as={Row}>
            <Col xs="6" >
            <Form.Label column sm="12" style={{fontWeight:"800", fontSize:"20px", marginBottom: '20px',}}>
              Сохранение в pdf
            </Form.Label>
            </Col>
            <Col xs="4" />
            <Col xs="2">
              <Button onClick={saveAsPdf} variant="contained" color="primary" component="span">
                      Сохранить
              </Button>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="bisnes_plan_pdf" name="bisnes_plan_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Выполнение бизнес-плана</Form.Label>
              </MenuItem>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="escort_pdf" name="escort_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Количество секций в сопровождении</Form.Label>
              </MenuItem>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="operation_pdf" name="operation_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Количество скважинных операций в год</Form.Label>
              </MenuItem>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="society_pdf" name="society_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Количество скважин по Обществам</Form.Label>
              </MenuItem>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="control_pdf" name="control_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Количество отправленных отчётов</Form.Label>
              </MenuItem>
            </Col>
            <Col xs="6">
              <MenuItem >
                  <Checkbox id="servises_pdf" name="servises_pdf" onChange={(e) => updateValuesPdf(e)} defaultChecked/>
                    <Form.Label column sm="12" style={{fontWeight:"700"}}>Количество скважин по порядчикам</Form.Label>
              </MenuItem>
            </Col>
            </Form.Group>
            </CardContent>
          </Grid>
          <Grid item xs={6}>
          {isLoadingGrafik ? (
          <Loading />
        ) :(
          <EscortBarChart
            xs={12}
            data={dataEscort}
            chartRefEscort={chartRefEscort}
            name="escort"
            title={'Количество секций в сопровождении по месяцам'}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid>
          <Grid item xs={6}>
          {isLoadingGrafik ? (
          <Loading />
        ) :(
          <OperationsBarChart
            chartRefOperations={chartRefOperations}
            xs={12}
            data={dataOperations}
            name="operations"
            title={'Количество скважинных операций в год'}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid>
          <Grid item xs={6}>
          {isLoadingGrafik ? (
          <Loading />
        ) :(
          <SocietyBarChart
            chartRefSociety={chartRefSociety}
            xs={12}
            data={dataSociety}
            month={monthSociety}
            name="society"
            title={'Количество скважин по Обществам'}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid>
          <Grid item xs={6}>
          {isLoadingGrafik ? (
          <Loading />
        ) :(
          <ControlBarChart
            xs={12}
            chartRefControl={chartRefControl}
            data={dataControl}
            name="control"
            title={'Количество отправленных отчётов по месяцам'}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid>
        
          <Grid item xs={6}>
          {isLoadingGrafik ? (
          <Loading />
        ) :(
          <ServicesBarChart
            chartRefServices={chartRefServices}
            xs={12}
            data={dataServices}
            name="control"
            title={'Количество скважин по порядчикам'}
            color="#FCBB14"
            style={{ width: "100%" }}
          />
        )}
          </Grid> 
        </Grid>
      </>
    )
  else return (<Loading />)
}

