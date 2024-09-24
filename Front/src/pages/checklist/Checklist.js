import React, {useEffect, useState, Suspense} from "react";
import {Form, Button, Badge, Row, Col} from 'react-bootstrap';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
    Grid,
    Input,
    Table, TableHead, TableRow, TableCell, TableBody,
    Card, CardContent,
    IconButton,
    ListSubheader,
    Typography,
    Select, MenuItem, FormControl,
    InputLabel, Chip
} from "@material-ui/core";
import { calc_finish_value, calc_tablet_digitalData, calc_value_rt, calc_value_memory, calc_value_memory_azimut, calc_value_rt_azimut, } from "../calcScripts";

import {
    AddCircleOutline as PlusIcon,
    NotInterested as NotInterestedIcon,
    RemoveCircleOutline as RemoveCircleOutlineIcon,
  } from "@material-ui/icons";

import { useHistory } from "react-router";

import { styleCell, styleInput, styleSelect, styleTextfield, styleBlueInput, styleBlueInputDisabled } from "./styles";

import PageTitle from "../../components/PageTitle";
import ValidityToast from "../../components/Toasts/ValidityToast";
import SuccessToast from "../../components/Toasts/SuccessToast";

import Blocked from "../../components/Blocked/Blocked";

import { prepare_for_post_inform_method, prepare_for_post_secondtable, check_validity } from "./Scripts";
import { make_indexes } from "../reports/Scripts";

import "../../pages/styles.css"

const FullnessDialog = React.lazy(() => import('../../components/Dialogs/FullnessDialog'));
//const LasDialog = React.lazy(() => import('../../components/Dialogs/LasDialog'));
//const WitsmlDialog = React.lazy(() => import('../../components/Dialogs/WitsmlDialog'));
const DigitalDialog = React.lazy(() => import('../../components/Dialogs/DigitalDialog'));
const DensityDialog = React.lazy(() => import('../../components/Dialogs/DensityDialog'));
const FillDataDialog = React.lazy(() => import('../../components/Dialogs/FillDataDialog'));

var tableRowIndex = 0;

function Checklist() {
    const role = localStorage.getItem('role');
    const history = useHistory();
    const [hover, setHover] = useState({
        index: 0,
        hover: false
    });
    const [showModalData, setShowModalData] = useState(false);
    const [showModalFullness, setShowModalFullness] = useState(false);
    //const [showModalLas, setShowModalLas] = useState(false);
    //const [showModalWitsml, setShowModalWitsml] = useState(false);
    const [showModalDigital, setShowModalDigital] = useState(false);
    const [showModalDensity, setShowModalDensity] = useState(false);
    const [showValidityToast, setShowValidityToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [rows, setRows] = useState([]);
    const [method_value, setMethod_value] = useState(null);
    const [secondrows, setSecondrows] = useState([]);
    /*const [witsmlData, setWitsmlData] = useState({
        fullness_data: "",
        curvenames: "",
        mnemodescription: "",
        witsml_count: null,
        status: true
    });
    const [lasData, setLasData] = useState({
        cap: "",
        parametres: "",
        mnemodescription: "",
        tabledata: "",
        las_file_count: null,
        status: true
    });*/
    const [digitalData, setDigitalData] = useState({
        type:"LAS",
        digital_count:0,
        wellLas: "",
        parameteresLas: "",
        curveLas: "",
        log_dataLas: "",
        wellWitsml: "",
        parameteresWitsml: "",
        curveWitsml: "",
        log_dataWitsml: ""
    });
    const [densityData, setDensityData] = useState({
        density: null,
    });
    const [fullnessData, setFullnessData] = useState({
        act: "",
        titul_list: "",
        well_construction: "",
        wellbore_sizes: "",
        chrono_data: "",
        sol_data: "",
        dash_comp: "",
        summary_data: "",
        inklino_data: "",
        main_record: "",
        parametr: "",
        control_record: "",
        lqc: "",
        calibration: "",
        full_inf_count: null,
    });
    const [quality_id, setQuality_id] = useState(null);
    const [customer, setCustomer] = useState("");
    const [field, setField] = useState("");
    const [num_pad, setNum_pad] = useState("");
    const [num_well, setNum_well] = useState("");
    const [num_wellbore, setNum_wellbore] = useState("");
    const [well_type, setWell_type] = useState("");
    const [service, setService] = useState("");
    const [service_id, setService_id] = useState(null);
    const [pie_well, setPie_well] = useState("");
    const [data_type, setData_type] = useState("");
    const [column_shoe, setColumn_shoe] = useState(null);
    const [section_interval_start, setSection_interval_start] = useState(null);
    const [section_interval_end, setSection_interval_end] = useState(null);
    const [diametr, setDiametr] = useState(null);
    const [value, setValue] = useState(null);
    const [start_date, setStart_date] = useState(null);
    const [end_date, setEnd_date] = useState(null);
    const [note, setNote] = useState("");
    const [test, setTest] = useState("");
    const [rowIndex, setRowIndex] = useState(null);
    const [koefDensity, setKoefDensity] = useState(1)
    const [servicesData, setServicesData] = useState([]);
    const [methodsData, setMethodsData] = useState([]);
    const [devicesData, setDevicesData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [fieldsData, setFieldsData] = useState([]);
    const [clustersData, setClustersData] = useState([]);
    const [wellsData, setWellsData] = useState([]);
    const [wellboresData, setWellboresData] = useState([]);
    const [dataEscort, setDataEscort]=useState('')
    const [arrNumWells, setArrNumWells] = useState([]);
    const [complex_definition, setComplex_definition] = useState([])
    const escort=[{name:'Круглосуточно'}, {name:'ТЗ'}]
    const [dragActive, setDragActive] = useState(false)
    const [interval_fact, setInterval_fact]=useState({
        start_interval:'',
        end_interval:''
    })
    const [fileLas, setFileLas]=useState(null)
    const mainData = {
        customer: customer, 
        field: field,
        field_id: field !== "" ? fieldsData.find(item => item.name === field).id : null, 
        num_pad: num_pad, 
        num_well: num_well, 
        num_wellbore: num_wellbore, 
        pie_well: pie_well, 
        well_type: well_type,
        service: service,
        start_date: start_date,
        end_date: end_date,
        data_type: data_type,
        section_interval_start: interval_fact.start_interval || section_interval_start,
        section_interval_end: interval_fact.end_interval || section_interval_end,
        diametr: diametr
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

    const getCustomers = () => {
        fetch(process.env.REACT_APP_API+'quality_customers/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setCustomersData(data);
        })
    }

    const getFields = (customer_id) => {
        fetch(process.env.REACT_APP_API+'fields/'+ customer_id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setFieldsData(data);
        })
    }

    const getClusters = (field_id) => {
        fetch(process.env.REACT_APP_API+'clusters/'+ field_id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setClustersData(data);
        })
    }

    const getWells = (cluster_id) => {
        fetch(process.env.REACT_APP_API+'wells/'+ cluster_id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setWellsData(data);
            var arr = []
            for (const num of data.map(item => item.num_well).filter((value, index, self) => {return self.indexOf(value) === index})) {
                arr.push({ "num_well": num, "wells": data.filter(item => item.num_well === num)})
            }
            setArrNumWells(arr)
        })
    }

    const getWellbores = (well_id) => {
        fetch(process.env.REACT_APP_API+'wellbores/'+ well_id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setWellboresData(data);
        })
    }
    
    const getMethods = (service_id) => {
        service_id !== null &&
          methodsData.length === 0 &&
          fetch(
            process.env.REACT_APP_API + "methods/" + service_id + "?format=json",
            {
              headers: {
                "Content-Type": "application/json",
                'Authorization': "Token " + localStorage.getItem('id_token'),
                'Accept': "application/json",
              },
            },
          )
            .then((response) => response.json())
            .then((data) => {
              setMethodsData(data);
            });
      }

    const getDevices = (service_id) => {
        fetch(
          process.env.REACT_APP_API +
            "service_devices/" +
            service_id +
            "?format=json",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              'Authorization': "Token " + localStorage.getItem('id_token')
            },
          },
        )
          .then((response) => response.json())
          .then((data) => {
            setDevicesData(data);
          });
      };

    const putWellboreValues = (wellbore_id) => {
        fetch(process.env.REACT_APP_API+'wellbores/id/'+ wellbore_id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "id": wellbore_id,
                "num_wellbore": num_wellbore.split(" ")[1],
                "WP_CS": column_shoe
            }) 
        })
    }

    const postReport = () => {
        
        if(check_validity(customer, field, num_pad, num_well, num_wellbore, data_type, section_interval_start, section_interval_end)) {
        var split_wellbore = num_wellbore.split(" ");
        console.log('rows', rows)
        console.log('methodsData',methodsData)
        console.log('devicesData', devicesData)
        fetch(process.env.REACT_APP_API+'full_post/',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "value": value,
                "density": densityData,
                "id_wellbore": wellboresData.find(i => i.num_wellbore === split_wellbore[1] && i.pie_well === split_wellbore[0]).id,
                "section_interval_start": section_interval_start,
                "section_interval_end": section_interval_end,
                "service_id": servicesData.find(s => s.name === service).id,
                "data_type": data_type, 
                "note": note,
                "start_date": start_date,
                "end_date": end_date,
                "full_inform": fullnessData,
                "digital_data": digitalData,
                //"las_file": lasData,
                //"witsml": witsmlData,
                "inform_for_method": prepare_for_post_inform_method(rows, methodsData, devicesData),
                "second_table": prepare_for_post_secondtable(secondrows, methodsData),
                "accompaniment_type": dataEscort,
                "complex_definition": complex_definition,
            }) 
        })
        .then(response => response.json())
        .then(data=>{
            putWellboreValues(wellboresData.find(i => i.num_wellbore === split_wellbore[1] && i.pie_well === split_wellbore[0]).id)
            history.push({
                pathname:  `/app/reports/${data.quality_control_pk}`,
             })
        })
        localStorage.setItem('post_quality_json', JSON.stringify({
            "value": value,
            "density": densityData,
            "id_wellbore": wellboresData.find(i => i.num_wellbore === split_wellbore[1] && i.pie_well === split_wellbore[0]).id,
            "section_interval_start": section_interval_start,
            "section_interval_end": section_interval_end,
            "service_id": servicesData.find(s => s.name === service).id,
            "data_type": data_type,
            "note": note,
            "start_date": start_date,
            "end_date": end_date,
            "WP_CS": column_shoe,
            "full_inform": fullnessData,
            "digital_data": digitalData,
            //"las_file": lasData,
            //"witsml": witsmlData,
            "inform_for_method": prepare_for_post_inform_method(rows, methodsData, devicesData),
            "second_table": prepare_for_post_secondtable(secondrows, methodsData)
    }));
       
        } else setShowValidityToast(!showValidityToast);
    }

    function updateBaseValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'customer'){
                setCustomer(inputValue)
                setField("")
                setNum_pad("")
                setNum_well("")
                setNum_wellbore("")
                getFields(customersData.find(i => i.name === inputValue).id)
           }
        else if(inputName === 'field'){
               setField(inputValue)
               setNum_pad("")
               setNum_well("")
               setNum_wellbore("")
               getClusters(fieldsData.find(i => i.name === inputValue).id)
           }
        else if(inputName === 'num_pad'){
                setNum_pad(inputValue)
                setNum_well("")
                setNum_wellbore("")
                getWells(clustersData.find(i => i.name === inputValue).id)
           }
        else if(inputName === 'num_well'){
                var split_well = inputValue.split(" ")
                setNum_well(inputValue)
                setNum_wellbore("")
                getWellbores(wellsData.find(i => i.num_well === split_well[1] && i.well_type === split_well[0]).id)
           }
        else if(inputName === 'num_wellbore'){
                var split_wellbore = inputValue.split(" ")
                setNum_wellbore(inputValue)
                setDiametr(wellboresData.find(i => i.num_wellbore === split_wellbore[1] && i.pie_well === split_wellbore[0]).diametr)
           }
        else if(inputName === 'well_type'){
                setWell_type(inputValue)
           }
        else if(inputName === 'service'){
                setService(inputValue);
                setService_id(servicesData.find(i => i.name === inputValue).id);
                getMethods(servicesData.find(i => i.name === inputValue).id);
                getDevices(servicesData.find(i => i.name === inputValue).id);
            }
        else if(inputName === 'pie_well'){
                setPie_well(inputValue);
            }
        else if(inputName === 'data_type'){
                setData_type(inputValue);
            }
        else if(inputName === 'section_interval_start'){
                inputValue === "" ? setSection_interval_start(null) : setSection_interval_start(inputValue);
            }
        else if(inputName === 'column_shoe'){
                inputValue === "" ? setColumn_shoe(null) : setColumn_shoe(inputValue);
                inputValue === "" ? setSection_interval_start(null) : setSection_interval_start(inputValue);
            }
        else if(inputName === 'section_interval_end'){
                inputValue === "" ? setSection_interval_end(null) : setSection_interval_end(inputValue);
            }
        else if(inputName === 'diametr'){
                inputValue === "" ? setDiametr(null) : setDiametr(inputValue);
            }
        else if(inputName === 'start_date'){
                setStart_date(inputValue)
            }
        else if(inputName === 'end_date'){
                setEnd_date(inputValue)
            }
        else if(inputName === 'escort'){
            setDataEscort(inputValue)
        }
        else if (inputName === 'complex_definition'){
            setComplex_definition(inputValue)
        }
    }

    /*const updateWitsmlValues = (data) => {
        setWitsmlData(data);
        if (data.status === false && lasData.status === false)
            setLasData({...lasData, "status": true })
    }
    const updateLasValues = (data) => {
        setLasData(data);
        if (data.status === false && witsmlData.status === false)
            setWitsmlData({...witsmlData, "status": true })

    }*/
    const updateFullnessValues = (data) => {
        setFullnessData(data);
    }
    const updateDensityValues = (data) => {
        setDensityData(data);
    }
    const updateData = (row, secondrow) => {
        var updatedRows = [...rows]
        var updatedRowsSecond = [...secondrows]
        if (rows.length === 0) {
            setRows([{...row, index: 0}])
            setSecondrows([{...secondrow, index: 0}])
        }
        if (rows.length !== 0 && row.index === null){
            tableRowIndex = parseFloat(tableRowIndex) + 1
            updatedRows[tableRowIndex] = {...row, index: tableRowIndex}
            updatedRowsSecond[tableRowIndex] = {...secondrow, index: tableRowIndex}
            setRows(updatedRows);
            setSecondrows(updatedRowsSecond);
        }
        if (rows.length !== 0 && row.index !== null){
            updatedRows[row.index] = row
            updatedRowsSecond[secondrow.index] = secondrow
            setRows(updatedRows);
            setSecondrows(updatedRowsSecond);
        }
        if (rows.length !== 0) {
            setValue(calc_finish_value(rows, digitalData.digital_count, digitalData.type, fullnessData.full_inf_count).toFixed(1))
        }
    }
    const handleDrag = (e)=>{
        e.preventDefault()
        setDragActive(true)
    }
    const handleLeave = (e)=>{
        e.preventDefault()
        setDragActive(false)
    }
    const deleteData = (index) => {
        if(rows.length > 0){
            var updatedRows = [...rows]
            var updatedRowsSecond = [...secondrows]
            var indexToRemove = updatedRows.findIndex(x => x.index === index);
            if(index > -1 && indexToRemove >= 0){
               updatedRows.splice(indexToRemove, 1);
               updatedRowsSecond.splice(indexToRemove, 1);
               setRows(make_indexes(updatedRows));
               setSecondrows(make_indexes(updatedRowsSecond));
            }
            setValue(parseFloat(calc_finish_value(rows, digitalData.digital_count, digitalData.type, fullnessData.full_inf_count).toFixed(2)))
         }
    }

    const handleModalData = () => {
        setShowModalData(!showModalData);
    }
    const handleModalFullness = () => {
        setShowModalFullness(!showModalFullness);
    }
    /*const handleModalLas = () => {
        setShowModalLas(!showModalLas);
    }
    const handleModalWitsml = () => {
        setShowModalWitsml(!showModalWitsml);
    }*/
    const handleModalDigital = () => {
        setShowModalDigital(!showModalDigital);
    }
    const handleModalDensity = () => {
        setShowModalDensity(!showModalDensity);
    }
    const handleValidityToast = () => {
        setShowValidityToast(!showValidityToast);
    }
    const handleSuccessToast = () => {
        setShowSuccessToast(!showSuccessToast);
    }

    const colorForChip = (m_value) => {
        if (m_value < 50)
            return "#f5364c"
        else if (m_value < 85)
            return "#f9bd27"
        else return "#22bd53"
    }
    const OnSumbitFileLas = (event) => {
        event.preventDefault();
        setFileLas( event.target.files[0]);
        const myData = new FormData();
        myData.append('file', event.target.files[0]);

        fetch(process.env.REACT_APP_API+'las_file/get_interval',{
            method: 'POST',
            headers:{
                
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body:myData})
        .then(response => response.json())
        .then(data=>{
            setInterval_fact(data)
        
    })
        .catch((err)=>(console.log(err)))
        
      };
    const handleDrop =(e) => {
        e.preventDefault();
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]){
            const myData = new FormData();
            myData.append('file', e.dataTransfer.files[0]);
    
            fetch(process.env.REACT_APP_API+'las_file/get_interval',{
                method: 'POST',
                headers:{
                    
                    'Authorization': "Token " + localStorage.getItem('id_token')
                },
                body:myData})
            .then(response => response.json())
            .then(data=>{setInterval_fact(data)})
            .catch((err)=>(console.log(err)))
            setFileLas(e.dataTransfer.files[0])
        }
    }
    useEffect(() => {
        getServices();
        getCustomers();
    }, [test])

    useEffect(() => {
        rows.length !== 0 && (tableRowIndex = rows.length - 1) 
    }, [rows])
    useEffect(()=>{
        for (let i=0;i<secondrows.length; i+=1){
            if (mainData.data_type === "Реального времени")
                if (rows[i].method.split(" ")[0] !== "Азимутальный"){
                    rows[i].method_value=parseFloat(calc_value_rt(secondrows[i], fullnessData.lqc, digitalData.type).toFixed(2))
                }
                else{
                    rows[i].method_value=parseFloat(calc_value_rt_azimut(secondrows[i], fullnessData.lqc).toFixed(2))
                }
            if (mainData.data_type === "Из памяти прибора")
                if (rows[i].method.split(" ")[0] !== "Азимутальный")
                    rows[i].method_value=parseFloat(calc_value_memory(secondrows[i], fullnessData.lqc, rows[i].koef_shod).toFixed(2))
                else
                    rows[i].method_value=parseFloat(calc_value_memory_azimut(secondrows[i], fullnessData.lqc, rows[i].koef_shod, digitalData.type).toFixed(2))
        }
        setValue(calc_finish_value(rows, digitalData.digital_count, digitalData.type, fullnessData.full_inf_count))
    }, [digitalData, fullnessData, mainData.data_type])
    useEffect(() => {
        if (densityData.density>=3){
            setKoefDensity(1)     
        }
        else if (densityData.density==2){
            setKoefDensity(0.75)
        }
        else if (densityData.density==1){
            setKoefDensity(0.5)
    } 
        else if (densityData.density==0){
            setKoefDensity(0)
    }  
    setValue(calc_finish_value(rows, digitalData.digital_count, digitalData.type, fullnessData.full_inf_count))
    }, [rows, densityData.density])

    
    if (role === "user" || role === "superuser") 
        return (
            <>
                <Suspense fallback={<p style={{zIndex: "9999"}}></p>}>
                    <FullnessDialog active={showModalFullness} setActive={handleModalFullness} fullness={fullnessData} fullnessData={fullnessData} setFullnessData={setFullnessData}/>
                </Suspense>
                <Suspense fallback={<p style={{zIndex: "9999"}}></p>}>    
                    <FillDataDialog 
                        active={showModalData} 
                        setActive={handleModalData} 
                        methodsData = {methodsData} 
                        devicesData = {devicesData} 
                        mainData = {mainData} 
                        row={rowIndex !== 999999 ? rows[rowIndex] : {}} 
                        secondrow={rowIndex !== 999999 ? secondrows[rowIndex] : {}} 
                        fullnessAct={fullnessData.act} 
                        service_id={service_id} 
                        lqc={fullnessData.lqc}
                        onUpdate={updateData} 
                        onDelete={deleteData}
                        digitalData_type={digitalData.type}
                        full_inf_count={fullnessData.full_inf_count}
                        digital_count={digitalData.digital_count}
                        data_type={data_type}
                        digital_type={digitalData.type}
                    />
                    {/*<LasDialog active={showModalLas} setActive={handleModalLas} las={lasData} onUpdate={updateLasValues}/>
                    <WitsmlDialog active={showModalWitsml} setActive={handleModalWitsml} witsml={witsmlData} onUpdate={updateWitsmlValues}/>*/}
                    <DigitalDialog active={showModalDigital} setActive={handleModalDigital} digital={digitalData} digitalData={digitalData} setDigitalData={setDigitalData}/>
                    <DensityDialog active={showModalDensity} setActive={handleModalDensity} density_data={densityData} onUpdate={updateDensityValues}/>
                </Suspense>
                <ValidityToast active={showValidityToast} setActive={handleValidityToast}/>
                <SuccessToast active={showSuccessToast} setActive={handleSuccessToast}/>
                <PageTitle title={data_type === "" && "Качество данных ГИС" || data_type === "Реального времени" && "Качество данных ГИС (Оперативный отчёт)" 
                || data_type === "Из памяти прибора" && "Качество данных ГИС (Финальный отчёт)"} />
                <Grid container spacing={4}>
                <Grid item xs={12}>
                <Card
                    sx={{ minWidth: 275 }}
                    elevation={4}
                    style={{
                    borderRadius: "15px",
                    backgroundColor: "#34547A",
                    color: "#fff",
                    }}
                >
                <CardContent style={{ padding: "0.5rem 1.5rem 0 1.5rem", color:"white"}}>
                    <Form.Group as={Row}>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="customer" style={styleInput}>Общество</InputLabel>
                                    <Select labelId="customer" name="customer" label="Общество" size="small" style={styleSelect} value={customer} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {customersData.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="field" style={styleInput}>Месторождение</InputLabel>
                                    <Select labelId="field" name="field" label="Месторождение" size="small" style={styleSelect} value={field} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {fieldsData.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="1">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="num_pad" style={styleInput}>Куст</InputLabel>
                                    <Select labelId="num_pad" name="num_pad" label="Куст" size="small" style={styleSelect} value={num_pad} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {clustersData.map(item => {return <MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>})}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="num_well" style={styleInput}>Скважина</InputLabel>
                                    <Select labelId="num_well" name="num_well" label="Скважина" size="small" style={styleSelect} value={num_well} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {arrNumWells.map(item => {return [<ListSubheader style={{pointerEvents: "none"}}>{"Скважина " + item.num_well}</ListSubheader>, item.wells.map(i => {return <MenuItem key={i.well_type + i.num_well} value={i.well_type + " " + i.num_well} style={{fontSize:"20px"}}>{i.well_type + " " + i.num_well}</MenuItem>})]})}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="num_wellbore" style={styleInput}>Ствол</InputLabel>
                                    <Select labelId="num_wellbore" name="num_wellbore" label="Ствол" size="small" style={styleSelect} value={num_wellbore} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {wellboresData.map(item => {return <MenuItem key={item.num_wellbore + item.pie_well} value={item.pie_well + " " + item.num_wellbore} style={{fontSize:"20px"}}>{item.num_wellbore !== "1" ? item.pie_well + " " + item.num_wellbore : item.pie_well}</MenuItem>})}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Form.Label column xs="2" style={{textAlign:"right", fontSize: "22px", fontWeight:"700", paddingTop:"1.25rem"}}>
                        <NotInterestedIcon style={{fontSize:"30px"}}/>диаметр долота, {diametr} мм
                        </Form.Label>
                        <Col xs="1" >
                            <Button variant="yellow" style={{minHeight:"100%", minWidth:"100%", marginTop:"1rem", width:"120px"}} onClick={() => postReport()}>Сохранить</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col xs="4"></Col>
                        <Form.Label column xs="2" style={{textAlign:"center", verticalAlign:"top", fontSize: "22px", fontWeight:"700"}}>
                        Башмак колонны, м
                        </Form.Label>
                        <Form.Label column xs="2" style={{textAlign:"center", verticalAlign:"top", fontSize: "22px", fontWeight:"700"}}>
                        Интервал секции, м
                        </Form.Label>
                        <Col xs="1"></Col>
                        <Form.Label column xs="2" style={{textAlign:"center", verticalAlign:"top", fontSize: "22px", fontWeight:"700"}}>
                        Дата ГИС
                        </Form.Label>
                        <Col xs="1"></Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{paddingBottom:"0.5rem"}}>
                        <Col xs="2">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="service" style={styleInput}>Сервисная компания</InputLabel>
                                    <Select labelId="service" name="service" style={styleSelect} size="small" label="Сервисная компания" value={service} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {servicesData.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
                        
                        <Col xs="2">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="data_type" style={styleInput}>Вид данных</InputLabel>
                                    <Select labelId="data_type" name="data_type" style={styleSelect} size="small" label="Вид данных" value={data_type} onChange={e => updateBaseValues(e)}>
                                        <MenuItem key="1" value="Реального времени" style={{fontSize:"20px"}}>Реального времени</MenuItem>
                                        <MenuItem key="2" value="Из памяти прибора" style={{fontSize:"20px"}}>Из памяти прибора</MenuItem>
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="2">
                            <div style={{width: "50%", margin: "auto"}}>
                                <Form.Control id="column_shoe" name="column_shoe" style={styleBlueInput} value={column_shoe} type="number" step="0.01" onChange={e => updateBaseValues(e)}/>
                            </div>
                        </Col>
                        <Col xs="1">
                            <Form.Control id="section_interval_start" name="section_interval_start" style={styleBlueInput} value={section_interval_start} type="number" step="0.01" onChange={e => updateBaseValues(e)}/>
                        </Col>
                        <Col xs="1">
                            <Form.Control id="section_interval_end" name="section_interval_end" style={styleBlueInput} value={section_interval_end} type="number" step="0.01" onChange={e => updateBaseValues(e)}/>
                        </Col>
                        <Col xs="2">
                        <Form.Control
                            disabled={!(role === "user" || role === "superuser")}
                            id="start_date"
                            name="start_date"
                            value={start_date}
                            onChange={(e) => setStart_date(e.target.value)}
                            style={styleBlueInput}
                            type="date"
                        />
                        </Col>
                        <Col xs="2">
                        <Form.Control
                            disabled={!(role === "user" || role === "superuser")}
                            id="end_date"
                            name="end_date"
                            value={end_date}
                            onChange={(e) => setEnd_date(e.target.value)}
                            style={styleBlueInput}
                            type="date"
                        />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{paddingBottom:"0.5rem"}}>
                        <Col xs="2">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="escort" style={styleInput}>Сопровождение</InputLabel>
                                    <Select labelId="escort" name="escort" style={styleSelect} size="small" label="Сопровождения" value={dataEscort} onChange={e => updateBaseValues(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {escort.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
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
                    Автоматическое определение комплекса
                    </Form.Label>
                    <Col sm="8" style={{verticalAlign:"middle"}}>
                    <Form.Control as="select" id="complex_definition" name="complex_definition" style={styleBlueInput} value={complex_definition} onChange={e => updateBaseValues(e)}>
                            <option></option>
                            <option>ГК+УЭС</option>
                            <option>Полный</option>
                            <option>Специальный</option>
                            <option>Отсутствует</option>
                        </Form.Control>
                    </Col>
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
                <CardContent style={{ height:"100%", paddingBottom: "0", paddingTop:"1rem", fontWeight:"600" }}>
                <Col sm="12" style={{height:"100%", backgroundColor:'white'}}>
                  <Form.Group as={Row} style={{marginBottom:"1rem"}}>
                  
                    <Form.Label column style={dragActive ? styleBlueInputDisabled : styleBlueInput} onDragEnter={handleDrag} onDrop={handleDrop} onDragOver={handleDrag} onDragLeave={handleLeave}>
                    <input accept=".las" style={{ display: "none" }}  type="file" onChange={OnSumbitFileLas}/>
                    <CloudUploadIcon style={{ marginRight: "10px" }}/>
                    {fileLas? fileLas.name : "Загрузить файл LAS"}
                    </Form.Label>
                  </Form.Group>
                  </Col>
                </CardContent>
                
              </Card>
                </Grid>
                <Grid item xs={12}>
                <Card
                    sx={{ minWidth: 275 }}
                    elevation={4}
                    style={{
                    borderRadius: "15px",
                    backgroundColor: "#34547A",
                    color: "#fff",
                    }}
                >
                <CardContent style={{ paddingBottom: "0", color:"white"}}>
                    <Row>
                        <Col xs={4} style={{borderRight:"2px solid #6985AF"}}>
                        <Button variant="deepblueadd" size="large" onClick={handleModalFullness} style={{width: "100%", height: "100%", fontSize: "18px"}}>Полнота предоставления данных<br/> на планшете&nbsp;&nbsp;
                        <Badge variant="light">{fullnessData.full_inf_count !== null ? fullnessData.full_inf_count + "%" : "%"}</Badge></Button>
                        </Col>
                        {/*<Col xs={3} style={{borderRight:"2px solid #6985AF"}}>
                        <Button variant="deepblueadd" size="large" onClick={handleModalLas} style={{width: "100%", height: "100%", fontSize: "18px", display:"inline-block"}}>Оформление Las-файла&nbsp;&nbsp;
                        <Badge variant="light">{lasData.status === true ? (lasData.las_file_count !== null ? lasData.las_file_count + "%" : "%") : "отсутствует"}</Badge></Button>
                        </Col>
                        <Col xs={3} style={{borderRight:"2px solid #6985AF"}}>
                        <Button variant="deepblueadd" size="large" onClick={handleModalWitsml} style={{width: "100%", height: "100%", fontSize: "18px"}}>Корректность загрузки данных реального времени (WITSML)&nbsp;&nbsp;
                        <Badge variant="light">{witsmlData.status === true ? (witsmlData.witsml_count !== null ? witsmlData.witsml_count + "%" : "%") : "отсутствует"}</Badge></Button>
                        </Col>*/}
                        <Col xs={4} style={{borderRight:"2px solid #6985AF"}}>
                        <Button variant="deepblueadd" size="large" onClick={handleModalDigital} style={{width: "100%", height: "100%", fontSize: "18px"}}>Полнота предоставления цифровых данных&nbsp;&nbsp;
                        <Badge variant="light">{digitalData.type+' '+digitalData.digital_count+ "%"}</Badge></Button>
                        </Col>
                        <Col xs={4}>
                        <Button variant="deepblueadd" size="large" onClick={handleModalDensity} style={{width: "100%", height: "100%", fontSize: "18px"}}>Плотность данных:&nbsp;&nbsp;
                        <Badge variant="light">{densityData.density !== null ? densityData.density + " точ. на метр" : "точ. на метр"}</Badge></Button>
                        </Col>
                    </Row>
                    <Row>
                    <Table>
                            <TableHead style={{backgroundColor:"#34547A"}}>
                                <TableRow>
                                    <TableCell align="center" style={{width:"50px", color:"white", borderBottom:"2px solid #6985AF"}}>
                                    <IconButton
                                        aria-haspopup="false"
                                        color="innherit"
                                        onClick={() => {setRowIndex(999999); handleModalData();}}
                                        style={{outline: "none", visibility: (data_type === "" || service === "" || field === "" ? "hidden" : "visible")}}
                                        >
                                        <PlusIcon style={{color:"white"}}/>
                                    </IconButton>
                                    </TableCell>
                                    <TableCell align="center" style={{width: "450px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Метод</TableCell>
                                    <TableCell align="center" style={{width: "150px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Тип прибора</TableCell>
                                    <TableCell align="center" style={{color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Номер прибора</TableCell>
                                    <TableCell align="center" style={{color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Дата калибровки прибора</TableCell>
                                    <TableCell align="center" style={{width: "200px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Интервал записи (факт), м</TableCell>
                                    <TableCell align="center" style={{width: "300px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Коэффициент сходимости данных</TableCell>
                                    <TableCell align="center" style={{color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Причина расхождения данных</TableCell>
                                    <TableCell align="center" style={{width: "200px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Петрофизическая задача</TableCell>
                                    <TableCell align="center" style={{width: "100px", color:"white", borderBottom:"2px solid #6985AF", fontSize:"18px"}}>Оценка по методу</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{paddingTop:"100px"}}>
                                {rows.map((row, index) => {
                                        if (row) return(
                                        <TableRow key={index} style={{cursor: "pointer", height:"50px", margin:"0", padding:"0", backgroundColor: (hover.index === index && hover.hover ? '#f0f0f0' : '#fff')}} onMouseEnter={() => setHover({index: index, hover: true})} onMouseLeave={() => setHover({index: index, hover: false})}>
                                            <TableCell align="center" style={styleCell}>
                                            <IconButton
                                                    aria-haspopup="true"
                                                    color="innherit"
                                                    onClick={() => {window.confirm("Вы точно хотите удалить данный метод?") && deleteData(index)}}
                                                    style={{outline: "none", padding:"0", margin:"0"}}
                                                    >
                                                    <RemoveCircleOutlineIcon style={{color:"black"}}/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.method === "" ? <>&mdash;</> : row.method}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.tool_type === "" ? <>&mdash;</> : row.tool_type}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.tool_num === "" ? <>&mdash;</> : row.tool_num}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.calibr_date === null ? <>&mdash;</> : row.calibr_date}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.interval_shod_start === null || row.interval_shod_end === null ? <>&mdash;</> : row.interval_shod_start+" - "+row.interval_shod_end}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.koef_shod === null ? <>&mdash;</> : row.koef_shod}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.reason_rashod === "" ? <>&mdash;</> : row.reason_rashod}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.petrophysic_task === null ? <>&mdash;</> : row.petrophysic_task}</TableCell>
                                            <TableCell align="center" onClick={() => {setRowIndex(index); handleModalData()}} style={styleCell}>{row.method_value === null ? <>&mdash;</> : <Chip style={{backgroundColor: (colorForChip(row.method_value)), color: "#fff"}} label={parseFloat((row.method_value +calc_tablet_digitalData(digitalData.digital_count, digitalData.type, fullnessData.full_inf_count))*koefDensity*Number(row.petrophysic_task)).toFixed(2)+"%"}/>}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                    </Table>
                    </Row>
                </CardContent>
                </Card>
                </Grid>
                <Grid item xs>
                <Card
                    sx={{ minWidth: 275 }}
                    elevation={4}
                    style={{ borderRadius: "15px" }}
                >
                    <CardContent style={{ paddingBottom: "0.2rem" }}>
                    <Form.Group>
                        <Form.Control
                        disabled={!(role === "user" || role === "superuser")}
                        id="note"
                        name="note"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Введите примечания..."
                        style={{ border: "0" }}
                        />
                    </Form.Group>
                    </CardContent>
                </Card>
                </Grid>
                <Grid item xs="auto" style={{textAlign: "right", display: (value ? "block" : "none")}}>
                <Card
                    sx={5}
                    elevation={4}
                    style={{
                    borderRadius: "15px",
                    backgroundColor: "#34547A",
                    color: "#fff"
                    }}
                >
                <CardContent style={{paddingBottom: "1rem", color:"white"}}>
                    <Typography variant="button" component="h2" style={{fontSize: "25px"}}>
                        {`Общая оценка качества составила: ${parseFloat((Number(value)*koefDensity).toFixed(2))}%`}
                    </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                </Grid>
            </>
        )
    else return(<Blocked/>)
}

export default Checklist;