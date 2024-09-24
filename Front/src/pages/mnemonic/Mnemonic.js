import React, {useState, useRef, useEffect} from 'react';
import "../../pages/styles.css"

import PageTitle from "../../components/PageTitle";
import AddMethodClassDialog from '../../components/Dialogs/AddMethodClassDialog';
import AddMethodParamDialog from '../../components/Dialogs/AddMethodParamDialog';
import AddMethodDialog from '../../components/Dialogs/AddMethodDialog';
import EditMethodParamDialog from '../../components/Dialogs/EditMethodParamDialog';

import Blocked from '../../components/Blocked/Blocked';

import {useHistory} from 'react-router';

import {Form} from 'react-bootstrap';
import {
    Grid,
    IconButton,
    Tooltip,
    Button,
    Table, TableBody, TableCell, TableRow, TableHead,
    Card, CardContent,
} from "@material-ui/core";
import {
    AddCircleOutline as PlusIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    SettingsOutlined as SettingsOutlinedIcon
  } from "@material-ui/icons";
import Loading from '../../components/Loading/Loading';

function Mnemonic() {
    const [methodClasses, setMethodClasses] = useState([])
    const [methods, setMethods] = useState([])
    const [method, setMethod] = useState({})
    const [parametr, setParametr] = useState({})
    const [class_item, setClass_item] = useState({})
    const [methodParametrs, setMethodParametrs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [textError, setTextError] = useState('');
    const [showModalAddClass, setShowModalAddClass] = useState(false)
    const [showModalAddParam, setShowModalAddParam] = useState(false)
    const [showModalEditParam, setShowModalEditParam] = useState(false)
    const [showModalAddMethod, setShowModalAddMethod] = useState(false)

    const [editClass, setEditClass] = useState({})
    const [className, setClassName] = useState("")
    const [editMethod, setEditMethod] = useState({})
    const [methodName, setMethodName] = useState("")

    const constant = false;
    const role = localStorage.getItem('role')
    const history = useHistory()
    const isDisabledAddClass = useRef(true)
    const isDisabledAddMetod = useRef(true)
    const isDisabledAddParam= useRef(true)
    const isDisabledEditMethod=useRef(true)
    const getMnemonicFile = () => {
        fetch(process.env.REACT_APP_API+'mnemonic_file/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        })
      }

    const getMethodClasses = () => {
        fetch(process.env.REACT_APP_API+'method_class/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setMethodClasses(data)
            for (let i = 0; i < data.length; i++) {
                editClass[data.name] = false
            }
        })
    }
    const getMethods = () => {
        fetch(process.env.REACT_APP_API+'methods/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            setMethods(data)
            for (let i = 0; i < data.length; i++) {
                editMethod[data.name] = false
            }
        })
    }
    const getMethodParametrs = () => {
        fetch(process.env.REACT_APP_API+'method_parametrs/?format=json', { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token " + localStorage.getItem('id_token')
           }
        }) 
        .then(response=>response.json())
        .then(data=>{
            console.log('data', data)
            setIsLoading(false)
            setMethodParametrs(data)
        })
    }

    const deleteMethodClass = (item) => {
        if (window.confirm("Вы точно хотите удалить класс методов - " + item.name + "?")){
            fetch(process.env.REACT_APP_API+'method_class/'+ item.id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
            history.go(0)
        }
    }

    const deleteMethod = (item) => {
        if (window.confirm("Вы точно хотите удалить метод - " + item.name + "?")){
            fetch(process.env.REACT_APP_API+'methods/id/'+ item.id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
            history.go(0)
        }
    }

    const deleteParam = (item) => {
            let newMethodParametrs=[];
            fetch(process.env.REACT_APP_API+'method_parametrs/id/'+ item.id +'?format=json', { method: 'DELETE', headers: {'Authorization': "Token " + localStorage.getItem('id_token')} })
            .then((res)=>{if (res.ok){              
                for (let i=0; i<methodParametrs.length; i+=1){
                    if (item.id!==methodParametrs[i].id){
                        newMethodParametrs.push(methodParametrs[i]);
                    }
                }
                setMethodParametrs(newMethodParametrs)
            }
            else{
                console.log(`Error `+res.status)
            }
        })
    }

    const onSubmitEditClass = (e, classId, class_name) => {
        e.preventDefault()
        if (class_name !== className) {
            fetch(process.env.REACT_APP_API+'method_class/'+ classId + '?format=json',{
                method: 'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization': "Token " + localStorage.getItem('id_token')
                },
                body: JSON.stringify({
                    "name": className
                }) 
            }) 
            var mass = [...methodClasses]
            var index = methodClasses.findIndex(item => item.id == classId)
            mass.splice(index, 1)
            mass.splice(index, 0, {"id": classId, "name": className})
            setMethodClasses(mass)
        }
        setEditClass({...editClass, [className]: false})
    };

    const onSubmitEditMethod = (e, met) => {
        e.preventDefault()
        if (met.name !== methodName) {
            fetch(process.env.REACT_APP_API+'methods/id/'+ met.id + '?format=json',{
                method: 'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization': "Token " + localStorage.getItem('id_token')
                },
                body: JSON.stringify({
                    "name": methodName
                }) 
            }) 
            var mass = [...methods]
            var index = methods.findIndex(item => item.id == met.id)
            mass.splice(index, 1)
            mass.splice(index, 0, {"id": met.id, "name": methodName, "method_class_id": met.method_class_id})
            setMethods(mass)
        }
        setEditMethod({...editMethod, [methodName]: false})
    };

    const allFalse = (obj) => {
        for (var key in obj)
            obj[key] = false
        return obj
    }

    const handleModalAddClass = () => {
        setTextError('')
        isDisabledAddClass.current=!isDisabledAddClass.current
        setShowModalAddClass(!showModalAddClass)
    }
    const handleModalAddParam = () => {
        setTextError('')
        isDisabledAddParam.current=!isDisabledAddParam.current
        setShowModalAddParam(!showModalAddParam)
    }
    const handleModalEditParam = () => {
        setTextError('')
        isDisabledEditMethod.current=!isDisabledEditMethod.current
        setShowModalEditParam(!showModalEditParam)
    }
    const handleModalAddMethod = () => {
        setTextError('')
        isDisabledAddMetod.current=!isDisabledAddMetod.current
        setShowModalAddMethod(!showModalAddMethod)
    }

    useEffect(() => {
        getMnemonicFile()
        getMethodClasses()
        getMethods()
        getMethodParametrs()
    }, [constant])
    if (role === "superuser")
    if (!isLoading)
    return(
        <>
        <AddMethodClassDialog  active={!isDisabledAddClass.current} setActive={handleModalAddClass} isDisabledAddClass={isDisabledAddClass} getMethodClasses={getMethodClasses} textError={textError} setTextError={setTextError}/>
        <AddMethodDialog active={!isDisabledAddMetod.current} setActive={handleModalAddMethod} class_item={class_item} isDisabledAddMetod={isDisabledAddMetod} getMethods={getMethods} textError={textError} setTextError={setTextError}/>
        <AddMethodParamDialog active={!isDisabledAddParam.current} setActive={handleModalAddParam} method={method} isDisabledAddParam={isDisabledAddParam} getMethodParametrs={getMethodParametrs} textError={textError} setTextError={setTextError}/>
        <EditMethodParamDialog active={!isDisabledEditMethod.current} setActive={handleModalEditParam} parametr={parametr} isDisabledEditMethod={isDisabledEditMethod} setMethodParametrs={setMethodParametrs} textError={textError} setTextError={setTextError} methodParametrs={methodParametrs}/>
        <PageTitle title="База мнемоник" 
            button={<a className="fileButton"
              style={{marginRight: "2rem", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
              href="https://gis.igirgi.su/dj/files/mnemonics.json"
              download
              >
                  Выгрузить JSON файл
            </a>} 
            button2={<Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={handleModalAddClass}
            style={{outline: 'none', visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}
        >
            Создать класс методов ГИС
        </Button>} />
        <Grid container spacing={4}>
            <Grid item xs="12">
                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Метод ГИС</TableCell>
                                    <TableCell>Регистрируемый параметр</TableCell>
                                    <TableCell>Сокращение на латинице</TableCell>
                                    <TableCell>Тип кривой</TableCell>
                                    <TableCell>Единицы измерения</TableCell>
                                    <TableCell>Описание</TableCell>
                                    {(role === "user" || role === "superuser") && <TableCell style={{width: "225px"}}></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    methodClasses.map(cl_item => {return (
                                    <>
                                    <TableRow>
                                        <TableCell align="center" colSpan={(role === "user" || role === "superuser") ? 7 : 6}>
                                            <b style={{display:(editClass[cl_item.name] && 'none')}} 
                                            onClick={() => {
                                                if (role === "user" || role === "superuser") {
                                                    setClassName(cl_item.name); 
                                                    setEditClass(allFalse(editClass)); 
                                                    setEditClass({...editClass, [cl_item.name]: true})
                                                }
                                                }}>
                                            {cl_item.name}</b>
                                            <Form style={{width: "25%", display:(editClass[cl_item.name] ? 'inline-block' : 'none')}} onSubmit={(e) => onSubmitEditClass(e, cl_item.id, cl_item.name)}>
                                                <Form.Control
                                                    type="text"
                                                    id="edit_class"
                                                    value={className}
                                                    style={{textAlign: "center"}}
                                                    onChange={e => setClassName(e.target.value)}
                                                />
                                            </Form>
                                            <Tooltip title="Добавить метод ГИС для класса">
                                            <IconButton 
                                            aria-label="add_method" 
                                            style={{outline: 'none', visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden'), display:((role !== "user" || role !== "superuser") && editClass[cl_item.name]) && 'none'}}
                                            onClick={() => {setClass_item(cl_item); handleModalAddMethod();}}>
                                                <PlusIcon />
                                            </IconButton>
                                            </Tooltip>
                                            <IconButton
                                            style={{outline: "none", display:((role !== "user" || role !== "superuser") && !editClass[cl_item.name]) && 'none'}}
                                            onClick={() => {deleteMethodClass(cl_item)}}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {methods.filter(m_item => m_item.method_class_id == cl_item.id).map(item => {
                                        const mass_method_param = methodParametrs.filter(mp => mp.method_id === item.id)
                                        
                                        return (
                                        <>
                                        <TableRow>
                                            <TableCell rowSpan={mass_method_param.length == 0 ? 1 : mass_method_param.length}>
                                                <b style={{display:(editMethod[item.name] && 'none')}} 
                                                onClick={() => {
                                                    if (role === "user" || role === "superuser") {
                                                        setMethodName(item.name); 
                                                        setEditMethod(allFalse(editMethod)); 
                                                        setEditMethod({...editMethod, [item.name]: true})
                                                    }
                                                }}>
                                                    {item.name}
                                                </b>
                                                <Form style={{width: "60%", display:(editMethod[item.name] ? 'inline-block' : 'none')}} onSubmit={(e) => onSubmitEditMethod(e, item)}>
                                                    <Form.Control
                                                        type="text"
                                                        id="edit_class"
                                                        value={methodName}
                                                        style={{textAlign: "center"}}
                                                        onChange={e => setMethodName(e.target.value)}
                                                    />
                                                </Form>
                                                <Tooltip title="Добавить параметр для метода">
                                                <IconButton
                                                    aria-label="add_method_param"
                                                    
                                                    style={{outline: 'none', visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden'), display:((role !== "user" || role !== "superuser") && editMethod[item.name]) && 'none'}}
                                                    onClick={() => {setMethod(item); handleModalAddParam();}}>
                                                    <PlusIcon />
                                                </IconButton>
                                                </Tooltip>
                                                <IconButton
                                                style={{outline: "none", display:((role !== "user" || role !== "superuser") && !editMethod[item.name]) && 'none'}}
                                                onClick={() => deleteMethod(item)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{mass_method_param[0] !== undefined ? mass_method_param[0].name : <>&mdash;</>}</TableCell>
                                            <TableCell>{mass_method_param[0] !== undefined ? mass_method_param[0].abbreviation : <>&mdash;</>}</TableCell>
                                            <TableCell>{mass_method_param[0] !== undefined ? mass_method_param[0].curve_type : <>&mdash;</>}</TableCell>
                                            <TableCell>{mass_method_param[0] !== undefined ? mass_method_param[0].units.map(u => {return (<span>{u} </span>)}) : <>&mdash;</>}</TableCell>
                                            <TableCell>{mass_method_param[0] !== undefined ? mass_method_param[0].description : <>&mdash;</>}</TableCell>
                                            {(role === "user" || role === "superuser") &&
                                            <TableCell>
                                                {mass_method_param[0] !== undefined ?
                                                <><IconButton
                                                style={{outline: "none"}}
                                                onClick={() => history.push({pathname:  `/app/mnemonic/${mass_method_param[0].id}`})}
                                                >
                                                    <SettingsOutlinedIcon />
                                                </IconButton>
                                                <IconButton
                                                style={{outline: "none"}}
                                                onClick={() => {setParametr(mass_method_param[0]); handleModalEditParam();}}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                style={{outline: "none"}}
                                                onClick={() => deleteParam(mass_method_param[0])}
                                                >
                                                    <DeleteIcon />
                                                </IconButton></>
                                                : <>&mdash;</>}
                                            </TableCell>}
                                        </TableRow>
                                        {mass_method_param.filter(mmp => mmp.id !== mass_method_param[0].id).map(i => {return (
                                            <TableRow>
                                                <TableCell>{i.name}</TableCell>
                                                <TableCell>{i.abbreviation}</TableCell>
                                                <TableCell>{i.curve_type}</TableCell>
                                                <TableCell>{i.units.map(u => {return (<span>{u} </span>)})}</TableCell>
                                                <TableCell>{i.description}</TableCell>
                                                {(role === "user" || role === "superuser") &&
                                                <TableCell>
                                                    <IconButton
                                                    style={{outline: "none"}}
                                                    onClick={() => history.push({pathname:  `/app/mnemonic/${i.id}`})}
                                                    >
                                                        <SettingsOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton
                                                    style={{outline: "none"}}
                                                    onClick={() => {setParametr(i); handleModalEditParam();}}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                    style={{outline: "none"}}
                                                    onClick={() => deleteParam(i)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>}
                                            </TableRow>
                                        )})}
                                        </>
                                    )})}
                                
                                    </>
                                    )
                                })
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </>
    )
    else return (<Loading/>)
    else return (<Blocked/>)
}

export default Mnemonic