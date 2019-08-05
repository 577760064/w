
//日期转换（20010101010101 转 2001-01-01 01:01:01）
function strConvertDate(str){
    return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
}