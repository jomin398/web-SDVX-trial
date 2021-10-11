let SDVXModule = null;
function sendAjaxRequest(url, method, data) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        }
        xhr.open(method?method:'GET', url, true);
        xhr.responseType = 'json';
        xhr.send(data);
    });
}
const insertAdjacentElePos =['beforebegin','afterbegin','beforeend','afterend'];

function pageOnload() {
    document.querySelector('.mein button.start').onclick = ()=> {
        SDVXModule = new(sdvx());
        SDVXModule.init()
    }
}

   
window.onload = () => pageOnload()