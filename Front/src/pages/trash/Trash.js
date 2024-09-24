import React, {useState, useEffect} from 'react';

import {
    Grid,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel, Select, MenuItem
  } from "@material-ui/core";

import MUIDataTable from "mui-datatables";

import PageTitle from "../../components/PageTitle";
import CustomToolbarSelectTrash from '../../components/Toolbar/CustomToolbarSelectTrash';
import NotFound from '../../components/NotFound/NotFound';
import { textLabels } from '../textLabels';

function Trash() {
    const role = localStorage.getItem('role');
    const [category, setCategory] = useState("")

    const [customersData, setCustomersData] = useState([])
    const [fieldsData, setFieldsData] = useState([])
    const [clustersData, setClustersData] = useState([])
    const [wellsData, setWellsData] = useState([])
    const [wellboresData, setWellboresData] = useState([])
    const [stratasData, setStratasData] = useState([])
    const [servicesData, setServicesData] = useState([])
    const [serviceMethodsData, setServiceMethodsData] = useState([])
    const [qualityControlsData, setQualityControlsData] = useState([])

    const [selectedRows, setSelectedRows] = useState([]);

    const columnsStrata = [
        {
            name: "Название пласта"
        },
        {
            name: "Месторождение"
        },
        {
            name: "Прошедшее время с момента удаления"
        },
        {
            name: "Прикрепленный файл",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        stratasData[tableMeta.rowIndex].strata_file ? <Button size="medium" onClick={() => window.open(stratasData[tableMeta.rowIndex].strata_file, '_blank')} style={{outline: "none", width: "40%", backgroundColor:"#34547A", color:"#fff"}}>Открыть файл</Button>
                        : <Button disabled size="medium" style={{outline: "none", backgroundColor:"#F6D106", color:"#000", width: "40%"}}>Файлов не обнаружено</Button>
                        );
                  }
            }
        }
    ]

    const getDeletedCustomers = () => {
        fetch(process.env.REACT_APP_API+'deleted_customers/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setCustomersData(data)
        })
    }
    const getDeletedFields = () => {
        fetch(process.env.REACT_APP_API+'deleted_fields/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setFieldsData(data)
        })
    }
    const getDeletedClusters = () => {
        fetch(process.env.REACT_APP_API+'deleted_clusters/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setClustersData(data)
        })
    }
    const getDeletedWells = () => {
        fetch(process.env.REACT_APP_API+'deleted_wells/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setWellsData(data)
        })
    }
    const getDeletedWellbores = () => {
        fetch(process.env.REACT_APP_API+'deleted_wellbores/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setWellboresData(data)
        })
    }
    const getDeletedStratas = () => {
        fetch(process.env.REACT_APP_API+'deleted_strata/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setStratasData(data)
        })
    }
    const getDeletedServices = () => {
        fetch(process.env.REACT_APP_API+'deleted_services/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setServicesData(data)
        })
    }
    const getDeletedServiceMethods = () => {
        fetch(process.env.REACT_APP_API+'deleted_service_methods/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setServiceMethodsData(data)
        })
    }
    const getDeletedQualityControls = () => {
        fetch(process.env.REACT_APP_API+'deleted_quality/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setQualityControlsData(data)
        })
    }

    const recoveryCustomer = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_customer/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": customersData.find(item => item.id === id).name
            }) 
        })
    }
    const recoveryField = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_field/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": fieldsData.find(item => item.id === id).name
            }) 
        })
    }
    const recoveryCluster = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_cluster/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": clustersData.find(item => item.id === id).name
            }) 
        })
    }
    const recoveryWell = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_well/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_well": wellsData.find(item => item.id === id).num_well,
                "num_pad": wellsData.find(item => item.id === id).num_pad
            }) 
        })
    }
    const recoveryWellbore = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_wellbore/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "num_wellbore": wellboresData.find(item => item.id === id).num_wellbore
            }) 
        })
    }
    const recoveryStrata = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_strata/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": stratasData.find(item => item.id === id).name
            }) 
        })
    }
    const recoveryService = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_service/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "name": servicesData.find(item => item.id === id).name
            }) 
        })
    }
    const recoveryServiceMethod = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_service_method/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({}) 
        })
    }
    const recoveryQuality = (id) => {
        fetch(process.env.REACT_APP_API+'recovery_quality/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "data_type": qualityControlsData.find(item => item.quality_control_id === id).data_type
            }) 
        })
    }

    const deleteCustomer = (id) => {
        fetch(process.env.REACT_APP_API+'del_customer/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteField = (id) => {
        fetch(process.env.REACT_APP_API+'del_field/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteCluster = (id) => {
        fetch(process.env.REACT_APP_API+'del_cluster/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteWell = (id) => {
        fetch(process.env.REACT_APP_API+'del_well/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteWellbore = (id) => {
        fetch(process.env.REACT_APP_API+'del_wellbore/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteStrata = (id) => {
        fetch(process.env.REACT_APP_API+'del_strata/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteService = (id) => {
        fetch(process.env.REACT_APP_API+'del_service/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteServiceMethod = (id) => {
        fetch(process.env.REACT_APP_API+'del_service_method/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    const deleteQuality = (id) => {
        fetch(process.env.REACT_APP_API+'del_quality/'+ id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const rowsDeleteCustomer = () => {
        if (window.confirm('Вы точно хотите удалить '+ customersData[selectedRows[0]].name +' из списка дочерних обществ?')){
            deleteCustomer(customersData[selectedRows[0]].id);
            customersData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteField = () => {
        if (window.confirm('Вы точно хотите удалить '+ fieldsData[selectedRows[0]].name +' из списка месторождений?')){
            deleteField(fieldsData[selectedRows[0]].id);
            fieldsData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteCluster = () => {
        if (window.confirm('Вы точно хотите удалить куст №'+ clustersData[selectedRows[0]].name +' из списка кустов?')){
            deleteCluster(clustersData[selectedRows[0]].id);
            clustersData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteWell = () => {
        if (window.confirm('Вы точно хотите удалить скважину №'+ wellsData[selectedRows[0]].num_well +' из списка скважин?')){
            deleteWell(wellsData[selectedRows[0]].id);
            wellsData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteWellbore = () => {
        if (window.confirm('Вы точно хотите удалить ствол №'+ wellboresData[selectedRows[0]].num_wellbore +' из списка стволов?')){
            deleteWellbore(wellboresData[selectedRows[0]].id);
            wellboresData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteStrata = () => {
        if (window.confirm('Вы точно хотите удалить пласт №'+ stratasData[selectedRows[0]].name +' из списка пластов?')){
            deleteStrata(stratasData[selectedRows[0]].id);
            stratasData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteService = () => {
        if (window.confirm('Вы точно хотите удалить '+ servicesData[selectedRows[0]].name +' из списка сервисных компаний?')){
            deleteService(servicesData[selectedRows[0]].id);
            servicesData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteServiceMethod = () => {
        if (window.confirm('Вы точно хотите удалить инструмент '+ serviceMethodsData[selectedRows[0]].tool_type + ' cервисной компании ' + serviceMethodsData[selectedRows[0]].service_name +' из списка сервисных методов?')){
            deleteServiceMethod(serviceMethodsData[selectedRows[0]].service_method_id);
            serviceMethodsData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }
    const rowsDeleteQualityControl = () => {
        if (window.confirm('Вы точно хотите удалить отчёт №'+ qualityControlsData[selectedRows[0]].quality_control_id +' из списка отчётов?')){
            deleteQuality(qualityControlsData[selectedRows[0]].quality_control_id);
            qualityControlsData.splice(selectedRows[0], 1);
          }
        setSelectedRows([]);
    }

    const recoveryRowsCustomer = () => {
        recoveryCustomer(customersData[selectedRows[0]].id);
        customersData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsField = () => {
        recoveryField(fieldsData[selectedRows[0]].id);
        fieldsData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsCluster = () => {
        recoveryCluster(clustersData[selectedRows[0]].id);
        clustersData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsWell = () => {
        recoveryWell(wellsData[selectedRows[0]].id);
        wellsData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsWellbore = () => {
        recoveryWellbore(wellboresData[selectedRows[0]].id);
        wellboresData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsStrata = () => {
        recoveryStrata(stratasData[selectedRows[0]].id);
        stratasData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsService = () => {
        recoveryService(servicesData[selectedRows[0]].id);
        servicesData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsServiceMethod = () => {
        recoveryServiceMethod(serviceMethodsData[selectedRows[0]].service_method_id);
        serviceMethodsData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    const recoveryRowsQualityControl = () => {
        recoveryQuality(qualityControlsData[selectedRows[0]].quality_control_id);
        qualityControlsData.splice(selectedRows[0], 1);
        setSelectedRows([])
    }
    

    const updateCategory = (name) => {
        setCategory(name)
        setSelectedRows([])
        name === "Дочерние общества" && getDeletedCustomers()
        name === "Месторождения" && getDeletedFields()
        name === "Кусты" && getDeletedClusters()
        name === "Скважины" && getDeletedWells()
        name === "Стволы" && getDeletedWellbores()
        name === "Пласты" && getDeletedStratas()
        name === "Сервисные компании" && getDeletedServices()
        name === "Сервисные методы" && getDeletedServiceMethods()
        name === "Отчеты качества ГИС" && getDeletedQualityControls()
    }

    return (
        <>
            <PageTitle title={category !== "" ? "Корзина (" + category + ")" : "Корзина"}/>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="category">Выберите категорию</InputLabel>
                            <Select labelId="category" name="category" label="Выберите категорию" size="small" value={category} onChange={e => updateCategory(e.target.value)}>
                                <MenuItem hidden disabled></MenuItem>
                                <MenuItem key="customers" value="Дочерние общества" style={{fontSize: "20px"}}>Дочерние общества</MenuItem>
                                <MenuItem key="fields" value="Месторождения" style={{fontSize: "20px"}}>Месторождения</MenuItem>
                                <MenuItem key="clusters" value="Кусты" style={{fontSize: "20px"}}>Кусты</MenuItem>
                                <MenuItem key="wells" value="Скважины" style={{fontSize: "20px"}}>Скважины</MenuItem>
                                <MenuItem key="wellbores" value="Стволы" style={{fontSize: "20px"}}>Стволы</MenuItem>
                                <MenuItem key="stratas" value="Пласты" style={{fontSize: "20px"}}>Пласты</MenuItem>
                                <MenuItem key="services" value="Сервисные компании" style={{fontSize: "20px"}}>Сервисные компании</MenuItem>
                                <MenuItem key="service_methods" value="Сервисные методы" style={{fontSize: "20px"}}>Сервисные методы</MenuItem>
                                <MenuItem key="quality" value="Отчеты качества ГИС" style={{fontSize: "20px"}}>Отчеты качества ГИС</MenuItem>
                            </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={9}></Grid>
                {category === "Дочерние общества" && <Grid item xs={12}>
                    {customersData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные дочерние общества
                        {customersData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={customersData.map(item => [item.name, item.time_before_del])}
                        columns={["Название", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                          },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsCustomer} onRowsDelete={rowsDeleteCustomer}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Месторождения" && <Grid item xs={12}>
                    {fieldsData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные месторождения
                        {fieldsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={fieldsData.map(item => [item.name, item.customer_name, item.time_before_del])}
                        columns={["Название", "Дочернее общество", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsField} onRowsDelete={rowsDeleteField}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Кусты" && <Grid item xs={12}>
                    {clustersData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные кусты
                        {clustersData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={clustersData.map(item => [item.name, item.field_name, item.time_before_del])}
                        columns={["Название", "Месторождение", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsCluster} onRowsDelete={rowsDeleteCluster}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Скважины" && <Grid item xs={12}>
                    {wellsData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные скважины
                        {wellsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={wellsData.map(item => [item.num_well, item.num_pad, item.well_type, item.customer_name, item.time_before_del])}
                        columns={["Номер скважины", "Номер куста", "Тип скважины", "Дочернее общество", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsWell} onRowsDelete={rowsDeleteWell}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Стволы" && <Grid item xs={12}>
                    {wellboresData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные стволы
                        {wellboresData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={wellboresData.map(item => [item.num_wellbore, item.pie_well, item.diametr, item.well_num, item.time_before_del])}
                        columns={["Номер ствола", "Участок ствола", "Диаметр", "Номер скважины", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsWellbore} onRowsDelete={rowsDeleteWellbore}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Пласты" && <Grid item xs={12}>
                    {stratasData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные пласты
                        {stratasData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={stratasData.map(item => [item.name, item.field_name, item.time_before_del])}
                        columns={columnsStrata}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsStrata} onRowsDelete={rowsDeleteStrata}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Сервисные компании" && <Grid item xs={12}>
                    {servicesData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные сервисные компании
                        {servicesData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={servicesData.map(item => [item.name, item.time_before_del])}
                        columns={["Название", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsService} onRowsDelete={rowsDeleteService}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Сервисные методы" && <Grid item xs={12}>
                    {serviceMethodsData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные сервисные методы
                        {serviceMethodsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={serviceMethodsData.map(item => [item.tool_type, item.method, item.service_name, item.time_before_del])}
                        columns={["Название инструмента", "Метод", "Сервисная компания", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsServiceMethod} onRowsDelete={rowsDeleteServiceMethod}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
                {category === "Отчеты качества ГИС" && <Grid item xs={12}>
                    {qualityControlsData.length === 0 ? <NotFound/> :
                    <MUIDataTable
                        title={<Typography variant="h6">
                        Удаленные отчеты качества ГИС
                        {qualityControlsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>}
                        data={qualityControlsData.map(item => [item.quality_control_id, item.customer, item.field, item.well, item.data_type === "Реального времени" ? "Оперативный" : "Финальный", item.section_interval_start + " - " + item.section_interval_end, item.value, item.time_before_del])}
                        columns={["Номер отчета", "Дочернее общество", "Месторождение", "Скважина", "Тип отчёта", "Интервал секции (м)", "Оценка (%)", "Прошедшее время с момента удаления"]}
                        options={{
                        print: false,
                        filter: false,
                        download: false,
                        rowsPerPage: 50,
                        rowsPerPageOptions: [50,100,500],
                        viewColumns: "false",
                        textLabels: textLabels,
                        rowsSelected: selectedRows,
                        onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                            setSelectedRows(rowsSelected)
                        },
                        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                            <CustomToolbarSelectTrash selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onRowsRecovery={recoveryRowsQualityControl} onRowsDelete={rowsDeleteQualityControl}/>
                        ),
                        selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
                        }}
                    />}
                </Grid>}
            </Grid>
        </>
    )
}

export default Trash;
