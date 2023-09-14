var csrf;

var fulldate;
var set_new_consular_id = "4";
var set_new_exit_office_id = 1;
var set_new_service_type_id = 1;
var set_new_calendar_type = 2;
var personCount = 1;

$(document).ready(function () {
    csrf = $('meta[name="csrf-token"]').attr("content");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": csrf,
        },
    });

    fulldate = $(".calendarinput").val();
});

const showAllComponents = () => {
    $("#appCount").addClass("active in");
    $("#appPersonalInfo").addClass("active in");
    $("#appServices").addClass("active in");
    $("#appPreview").addClass("active in");
    $("#appCalendar").addClass("active in");
    $("#appCreditCard").addClass("active in");
};

const fillCity = () => {
    $("#ajaxcity").html(
        '<select name="city" id="city" class="form-control jvnsMt20 city"><option value="0" selected="selected">Place of Residence</option><option value="9">AHWAZ</option><option value="6">ARAK</option><option value="7">ARDEBIL</option><option value="12">BANDARABBAS</option><option value="14">BIRJAND</option><option value="11">BOJNORD</option><option value="13">BUSHEHR</option><option value="2">ESFEHAN</option><option value="28">GORGAN</option><option value="29">HAMEDAN</option><option value="10">ILAM</option><option value="25">KARAJ</option><option value="26">KERMAN</option><option value="27">KERMANSHAH</option><option value="15">KHORAMABAD</option><option value="4">MASHHAD</option><option value="23">QAZVIN</option><option value="24">QOM</option><option value="16">RASHT</option><option value="21">SANANDAJ</option><option value="19">SARI</option><option value="20">SEMNAN</option><option value="22">SHAHREKORD</option><option value="5">SHIRAZ</option><option value="3">TABRIZ</option><option value="1">TEHRAN</option><option value="8">URUMIEH</option><option value="30">YASUJ</option><option value="31">YAZD</option><option value="17">ZAHEDAN</option><option value="18">ZANJAN</option></select>'
    );

    $("#ajaxoffice").html(
        '<select name="office" id="office" class="form-control jvnsMt20 office"><option value="0" selected="selected">Application Center</option><option value="1">TEHRAN</option></select>'
    );

    $("#ajaxofficetype").html(
        '<select name="officetype" id="officetype" class="form-control jvnsMt20 officetype"><option value="0" selected="selected">Service Type</option><option value="1">NORMAL</option></select>'
    );
};

const getDate = () => {
    $.ajax({
        url: "https://it-ir-appointment.visametric.com/en/appointment-form/personal/getdate",
        type: "POST",
        async: false,
        data: {
            consularid: set_new_consular_id,
            exitid: set_new_exit_office_id,
            servicetypeid: set_new_service_type_id,
            calendarType: set_new_calendar_type,
            totalperson: 1, //personCount,
        },
        success: function (getvaliddates) {
            var enableDays = getvaliddates;
            $("#datepicker").datepicker({
                maxViewMode: 2,
                weekStart: 1,
                beforeShowDay: function (date) {
                    if (enableDays.indexOf(formatDate(date)) < 0)
                        return {
                            enabled: false,
                        };
                    else
                        return {
                            enabled: true,
                        };
                },
                startDate: "+1d",
                endDate: "+2m",
                todayHighlight: true,
                format: "dd-mm-yyyy",
                clearBtn: true,
                autoclose: true,
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        },
    });
};

const sendDate = () => {
    $.ajax({
        url: "https://it-ir-appointment.visametric.com/en/appointment-form/senddate",
        type: "POST",
        async: false,
        data: {
            fulldate: fulldate,
            totalperson: personCount,
            set_new_consular_id: set_new_consular_id,
            set_new_exit_office_id: set_new_exit_office_id,
            calendarType: set_new_calendar_type,
            set_new_service_type_id: set_new_service_type_id,
            personalinfo:
                "eyJpdiI6IlA0UzFrWUx2TWpxbzJiU3pHY3VjelE9PSIsInZhbHVlIjoiWEZhUDk1dEIzWis3VWwydXA0MEhPQT09IiwibWFjIjoiODNkNmIxOWViYzY5OTRkMjcwMTdmYWIyZWYxNjU0ZjQ0NzUxOGMzZTVlNjlkMzhhOTBiNTIyODI4OTRjYmFlNCJ9",
        },
        success: function (response) {
            $(".dateresult").html("");
            $(".dateresult").show("slow");
            $(".dateresult").html(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {},
    });
};

const national = () => {
    var nationalHtml = `
        <form
        method="post"
        action="https://it-ir-appointment.visametric.com/en/NationalStudent"
        id="goAppointment"
        class="goappointment"
        >
            <input type="hidden" name="_token" value=${csrf} />
            <input type="hidden" id="cpJvnsControl" class="cpJvnsControl" name="cpJvnsControl" value="" />
        </form>    
    `;

    $("body").html(nationalHtml);

    $("#goAppointment").submit();
};

const appointment = () => {
    var getappointment = `
        <input type="radio" name="nationality" form="formAccessApplication" value="Iran" id="result3" data-id="3" class="result" checked>
        <form
            action="https://it-ir-appointment.visametric.com/en/appointment-form"
            method="POST"
            id="formAccessApplication"
        >
            <input type="hidden" name="_token" value=${csrf} />
            <div class="row">
                <div class="col-md-offset-3 col-md-6" id="redirectButton">
                    <button id="btnSubmit" class="btn btn-primary btn-block">Get Appointment</button>
                </div>
            </div>

            <input type="hidden" value="aT3g5o0i11" name="jvnsAccess" />
        </form>    
    `;

    $("body").html(getappointment);

    $("#formAccessApplication").submit();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);

    if (request.message == "show-all") {
        showAllComponents();
    } else if (request.message == "get-date") {
        getDate();
    } else if (request.message == "send-date") {
        sendDate();
    } else if (request.message == "fill-all") {
        fillCity();
    } else if (request.message == "national") {
        national();
    } else if (request.message == "appointment") {
        appointment();
    }
});
