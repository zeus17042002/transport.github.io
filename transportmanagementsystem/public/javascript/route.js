function dateTime(){
    var datetime = document.querySelectorAll(".datetime");
    datetime.forEach(d => {
        console.log((d.innerHTML))
        var date = d.innerHTML.slice(0,16).split(" ");
        var time = d.innerHTML.slice(16, d.innerHTML.length).split(" ")[0]
        var dateafterchange = changeDate(date);
        d.innerHTML = dateafterchange + " - " + time;
    })

}

function changeDate(date){
    var day = changeDay(date[0]);
    var month = changeMonth(date[1]);
    return day + " " + date[2] + " " + month + " " + date[3]; 
}

function changeMonth(month){
    switch(month){
        case "Jan":
            return "01";
        case "Feb":
            return "02";
        case "Mar":
            return "03";
        case "Apr":
            return "04";
        case "May":
            return "05";
        case "Jun":
            return "06";
        case "Jul":
            return "07";
        case "Aug":
            return "08";
        case "Sep":
            return "09";
        case "Oct":
            return "10";
        case "Nov":
            return "11";
        case "Dec":
            return "12";
        default:
            return "";
    }
}

function changeDay(day){
    switch(day){
        case "Mon":
            return "Thứ 2";
        case "Tue":
            return "Thứ 3";
        case "Wed":
            return "Thứ 4";
        case "Thu":
            return "Thứ 5";
        case "Fri":
            return "Thứ 6";
        case "Sat":
            return "Thú 7";
        case "Sun":
            return "Chủ Nhật";
        default:
            return "";
    }
}

dateTime()

function changeEditForm(id, routeName, start, end, distance, fare){
    console.log(fare)
    document.getElementById("_id").value = id;
    document.getElementById("editRouteName").value = routeName;
    document.getElementById("editStart").value = start;
    document.getElementById("editEnd").value = end;
    document.getElementById("editDistance").value = distance;
    document.getElementById("editFare").value = fare;
    document.getElementById("editRouteForm").setAttribute("action", "/routes/edit/" + id);
    console.log(document.getElementById("editRouteName").value)
}