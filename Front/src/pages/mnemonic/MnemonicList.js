import React, {useEffect, useState, Suspense} from 'react';
import {
    Grid,
    Button,
    CircularProgress,
    Typography
} from "@material-ui/core";

import MUIDataTable from "mui-datatables";

import { useHistory } from "react-router-dom";

import CustomToolbarSelect from '../../components/Toolbar/CustomToolbarSelect';
import AddMnemonicDialog from '../../components/Dialogs/AddMnemonicDialog';
import EditMnemonicDialog from '../../components/Dialogs/EditMnemonicDialog';

import PageTitle from "../../components/PageTitle";

function MnemonicList(props) {
  const history = useHistory();
  const role = localStorage.getItem('role');

  const [mParam, setMParam] = useState({})
  const [mnemonicData, setMnemonicData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [mnemonic_id, setMnemonic_id] = useState(null)
  const [mnemonic_name, setMnemonic_name] = useState("")
  
  const [showAddMnemonic, setShowAddMnemonic] = useState(false)
  const [showEditMnemonic, setShowEditMnemonic] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const getParam = (props) => {
    fetch(process.env.REACT_APP_API+'method_parametrs/id/' + props.match.params.id + '?format=json', { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token')
       }
    }) 
    .then(response=>response.json())
    .then(data=>{
        setMParam(data);
    })
  }

  const getMnemonic = (props) => {
    setShowProgress(true)
    fetch(process.env.REACT_APP_API+'mnemonic/' + props.match.params.id + '?format=json', { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token')
       }
    }) 
    .then(response=>response.json())
    .then(data=>{
        setMnemonicData(data);
    })
    setShowProgress(false)
  }

  const deleteMnemonic = (mnemonic_id) => {
    fetch(process.env.REACT_APP_API+'mnemonic/id/'+ mnemonic_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
  }

  const rowsDelete = () => {
    if (window.confirm('Вы точно хотите удалить '+ mnemonicData[selectedRows[0]].name +' из списка мнемоник?')){
        deleteMnemonic(mnemonicData[selectedRows[0]].id);
        mnemonicData.splice(selectedRows[0], 1);
    }
    setSelectedRows([])
  }

  const changeName = () => {
    setMnemonic_id(mnemonicData[selectedRows[0]].id)
    setMnemonic_name(mnemonicData[selectedRows[0]].name)
    handleModalEditMnemonic()
  }

  const handleModalMnemonic = () => {
    setShowAddMnemonic(!showAddMnemonic)
  }
  const handleModalEditMnemonic = () => {
    setShowEditMnemonic(!showEditMnemonic)
  }

  useEffect(() => {
    getParam(props)
    getMnemonic(props)
  }, [])

    return (
        <>
        <AddMnemonicDialog active={showAddMnemonic} setActive={handleModalMnemonic} param_id={props.match.params.id}/>
        <EditMnemonicDialog active={showEditMnemonic} setActive={handleModalEditMnemonic} mnemonic_id={mnemonic_id} mnemonic_name={mnemonic_name}/>
        <PageTitle title={mParam.name + " - " + mParam.abbreviation}
            button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            onClick={handleModalMnemonic}
            >
                Создать новую мнемонику
            </Button>} />
            <Grid container spacing={4}>
            <Grid item xs={12}>
            <MUIDataTable
            title={<Typography variant="h6">
            Список мнемоник для переименования
            {showProgress    && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
            </Typography>}
            data={mnemonicData.map(item => [item.name])}
            columns={[""]}
            options={{
              viewColumns: false,
              filter: false,
              print: false,
              download: false,
              sort: false,
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
                pagination: {
                  next: "Следующая страница",
                  previous: "Предыдущая страница",
                  rowsPerPage: "Строк на странице:",
                  displayRows: "из",
                },
                selectedRows: {
                  text: "строка выбрана"
                },
              },
              selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
              rowsSelected: selectedRows,
              onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                setSelectedRows(rowsSelected);
              },
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeName} onRowsDelete={rowsDelete}/>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>    
            <Button color="secondary" variant="contained" onClick={() => {history.push('/app/mnemonic')}} style={{outline: "none", backgroundColor:"#34547A"}}>Вернуться назад</Button>    
        </Grid>
        </Grid>
        </>
    )
}

export default MnemonicList;