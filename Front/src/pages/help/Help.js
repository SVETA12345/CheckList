import React, {useState} from 'react';

import {
    Grid
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Description as DescriptionIcon,
    NoteAdd as NoteAddIcon,
    Storage as StorageIcon,
    TableChart as TableChartIcon,
    Toll as TollIcon,
} from "@material-ui/icons";

import img1 from "./images/1.png"
import img2 from "./images/2.png"
import img3 from "./images/3.png"
import img4 from "./images/4.png"
import img5 from "./images/5.png"
import img6 from "./images/6.png"
import img7a from "./images/7a.png"
import img7b from "./images/7b.png"
import img7c from "./images/7c.png"
import img8 from "./images/8.png"
import img9 from "./images/9.png"
import img10 from "./images/10.png"
import img11 from "./images/11.png"
import img12 from "./images/12.png"
import img13 from "./images/13.png"
import img14 from "./images/14.png"
import img15 from "./images/15.png"
import img16 from "./images/16.png"
import img17 from "./images/17.png"
import img18 from "./images/18.png"
import img19 from "./images/19.png"
import img20 from "./images/20.png"
import img21 from "./images/21.png"
import img22 from "./images/22.png"
import img23 from "./images/23.png"
import img24 from "./images/24.png"
import img25 from "./images/25.png"
import img26 from "./images/26.png"
import img27 from "./images/27.png"
import img28 from "./images/28.png"
import img29 from "./images/29.png"
import img30 from "./images/30.png"
import img31 from "./images/31.png"
import img32 from "./images/32.png"
import img33 from "./images/33.png"
import img34 from "./images/34.png"
import img35 from "./images/35.png"
import img36 from "./images/36.png"
import img37 from "./images/37.png"
import img38a from "./images/38a.png"
import img38b from "./images/38b.png"
import img38c from "./images/38c.png"

import PageTitle from "../../components/PageTitle";
import CustomAccordion from './CustomAccordion';
import {fixImg, marginSpan, helpContainer} from "./styles"

const data = [
    {
        panelNum: "panel1",
        icon: <PersonIcon/>,
        name: "Общества группы",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>Данный раздел содержит список обществ группы.</span>
            <img src={img1} style={fixImg}/>
            <span style={marginSpan}>A также списки относящихся к ним месторождений.</span>
            <img src={img2} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно добавить новое общество группы.</span> 
            <img src={img3} style={fixImg}/>
            <span style={marginSpan}>Для каждого общества группы доступны функции <b>добавления</b> нового месторождения, <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img4} style={fixImg}/>
            <span style={marginSpan}>Для каждого месторождения доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img5} style={fixImg}/>
            <span style={marginSpan}><b>При нажатии</b> на любое месторождение открываются подразделы «Настройка петрофизической задачи» и «Пласты месторождения …»</span>
            <img src={img6} style={fixImg}/>
            <span style={marginSpan}>В подразделе «Настройка петрофизической задачи» можно посмотреть или, если необходимо, изменить вклад любого метода ГИС в решение определённой петрофизической задачи для данного месторождения. Для этого нужно из выпадающего списка во вкладке «Метод» выбрать метод ГИС, изменить значение вклада и <b>нажать кнопку «Сохранить»</b>.</span>
            <img src={img7a} style={fixImg}/>
            <img src={img7b} style={fixImg}/>
            <img src={img7c} style={fixImg}/>
            <span style={marginSpan}>В подразделе «Пласты месторождения …» содержится список пластов данного месторождения.</span>
            <img src={img8} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно добавить новый пласт.</span>
            <img src={img9} style={fixImg}/>
            <span style={marginSpan}>Для каждого пласта доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img10} style={fixImg}/>
            <span style={marginSpan}>В прикреплённых файлах содержатся методические рекомендации по определению ФЕС в скважинах, вышедших из бурения по данному месторождению. Можно самостоятельного добавить новый файл.</span>
            <img src={img11} style={fixImg}/>
            <div style={{marginBottom: "2rem"}}></div>
        </div>
    },
    {
        panelNum: "panel2",
        icon: <StorageIcon/>,
        name: "Создать скважину",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>
                Данный раздел предназначен для создания скважин.<br/>
                Для этого необходимо выбрать <b>общество группы</b> и <b>месторождение</b>, на котором ведется бурение этой скважины 
                (база обществ группы и месторождений находится в разделе <a href="/app/customers">«Общества группы»</a>), и <b>последовательно</b> внести 
                данные о номере куста, номере скважины и её типе (вертикальная, горизонтальная, многозабойная, многоствольная или наклонно-направленная) 
                и об участке ствола (боковой, пилотный, транспортный, горизонтальный), его номере и диаметре.
            </span>
            <img src={img12} style={fixImg}/>
            <span style={marginSpan}>
                Все созданные скважины хранятся в разделе <a href="/app/trackedwells">«База данных скважин»</a>.<br/>
                Для свойств всех кустов, скважин и стволов доступны функции <b>изменения</b> названия и <b>удаления</b>.
            </span>
            <img src={img13} style={fixImg}/>
            <div style={{marginBottom: "2rem"}}></div>
        </div>
    },
    {
        panelNum: "panel3",
        icon: <SettingsIcon/>,
        name: "Сервисные компании",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>Данный раздел содержит список сервисных компаний.</span>
            <img src={img14} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно <b>добавить</b> новую сервисную компанию.</span>
            <img src={img15} style={fixImg}/>
            <span style={marginSpan}>Для каждой сервисной компании доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img16} style={fixImg}/>
            <span style={marginSpan}>При нажатии на любую сервисную компанию появляется список методов данной сервисной компании.</span>
            <img src={img17} style={fixImg}/>
            <span style={marginSpan}>При выборе любого метода сервисной компании появляется информация о приборе.</span>
            <img src={img18} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно <b>добавить</b> новый метод и прибор сервисной компании.</span>
            <img src={img19} style={fixImg}/>
            <span style={marginSpan}>Для каждого прибора доступна функция <b>удаления</b>; с удалением прибора удаляется и метод.</span>
            <img src={img20} style={fixImg}/>
            <div style={{marginBottom: "2rem"}}></div>
        </div>
    },
    {
        panelNum: "panel4",
        icon: <TableChartIcon/>,
        name: "База мнемоник",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>
                Данный раздел содержит информацию о методах ГИС (регистрируемый параметр, сокращение на латинице, тип кривой, единица измерения, описание), сгруппированных в классы.
            </span>
            <img src={img21} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно <b>добавить</b> новый класс методов ГИС.</span>
            <img src={img22} style={fixImg}/>
            <span style={marginSpan}>Для каждого класса методов ГИС доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img23} style={fixImg}/>
            <span style={marginSpan}>В любой класс методов ГИС можно самостоятельно <b>добавить</b> новый метод.</span>
            <img src={img24} style={fixImg}/>
            <span style={marginSpan}>Для каждого метода ГИС доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img25} style={fixImg}/>
            <span style={marginSpan}>В любой метод ГИС можно самостоятельно <b>добавить</b> новый регистрируемый параметр.</span>
            <img src={img26} style={fixImg}/>
            <span style={marginSpan}>Для каждого регистрируемого параметра метода ГИС доступны функции <b>изменения</b> названия и <b>удаления</b>.</span>
            <img src={img27} style={fixImg}/>
            <div style={{marginBottom: "2rem"}}></div>
        </div>
    },
    {
        panelNum: "panel5",
        icon: <NoteAddIcon/>,
        name: "Создать отчет",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>
                Данный раздел предназначен для создания отчётов. Для этого необходимо <b>последовательно</b> заполнить <b style={{color: "red"}}>ВЕСЬ верхний блок</b> в листе оценки ГИС.
            </span>
            <img src={img28} style={fixImg}/>
            <span style={marginSpan}>
                Нижний блок можно заполнить сразу в этом разделе либо позже в разделе <a href="/app/reports">«Отчёты по контролю качества»</a>.
            </span>
        </div>
    },
    {
        panelNum: "panel6",
        icon: <DescriptionIcon/>,
        name: "Отчеты по контролю качества",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>Данный раздел содержит список созданных отчётов.</span>
            <img src={img29} style={fixImg}/>
            <span style={marginSpan}>Можно <b>отредактировать</b> шаблон выгрузки Excel, скачав, изменив и загрузив его обратно.</span>
            <img src={img30} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно <b>добавить</b> новый отчёт, и тогда откроется раздел <a href="/app/checklist">«Создать отчёт»</a>.</span>
            <img src={img31} style={fixImg}/>
            <span style={marginSpan}>Для каждого отчёта доступна функция <b>удаления</b>.</span>
            <img src={img32} style={fixImg}/>
            <span style={marginSpan}>
                При нажатии на любой отчёт открывается полная информация о нём. Здесь можно <b>заполнить нижний блок</b>, если это не было сделано ранее (при создании отчёта в разделе <a href="/app/checklist">«Создать отчёт»</a>).
            </span>
            <img src={img33} style={fixImg}/>
            <span style={marginSpan}>
                Для того чтобы добавить новый интервал секции, можно просто <b>изменить значения интервала</b> и дату ГИС (если необходимо) и нажать кнопку <b>«Сохранить»</b>.
            </span>
            <img src={img34} style={fixImg}/>
            <span style={marginSpan}>
                После добавления нового интервала секции <b>автоматически</b> создастся новый отчёт.
            </span> 
        </div>
    },
    {
        panelNum: "panel7",
        icon: <TollIcon/>,
        name: "База данных скважин",
        text:
        <div style={helpContainer}>
            <span style={marginSpan}>Данный раздел содержит список сопровождаемых скважин.</span>
            <img src={img35} style={fixImg}/>
            <span style={marginSpan}>Можно самостоятельно <b>добавить</b> новый ствол скважины, и тогда откроется раздел <a href="/app/database">«Создать скважину»</a>.</span>
            <img src={img36} style={fixImg}/>
            <span style={marginSpan}>Для добавления информации о скважине <b>нужно нажать</b> на неё <b>и заполнить</b> все необходимые поля.</span>
            <img src={img37} style={fixImg}/>
            <div style={{marginBottom: "2rem"}}></div>
        </div>
    },
    {
        panelNum: "panel8",
        icon: <DeleteIcon/>,
        name: "Корзина",
        text: 
        <div style={helpContainer}>
            <span style={marginSpan}>
                Данный раздел содержит все удалённые объекты.<br/>
                Для того чтобы восстановить или удалить окончательно объект, <b>необходимо выбрать категорию объекта и сам объект</b>.
            </span>
            <img src={img38a} style={fixImg}/>
            <img src={img38b} style={fixImg}/>
            <img src={img38c} style={fixImg}/>
            <span style={marginSpan}>Объект удалится автоматически, если с момента удаления прошло <b>более 28 суток</b>.</span>
        </div>
    },
]

function Help() {
    const [expanded, setExpanded] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
    
    return (
        <>
        <PageTitle title="Помощь" />
        <Grid container spacing={4}>
            <Grid item xs={12}>
            {data.map(item => 
                <CustomAccordion
                    expanded={expanded}
                    handleChange={handleChange}
                    panelNum={item.panelNum}
                    icon={item.icon}
                    name={item.name}
                    text={item.text}
                />
                )}
            <h2 style={{display: "block", margin: "1.5rem 0 0.5rem 0"}}>
                По всем вопросам, замечаниям и предложениям пишите на почту <a href="mailto:ilinkd@igirgi.rosneft.ru">ilinkd@igirgi.rosneft.ru</a>
            </h2>
            </Grid>
        </Grid>
        </>
    )
}

export default Help;