function createQR(QRdata, price) {
    clearQR();

    var qr = new QRCode($('#qrCode')[0], { 
        width: 200,
        height: 200,
        useSVG: true 
    });
    
    qr.makeCode(QRdata);
    
    $('#displayedAmount')[0].innerText = price + " ₺";
    
    $('#qrCodeContainer').addClass("visible");
    $('#qrCodeContainerOverlay').addClass("visible");
    $('#request-payment')[0].removeAttribute("disabled");

    window.localStorage.setItem('qrdata', 
    JSON.stringify({ 
        "QRdata": QRdata, 
        "price": price})
    );
}

function requestSale() {
    var price = $('#priceInput')[0].value;

    clearMessage();

    if(price && price > 0){
        var requestData = JSON.stringify({
            'totalReceiptAmount': parseFloat(price) 
        });

        showLoader();

        $.ajax({
            url: 'https://sandbox-api.payosy.com/api/get_qr_sale',
            type: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-ibm-client-id': 'acadf9f7-e02f-4729-8ef5-a1e2a8b6d404',
                'x-ibm-client-secret': 'G4lK2cH0iG0bC4eR1nW4xT5iT3qB2nJ2oL8xQ7yU8yH2tD0wN3'
            },
            data: requestData,
            dataType: 'json',
            success: function(result){
                console.log(result);
                createQR(result.QRdata, price);
                hideLoader();
            },
            error: function(error){
                console.log(error);
                hideLoader();
            }
        });
    } else{
        displayMessage("Empty Input" ,false);
    }
}

function requestPayment() {
    var requestData = JSON.parse(window.localStorage.getItem("qrdata"));

    clearMessage();
    showLoader();

    $.ajax({
        url: 'https://sandbox-api.payosy.com/api/payment',
        type: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': 'acadf9f7-e02f-4729-8ef5-a1e2a8b6d404',
            'x-ibm-client-secret': 'G4lK2cH0iG0bC4eR1nW4xT5iT3qB2nJ2oL8xQ7yU8yH2tD0wN3'
        },
        data: JSON.stringify({ 
            "returnCode": 1000,
            "returnDesc": "success",
            "receiptMsgCustomer": "beko Campaign",
            "receiptMsgMerchant": "beko Campaign Merchant",
            "paymentInfoList": 
                [{ 
                    "paymentProcessorID": 67,
                    "paymentActionList": [{ 
                          "paymentType": 3, 
                          "amount": parseFloat(requestData.price), 
                          "currencyID": 949, 
                          "vatRate": 800 
                    }] 
                }],
            "QRdata": requestData.QRdata,
            "json": true 
        }),
        dataType: 'json',
        success: function(result){
            console.log(result);
            clearQR();

            if(result.returnCode === 1000){
                displayMessage("Payment Complete", true);
            } else{
                displayMessage("Payment Incomplete", false);
            }

            $('#request-payment')[0].setAttribute("disabled", true);
            hideLoader();
        },
        error: function(error){
            console.log(error);
            hideLoader();
        }
    });
}
