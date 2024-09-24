import React, {useState, useEffect} from 'react';

import {
    TextField, FormControl, Select, Checkbox,
    Grid, Card, CardContent, OutlinedInput, MenuItem,
    Dialog, DialogContent, DialogTitle, DialogActions, ListItemText
} from "@material-ui/core";

import { Button, Form, Row, Col } from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import SuccessToast from '../Toasts/SuccessToast';
import { useHistory } from 'react-router';

import "../../pages/styles.css";

import {styleBlueInput} from "../../pages/checklist/styles";
import ValidAdmin from '../Toasts/ValidAdmin';
import {IMaskInput} from "react-imask";
import {MenuProps} from "../../pages/checklist/data";

function AdminDialog({active, setActive, user, checkPost}) {
    const constant = false;
    const history = useHistory()
    const [user_login, setUser_login] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [checkpassword, setCheckpassword] = useState("");
    const [role, setRole] = useState("");
    const [is_active, setIs_active] = useState(true);
    const [changePass, setChangePass] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [showValid, setShowValid] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const [customersData, setCustomersData] = useState([]);

    const handleToastValid = () => {
        setShowValid(!showValid);
    }
    const handleSuccessToast = () => {
        setShowSuccessToast(!showSuccessToast);
    }

    const check_validity = () => {
        return user_login === "" || name === "" || surname === "" || email === "" || tel === "" || password === "" || checkpassword === "" || role === "";
    }

    function getCustomers() {
        fetch(process.env.REACT_APP_API+'customers?format=json', { headers : { 
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

    const postUser = () => {
        if(!check_validity() && password === checkpassword) {
        fetch(process.env.REACT_APP_API+'users/?format=json',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "username": user_login,
                "first_name": name,
                "last_name": surname,
                "email": email,
                "phone_number": tel,
                "password": password,
                "is_active": is_active,
                "is_staff": false,
                "is_superuser": role === "superuser" ? true : false,
                "role": role,
                "customers": customers
            }) 
        })
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            else setActive();
          })
        } else handleToastValid();
    }

    const changePassword = (id) => {
        if(changePass && password === checkpassword) {
        fetch(process.env.REACT_APP_API+'password/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "password": password
            }) 
        })
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            else {handleSuccessToast();
                history.go(0);}
          })
    }
    }

    const changeAccess = (id) => {
        fetch(process.env.REACT_APP_API+'customer_permissions/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "role": role,
                "customers": customers
            }) 
        })
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            else {handleSuccessToast();
                history.go(0);
            }
          })
          console.log(JSON.stringify({
            "role": role,
            "customers": customers
        }))
    }

    const changeInformation = (id) => {
        fetch(process.env.REACT_APP_API+'informations/'+ id +'?format=json',{
            method: 'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': "Token " + localStorage.getItem('id_token')
            },
            body: JSON.stringify({
                "id": id,
                "username": user_login,
                "first_name": name,
                "last_name": surname,
                "email": email,
                "phone_number": tel,
                "is_superuser": role === "superuser" ? true : false,
                "is_active": is_active
            }) 
        })
        .then((response) => {
            if(!response.ok) throw new Error(response.status);
            else {handleSuccessToast();
                history.go(0)}
          })
    }

    useEffect(() => {
        getCustomers();
    }, [constant])

    useEffect(() => {
        if (!checkPost) {
            setUser_login(user.username);
            setName(user.first_name);
            setSurname(user.last_name);
            setEmail(user.email);
            setTel(user.phone_number);
            setIs_active(user.is_active);
            setRole(user.role);
            user.hasOwnProperty('customers') ? setCustomers(user.customers.map(item => item.id)) : setCustomers([]);
        } else setIs_active(true)
    }, [user])

    useEffect(() => {
        console.log(is_active)
    })

    return (
        <>
            <ValidAdmin active={showValid} setActive={handleToastValid}/>
            <SuccessToast active={showSuccessToast} setActive={handleSuccessToast}/>
            <Dialog open={active} onClose={setActive} maxWidth="lg" fullWidth>
                <DialogTitle>{checkPost ? "Добавление пользователя" : "Редактирование пользователя"}</DialogTitle>
                <Form name="addservice">
                    <DialogContent>
                    <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Card
                                sx={{ minWidth: 275 }}
                                elevation={4}
                                style={{
                                borderRadius: "15px",
                                backgroundColor: "#3F6694",
                                color: "#fff",
                                height:"100%"
                                }}
                            >
                            <CardContent style={{ paddingBottom: "0", color:"white"}}>
                                <Row style={{paddingBottom:"1rem"}}>
                                    <Col style={{fontSize:"20px", fontWeight:"700"}}>Основная информация</Col>
                                </Row>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Логин пользователя
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        id="login_user"
                                        name="login_user"
                                        value={user_login}
                                        style={styleBlueInput}
                                        onChange={(e) => setUser_login(e.target.value.toLowerCase())}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Имя
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        id="name"
                                        name="name"
                                        value={name}
                                        style={styleBlueInput}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Фамилия
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        id="surname"
                                        name="surname"
                                        value={surname}
                                        style={styleBlueInput}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    E-mail
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        style={styleBlueInput}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Телефон
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        as={IMaskInput}
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        mask={"+7(000)000-00-00"}
                                        value={tel}
                                        style={styleBlueInput}
                                        onChange={(e) => setTel(e.target.value)}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Заблокировать
                                    </Form.Label>
                                    <Col sm="6" style={{textAlign:"center"}}>
                                    <BootstrapSwitchButton 
                                    checked={is_active} 
                                    width={200}
                                    onChange={(checked) => setIs_active(checked)} 
                                    onlabel="Разблокирован" 
                                    offlabel="Заблокирован" 
                                    onstyle="success" 
                                    offstyle="danger" />  
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col sm="8"></Col>
                                    <Col sm="4"><Button variant="yellow" style={{height:"100%", width:"100%", display:(checkPost ? 'none' : 'block')}} onClick={() =>{ changeInformation(user.id);localStorage.setItem('name', name);}}>Сохранить</Button></Col>
                                </Form.Group>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={6}>
                        <Card
                                sx={{ minWidth: 275 }}
                                elevation={4}
                                style={{
                                borderRadius: "15px",
                                backgroundColor: "#3F6694",
                                color: "#fff",
                                marginBottom:"1.5rem"
                                }}
                            >
                            <CardContent style={{ paddingBottom: "0", color:"white"}}>
                                <Row style={{paddingBottom:"1rem"}}>
                                    <Col style={{fontSize:"20px", fontWeight:"700"}}>Поменять пароль</Col>
                                </Row>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Введите новый пароль
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        style={styleBlueInput}
                                        onChange={(e) => {setPassword(e.target.value); setChangePass(true);}}
                                    />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Введите пароль ещё раз
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        type="password"
                                        id="checkpassword"
                                        name="checkpassword"
                                        value={checkpassword}
                                        style={styleBlueInput}
                                        onChange={(e) => setCheckpassword(e.target.value)}
                                    />
                                    <Form.Text style={{fontSize:"14px", color:"white", display: (password === checkpassword ? 'none' : 'block')}}>
                                        Пароли не совпадают!
                                    </Form.Text>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col sm="8"></Col>
                                    <Col sm="4"><Button variant="yellow" style={{height:"100%", width:"100%", display:(checkPost ? 'none' : 'block')}} onClick={() => changePassword(user.id)}>Сохранить</Button></Col>
                                </Form.Group>
                            </CardContent>
                        </Card>
                        <Card
                                sx={{ minWidth: 275 }}
                                elevation={4}
                                style={{
                                borderRadius: "15px",
                                backgroundColor: "#3F6694",
                                color: "#fff"
                                }}
                            >
                            <CardContent style={{ paddingBottom: "0", color:"white"}}>
                                <Row style={{paddingBottom:"1rem"}}>
                                    <Col style={{fontSize:"20px", fontWeight:"700"}}>Информация по доступу к ресурсу</Col>
                                </Row>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Роль пользователя
                                    </Form.Label>
                                    <Col sm="6">
                                    <Form.Control
                                        as="select"
                                        id="role"
                                        name="role"
                                        value={role}
                                        style={styleBlueInput}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option key="0" hidden></option>
                                        <option key="1" value="user">Редактор ОГ</option>
                                        <option key="2" value="viewer">Просмотр</option>
                                        <option key="3" value="superviewer">Просмотр всех ОГ</option>
                                        <option key="4" value="superuser">admins</option>
                                    </Form.Control>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="6" style={{fontSize: "18px"}}>
                                    Доступные ОГ
                                    </Form.Label>
                                    <Col sm="6">
                                    {/*<Form.Control
                                        as="select"
                                        multiple
                                        id="customers"
                                        name="customers"
                                        value={customers}
                                        style={styleBlueInput}
                                        onChange={e => setCustomers([].slice.call(e.target.selectedOptions).map(item => item.value))}
                                    >
                                        {customersData.map(item => {return <option key={item.name} value={item.id}>{item.name}</option>})}
                                    </Form.Control>*/}
                                    <FormControl
                                        id="customers"
                                        name="customers"
                                    >
                                        <Select
                                        disabled={role === "superuser" || role === "superviewer"}
                                        id="customers_select"
                                        name="customers_select"
                                        multiple
                                        value={customers}
                                        renderValue={selected => selected.map(select => customersData.find(item => item.id === select).name).join(', ')}
                                        onChange={(e) => setCustomers(e.target.value)}
                                        input={
                                            <OutlinedInput
                                            style={{ width: "268px", height: "38px", color:"white", fontSize:"20px", fontWeight:"700" }}
                                            />
                                        }
                                        MenuProps={MenuProps}
                                        >
                                        {customersData.map(item => (
                                            <MenuItem key={item.id} value={item.id}>
                                            <Checkbox
                                                checked={
                                                customers.toString().indexOf(item.id) > -1
                                                }
                                            />
                                            <ListItemText primary={item.name} />
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Col sm="8"></Col>
                                    <Col sm="4"><Button variant="yellow" style={{height:"100%", width:"100%", display:(checkPost ? 'none' : 'block')}} onClick={() => changeAccess(user.id)}>Сохранить</Button></Col>
                                </Form.Group>
                            </CardContent>
                        </Card>
                    </Grid>
                    </Grid>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => {postUser(); setActive(); history.go(0);}} style={{outline: "none", visibility:(checkPost ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
                </Form>
            </Dialog>   
        </>
    )
}

export default AdminDialog;