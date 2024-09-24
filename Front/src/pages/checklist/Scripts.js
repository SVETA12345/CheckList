
export function calc_koef(obj) {
    var koef = 0;
    for (var key in obj){
        if (obj[key] === "Полная" || obj[key] === "Имеется")
            koef += 1;
        if (obj[key] === "Частичная")
            koef += 0.5;
        if (obj[key] === "Отсутствует" || obj[key] === "Не имеется")
            koef += 0;
    }
    let count=0;
    if(obj.type=='LAS'){
        count=4;
    }
    else if (obj.type=='WITSML'){
        count=5
    }
    else if (obj.type =="LAS+WITSML"){
        count=9
    }
    else{
        count = 14
    }
    const digitalCount=parseFloat((koef / (count) *100).toFixed(2))
    return digitalCount
    /*if (obj.hasOwnProperty('las_file_count')){
        obj.las_file_count = Math.round(koef / (Object.keys(obj).length - 2) *100);
        return;
    }
    if (obj.hasOwnProperty('witsml_count')){
        obj.witsml_count = Math.round(koef / (Object.keys(obj).length - 2) *100);
        return;
    }*/
}

export function push_all_full(obj) {
    for (var key in obj){
        if (key !== "koef"){
            obj[key] = "Полная"
        }
    }
}

export function delete_all_props(obj) {
    for (var key in obj){
        obj[key] = ""
    }
}

export function prepare_for_put_inform_method(arr, methods, service_devices) {
    var post_inform_method = [];
    var id_post = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === null)
            id_post = -arr[i].index;
        else
            id_post = arr[i].id;
        post_inform_method[i] = {
            ...arr[i],
            id: id_post,
            method_id: methods.find(m => m.name === arr[i].method).id,
            service_device_id: service_devices.find(s => s.tool_type === arr[i].tool_type).service_device_id
        }
        delete post_inform_method[i].method;
        delete post_inform_method[i].tool_type;
        delete post_inform_method[i].index;
    }
    return post_inform_method;
}

export function prepare_for_post_inform_method(arr, methods, service_devices) {
    var post_inform_method = [];
    for (var i = 0; i < arr.length; i++) {
        post_inform_method[i] = {
            ...arr[i],
            id: arr[i].index,
            method_id: methods.find(m => m.name === arr[i].method).id,
            service_device_id: service_devices.find(s => s.tool_type === arr[i].tool_type).service_device_id
        }
        delete post_inform_method[i].method;
        delete post_inform_method[i].tool_type;
        delete post_inform_method[i].index;
    }
    return post_inform_method;
}

export function prepare_for_put_secondtable(arr, methods) {
    console.log(arr)
    var post_second_table = [];
    var id_post = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].inform_for_method_id !== null)
            id_post = arr[i].inform_for_method_id;
        else
            id_post = -arr[i].index;
        post_second_table[i] = {
            ...arr[i],
            inform_for_method_id: id_post,
            method_id: methods.find(m => m.name === arr[i].method).id
        }
        delete post_second_table[i].method;
        delete post_second_table[i].index;
    }
    return post_second_table;
}

export function prepare_for_post_secondtable(arr, methods) {
    var post_second_table = [];
    for (var i = 0; i < arr.length; i++) {
        post_second_table[i] = {
            ...arr[i],
            inform_for_method_id: arr[i].index,
            method_id: methods.find(m => m.name === arr[i].method).id
        }
        delete post_second_table[i].method;
        delete post_second_table[i].index;
    }
    return post_second_table;
}

export function check_validity(customer, field, num_pad, num_well, num_wellbore, data_type, section_interval_start, section_interval_end) {
    var checkvalues = false;
    customer === "" || field === "" || num_pad === "" || num_well === "" || num_wellbore === "" || data_type === "" || section_interval_start === null || section_interval_end === null ? checkvalues = false : checkvalues = true;
    return checkvalues
}