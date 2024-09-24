export function make_indexes(arr) {
    for(var i = 0; i < arr.length; i++){
        arr[i] = {...arr[i], "index": i};
    }
    return arr;
}