import React, {useEffect, useState} from 'react';

import {
    Grid,
    Button,
    CircularProgress,
    Typography,
    Divider,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel, Select, MenuItem
  } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import {Form, Row, Col} from "react-bootstrap";

import { useHistory } from "react-router";

import CustomToolbarSelect from '../../components/Toolbar/CustomToolbarSelect';
import AddStrataDialog from '../../components/Dialogs/AddStrataDialog';
import EditStrataDialog from '../../components/Dialogs/EditStrataDialog';
import Loading from "../../components/Loading/Loading";
import PageTitle from "../../components/PageTitle";
import SuccessToast from "../../components/Toasts/SuccessToast";
import ErrorToast from "../../components/Toasts/ErrorToast";
// http://127.0.0.1:8000
function Strata(props) {
    const history = useHistory();
    const role = localStorage.getItem('role');
    const constant = false;
    const [isSuccessToast, setIsSuccessToast] = useState(false)
    const [field, setField] = useState({});
    const [method, setMethod] = useState("");
    const [collectors, setCollectors] = useState(null);
    const [saturation, setSaturation] = useState(null);
    const [kp, setKp] = useState(null);
    const [kng, setKng] = useState(null);
    const [lithotype, setLithotype] = useState(null);
    const [statusError, setStatusError] = useState(0)
    const [strata, setStrata] = useState([]);
    const [strataObj, setStrataObj] = useState({
        id: null,
        name: "",
        strata_file: "",
    });
    const [selectedRows, setSelectedRows] = useState([]);

    const [allMethodsData, setAllMethodsData] = useState([]);
    const [petroData, setPetroData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [load, setLoad] = useState(false);
    const [isErrorToast, setIsErrorToast] = useState(false)
    const [showModalStrata, setShowModalStrata] = useState(false);
    const [showModalEditStrata, setShowModalEditStrata] = useState(false);
    const [idPetro, setIdPetro] = useState(null)
    const columns = [
        {
            name: "Название пласта"
        },
        {
            name: "Прикрепленный файл",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        strata[tableMeta.rowIndex].strata_file_name ? <Button size="medium" onClick={() => getStrataFile(strata[tableMeta.rowIndex].id, strata[tableMeta.rowIndex].name)} style={{outline: "none", width: "25%", backgroundColor:"#34547A", color:"#fff"}}>Открыть файл</Button>
                        : <Button size="medium" onClick={() => {setStrataObj(strata[tableMeta.rowIndex]); handleModalEditStrata();}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden'), backgroundColor:"#F6D106", color:"#000", width: "25%"}}>Добавить файл</Button>
                        );
                  }
            }
        }
    ]

    const getStrataFile = (strata_id, name) =>{
        fetch(process.env.REACT_APP_API+'strata/file/id/'+strata_id,{
            method: 'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
        }).then(response=>response.blob())
        .then(data=>{
            const exselURL = window.URL.createObjectURL(data);
            const tempLink = document.createElement('a');
            tempLink.href = exselURL;
            tempLink.download=String(`Пласт ${name}`);
            tempLink.click();
        })
    }
    const putPetroValues = (method_id) => {
        fetch(process.env.REACT_APP_API+'petrophysics/id/'+ idPetro + '?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "separation_of_reservoirs": collectors === "" ? null : collectors,
                "determination_nature_saturation": saturation === "" ? null : saturation,
                "determination_Kp": kp === "" ? null : kp,
                "determination_Kng": kng === "" ? null : kng,
                "determination_lithotype": lithotype === "" ? null : lithotype,
            }) 
        }).then((response) => {
            if(!response.ok) {setStatusError(response.status); setIsErrorToast(true)}
            else setIsSuccessToast(true);
        }).catch((err)=>{console.log(err)})
    }

    const getFieldInformation = (props) => {
        setLoad(true);
        fetch(process.env.REACT_APP_API+'fields/id/'+ props.match.params.id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setField(data);
        })
        setLoad(false);
    }

    const getStrataInformation = (props) => {
        fetch(process.env.REACT_APP_API+'strata/'+ props.match.params.id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setStrata(data);
        })
    }

    const getPetroInformation = (props, e) => {
        setIsLoading(true)
        fetch(process.env.REACT_APP_API+'petrophysics/'+ props.match.params.id + '/' + allMethodsData.find(item => item.name === e.target.value).id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setPetroData(data);
            setIdPetro(data.id)
            if (data.length !== 0) {
                setCollectors(data.separation_of_reservoirs)
                setSaturation(data.determination_nature_saturation)
                setKp(data.determination_Kp)
                setKng(data.determination_Kng)
                setLithotype(data.determination_lithotype)
            }
            setIsLoading(false)  
        })
        .finally(()=>{})
    }

    const changeName = () => {
        setStrataObj(strata[selectedRows[0]]);
        handleModalEditStrata();
    }

    const deleteStrata = (strata_id) => {
        fetch(process.env.REACT_APP_API+'strata/id/'+ strata_id + '?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const rowsDelete = () => {
        if (window.confirm('Вы точно хотите удалить пласт '+ strata[selectedRows[0]].name +'?')){
          deleteStrata(strata[selectedRows[0]].id);
          strata.splice(selectedRows[0], 1);
          setSelectedRows([]);
        }
    }

    const getAllMethods = () => {
        fetch(process.env.REACT_APP_API+'methods/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setAllMethodsData(data);
        })
    }

    const updateMethod = (e) => {
        setMethod(e.target.value)
        getPetroInformation(props, e)
    }

    useEffect(() => {
        getFieldInformation(props);
        getStrataInformation(props);
        getAllMethods();
    }, [constant])

    const handleModalStrata = () => {
        setShowModalStrata(!showModalStrata);
    }
    const handleModalEditStrata = () => {
        setShowModalEditStrata(!showModalEditStrata);
    }
    const handleSuccessToast = () => {
        setIsSuccessToast(!isSuccessToast);
    }
    const handleErrorToast = () => {
        setIsErrorToast(!isErrorToast);
    }
    useEffect(()=>{
        setPetroData({
            id:idPetro,
            collectors,
            saturation, 
            kp,
            kng,
            lithotype
        })
    },[collectors, saturation, kp, kng, lithotype])
    return (
        <>
            <SuccessToast active={isSuccessToast} setActive={handleSuccessToast}/>
            <ErrorToast active={isErrorToast} setActive={handleErrorToast} statusError={statusError}/>
            <AddStrataDialog active={showModalStrata} setActive={handleModalStrata} field_id={props.match.params.id} strataAll={strata} setStrataAll={setStrata}/>
            <EditStrataDialog active={showModalEditStrata} setActive={handleModalEditStrata} strata_id={strataObj.id} strata_name={strataObj.name} strata_file={strataObj.strata_file} strata_file_name={strataObj.strata_file_name} strataList={strata} setStrataList={setStrata}/>
            <Grid item xs={12}>
                <PageTitle title="Настройка петрофизической задачи"/>
                <Form.Group as={Row} style={{paddingBottom:"1rem"}}>
                        <Col xs="3">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="method">Метод</InputLabel>
                                    <Select labelId="method" name="method" label="Метод" size="small" value={method} onChange={e => updateMethod(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {allMethodsData.map(item => <MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>)}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="9"></Col>
                </Form.Group>
                {isLoading ? (<Loading />) :
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                    <Form.Group as={Row} xs="10">
                        <Col xs="2">
                        <TextField type="number" InputLabelProps={{ shrink: true }} fullWidth id="collectors" label="Выделение коллекторов" variant="standard" value={collectors === null ? "" : collectors} onChange={e => setCollectors(e.target.value)}/>
                        </Col>
                        <Col xs="2">
                        <TextField type="number" InputLabelProps={{ shrink: true }} fullWidth id="saturation" label="Определение характера насыщения" variant="standard" value={saturation === null ? "" : saturation} onChange={e => setSaturation(e.target.value)}/>
                        </Col>
                        <Col xs="2">
                        <TextField type="number" InputLabelProps={{ shrink: true }} fullWidth id="kp" label="Определение Кп" variant="standard" value={kp === null ? "" : kp} onChange={e => setKp(e.target.value)}/>
                        </Col>
                        <Col xs="2">
                        <TextField type="number" InputLabelProps={{ shrink: true }} fullWidth id="kng" label="Определение Кнг" variant="standard" value={kng === null ? "" : kng} onChange={e => setKng(e.target.value)}/>
                        </Col>
                        <Col xs="2">
                        <TextField type="number" InputLabelProps={{ shrink: true }} fullWidth id="lithotype" label="Литологическое расчленение" variant="standard" value={lithotype === null ? "" : lithotype} onChange={e => setLithotype(e.target.value)}/>
                        </Col>
                        <Col xs="2" style={{textAlign:"center"}}>
                            <Button onClick={() => petroData.length !== 0 && putPetroValues(petroData.id)} style={{outline: "none", display: "inline-block", marginTop: "0.75rem", height:"100%", width:"85%", backgroundColor:"#34547A", color:"#fff", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                        </Col>
                    </Form.Group>
                    </CardContent>
                </Card>
                }
                <Divider/>
            </Grid>
            <PageTitle title={field.name !== undefined ? "Пласты месторождения " + field.name : "Пласты месторождения "} button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            onClick={handleModalStrata}
            >
                Добавить пласт
            </Button>} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Список пластов в базе
                        {load && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={strata.map(item => [item.name])}
                        columns={columns}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 100,
                        rowsPerPageOptions: [100,500,1000],
                        viewColumns: "false",
                        rowsSelected: selectedRows,
                        textLabels: {
                            body: {
                              noMatch: "Записей не найдено.",
                              toolTip: "Сортировать"
                            },
                            filter: {
                              all: "Все",
                              title: "Фильтры",
                              reset: "СБРОСИТЬ",
                            },
                            toolbar: {
                              search: "Поиск",
                              viewColumns: "Показать столбцы",
                                filterTable: "Фильтр таблицы"
                            },
                            viewColumns: {
                                title: "Показать столбцы"
                              },
                            selectedRows: {
                              text: "строка выбрана"
                            },
                            pagination: {
                                next: "Следующая страница",
                                previous: "Предыдущая страница",
                                rowsPerPage: "Строк на странице:",
                                displayRows: "из",
                              },
                          },
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected);
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeName} onRowsDelete={rowsDelete}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={() => {history.push({pathname: "/app/customers"})}} style={{outline: "none", backgroundColor:"#34547A"}}>Вернуться назад</Button>
                </Grid>
            </Grid>
        </>
    )
}

export default Strata
