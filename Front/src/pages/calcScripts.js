function parametres_to_number(param) {
    if (param === "Свойства реперного горизонта отсутствуют" || param === "Реперные горизонты не вскрыты" || param === "Отменена по согласованию сторон" || param === "Низкая плотность данных реального времени" || param === "Коррелируют" || param === "Имеется" || param === "Увязан" || param === "Отсутствуют" || param === "Отсутствует" || param === "Соответствует основному замеру" || param === "Соответствует данным опорных скважин" || param === "Лежат в области ожидаемых значений" || param === "Соответствуют" || param === "Хорошее" || param === "Полная") {
        return Number(1);
    }
    else if (param === "Частичная" || param === "Занижены" || param === "Завышены" || param === "Проблема с передачей данных реального времени" || param === "Частично коррелируют" || param === "Частично неувязан" || param === "Единичные" || param === "Незначительная" || param === "Занижено. Данные могут быть использованы в оценке ФЕС" || param === "Завышено. Данные могут быть использованы в оценке ФЕС" || param === "Удовлетворительное") {
        return Number(0.5);
    }
    else if (param === undefined || param === "Свойства реперного горизонта расходятся" || param === "Перерасчет данных из памяти прибора" || param === "Не соответствует основной записи" || param === "Не коррелируют" || param === "Не имеется" || param === "Неувязан" || param === "Регулярные" || param === "Высокая" || param === "Не произведена" || param === "Не лежат в области ожидаемых значений" || param === "Занижено. Данные некондиционные" || param === "Завышено. Данные некондиционные" || param === "Не соответствуют" || param === "Неудовлетворительное") {
        return Number(0);
    } else { return param; }
}

export function calc_value_rt_azimut(secondrow, lqc, petrophysic_task) {
    console.log('petrophysic_task', petrophysic_task)
    var res = 0
    for (var key in secondrow){
        if (key !== "method" && key !== "method_value" && key !== "notes" && key !== "inform_for_method_id" && key !== "method_id" && key !== "index" && key !== "device_tech_condition" && key !== "distribute_palet" && key !== "distribute_support" && key !== "corresponse")
            if (lqc === "Не имеется" || lqc === "")
                res += parametres_to_number(secondrow[key]) * 12
            else
                res += parametres_to_number(secondrow[key]) * 9
    }
    if (lqc !== "Не имеется" && lqc !== "")
        res += parametres_to_number(secondrow["device_tech_condition"]) * 18
    if (petrophysic_task!==null && petrophysic_task!==undefined){
        console.log('calc_value_rt_azimut', petrophysic_task)
        res=res*Number(petrophysic_task)
    }
    return res;
}

// расчёт по реальному времени
export function calc_value_rt(secondrow, lqc, digitalData_type) {
    var res = 0
    for (var key in secondrow){
        if (key !== "method" && key !== "method_value" && key !== "notes" && key !== "inform_for_method_id" && key !== "method_id" && key !== "index" && key !== "device_tech_condition")
            if (lqc === "Не имеется" || lqc === "")
                res += parametres_to_number(secondrow[key]) * 8
            else
                res += parametres_to_number(secondrow[key]) * 6
    }
    if (lqc !== "Не имеется" && lqc !== "") 
        res += parametres_to_number(secondrow["device_tech_condition"]) * 18
    return res;
}

export function calc_value_memory(secondrow, lqc, koef_shod) {
    var res = 0
        for (var key in secondrow){
            if (key !== "method" && key !== "method_value" && key !== "notes" && key !== "inform_for_method_id" && key !== "method_id" && key !== "index" && key !== "device_tech_condition")
                if (lqc === "Не имеется" || lqc === "")
                    res += parametres_to_number(secondrow[key]) * 7
                else
                    res += parametres_to_number(secondrow[key]) * 5 
        }
        if (lqc !== "Не имеется" && lqc !== "") 
            res += parametres_to_number(secondrow["device_tech_condition"]) * 18
        res += koef_shod * 0.09
    return res;
}

export function calc_value_memory_azimut(secondrow, lqc, koef_shod, digitalData_type) {
    var res = 0
        for (var key in secondrow){
            if (key !== "method" && key !== "method_value" && key !== "notes" && key !== "inform_for_method_id" && key !== "method_id" && key !== "index" && key !== "device_tech_condition" && key !== "distribute_palet" && key !== "distribute_support" && key !== "corresponse")
                if (digitalData_type !== "LAS")
                    if (lqc === "Не имеется" || lqc === "")
                        res += parametres_to_number(secondrow[key]) * 10
                    else{
                        res += parametres_to_number(secondrow[key]) * 7 
                    }
                else
                    if (lqc === "Не имеется" || lqc === "")
                        res += parametres_to_number(secondrow[key]) * 10.5
                    else
                        res += parametres_to_number(secondrow[key]) * 7.5
        }
        if (lqc !== "Не имеется" && lqc !== "")
            res += parametres_to_number(secondrow["device_tech_condition"]) * 18
        if (digitalData_type !== "LAS") 
            res += koef_shod * 0.12
        else
            res += koef_shod * 0.09 
    return res;
}
export function calc_tablet_digitalData(digital_count,typeDigital, full_inf_count){
    var res=0
    if (typeDigital==='LAS+WITSML'){
        res+=digital_count*0.14
        res+=full_inf_count*0.14
    }
    else if (typeDigital==='LAS' || typeDigital==='WITSML'){
        res+=digital_count*0.1
        res+=full_inf_count*0.18
    }
    return parseFloat(res.toFixed(2))
}

export function calc_finish_value(rows, digital_count,typeDigital, full_inf_count) {
    var res = 0
    var petro_sum = 0
    var method_sum=0
    for (var i = 0; i < rows.length; i++) {
        method_sum += (rows[i].method_value+calc_tablet_digitalData(digital_count, typeDigital, full_inf_count))*Number(rows[i].petrophysic_task)
        petro_sum += Number(rows[i].petrophysic_task)
    }
    if(rows.length)
        res+=method_sum/rows.length
    return res;
}