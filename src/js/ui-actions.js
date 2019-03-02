function validateInput(value) {
    if(value === ""){
        displayMessage("Empty Input" ,false);
        $('#generate-qr')[0].setAttribute("disabled", true);
    } else if(Number(value) <= 0) {
        displayMessage("Invalid Input" ,false);
        $('#generate-qr')[0].setAttribute("disabled", true);
    } else {
        clearMessage();
        $('#generate-qr')[0].removeAttribute("disabled");
    }
}

function clearQR() {
    $('#qrCode')[0].innerHTML = "";
    $('#displayedAmount')[0].innerText = "";
    $('#qrCodeContainer').removeClass("visible");
    $('#qrCodeContainerOverlay').removeClass("visible");
    window.localStorage.removeItem('qrdata');
}

function clearMessage() {
    $('#messageContainer')[0].innerText = "";
    $('#messageContainer').removeClass("visible");
    $('#messageContainer').removeClass("successMessage");
    $('#messageContainer').removeClass("errorMessage");
}

function displayMessage(messageBody, isSuccess) {
    $('#messageContainer')[0].innerText = messageBody;
    $('#messageContainer').addClass("visible " + (isSuccess ? "successMessage" : "errorMessage"));
}

function hideLoader() {
    $('#loader').removeClass("visible");
    $('#loaderOverlay').removeClass("visible");
}

function showLoader() {
    $('#loader').addClass("visible");
    $('#loaderOverlay').addClass("visible");
}