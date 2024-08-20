document.addEventListener("DOMContentLoaded", function() {
    JsBarcode("#barcode", "ABC123456789", {
        format: "CODE128", 
        width: 1.9,          
        height: 55,       
        displayValue: false 
    });
});
