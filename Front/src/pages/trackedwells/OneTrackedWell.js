import React, {useState, useRef, useEffect} from 'react';

import PageTitle from "../../components/PageTitle";

import {
    Grid,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
    Button, 
    IconButton,
    Paper
} from "@material-ui/core";

import {
    Check as CheckIcon,
    Edit as EditIcon
  } from "@material-ui/icons";

 import { useHistory } from 'react-router-dom'; 
import {useLocation} from 'react-router-dom'
import {Form} from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';
import Blocked from "../../components/Blocked/Blocked";
import SuccessToast from "../../components/Toasts/SuccessToast";

const status = [
    {
        name: "Должна начаться",
        color: "orange"
    },
    {
        name: "В бурении",
        color: "blue"
    },
    {
        name: "В ожидании",
        color: "orange"
    },
    {
        name: "Добурена",
        color: "red"
    },
    {
        name: "Отчет отправлен",
        color: "green"
    }
]

function OneTrackedWell(props) {
    const [wellboreData, setWellboreData]= useState({})
    const [trackedData, setTrackedData] = useState({})
    const [servicesData, setServicesData] = useState([])
    const constant = false
    const role = localStorage.getItem("role")
    const history = useHistory()
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    
    const [ILWD_I, setILWD_I] = useState("")
    const [WP_TD, setWP_TD] = useState(null)
    const [WP_PCS, setWP_PCS] = useState(null)
    const [WP_PT1, setWP_PT1] = useState(null)
    const [WP_PT3, setWP_PT3] = useState(null)
    const [WP_PWL, setWP_PWL] = useState(null)
    const [WP_PCP, setWP_PCP] = useState(null)
    const [WP_CS, setWP_CS] = useState(null)
    const [WP_T1, setWP_T1] = useState(null)
    const [WP_T3, setWP_T3] = useState(null)
    const [WP_WL, setWP_WL] = useState(null)
    const [WP_CP, setWP_CP] = useState(null)
    const [WP_DL, setWP_DL] = useState(null)
    const [WP_DM, setWP_DM] = useState("")
    const [ILWD_TI, setILWD_TI] = useState(null)
    const [ILWD_TFS, setILWD_TFS] = useState(null)
    const [ILWD_TLS, setILWD_TLS] = useState(null)
    const [ILWD_TRS, setILWD_TRS] = useState(null)
    const [ILWD_TM, setILWD_TM] = useState(null)
    const [ILWD_LU, setILWD_LU] = useState("")
    const [ILWD_A, setILWD_A] = useState("")
    const [ILQC_A, setILQC_A] = useState("")
    const [ILQC_C, setILQC_C] = useState("")
    const [ILQC_TR, setILQC_TR] = useState(null)
    const [main_strata, setMain_strata] = useState("")
    const [contractor, setContractor] = useState("")
    const [WP_GRemark, setWP_GRemark] = useState("")
    const [status_wellbore, setStatus_wellbore] = useState("")
    const [editWP_GRemark, setEditWP_GRemark] = useState(false)
    const [editMainInfo, setEditMainInfo] = useState(false)
    const [editInter, setEditInter] = useState(false)
    const [editFinal, setEditFinal] = useState(false)
    const [editLQC, setEditLQC] = useState(false)
    const [editDrilling, setEditDrilling] = useState(false)
    
    const location=useLocation()

    const getWellboreData = (props) => {
        fetch(process.env.REACT_APP_API+'wellbores/id/'+ props.match.params.id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setWellboreData(data);
            setILWD_I(data.ILWD_I)
            setWP_TD(data.WP_TD)
            setWP_PCS(data.WP_PCS)
            setWP_PT1(data.WP_PT1)
            setWP_PT3(data.WP_PT3)
            setWP_PWL(data.WP_PWL)
            setWP_PCP(data.WP_PCP)
            setWP_CS(data.WP_CS)
            setWP_T1(data.WP_T1)
            setWP_T3(data.WP_T3)
            setWP_WL(data.WP_WL)
            setWP_CP(data.WP_CP)
            setWP_DL(data.WP_DL)
            setWP_DM(data.WP_DM)
            setMain_strata(data.main_strata)
            setContractor(data.contractor)
            setILWD_TI(data.ILWD_TI)
            setILWD_TFS(data.ILWD_TFS)
            setILWD_TLS(data.ILWD_TLS)
            setILWD_TRS(data.ILWD_TRS)
            setILWD_TM(data.ILWD_TM)
            setILWD_LU(data.ILWD_LU)
            setILWD_A(data.ILWD_A)
            setILQC_A(data.ILQC_A)
            setILQC_C(data.ILQC_C)
            setILQC_TR(data.ILQC_TR)
            setWP_GRemark(data.WP_GRemark)
            setStatus_wellbore(data.status_wellbore)
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

    const changeTrackedData = (wellbore_id) => {
        fetch(process.env.REACT_APP_API+'wellbores/id/'+ wellbore_id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_wellbore": trackedData.num_wellbore,
                "ILWD_I": ILWD_I,
                "WP_TD": WP_TD,
                "WP_PCS": WP_PCS,
                "WP_PT1": WP_PT1,
                "WP_PT3": WP_PT3,
                "WP_PWL": WP_PWL,
                "WP_PCP": WP_PCP,
                "WP_CS": WP_CS,
                "WP_T1": WP_T1,
                "WP_T3": WP_T3,
                "WP_WL": WP_WL,
                "WP_CP": WP_CP,
                "WP_DL": WP_DL,
                "WP_DM": WP_DM,
                "ILWD_TI": ILWD_TI,
                "ILWD_TFS": ILWD_TFS,
                "ILWD_TLS": ILWD_TLS,
                "ILWD_TRS": ILWD_TRS,
                "ILWD_TM": ILWD_TM,
                "ILWD_LU": ILWD_LU,
                "ILWD_A": ILWD_A,
                "ILQC_A": ILQC_A,
                "ILQC_C": ILQC_C,
                "ILQC_TR": ILQC_TR,
                "WP_GRemark": WP_GRemark,
                "status_wellbore": status_wellbore,
                "main_strata": main_strata,
                "contractor": contractor
            }) 
        })
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            else setShowSuccessToast(true);
        })
    };

    const addName = (role, setRole) => {
        if (role)
            setRole("")
        else
            setRole(localStorage.getItem("name"))
    }

    const timeSubtraction = (firstTime, lastTime) => {
        let res = ""
        let arrres = []
        let arrFirstTime = firstTime.replace("T", "-").replace(":", "-").replace(" ", "-").split("-")
        let arrLastTime = lastTime.replace("T", "-").replace(":", "-").replace(" ", "-").split("-")
        for (let i = 0; i < arrFirstTime.length; i++) {
            arrres.push(Number(arrLastTime[i]) - Number(arrFirstTime[i]))
        }
        arrres[0] && (res += (arrres[0].toString() + " лет "))
        arrres[1] && (res += (arrres[1].toString() + " месяцев "))
        if (arrres[2])
            if (arrres[3] < 0)
                res += ((arrres[2] - 1).toString() + " дней ")
            else
                res += (arrres[2].toString() + " дней ")
        if (arrres[4] < 0)
            if (arrres[3] < 1)
                res += ((24 + arrres[3] - 1).toString() + ":")
            else
                res += ((arrres[3] - 1).toString() + ":")
        else
            if (arrres[3] < 0)
                res += ((24 + arrres[3]).toString() + ":")
            else
                res += (arrres[3].toString() + ":")
        if (arrres[4] < 0)
            res += (60 + arrres[4]).toString()
        else
            res += arrres[4].toString()
        return res
    }

    useEffect(() => {
        WP_PT3 && WP_TD && setWP_DL(Number(WP_PT3) - Number(WP_TD))
    }, [WP_PT3, WP_TD])

    useEffect(() => {
        ILWD_TFS && ILWD_TLS && setILWD_TI(timeSubtraction(ILWD_TFS, ILWD_TLS))
    }, [ILWD_TFS, ILWD_TLS])

    useEffect(() => {
        setTrackedData(location.state)
        getWellboreData(props)
        getServices()
    }, [constant])

    const handleSuccessToast = () => {
        setShowSuccessToast(!showSuccessToast);
    }

    if (role === "superuser") 
    if ("id_wellbore" in trackedData)
    return (
        <>
        <SuccessToast active={showSuccessToast} setActive={handleSuccessToast}/>
        <PageTitle 
            style={{fontSize: "37px"}}
            title1row={trackedData.customer + " - " + trackedData.field} 
            enter={true} 
            title2row={<span style={{fontSize: "30px"}}>{"Куст: " + trackedData.cluster + ", Скважина: " + trackedData.well + ", Ствол: " + wellboreData.num_wellbore + " (" + wellboreData.pie_well + ")"}</span>} 
            title3row={<div style={{display: "flex", alignItems: "center"}}>
            <b>Статус:</b>
            <Form.Control 
                as="select"
                id="status_wellbore"
                name="status_wellbore"
                value={status_wellbore}
                style={{border: "none", width: "auto", display: "inline-block", backgroundColor:"#FFFCF3", paddingBottom: 0, fontSize: "23px", fontWeight: 700, color:(status_wellbore && status.find(item => item.name === status_wellbore).color)}}
                onChange={(e) => setStatus_wellbore(e.target.value)}>
                <option></option>
                {status.map(item => (<option key={item.name} value={item.name}>{item.name}</option>))}
            </Form.Control>
            </div>
            } 
            button={
            <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", height: "50%", fontSize: "18px"}}
            onClick={() => changeTrackedData(trackedData.id_wellbore)}>
                Сохранить
            </Button>
            }
        />
        <Grid container spacing={4}>
            <Grid item xs={4}>
                <Grid item xs={12} style={{marginBottom: "2rem"}}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "2em"}}>
                                    Общая информация
                                    <IconButton
                                        style={{outline: "none", display: (editMainInfo && 'none')}}
                                        onClick={() => setEditMainInfo(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{outline: "none", display: (!editMainInfo && 'none')}}
                                        onClick={() => setEditMainInfo(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Тип скважины
                                    </TableCell>
                                    <TableCell>
                                        { trackedData.well_type ? trackedData.well_type : <>&mdash;</>}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Интерпретация
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editMainInfo ? (ILWD_I ? ILWD_I : <>&mdash;</>) : 
                                                <Form.Control 
                                                    as="select"
                                                    id="ILWD_I"
                                                    name="ILWD_I"
                                                    value={ILWD_I}
                                                    onChange={(e) => setILWD_I(e.target.value)}>
                                                    <option></option>
                                                    <option value="Круглосуточная">Круглосуточная</option>
                                                    <option value="На финальный забой">На финальный забой</option>
                                                </Form.Control>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Целевой пласт
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editMainInfo ? (main_strata ? main_strata : <>&mdash;</>) : 
                                                <Form.Control 
                                                    as="select"
                                                    id="strata"
                                                    name="strata"
                                                    value={main_strata}
                                                    onChange={(e) => setMain_strata(e.target.value)}>
                                                    <option></option>
                                                    {trackedData.strata.map(item => (<option key={item} value={item}>{item}</option>))}
                                                </Form.Control>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Подрядчик LWD
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editMainInfo ? (contractor ? contractor : <>&mdash;</>) : 
                                                <Form.Control 
                                                    as="select"
                                                    id="contractor"
                                                    name="contractor"
                                                    value={contractor}
                                                    onChange={(e) => setContractor(e.target.value)}>
                                                    <option></option>
                                                    {servicesData.map(item => (<option key={item.name} value={item.name}>{item.name}</option>))}
                                                </Form.Control>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Текущий забой
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editMainInfo ? (WP_TD ? WP_TD : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_TD"
                                                    name="WP_TD"
                                                    value={WP_TD}
                                                    onChange={(e) => setWP_TD(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Плановая глубина
                                    </TableCell>
                                    <TableCell>
                                        {WP_PT3 ? WP_PT3 : <>&mdash;</>}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Осталось до забоя
                                    </TableCell>
                                    <TableCell>
                                        {WP_DL ? WP_DL : <>&mdash;</>}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Время интерпретации
                                    </TableCell>
                                    <TableCell>
                                        {ILWD_TI ? ILWD_TI : <>&mdash;</>}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "2em"}}>
                                    Примечание
                                    <IconButton
                                        style={{outline: "none", display: (!editWP_GRemark && 'none')}}
                                        onClick={() => setEditWP_GRemark(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" style={{whiteSpace: 'pre-line'}} colSpan={2} onClick={() => setEditWP_GRemark(true)}>
                                        {
                                            !editWP_GRemark ? (WP_GRemark ? WP_GRemark : <>&mdash;</>) :
                                            <Form>
                                                <Form.Control 
                                                    as="textarea"
                                                    style={{whiteSpace: 'pre-wrap'}}
                                                    id="WP_GRemark"
                                                    name="WP_GRemark"
                                                    value={WP_GRemark}
                                                    onChange={(e) => setWP_GRemark(e.target.value)}
                                                />
                                            </Form>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "2em"}}>
                                    Интерпретация
                                    <IconButton
                                        style={{outline: "none", display: (editInter && 'none')}}
                                        onClick={() => setEditInter(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{outline: "none", display: (!editInter && 'none')}}
                                        onClick={() => setEditInter(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Подготовка
                                    </TableCell>
                                    <TableCell style={{color: (ILWD_LU === "Выполнена" ? "green" : "red")}}>
                                        {
                                            !editInter ? (ILWD_LU ? ILWD_LU : <>&mdash;</>) : 
                                                <Form.Control 
                                                    as="select"
                                                    id="ILWD_LU"
                                                    name="ILWD_LU"
                                                    value={ILWD_LU}
                                                    onChange={(e) => setILWD_LU(e.target.value)}>
                                                    <option></option>
                                                    <option value="Выполнена">Выполнена</option>
                                                    <option value="Не выполнена">Не выполнена</option>
                                                </Form.Control>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Буровая механика
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editInter ? (WP_DM ? WP_DM : <>&mdash;</>) : 
                                                <Form.Control 
                                                    as="select"
                                                    id="WP_DM"
                                                    name="WP_DM"
                                                    value={WP_DM}
                                                    onChange={(e) => setWP_DM(e.target.value)}>
                                                    <option></option>
                                                    <option value="Да">Да</option>
                                                    <option value="Нет">Нет</option>
                                                </Form.Control>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Первый замер
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editInter ? (ILWD_TFS ? ILWD_TFS : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="datetime-local"
                                                    id="ILWD_TFS"
                                                    name="ILWD_TFS"
                                                    value={ILWD_TFS}
                                                    onChange={(e) => setILWD_TFS((e.target.value).replace("T", " "))}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Последний замер
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editInter ? (ILWD_TLS ? ILWD_TLS : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="datetime-local"
                                                    id="ILWD_TLS"
                                                    name="ILWD_TLS"
                                                    value={ILWD_TLS}
                                                    onChange={(e) => setILWD_TLS((e.target.value).replace("T", " "))}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "2em"}}>
                                    Финальный забой
                                    <IconButton
                                        style={{outline: "none", display: (editFinal && 'none')}}
                                        onClick={() => setEditFinal(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{outline: "none", display: (!editFinal && 'none')}}
                                        onClick={() => setEditFinal(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Время отправки
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editFinal ? (ILWD_TRS ? ILWD_TRS : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="datetime-local"
                                                    id="ILWD_TRS"
                                                    name="ILWD_TRS"
                                                    value={ILWD_TRS}
                                                    onChange={(e) => setILWD_TRS((e.target.value).replace("T", " "))}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Интерпретатор
                                    </TableCell>
                                    <TableCell onClick={editFinal ? () => addName(ILWD_A, setILWD_A) : undefined}>
                                        {!editFinal ? (ILWD_A ? ILWD_A : <>&mdash;</>) :
                                            (ILWD_A ? ILWD_A : "Щелкните, чтобы добавить свое имя")
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "2em"}}>
                                    Отчет по интерпретации
                                    <IconButton
                                        style={{outline: "none", display: (editLQC && 'none')}}
                                        onClick={() => setEditLQC(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{outline: "none", display: (!editLQC && 'none')}}
                                        onClick={() => setEditLQC(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Данные из памяти
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editLQC ? (ILWD_TM ? ILWD_TM : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="datetime-local"
                                                    id="ILWD_TM"
                                                    name="ILWD_TM"
                                                    value={ILWD_TM}
                                                    onChange={(e) => setILWD_TM((e.target.value).replace("T", " "))}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Интерпретатор
                                    </TableCell>
                                    <TableCell onClick={editLQC ? () => addName(ILQC_A, setILQC_A) : undefined}>
                                        {!editLQC ? (ILQC_A ? ILQC_A : <>&mdash;</>) :
                                            (ILQC_A ? ILQC_A : "Щелкните, чтобы добавить свое имя")
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Проверил
                                    </TableCell>
                                    <TableCell onClick={editLQC ? () => addName(ILQC_C, setILQC_C) : undefined}>
                                        {!editLQC ? (ILQC_C ? ILQC_C : <>&mdash;</>) :
                                            (ILQC_C  ? ILQC_C : "Щелкните, чтобы добавить свое имя")
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Отправка отчета
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editLQC ? (ILQC_TR ? ILQC_TR : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="datetime-local"
                                                    id="ILQC_TR"
                                                    name="ILQC_TR"
                                                    value={ILQC_TR}
                                                    onChange={(e) => setILQC_TR((e.target.value).replace("T", " "))}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Grid item xs={12} style={{marginBottom: "2rem"}}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={4} style={{fontSize: "2em"}}>
                                    Бурение
                                    <IconButton
                                        style={{outline: "none", display: (editDrilling && 'none')}}
                                        onClick={() => setEditDrilling(true)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        style={{outline: "none", display: (!editDrilling && 'none')}}
                                        onClick={() => setEditDrilling(false)}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell align="center" colSpan={2} style={{fontSize: "1.5em"}}>
                                    План
                                </TableCell>
                                <TableCell align="center" colSpan={2} style={{fontSize: "1.5em"}}>
                                    Факт
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Башмак колонны
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_PCS ? WP_PCS : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_PCS"
                                                    name="WP_PCS"
                                                    value={WP_PCS}
                                                    onChange={(e) => setWP_PCS(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        Башмак колонны
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_CS ? WP_CS : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_CS"
                                                    name="WP_CS"
                                                    value={WP_CS}
                                                    onChange={(e) => setWP_CS(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Точка Т1
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_PT1 ? WP_PT1 : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_PT1"
                                                    name="WP_PT1"
                                                    value={WP_PT1}
                                                    onChange={(e) => setWP_PT1(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        Точка Т1
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_T1 ? WP_T1 : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_T1"
                                                    name="WP_T1"
                                                    value={WP_T1}
                                                    onChange={(e) => setWP_T1(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Точка Т3
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_PT3 ? WP_PT3 : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_PT3"
                                                    name="WP_PT3"
                                                    value={WP_PT3}
                                                    onChange={(e) => setWP_PT3(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        Точка Т3
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_T3 ? WP_T3 : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_T3"
                                                    name="WP_T3"
                                                    value={WP_T3}
                                                    onChange={(e) => setWP_T3(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Длина ствола
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_PWL ? WP_PWL : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_PWL"
                                                    name="WP_PWL"
                                                    value={WP_PWL}
                                                    onChange={(e) => setWP_PWL(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        Длина ствола
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_WL ? WP_WL : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_WL"
                                                    name="WP_WL"
                                                    value={WP_WL}
                                                    onChange={(e) => setWP_WL(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Точка срезки
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_PCP ? WP_PCP : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_PCP"
                                                    name="WP_PCP"
                                                    value={WP_PCP}
                                                    onChange={(e) => setWP_PCP(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        Точка срезки
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !editDrilling ? (WP_CP ? WP_CP : <>&mdash;</>) : 
                                                <Form.Control 
                                                    type="number"
                                                    step="0.01"
                                                    id="WP_CP"
                                                    name="WP_CP"
                                                    value={WP_CP}
                                                    onChange={(e) => setWP_CP(e.target.value)}
                                                />
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell align="center" colSpan={4} style={{fontSize: "2em"}}>
                                    Контроль качества
                                </TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell style={{fontWeight: 700}}>
                                    №
                                </TableCell>
                                <TableCell style={{fontWeight: 700}}>
                                    Тип отчета
                                </TableCell>
                                <TableCell style={{fontWeight: 700}}>
                                    Интервал секции
                                </TableCell>
                                <TableCell style={{fontWeight: 700}}>
                                    Оценка
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trackedData.quality_controls ? trackedData.quality_controls.map(item => 
                                    <TableRow style={{cursor: "pointer"}} onClick={() => history.push({
                                        pathname:  `/app/reports/${item.quality_control_id}`,
                                     })}>
                                        <TableCell>
                                            {item.quality_control_id}
                                        </TableCell>
                                        <TableCell>
                                            {item.data_type === "Реального времени" ? "Оперативный" : "Финальный"}
                                        </TableCell>
                                        <TableCell>
                                            {item.section_interval_start + "-" + item.section_interval_end}
                                        </TableCell>
                                        <TableCell>
                                            {item.value}
                                        </TableCell>
                                    </TableRow>
                                    ) : <TableRow>
                                        <TableCell align='center' colSpan={4}>&mdash;</TableCell>
                                        </TableRow>}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
        </>
    )
    else return (<Loading/>)
    else return (<Blocked/>)
}

export default OneTrackedWell;