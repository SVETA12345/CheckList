import React, {useEffect, useState} from "react";
import {
    Grid,
    Button,
    Typography,
    CircularProgress, 
    Chip
} from "@material-ui/core";

import MUIDataTable from "mui-datatables";

import PageTitle from "../../components/PageTitle";
import Blocked from "../../components/Blocked/Blocked";
import AdminDialog from "../../components/Dialogs/AdminDialog";

const Admin = () => {
    const [usersData, setUsersData] = useState([]);
    const [user, setUser] = useState({});
    const [showModalAdmin, setShowModalAdmin] = useState(false);
    const [checkPost, setCheckPost] = useState(false);
    const role = localStorage.getItem('role');
    const constant = false;

    const getUsers = () => {
        fetch(process.env.REACT_APP_API+'users/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setUsersData(data);
        })
    }

    const deleteUser = (user_id) => {
        fetch(process.env.REACT_APP_API+'informations/'+ user_id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
    }

    const handleModalAdmin = () => {
        setShowModalAdmin(!showModalAdmin);
    }

    useEffect(() => {
        getUsers();
    }, [constant])

    if (role === "superuser")
        return (
            <>
                <AdminDialog active={showModalAdmin} setActive={handleModalAdmin} user={user} checkPost={checkPost}/>
                <PageTitle title="Редактирование пользователей" button={<Button
                variant="contained"
                size="medium"
                color="secondary"
                style={{outline: "none", backgroundColor:"#34547A"}}
                onClick={() => {setCheckPost(true); setUser({}); handleModalAdmin();}}
                >
                Добавить нового пользователя
            </Button>} />
            <Grid item xs={12}>
                <MUIDataTable
                    title={<Typography variant="h6">
                    Список пользователей
                    {usersData.length === 0 && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                </Typography>}
                    data={usersData.map(item => [item.username, item.first_name, item.last_name, item.email, item.phone_number, <Chip style={{backgroundColor: (item.is_active ? "#22bd53" : "#f5364c"), color: "#fff"}} label={item.is_active ? "Разблокирован" : "Заблокирован"}/>, item.role])}
                    columns={["Логин", "Имя", "Фамилия", "E-mail", "Номер телефона", "Статус", "Роль"]}
                    options={{
                    filterType: "checkbox",
                    sort: false,
                    print: false,
                    download: false,
                    textLabels: {
                        body: {
                          noMatch: "Записей не найдено.",
                          toolTip: "Сортировать"
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
                    selectableRows: 'single',
                    onRowsDelete: (rowMeta) => {
                        if (window.confirm('Вы точно хотите удалить пользователя ' + usersData[rowMeta.data[0].dataIndex].username +'?'))
                            deleteUser(usersData[rowMeta.data[0].dataIndex].id);
                        else
                            getUsers();
                      },
                    setRowProps: value => ({ style: { cursor: 'pointer' } }),
                    onRowClick: (rowData, rowMeta) => {
                        setCheckPost(false);
                        setUser(usersData[rowMeta.dataIndex]);
                        handleModalAdmin();
                    }
                    }}
                />
            </Grid>
            </>
        )
    else return (<Blocked/>)
}

export default Admin;
