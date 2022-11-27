const baseUrl = 'http://localhost:3000';
const headers = {
    headers:{
        Authorization : localStorage.getItem('accessToken')
    }
};
function timer(ms){
    let times = new Date(ms);
    let day = times.toLocaleDateString();
    let h = times.getHours()  < 10 ? `0${times.getHours()}` : times.getHours();
    let m = times.getMinutes() < 10 ? `0${times.getMinutes()}` : times.getMinutes();
    let s = times.getSeconds()  < 10 ? `0${times.getSeconds()}` : times.getSeconds();
    return `${day.replace(/\//g,'-')} ${h}:${m}:${s}`;
};