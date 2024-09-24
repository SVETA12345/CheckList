import React, {useState, useEffect} from 'react';

import PageTitle from "../../components/PageTitle";
import CustomToolbarSelect from '../../components/Toolbar/CustomToolbarSelect';
import EditClusterDialog from '../../components/Dialogs/EditClusterDialog';
import EditWellDialog from '../../components/Dialogs/EditWellDialog';
import EditWellboreDialog from '../../components/Dialogs/EditWellboreDialog';

import {pie_wells, well_types} from "./data.js"

import WarningToast from '../../components/Toasts/WarningToast';

import MUIDataTable from "mui-datatables";

import {Form, Row, Col} from 'react-bootstrap';
import {
    Grid,
    IconButton,
    TextField,
    Box,
    Typography,
    Select, MenuItem, FormControl,
    InputLabel
} from "@material-ui/core";
import {
    AddCircleOutline as PlusIcon,
    Check as CheckIcon
  } from "@material-ui/icons";
import { NavItem } from 'react-bootstrap';

function Database() {
    const constant = false;
    const [customersData, setCustomersData] = useState([]);
    const [fieldsData, setFieldsData] = useState([]);
    const [clustersData, setClustersData] = useState([]);
    const [wellsData, setWellsData] = useState([]);
    const [wellboresData, setWellboresData] = useState([]);
    const [customer, setCustomer] = useState("");
    var customerId = null;
    const [field, setField] = useState("");
    const [fieldId, setFieldId] = useState(null);
    const [cluster, setCluster] = useState("");
    const [clusterId, setClusterId] = useState(null);
    const [well, setWell] = useState("");
    const [well_type, setWell_type] = useState("");
    const [wellId, setWellId] = useState(null);
    const [wellbore, setWellbore] = useState("");
    const [pie_well, setPie_well] = useState("");
    const [diametr, setDiametr] = useState("");
    const [wellboreId, setWellboreId] = useState(null);

    const [selectedCluster, setSelectedCluster] = useState(null);
    const [selectedClusterName, setSelectedClusterName] = useState("");
    const [selectedWell, setSelectedWell] = useState(null);

    const [selectedRowsCluster, setSelectedRowsCluster] = useState([]);
    const [selectedRowsWell, setSelectedRowsWell] = useState([]);
    const [selectedRowsWellbore, setSelectedRowsWellbore] = useState([]);

    const [showInputCluster, setShowInputCluster] = useState(false);
    const [showInputWell, setShowInputWell] = useState(false);
    const [showInputWellbore, setShowInputWellbore] = useState(false);

    const [refreshCluster, setRefreshCluster] = useState(false);
    const [refreshWell, setRefreshWell] = useState(false);
    const [refreshWellbore, setRefreshWellbore] = useState(false);

    const [showModalCluster, setShowModalCluster] = useState(false);
    const [showModalWell, setShowModalWell] = useState(false);
    const [showModalWellbore, setShowModalWellbore] = useState(false);

    const [showWarning, setShowWarning] = useState(false);

    const role = localStorage.getItem('role');

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

    const saveCluster = (field_id) => {
        fetch(process.env.REACT_APP_API+'clusters/' + field_id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": cluster
            }) 
        })
        setCluster("")
    };

    const saveWell = (cluster_id) => {
        fetch(process.env.REACT_APP_API+'wells/' + cluster_id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_well": well,
                "num_pad": clustersData.find(item => item.id === selectedCluster).name,
                "well_type": well_type
            }) 
        })
        setWell("")
        setWell_type("")
    };

    const saveWellbore = (well_id) => {
        fetch(process.env.REACT_APP_API+'wellbores/' + well_id + '?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_wellbore": wellbore,
                "pie_well": pie_well,
                "diametr": diametr
            }) 
        })
        console.log(JSON.stringify({
            "num_wellbore": wellbore,
            "pie_well": pie_well,
            "diametr": diametr
        }))
        setWellbore("")
        setPie_well("")
        setDiametr("")
    };

    const deleteCluster = (cluster_id) => {
        fetch(process.env.REACT_APP_API+'clusters/id/'+ cluster_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteWell = (well_id) => {
        fetch(process.env.REACT_APP_API+'wells/id/'+ well_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteWellbore = (wellbore_id) => {
        fetch(process.env.REACT_APP_API+'wellbores/id/'+ wellbore_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const autoWellbore = (pie_well) => {
        var data = wellboresData.filter(item => item.pie_well === pie_well)
        if (data.length === 0)
            return Number(1)
        else
            return Math.max.apply(Math, data.map(function(o) { return Number(o.num_wellbore) + 1; }))
    }

    const updateCustomer = (e) => {
        setCustomer(e.target.value)
        customerId = customersData.find(item => item.name === e.target.value).id
        setField("")
        setClustersData([])
        setWellsData([])
        setSelectedCluster(null)
        setWellboresData([])
        setSelectedWell(null)
        setSelectedRowsWell([])
        setSelectedRowsCluster([])
        setSelectedRowsWellbore([])
        getFields(customerId)
    }

    const updateField = (e) => {
        setField(e.target.value)
        setFieldId(fieldsData.find(item => item.name === e.target.value).id)
        getClusters(fieldsData.find(item => item.name === e.target.value).id)
        setWellsData([])
        setWellboresData([])
        setSelectedCluster(null)
        setSelectedWell(null)
        setSelectedRowsWell([])
        setSelectedRowsCluster([])
        setSelectedRowsWellbore([])
    }

    const updateCluster = () => {
        if (clustersData.find(item => item.name === cluster) === undefined) {
            saveCluster(fieldsData.find(item => item.name === field).id)
            setRefreshCluster(!refreshCluster)
            setShowInputCluster(false)
        } else handleWarning()
    }

    const updateWell = () => {
        if (wellsData.find(item => item.num_well === well && item.well_type === well_type) === undefined) {
            saveWell(selectedCluster)
            setRefreshWell(!refreshWell)
            setShowInputWell(false)
        } else handleWarning()
    }

    const updateWellbore = () => {
        if (wellboresData.find(item => item.num_wellbore === wellbore && item.pie_well === pie_well) === undefined) {
            saveWellbore(selectedWell)
            setRefreshWellbore(!refreshWellbore)
            setShowInputWellbore(false)
        } else handleWarning()
    }

    const changeNameCluster = () => {
        setClusterId(clustersData[selectedRowsCluster[0]].id);
        handleModalCluster();
    }

    const changeNameWell = () => {
        setWellId(wellsData[selectedRowsWell[0]].id);
        handleModalWell();
    }

    const changeNameWellbore = () => {
        setWellboreId(wellboresData[selectedRowsWellbore[0]].id);
        handleModalWellbore();
    }

    const rowsDeleteCluster = () => {
        if (window.confirm('Вы точно хотите удалить куст '+ clustersData[selectedRowsCluster[0]].name +'?')){
          deleteCluster(clustersData[selectedRowsCluster[0]].id);
          clustersData.splice(selectedRowsCluster[0], 1);
          setSelectedRowsCluster([]);
        }
    }

    const rowsDeleteWell = () => {
        if (window.confirm('Вы точно хотите удалить скважину '+ wellsData[selectedRowsWell[0]].num_well +'?')){
          deleteWell(wellsData[selectedRowsWell[0]].id);
          wellsData.splice(selectedRowsWell[0], 1);
          setSelectedRowsWell([]);
        }
    }

    const rowsDeleteWellbore = () => {
        if (window.confirm('Вы точно хотите удалить ствол '+ wellboresData[selectedRowsWellbore[0]].num_wellbore +'?')){
          deleteWellbore(wellboresData[selectedRowsWellbore[0]].id);
          wellboresData.splice(selectedRowsWellbore[0], 1);
          setSelectedRowsWellbore([]);
        }
    }

    useEffect(() => {
        getCustomers();
    }, [constant])

    //опять ебучие костыли как же я их ненавижу, но что делать
    useEffect(() => { 
        fieldsData.length !== 0 && getClusters(fieldId);
    }, [refreshCluster])

    useEffect(() => { 
        clustersData.length !== 0 && getWells(selectedCluster);
    }, [refreshWell])
    
    useEffect(() => { 
        wellsData.length !== 0 && getWellbores(selectedWell);
    }, [refreshWellbore])

    const onUpdateCluster = () => {
        setRefreshCluster(!refreshCluster);
        setSelectedRowsCluster([]);

    }
    const onUpdateWell = () => {
        setRefreshWell(!refreshWell);
        setSelectedRowsWell([]);
    }
    const onUpdateWellbore = () => {
        setRefreshWellbore(!refreshWellbore);
        setSelectedRowsWellbore([]);
    }

    const onUpdatePieWell = (e) => {
        setPie_well(e.target.value)
        setWellbore(autoWellbore(e.target.value))
    }

    const handleModalCluster = () => {
        setShowModalCluster(!showModalCluster);
    }
    const handleModalWell = () => {
        setShowModalWell(!showModalWell);
    }
    const handleModalWellbore = () => {
        setShowModalWellbore(!showModalWellbore);
    }
    const handleWarning = () => {
        setShowWarning(!showWarning);
    }

    return (
        <>
            <EditClusterDialog active={showModalCluster} setActive={handleModalCluster} cluster_id={clusterId} field_id={fieldId} onUpdate={onUpdateCluster} cluster_name={clustersData[selectedRowsCluster[0]] !== undefined ? clustersData[selectedRowsCluster[0]].name : ""}/> 
            <EditWellDialog active={showModalWell} setActive={handleModalWell} well_id={wellId} num_pad={selectedClusterName} onUpdate={onUpdateWell} well_type={wellsData[selectedRowsWell[0]] !== undefined ? wellsData[selectedRowsWell[0]].well_type : ""} well_name={wellsData[selectedRowsWell[0]] !== undefined ? wellsData[selectedRowsWell[0]].num_well : ""}/> 
            <EditWellboreDialog active={showModalWellbore} setActive={handleModalWellbore} wellbore_id={wellboreId} onUpdate={onUpdateWellbore} diametr={wellboresData[selectedRowsWellbore[0]] !== undefined ? wellboresData[selectedRowsWellbore[0]].diametr : ""} pie_well={wellboresData[selectedRowsWellbore[0]] !== undefined ? wellboresData[selectedRowsWellbore[0]].pie_well : ""} wellbore_name={wellboresData[selectedRowsWellbore[0]] !== undefined ? wellboresData[selectedRowsWellbore[0]].num_wellbore : ""}/> 
            <WarningToast active={showWarning} setActive={handleWarning}/>
            <PageTitle title="Создание скважины"/>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Form.Group as={Row} style={{paddingBottom:"0.5rem"}}>
                        <Col xs="3">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="customer">Общество</InputLabel>
                                    <Select labelId="customer" name="customer" label="Общество" size="small" value={customer} onChange={e => updateCustomer(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {customersData.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="3">
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="field">Месторождение</InputLabel>
                                    <Select labelId="field" name="field" label="Месторождение" size="small" value={field} onChange={e => updateField(e)}>
                                        <MenuItem hidden disabled></MenuItem>
                                        {fieldsData.map(item => (<MenuItem key={item.name} value={item.name} style={{fontSize:"20px"}}>{item.name}</MenuItem>))}
                                    </Select>
                            </FormControl>
                        </Col>
                        <Col xs="6"></Col>
                    </Form.Group>
                </Grid>
                <Grid item xs={4}>
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Кусты
                        {<><IconButton aria-label="add_cluster" onClick={() => setShowInputCluster(true)} style={{outline:'none', visibility:((role === "user" || role === "superuser") && field !== "" ? 'visible' : 'hidden')}}>
                            <PlusIcon />
                        </IconButton>
                        <Box sx={{ display: 'inline-block', visibility:(showInputCluster ? 'visible' : 'hidden')}}>
                            <TextField id="input-cluster" variant="standard" label="Номер" value={cluster} style = {{verticalAlign:"middle"}} onChange={e => setCluster(e.target.value)}/>
                            <IconButton aria-label="save_cluster" onClick={() => updateCluster()} style={{outline:'none'}}>
                                <CheckIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            </IconButton>
                        </Box>
                        </>
                        }
                        </Typography>}
                        data={clustersData.map(item => [item.name])}
                        columns={["Номер куста"]}
                        options={{
                            viewColumns: false,
                            filter: false,
                            print: false,
                            download: false,
                            pagination: false,
                            rowsPerPage: 1000000,
                            textLabels: {
                                body: {
                                  noMatch: "Записей не найдено.",
                                  toolTip: "Сортировать"
                                },
                                toolbar: {
                                  search: "Поиск"
                                },
                                selectedRows: {
                                  text: "строка выбрана"
                                },
                              },
                            setRowProps: (row, index) => ({ style: {cursor: 'pointer' } }),
                            rowsSelected: selectedRowsCluster,
                            onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                                setSelectedRowsCluster(rowsSelected);
                                if (rowsSelected.length !== 0) {
                                    getWells(clustersData[rowsSelected[0]].id);
                                    setSelectedCluster(clustersData[rowsSelected[0]].id);
                                    setSelectedClusterName(clustersData[rowsSelected[0]].name);
                                } else {
                                    setWellsData([])
                                    setSelectedCluster(null)
                                }
                                setWellboresData([]);
                                setSelectedRowsWell([]);
                                setSelectedRowsWellbore([]);
                                setSelectedWell(null);
                                setShowInputWell(false);
                                setShowInputWellbore(false);
                            },
                            selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                                <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeNameCluster} onRowsDelete={rowsDeleteCluster}/>
                            ),
                            onRowClick: (rowData, rowMeta) => {
                                if (selectedRowsCluster[0] !== rowMeta.dataIndex){
                                    getWells(clustersData[rowMeta.dataIndex].id);
                                    setSelectedRowsCluster([rowMeta.dataIndex]);
                                    setSelectedCluster(clustersData[rowMeta.dataIndex].id);
                                    setSelectedClusterName(clustersData[rowMeta.dataIndex].name);
                                } else {
                                    setSelectedRowsCluster([])
                                    setSelectedCluster(null)
                                    setSelectedClusterName("")
                                    setWellsData([])
                                }
                                setWellboresData([]);
                                setSelectedRowsWell([]);
                                setSelectedRowsWellbore([]);
                                setSelectedWell(null);
                                setShowInputWell(false);
                                setShowInputWellbore(false);
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Скважины
                        {<><IconButton aria-label="add_well" onClick={() => setShowInputWell(true)} style={{outline: 'none', visibility:((role === "user" || role === "superuser") && selectedCluster !== null ? 'visible' : 'hidden')}}>
                            <PlusIcon />
                        </IconButton>
                        <Box sx={{ display: showInputWell ? 'inline-block' : 'none'}}>
                            <TextField id="input-well" variant="standard" label="Номер" value={well} style = {{verticalAlign:"middle", marginRight:"1rem", width: "5rem"}} onChange={e => setWell(e.target.value)}/>
                            <FormControl variant="standard" style={{verticalAlign:"middle", width:"17rem"}}>
                                <InputLabel id="well_type">Тип скважины</InputLabel>
                                    <Select labelId="well_type" name="well_type" label="Тип скважины" value={well_type} onChange={e => setWell_type(e.target.value)}>
                                        {well_types.map(item => <MenuItem key={item} value={item} style={{fontSize:"20px"}}>{item}</MenuItem>)}
                                    </Select>
                            </FormControl>
                            <IconButton aria-label="save_well" onClick={() => updateWell()} style={{outline:'none'}}>
                                <CheckIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            </IconButton>
                        </Box>
                        </>}
                        </Typography>}
                        data={wellsData.map(item => [item.num_well, item.well_type])}
                        columns={["Номер скважины", "Тип скважины"]}
                        options={{
                            viewColumns: false,
                            setRowProps: (row, index) => ({ style: { cursor: 'pointer' } }),
                            print: false,
                            filter: false,
                            download: false,
                            pagination: false,
                            rowsPerPage: 1000000,
                            textLabels: {
                                body: {
                                  noMatch: "Записей не найдено.",
                                  toolTip: "Сортировать"
                                },
                                toolbar: {
                                  search: "Поиск"
                                },
                                selectedRows: {
                                  text: "строка выбрана"
                                },
                              },
                            selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                            rowsSelected: selectedRowsWell,
                            onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                                setSelectedRowsWell(rowsSelected);
                                if (rowsSelected.length !== 0) {
                                    getWellbores(wellsData[rowsSelected[0]].id);
                                    setSelectedWell(wellsData[rowsSelected[0]].id);
                                } else {
                                    setWellboresData([])
                                    setSelectedWell(null)
                                }
                                setSelectedRowsWellbore([]);
                                setShowInputWellbore(false);
                            },
                            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                                <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeNameWell} onRowsDelete={rowsDeleteWell}/>
                            ),
                            onRowClick: (rowData, rowMeta) => {
                                if (selectedRowsWell[0] !== rowMeta.dataIndex){
                                    getWellbores(wellsData[rowMeta.dataIndex].id);
                                    setSelectedRowsWell([rowMeta.dataIndex]);
                                    setSelectedWell(wellsData[rowMeta.dataIndex].id);
                                }
                                else {
                                    setSelectedRowsWell([])
                                    setSelectedWell(null)
                                    setWellboresData([])
                                }
                                setSelectedRowsWellbore([]);
                                setShowInputWellbore(false);
                             }
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Стволы
                        {<><IconButton aria-label="add_wellbore" onClick={() => setShowInputWellbore(true)} style={{outline: 'none', visibility:((role === "user" || role === "superuser") && selectedWell !== null ? 'visible' : 'hidden')}}>
                            <PlusIcon />
                        </IconButton>
                        <Box sx={{ display: showInputWellbore ? 'inline-block' : 'none'}}>
                            <FormControl variant="standard" style={{width:"10rem", verticalAlign:"middle", marginRight:"1rem"}}>
                                <InputLabel id="pie_well">Участок ствола</InputLabel>
                                    <Select labelId="pie_well" name="pie_well" label="Участок ствола скважины" value={pie_well} onChange={e => onUpdatePieWell(e)}>
                                        {pie_wells.map(item => <MenuItem key={item} value={item} style={{fontSize:"20px"}}>{item}</MenuItem>)}
                                    </Select>
                            </FormControl>
                            <TextField id="input-wellbore" variant="standard" label="Номер" value={wellbore} style = {{verticalAlign:"middle", marginRight:"1rem", width: "5rem"}} onChange={e => setWellbore(e.target.value)}/>
                            <TextField id="input-diametr" variant="standard" label="Диаметр" type="number" value={diametr} style = {{verticalAlign:"middle", width: "5rem"}} onChange={e => setDiametr(e.target.value)}/>
                            <IconButton aria-label="save_wellbore" onClick={() => updateWellbore()} style={{outline:'none'}}>
                                <CheckIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            </IconButton>
                        </Box>
                        </>}
                        </Typography>}
                        data={wellboresData.map(item => [item.num_wellbore, item.pie_well, item.diametr])}
                        columns={["Номер ствола", "Участок ствола скважины", "Диаметр"]}
                        options={{
                            viewColumns: false,
                            setRowProps: value => ({ style: { cursor: 'pointer' } }),
                            print: false,
                            filter: false,
                            download: false,
                            pagination: false,
                            rowsPerPage: 1000000,
                            textLabels: {
                                body: {
                                  noMatch: "Записей не найдено.",
                                  toolTip: "Сортировать"
                                },
                                toolbar: {
                                  search: "Поиск"
                                },
                                selectedRows: {
                                  text: "строка выбрана"
                                },
                              },
                            selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                            rowsSelected: selectedRowsWellbore,
                            onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                                setSelectedRowsWellbore(rowsSelected);
                            },
                            onRowClick: (rowData, rowMeta) => {
                                selectedRowsWellbore[0] !== rowMeta.dataIndex ? setSelectedRowsWellbore([rowMeta.dataIndex]) : setSelectedRowsWellbore([])
                            },
                            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                                <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeNameWellbore} onRowsDelete={rowsDeleteWellbore}/>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default Database;
