
 var data = [
    { text: "RD", value: "v_RD" },
    { text: "ICP", value: "v_ICP" },
    { text: "PENrose", value: "v_PENrose" }
]
$(document).ready(function () {
   
    $("#start_datepicker").kendoDatePicker({
        value: new Date(),
        min: "1900-01-01",
        max: new Date(),
        dateInput: true,
        format: "yyyy-MM-dd"
    });
    $("#expiry_datepicker").kendoDatePicker({
        value: new Date(),
        min: "1900-01-01",
        max: new Date(),
        dateInput: true,
        format: "yyyy-MM-dd"
    });

   
});
$("#PipelineName").kendoDropDownList({
    dataTextField: "text",
    dataValueField: "value",
    dataSource:data,
    index: 0,
    // change: onCategoryChange
});
var locatoinX = [];
var locatoinY = [];
var intubation = false;
//讀取資料庫資訊塞進陣列裡面
var locationPointer = locatoinX.length;
var img = new Image();
img.src = "https://i.imgur.com/lQx1bV0.jpg";
window.onload = function () {
    var lc = document.getElementById("full");
    var lctx = lc.getContext("2d");
    lctx.drawImage(img, 0, 0, 600, 600);
    lc.onclick = function () {
        if (intubation) {
            var x = event.clientX;
            var y = event.clientY;
            locatoinX[locationPointer] = x;
            locatoinY[locationPointer] = y;
            locationPointer = locationPointer + 1;
        }
        if (intubation==2) {
            for (var i = 0; i < locationPointer; i++) {
             if(event.clientX >= locatoinX[i]-5 && event.clientX <= locatoinX[i]+10 && event.clientY>= locatoinY[i]-5 && event.clientY<= locatoinY[i]+10){
                 locatoinX.splice(i,1);
                 locatoinY.splice(i,1);
                 locationPointer = locationPointer - 1;

             }
         }

     }
        lctx.drawImage(img, 0, 0, 600, 600);
        for (var i = 0; i < locationPointer; i++) {
            lctx.beginPath();
            lctx.arc(locatoinX[i] - 15, locatoinY[i] - 15, 5, 0, 2 * Math.PI);
            lctx.fill();
        }
    };
}

function add() {
    intubation = true;
    var mydateInput = document.getElementById("date");
    var date = new Date();
    var dateString = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    mydateInput.value = dateString;
}
function Delete(){
   
    intubation=2;
    var x = event.clientX;
    var y = event.clientY;
    locatoinX[locationPointer] = x;
    locatoinY[locationPointer] = y;
    locationPointer = locationPointer + 1;

 }
function save() {
    intubation = false;
}