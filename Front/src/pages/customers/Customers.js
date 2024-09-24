import React, {useState, useRef, useEffect, Suspense} from "react";

import { makeStyles } from "@material-ui/styles";
import {
    Grid,
    Button,
    Typography,
    CircularProgress
  } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import CustomToolbarSelect from "../../components/Toolbar/CustomToolbarSelect";
import CustomToolbarSelectWithAdd from "../../components/Toolbar/CustomToolbarSelectWithAdd";
import PageTitle from "../../components/PageTitle";
import { useHistory } from "react-router";
import { mdiConsoleNetwork } from "@mdi/js";

const AddCustomerDialog = React.lazy(() => import('../../components/Dialogs/AddCustomerDialog'));
const AddFieldDialog = React.lazy(() => import('../../components/Dialogs/AddFieldDialog'));
const EditCustomerDialog = React.lazy(() => import('../../components/Dialogs/EditCustomerDialog'));
const EditFieldDialog = React.lazy(() => import('../../components/Dialogs/EditFieldDialog'));

const useStyles = makeStyles(theme => ({
    tableOverflow: {
      overflow: 'auto'
    }
}))

function Customers() {
    const [fullData, setFullData] = useState([]);
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const [showModalEditCustomer, setShowModalEditCustomer] = useState(false);
    const [showModalEditField, setShowModalEditField] = useState(false);
    const [showModalField, setShowModalField] = useState(false);
    const [customer_id_addfield, setCustomer_id_addfield] = useState(0);
    const [customer_name_addfield, setCustomer_name_addfield] = useState("");
    const [customer_short_addfield, setCustomer_short_addfield] = useState("");
    const [field_id, setField_id] = useState(0);
    const [field_name, setField_name] = useState("");
    const [customer_index, setCustomer_index] = useState(null);
    const [selectedRowCustomer, setSelectedRowCustomer] = useState([]);
    const [selectedRowField, setSelectedRowField] = useState([[]]);
    const [constant, setConstant] = useState(false);
    const role = localStorage.getItem('role');
    const history = useHistory();
    const isDisabledAddCustomer=useRef(true)
    const isDisabledEditCustomer=useRef(true)
    const isDisabledAddDeposits=useRef(true)
    const isDisabledEditDeposits=useRef(true)
    const [error, setError] = useState(false)
    const [textError, setTextError]=useState('')
    const getCustomers = () => {
      fetch(process.env.REACT_APP_API+'full_data_customers/?format=json', { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token " + localStorage.getItem('id_token'),
       }
    }) 
      .then(response=>response.json())
      .then(data=>{
          setFullData(data);
      })
    }

    const deleteCustomer = (customer_id) => {
      fetch(process.env.REACT_APP_API+'customers/'+ customer_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const deleteField = (field_id) => {
      fetch(process.env.REACT_APP_API+'fields/id/'+ field_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const changeNameField = () => {
      setField_id(fullData[customer_index].field[selectedRowField[customer_index][0]].id);
      setField_name(fullData[customer_index].field[selectedRowField[customer_index][0]].name);
      handleModalEditField();
    }
  
    const changeNameCustomer = () => {
      setCustomer_id_addfield(fullData[selectedRowCustomer[0]].id);
      setCustomer_name_addfield(fullData[selectedRowCustomer[0]].name);
      setCustomer_short_addfield(fullData[selectedRowCustomer[0]].short);
      handleModalEditCustomer();
    }
  
    const rowsDeleteCustomer = () => {
      if (window.confirm("Вы точно хотите удалить " + fullData[selectedRowCustomer[0]].name + " из списка обществ?")){
        deleteCustomer(fullData[selectedRowCustomer[0]].id);
        fullData.splice(selectedRowCustomer[0], 1);
      }
      else
        getCustomers();
      setSelectedRowCustomer([]);
    }

    const fieldAdd = () => {
      setCustomer_id_addfield(fullData[selectedRowCustomer[0]].id);
      handleModalField();
    }

    const rowsDeleteField = () => {
      if (window.confirm("Вы точно хотите удалить " + fullData[customer_index].field[selectedRowField[customer_index][0]].name + " из списка месторождений?")){
        deleteField(fullData[customer_index].field[selectedRowField[customer_index][0]].id);
        fullData[customer_index].field.splice(selectedRowField[customer_index][0], 1);
      }
      else
        getCustomers();
      setSelectedRowField([]);
    }

    useEffect(() => {
      getCustomers();
    }, [constant])

    const handleModalCustomer = () => {
      setError(false)
      setTextError('')
      isDisabledAddCustomer.current=!isDisabledAddCustomer.current
      setShowModalCustomer(!showModalCustomer);
    }
    const handleModalField = () => {
      setError(false)
      setTextError('')
      isDisabledAddDeposits.current=!isDisabledAddDeposits.current
      setShowModalField(!showModalField);
    }
    const handleModalEditCustomer = () => {
      setError(false)
      setTextError('')
      isDisabledEditCustomer.current=!isDisabledEditCustomer.current
      setShowModalEditCustomer(!showModalEditCustomer);
    }
    const handleModalEditField = () => {
      setError(false)
      setTextError('')
      isDisabledEditDeposits.current=!isDisabledEditDeposits.current
      setShowModalEditField(!showModalEditField);
    }
    return (
        <>
        <Suspense fallback={<p style={{zIndex: "9999"}}></p>}>
          <EditCustomerDialog active={!isDisabledEditCustomer.current} setActive={handleModalEditCustomer} customer_id={customer_id_addfield} customer_name={customer_name_addfield} customer_short={customer_short_addfield} fullData={fullData} setFullData={setFullData} isDisabledEditCustomer={isDisabledEditCustomer} error={error} setError={setError} textError={textError} setTextError={setTextError}/>
          <EditFieldDialog active={!isDisabledEditDeposits.current} setActive={handleModalEditField} field_id={field_id} field_name={field_name} fullData={fullData} setFullData={setFullData} isDisabledEditDeposits={isDisabledEditDeposits} error={error} setError={setError} textError={textError} setTextError={setTextError}/>
          <AddFieldDialog active={!isDisabledAddDeposits.current} setActive={handleModalField} customer_id={customer_id_addfield} fullData={fullData} setFullData={setFullData} isDisabledAddDeposits={isDisabledAddDeposits} error={error} setError={setError} textError={textError} setTextError={setTextError}/>
          <AddCustomerDialog active={!isDisabledAddCustomer.current} setActive={handleModalCustomer} setFullData={setFullData} isDisabledAddCustomer={isDisabledAddCustomer} error={error} setError={setError} textError={textError} setTextError={setTextError}/>
        </Suspense>
        <PageTitle title="Общества группы" button={<Button
                variant="contained"
                size="medium"
                color="secondary"
                style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
                onClick={handleModalCustomer}
                >
                Добавить общество
            </Button>} />
        <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={<Typography variant="h6">
            Список обществ группы
            {fullData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          </Typography>}
            data={fullData.map(item => item.short ? [item.name + ` (${item.short})`] : [item.name])}
            columns={[""]}
            options={{
              responsive: 'vertical',
              sort: false,
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
              expandableRows: true,
              expandableRowsHeader: false,
              rowsSelected: selectedRowCustomer,
              setRowProps: value => ({ style: { cursor: 'pointer' } }),
              selectableRowsOnClick: true,
              isRowExpandable: (dataIndex, expandedRows) => {
                // Prevent expand/collapse of any row if there are 1 row expanded already (but allow those already expanded to be collapsed)
                if (expandedRows.data.length > 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false
                else return true;
              },
              onRowExpansionChange: (currentRowsExpanded, allRowsExpanded, rowsExpanded) => {
                setCustomer_index(currentRowsExpanded[0].index);
              },
              onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                setSelectedRowCustomer(rowsSelected);
              },
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                <CustomToolbarSelectWithAdd selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeNameCustomer} onRowsDelete={rowsDeleteCustomer} onRowsAdd={fieldAdd}/>
              ),
              selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none'),
              selectableRowsHideCheckboxes: true,
              renderExpandableRow: (rowData, rowMeta) => {
                //setCustomer_index(rowMeta.dataIndex);
                return (
                  <React.Fragment>
                    <tr>
                      <td colSpan={6}>
                        <MUIDataTable
                          title="Месторождения"
                          data={fullData[rowMeta.dataIndex].field.map(item => [item.name])}
                          columns={[""]}
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
                              pagination: {
                                next: "Следующая страница",
                                previous: "Предыдущая страница",
                                rowsPerPage: "Строк на странице:",
                                displayRows: "из",
                              },
                              toolbar: {
                                search: "Поиск"
                              },
                              selectedRows: {
                                text: "строка выбрана"
                              },
                            },
                            rowsSelected: selectedRowField[rowMeta.dataIndex],
                            onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
                              selectedRowField[rowMeta.dataIndex] = rowsSelected;
                            },
                            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                              <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} onChangeName={changeNameField} onRowsDelete={rowsDeleteField}/>
                            ),
                            setRowProps: value => ({ style: { cursor: 'pointer' } }),
                            onRowClick: (rowData, rowMeta) => {
                              history.push({
                                pathname:  `/app/strata/${fullData[customer_index].field[rowMeta.dataIndex].id}`,
                             });
                            },
                            selectableRows: (role === "user" || role === "superuser" ? 'single' : 'none')
                          }}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              },
            }}
          />
        </Grid>
        </Grid>
        </>
    )
}

export default Customers;