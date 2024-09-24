export const unique = (arr) => {
    let result = [];
    for (let str of arr) {
        if (!result.includes(str)) {
        result.push(str);
        }
    }
    return result;
  }

export const optimize_for_table = (arr, name_methods) => {
    var arr_copy = [...arr];
    var result = [];
    while (arr_copy.length !== 0) {
        for (var j = 0; j < name_methods.length; j++){
            var index = arr_copy.findIndex(item => item.method_class_name === name_methods[j]);
            if (index !== -1) {
                result.push(arr_copy[index]);
                arr_copy.splice(index, 1);
            } else {
                result.push("");
            }
        }
    }
    return result;
}