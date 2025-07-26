function startBili() {
    const val = document.querySelector("#room-id-input").value.trim();
    const script = document.querySelector("#userscript-input").value.trim();
    
    // 验证输入
    if (!val || !script) {
        showError("请填写完整的房间ID和用户脚本地址");
        return;
    }
    
    // 保存用户脚本地址
    localStorage.userscript = script;
    
    // 显示加载动画
    showLoading();
    
    // 发送消息到原生应用
    webkit.messageHandlers.controller.postMessage(`${val}$${script}`);
}

function showLoading() {
    const button = document.querySelector("#startbili");
    const buttonText = button.querySelector(".button-text");
    
    button.classList.add("loading");
    button.disabled = true;
    buttonText.style.opacity = "0";
}

function hideLoading() {
    const button = document.querySelector("#startbili");
    const buttonText = button.querySelector(".button-text");
    
    button.classList.remove("loading");
    button.disabled = false;
    buttonText.style.opacity = "1";
}

function showError(message) {
    // 创建错误提示
    const existingError = document.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    
    const formContainer = document.querySelector(".form-container");
    formContainer.appendChild(errorDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}

function validateInput(input) {
    const value = input.value.trim();
    const inputGroup = input.parentElement;
    
    // 移除之前的错误状态
    input.classList.remove("error");
    const existingError = inputGroup.querySelector(".field-error");
    if (existingError) {
        existingError.remove();
    }
    
    if (!value) {
        input.classList.add("error");
        const errorSpan = document.createElement("span");
        errorSpan.className = "field-error";
        errorSpan.textContent = "此字段为必填项";
        inputGroup.appendChild(errorSpan);
        return false;
    }
    
    return true;
}

document.addEventListener("DOMContentLoaded", function(){
    const startButton = document.querySelector("#startbili");
    const userscriptInput = document.querySelector("#userscript-input");
    const roomIdInput = document.querySelector("#room-id-input");
    
    // 设置默认用户脚本地址
    userscriptInput.value = localStorage.userscript || "https://sing.bilibiili.com/static/bilising.user.js";
    
    // 绑定点击事件
    startButton.addEventListener("click", startBili);
    
    // 输入验证
    userscriptInput.addEventListener("blur", function() {
        validateInput(this);
    });
    
    roomIdInput.addEventListener("blur", function() {
        validateInput(this);
    });
    
    // 回车键支持
    roomIdInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            startBili();
        }
    });
    
    userscriptInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            roomIdInput.focus();
        }
    });
    
    // 输入时清除错误状态
    [userscriptInput, roomIdInput].forEach(input => {
        input.addEventListener("input", function() {
            this.classList.remove("error");
            const inputGroup = this.parentElement;
            const existingError = inputGroup.querySelector(".field-error");
            if (existingError) {
                existingError.remove();
            }
        });
    });
});
