import React, {useEffect, useState, Suspense} from 'react';

import {
    Grid,
    Button,
    CircularProgress,
    Typography
  } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import { useHistory } from "react-router";

import CustomToolbarSelect from '../../components/Toolbar/CustomToolbarSelect';

import PageTitle from "../../components/PageTitle";

const AddServiceDialog = React.lazy(() => import('../../components/Dialogs/AddServiceDialog'));
const EditServiceDialog = React.lazy(() => import('../../components/Dialogs/EditServiceDialog'));

function Services() {
  const [service_id, setService_id] = useState(0);
  const [service_name, setService_name] = useState("");
  const [service_name_short, setService_name_short] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [showModalService, setShowModalService] = useState(false);
  const [showModalEditService, setShowModalEditService] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();
  const role = localStorage.getItem('role');

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

  const deleteService = (service_id) => {
    fetch(process.env.REACT_APP_API+'services/'+ service_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
  }

  const changeName = () => {
    setService_id(servicesData[selectedRows[0]].id);
    setService_name(servicesData[selectedRows[0]].name);
    setService_name_short(servicesData[selectedRows[0]].short);
    handleModalEditService();
  }

  const rowsDelete = () => {
    if (window.confirm('Вы точно хотите удалить '+ servicesData[selectedRows[0]].name +' из списка сервисных компаний?')){
      deleteService(servicesData[selectedRows[0]].id);
      servicesData.splice(selectedRows[0], 1);
    }
    else
      getServices();
    setSelectedRows([]);
  }

  useEffect(() => {
    getServices();
  }, [showModalService])

  const handleModalService = () => {
    setShowModalService(!showModalService);
  }
  const handleModalEditService = () => {
    setShowModalEditService(!showModalEditService);
  }

    return (
        <>
        <Suspense fallback={<p style={{zIndex: "9999"}}></p>}>
          <AddServiceDialog active={showModalService} setActive={handleModalService}/>
          <EditServiceDialog 
            active={showModalEditService} 
            setActive={handleModalEditService} 
            service_id={service_id} 
            service_name={service_name} 
            service_short={service_name_short}
            servicesData={servicesData}
            setServicesData={setServicesData}
          />
        </Suspense>
        <PageTitle title="Сервисные компании" button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            onClick={handleModalService}
            >
                Добавить сервисную компанию
            </Button>} />
            <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={<Typography variant="h6">
            Список сервисных компаний
            {servicesData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          </Typography>}
            data={servicesData.map(item => item.short ? [item.name + ` (${item.short})`] : [item.name])}
            columns={["Название"]}
            options={{
              viewColumns: false,
              filter: false,
              print: false,
              download: false,
              sort: false,
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
              ),
              setRowProps: value => ({ style: { cursor: 'pointer' } }),
              onRowClick: (rowData, rowMeta) => {
                history.push({
                  pathname:  `/app/services/${servicesData[rowMeta.dataIndex].id}`,
               });
              }
            }}
          />
        </Grid>
        </Grid>
        </>
    )
}

export default Services;