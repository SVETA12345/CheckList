import React, {useState, useEffect} from 'react';

import PageTitle from "../../components/PageTitle";

import MUIDataTable from "mui-datatables";
import Blocked from "../../components/Blocked/Blocked";
import {
    Route,
    Switch,
    Link
  } from "react-router-dom";

import {
    Grid,
    Button,
    Typography,
    CircularProgress,
    Chip
} from "@material-ui/core";
import { useHistory } from "react-router";
import OneTrackedWell from './OneTrackedWell'

function TrackedWells(props) {
    const [filterData, setFilterData] = useState([])
    const history = useHistory()
    const constant = false
    const role = localStorage.getItem("role")

    const [trackedData, setTrackedData] = useState([])
    const getTrackedData = () => {
      fetch(process.env.REACT_APP_API+'department_summary/?format=json', { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token " + localStorage.getItem('id_token')
         }
      }) 
      .then(response=>response.json())
      .then(data=>{
          setTrackedData(data)
          setFilterData(data)
      })
    }

    const colorForChip = (val) => {
      if (val === "Должна начаться" || val === "В ожидании")
          return "orange"
      else if (val === "В бурении")
          return "blue"
      else if (val === "Добурена")
          return "red"
      else return "green"
      
  }

  const filterTable = (param) => {
    if (param !== "all")
      setFilterData(trackedData.filter(item => item.status_wellbore === param))
    else 
      setFilterData(trackedData)
  }

  useEffect(() => {
    getTrackedData()
  }, [constant])

    if (role === "superuser") 
    return(
        <>
        
        <PageTitle title="База данных скважин" button={<div><Button
            variant="contained"
            size="medium"
            color="primary"
            style={{width: "100%", marginBottom: "0.5rem", outline: "none"}}
            onClick={() => {history.push({pathname: "/app/database"})}}
        >
            Создать новый ствол
        </Button><br/>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{width: "100%", outline: "none"}}
            disabled
        >
            Выгрузить таблицу
        </Button></div>} />
        <Grid container spacing={4}>
        <Grid item xs={12}>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", marginRight: "1rem"}}
            onClick={() => filterTable("all")}
        >
            Все
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", backgroundColor: "orange", marginRight: "1rem"}}
            onClick={() => filterTable("Должна начаться")}
        >
            Должна начаться
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", backgroundColor: "blue", marginRight: "1rem"}}
            onClick={() => filterTable("В бурении")}
        >
            В бурении
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", backgroundColor: "orange", marginRight: "1rem"}}
            onClick={() => filterTable("В ожидании")}
        >
            В ожидании
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", backgroundColor: "red", marginRight: "1rem"}}
            onClick={() => filterTable("Добурена")}
        >
            Добурена
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            style={{outline: "none", backgroundColor: "green"}}
            onClick={() => filterTable("Отчет отправлен")}
        >
            Отчет отправлен
        </Button>
        </Grid>
        <Grid item xs={12}>
          {//reportsData.length === 0 ? <NotFound/> : 
          <MUIDataTable
            title={<Typography variant="h6">
            Список сопровождаемых скважин в базе
            {trackedData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          </Typography>}
          
            data={filterData.map(item => [item.customer, 
              item.field, 
              item.cluster, 
              `${item.well_type} ${item.well}`, 
              `${item.pie_well} ${item.num_wellbore}`,
              item.main_strata, 
              item.contractor, 
              item.ILWD_TFS, 
              item.ILWD_TLS, 
              item.ILWD_I, 
              item.status_wellbore ? <Chip style={{width: "100%", backgroundColor: (colorForChip(item.status_wellbore)), color: "#fff"}} label={item.status_wellbore}/> : ""])}
            columns={["Общество", "Месторождение", "Куст", "Скважина", "Ствол", "Пласт", "Подрядчик LWD", "Первый замер", "Последний замер", "Интерпретация", "Статус"]}
            options={{
              filterType: "textField",
              print: false,
              download: false,
              rowsPerPage: 20,
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
                pagination: {
                  next: "Следующая страница",
                  previous: "Предыдущая страница",
                  rowsPerPage: "Строк на странице:",
                  displayRows: "из",
                },
                viewColumns: {
                    title: "Показать столбцы"
                  },
                selectedRows: {
                  text: "строка выбрана"
                },
              },
              selectableRows: 'none',
              setRowProps: value => ({ style: { cursor: 'pointer' } }),
              onRowClick: (rowData, rowMeta) => {
                props.history.push({
                  pathname:  `/app/trackedwells/${trackedData[rowMeta.dataIndex].id_wellbore}`,
                  state: trackedData[rowMeta.dataIndex]
               });
              }
            }}
          />
          }
        </Grid>
        </Grid>
        
        </>
    )
    else return (<Blocked/>)
}

export default TrackedWells