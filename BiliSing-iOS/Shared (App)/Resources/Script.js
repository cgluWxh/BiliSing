function startBili() {
    const val = document.querySelector("#room-id-input").value;
    const script = document.querySelector("#userscript-input").value;
    if (!val || !script) return;
    localStorage.userscript = script;
    webkit.messageHandlers.controller.postMessage(`${val}$${script}`);
}

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("#startbili").addEventListener("click", startBili);
    document.querySelector("#userscript-input").value = localStorage.userscript || "https://sing.bilibiili.com/static/bilising.user.js";
})
