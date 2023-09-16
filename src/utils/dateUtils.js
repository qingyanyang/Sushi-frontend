export function formateDate(time){
    if(!time) return ''
    let date = new Date(time)
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' ' +date.getHours() +':'+date.getMinutes()+':'+date.getSeconds()
}
export function convertDate(dateStr) {
    let date = new Date(dateStr);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
}
export function convertTime(dateStr) {
    let date = new Date(dateStr);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
}
