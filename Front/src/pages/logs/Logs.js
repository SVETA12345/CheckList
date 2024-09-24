import React, {useState, useEffect} from 'react';

import {
    Grid,
    IconButton,
    TextField,
    InputAdornment,FormControl,
    Button,
    Typography,
    CircularProgress
  } from "@material-ui/core";
import {Form, Row, Col} from 'react-bootstrap';

import {
  Settings as SettingsIcon,
  Backspace as BackspaceIcon,
  Check as CheckIcon
} from "@material-ui/icons";

import MUIDataTable from "mui-datatables";
import ValidAdmin from '../../components/Toasts/ValidAdmin';
import PageTitle from "../../components/PageTitle";

function Logs() {
    const [logsData, setLogsData] = useState([]);
    const [date_start, setDate_start] = useState("");
    const [date_end, setDate_end] = useState("");
    const constant = false;

    const [showInputTime, setShowInputTime] = useState(false);
    const [showValid, setShowValid] = useState(false);

    useEffect(() => {
        getLogs();
    },[constant])

    const getLogs = () => {
        fetch(process.env.REACT_APP_API+'get_week_log/?format=json', { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token " + localStorage.getItem('id_token')
         }
      }) 
        .then(response=>response.json())
        .then(data=>{
            setLogsData(data);
        })
    }

    const getTimeLogs = () => {
        setLogsData([])
        fetch(process.env.REACT_APP_API + 'get_range_log',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "date_start": date_start,
                "date_end": date_end
            }) 
        })
        .then(response => response.json())
        .then(data=>{
            setLogsData(data)
          })
    }

    return (
        <>
        <ValidAdmin active={showValid} setActive={() => setShowValid(!showValid)}/>
        <PageTitle title={
          <>Логи <IconButton aria-label="change_time" onClick={() => setShowInputTime(!showInputTime)} style={{outline:'none'}}>
            { showInputTime ? <BackspaceIcon/> : <SettingsIcon />}
          </IconButton></>} 
          button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{outline: "none", backgroundColor:"#34547A"}}
            onClick={() => { setShowInputTime(false); setDate_start(""); setDate_end(""); setLogsData([]); getLogs()}}
            >
                Загрузить логи за последнюю неделю
            </Button>}/>
            <Grid container spacing={4}>
                <Grid item xs={12} style={{display: (showInputTime ? 'flex' : 'none')}}>
                    <Form.Group as={Row} style={{paddingBottom:"0.25rem"}}>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                              <TextField type="date" 
                                value={date_start}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><b>c</b></InputAdornment>,
                                }}
                                onChange={(e) => setDate_start(e.target.value)}/>
                            </FormControl>
                        </Col>
                        <Col xs="2">
                            <FormControl fullWidth variant="standard">
                              <TextField type="date"
                                value={date_end} 
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><b>по</b></InputAdornment>,
                                }}
                                onChange={(e) => setDate_end(e.target.value)}/>
                            </FormControl>
                        </Col>
                        <Col xs="1" style={{padding: 0}}>
                          <IconButton aria-label="getrangelog" onClick={() => date_start !== "" && date_end !== "" ? getTimeLogs() : setShowValid(true)} style={{outline:'none'}}>
                            <CheckIcon/>
                          </IconButton>
                        </Col>
                        <Col xs="7"></Col>
                    </Form.Group>
                </Grid>
            <Grid item xs={12}>
          <MUIDataTable
            title={<Typography variant="h6">
            Список логов в базе
            {logsData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          </Typography>}
            data={logsData.map(item => [item.user_name, item.user_login, item.request.substring(0, 60), item.level, item.timestamp.substring(0, 10) + " " + item.timestamp.substring(11, 19)])}
            columns={["Имя", "Логин", "Запрос пользователя", "Уровень", "Время запроса"]}
            options={{
              filterType: "textField",
              print: false,
              download: false,
              //pagination: false,
              rowsPerPage: 20,
              rowsPerPageOptions: [20, 50, 100, 500],
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
                pagination: {
                  next: "Следующая страница",
                  previous: "Предыдущая страница",
                  rowsPerPage: "Строк на странице:",
                  displayRows: "из",
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
              selectableRows: 'none'
            }}
          />
        </Grid>
        </Grid>
        </>
    )
}

export default Logs;
