import React, {useState, useEffect, Suspense} from 'react';

//import {DropdownButton, Dropdown} from 'react-bootstrap';
import {
    Grid,
//    Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
    Button,
    CircularProgress,
    Typography,
//    Paper
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router";
//import { MdDeleteSweep } from 'react-icons/md';

import PageTitle from "../../components/PageTitle";
//import { unique, optimize_for_table } from './Scripts';
//import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import Loading from '../../components/Loading/Loading';

const AddToolDialog = React.lazy(() => import('../../components/Dialogs/AddToolDialog'));

function Service(props) {
    const [servicesData, setServicesData]= useState({});
    const [method_index, setMethod_index] = useState(null)
    const constant = false;
    const history = useHistory();
    //const [names_methods, setNames_methods] = useState([]);
    //const [optimizedData, setOptimizedData] = useState([]);
    const [showModalAddTool, setShowModalAddTool] = useState(false);
    const role = localStorage.getItem('role');

    useEffect(() => {
        getService(props);
      }, [constant])

    const getService = (props) => {
        fetch(process.env.REACT_APP_API+'full_data_services/'+ props.match.params.id +'?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setServicesData(data)
            //setNames_methods(unique(data.method.map(item => item.method_class_name)));
            //setOptimizedData(optimize_for_table(data.method, unique(data.method.map(item => item.method_class_name))))
        })
    }

    const deleteTool = (tool_id) => {
        if (role === ("superuser" || "user"))
            fetch(process.env.REACT_APP_API+'service_methods/id/'+ tool_id + '?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
      }

    /*const runCallbackTableRow = (cb) => {
        return cb();
      };
    const runCallbackTableCell = (cb) => {
        return cb();
    };
    */
    const handleModalAddTool = () => {
        setShowModalAddTool(!showModalAddTool);
    }

    if (servicesData.method)
    return (
        <>
        <Suspense fallback={<p style={{zIndex: "9999"}}></p>}>
            <AddToolDialog active={showModalAddTool} setActive={handleModalAddTool} service_id={props.match.params.id}/>
        </Suspense>
        <PageTitle title={`${servicesData.name} (${servicesData.short})`} button={<Button
            variant="contained"
            size="medium"
            color="secondary"
            style={{outline: "none", backgroundColor:"#34547A", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
            onClick={() => handleModalAddTool()}
            >
                Добавить инструмент
            </Button>} />
        <Grid container spacing={4}>
            <Grid item xs={12}>
            {/*<TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                            names_methods.length !==0 ? names_methods.map(item => { return <TableCell align="center">{item}</TableCell>}) : <TableCell align="center">МЕТОДОВ В СЕРВИСНОЙ КОМПАНИИ НЕ НАЙДЕНО</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {runCallbackTableRow(() => {
                            const row = [];
                            const copy_optimized = [...optimizedData]
                            for (var i = 0; i < Math.ceil(optimizedData.length / names_methods.length); i++) {
                                row.push(<TableRow>
                                    {runCallbackTableCell(() => {
                                        const cells = [];
                                        for (var j = 0; j < names_methods.length; j++){
                                            cells.push(<TableCell align="center" style={{minWidth:"100%"}}>
                                                {copy_optimized[j].name !== undefined && <DropdownButton variant="secondary" style={{minWidth:"100%"}} drop="right" title={copy_optimized[j].name}>
                                                    {copy_optimized[j].device !== undefined && copy_optimized[j].device.map(item => {
                                                        return <Dropdown.Item style={{width:"100%", textAlign:"center", fontSize:"20px"}} onClick={() => {deleteTool(item.id_service_method); history.go(0);}}>{(role === ("superuser" || "user")) && <MdDeleteSweep/>}&ensp;{item.tool_type}</Dropdown.Item>
                                                    })}
                                                </DropdownButton>}
                                            </TableCell>);
                                        }
                                        copy_optimized.splice(0, names_methods.length); 
                                        return cells;
                                    })}
                                </TableRow>);
                            }
                            return row;
                        })}
                    </TableBody>
                </Table>
                    </TableContainer>*/}
            <MUIDataTable
            title={<Typography variant="h6">
            Список методов и инструментов
          </Typography>}
            data={servicesData.method.map(item => [item.name])}
            columns={["Список методов в базе данных"]}
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
              },
              expandableRows: true,
              expandableRowsHeader: false,
              onRowExpansionChange: (currentRowsExpanded, allRowsExpanded, rowsExpanded) => {
                setMethod_index(currentRowsExpanded[0].index);
              },
              isRowExpandable: (dataIndex, expandedRows) => {
                // Prevent expand/collapse of any row if there are 1 row expanded already (but allow those already expanded to be collapsed)
                if (expandedRows.data.length > 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false
                else return true;
              },
              selectableRows: 'none',
              renderExpandableRow: (rowData, rowMeta) => {
                return (
                  <React.Fragment>
                    <tr>
                      <td colSpan={6}>
                        <MUIDataTable
                          title="Сервисные приборы"
                          data={ servicesData && servicesData.method[rowMeta.dataIndex].device.map(item => [item.tool_type])}
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
                            onRowsDelete: (rowMeta) => {
                                if (window.confirm('Вы действительно хотите удалить инструмент '+ servicesData.method[method_index].device[rowMeta.data[0].dataIndex].tool_type +' из списка инструментов?'))
                                    deleteTool(servicesData.method[method_index].device[rowMeta.data[0].dataIndex].id_service_method)
                                else
                                    getService(props)
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
            <Grid item xs={12}>    
                <Button color="secondary" variant="contained" onClick={() => {history.goBack()}} style={{outline: "none", backgroundColor:"#34547A"}}>Вернуться назад</Button>    
            </Grid>
        </Grid>
        
        </>
    )
    else return (<Loading/>)
}

export default Service;