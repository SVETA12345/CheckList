import React, {useState, useEffect} from 'react';

import {
    Grid,
    Button,
    Typography,
    CircularProgress
  } from "@material-ui/core";

import { useHistory } from "react-router";
import MUIDataTable from "mui-datatables";
import PageTitle from "../../components/PageTitle";
import NotFound from '../../components/NotFound/NotFound';

import EditSampleExDialog from '../../components/Dialogs/EditSampleExDialog';
import Loading from '../../components/Loading/Loading';

function Reports() {
    const [reportsData, setReportsData] = useState([]);
    const constant = false;
    const history = useHistory();
    const role = localStorage.getItem('role');

    const [showSampleModal, setShowSampleModal] = useState(false)
    let isLoading=false
    useEffect(() => {
        getReports();
    },[constant])

    const getReports = () => {
      isLoading=true
        fetch(process.env.REACT_APP_API+'quality_control/?format=json', { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token " + localStorage.getItem('id_token')
         }
      }) 
        .then(response=>response.json())
        .then(data=>{
          isLoading=false
            setReportsData(data);
        })
        .catch(err=> console.log(err))
      }

    const deleteReport = (report_id) => {
        fetch(process.env.REACT_APP_API+'quality_control/id/'+ report_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }
    
    const handleModal = () => {
      setShowSampleModal(!showSampleModal)
    }

    if (!isLoading)
    return (
        <>
        <EditSampleExDialog active={showSampleModal} setActive={handleModal}/>
        <PageTitle title="Отчёты по контролю качества" button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{marginRight: "2rem", outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            onClick={handleModal}
            >
                Редактировать шаблон выгрузки Excel
            </Button>}
            button2={<Button
              variant="contained"
              size="medium"
              color="secondary"
              style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
              onClick={() => {history.push({pathname: "/app/checklist"})}}
              >
                  Добавить новый отчёт
              </Button>}
            />
        <Grid container spacing={4}>
        <Grid item xs={12}>
          {reportsData.length === 0 ? <NotFound/> : 
          <MUIDataTable
            title={<Typography variant="h6">
            Список отчётов в базе
            {reportsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          </Typography>}
            data={reportsData.map(item => [item.customer, item.field, item.well, item.pie_well + " №" + item.num_wellbore, item.data_type === "Реального времени" ? "Оперативный" : "Финальный", item.section_interval_start + " - " + item.section_interval_end, item.data_of_created, item.author, item.value])}
            columns={["Общество", "Месторождение", "Скважина", "Ствол", "Тип отчёта", "Интервал секции (м)", "Дата создания", "Автор", "Оценка (%)"]}
            options={{
              filterType: "textField",
              print: false,
              download: false,
              pagination: false,
              sortOrder: {
                name: 'Дата создания',
                direction: 'desc'
              },
              rowsPerPage: 1000000,
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
              },
              selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
              setRowProps: value => ({ style: { cursor: 'pointer' } }),
              onRowClick: (rowData, rowMeta) => {
                history.push({
                  pathname:  `/app/reports/${reportsData[rowMeta.dataIndex].quality_control_id}`,
               });
              },
              onRowsDelete: (rowMeta) => {
                if (window.confirm('Вы точно хотите удалить отчет №'+ reportsData[rowMeta.data[0].dataIndex].quality_control_id +' из списка отчётов?'))
                    deleteReport(reportsData[rowMeta.data[0].dataIndex].quality_control_id);
                else
                    getReports();
              },
            }}
          />
          }
        </Grid>
        </Grid>
        </>
    )
    else return (<Loading/>)
}

export default Reports;