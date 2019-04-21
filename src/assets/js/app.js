import $ from 'jquery';
import util from 'util';
import 'what-input';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

if (!window.load) {
    window.load = function () {
        $('body').css('overflow-y', 'initial')
    }
}

const cookies = require('browser-cookies');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

function doError(err) {
    $('#errorDiv').empty()
    $('#errorDiv').append(`<code>${util.inspect(err)}</code>`)
    $('#errorModal').foundation('open')
}

$(document).foundation();

$("#SchedulerLoginForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/SchedulerLogin',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#SchedulerLoginForm').on('animationend', () => {
                window.location.replace('/index.html')
            })
            $('#SchedulerLoginForm').removeClass('bounceInUp')
            $('#SchedulerLoginForm').addClass('rotateOut')
        },
        data: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        })
    })
});

$('#SchedulerLoginForm').submit(() => {
    // cancel the actual submit...we'll take it from here
    return false
})

$('#createScheduleButton').on('click', (evt) => {
    $('#createScheduleModal').foundation('open')
})

$("#createScheduleForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/CreateSchedule',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            search($('#searchInput').val())
            $('#createScheduleModal').foundation('close')
        },
        data: JSON.stringify({
            schedule_name: $('#schedule_name').val(),
            average_appointment_length: $('#average_appointment_length').val(),
            M_START: $('#M_START').val(),
            M_END: $('#M_END').val(),
            T_START: $('#T_START').val(),
            T_END: $('#T_END').val(),
            W_START: $('#W_START').val(),
            W_END: $('#W_END').val(),
            Th_START: $('#Th_START').val(),
            Th_END: $('#Th_END').val(),
            F_START: $('#F_START').val(),
            F_END: $('#F_END').val(),
            S_START: $('#S_START').val(),
            S_END: $('#S_END').val(),
            Su_START: $('#Su_START').val(),
            Su_END: $('#Su_END').val()
        })
    })
});

$('#createScheduleForm').submit(() => {
    // cancel the actual submit...we'll take it from here
    return false
})


$("#SchedulerSignupForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/SchedulerSignup',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#SchedulerSignupForm').on('animationend', () => {
                window.location.replace('/index.html')
            })
            $('#SchedulerSignupForm').removeClass('rollIn')
            $('#SchedulerSignupForm').addClass('hinge')
        },
        data: JSON.stringify({
            group: $('#group').val(),
            password: $('#password').val(),
            email: $('#email').val()
        })
    })

    return false
})

$('#SchedulerSignupForm').on('submit', () => {
    // cancel the actual submit...we'll take it from here
    return false
})

function search(searchTerm) {
    $.ajax({
        url: '/api/listSchedules',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#schedulesDiv').empty()
            data.forEach((schedule, idx) => {
                $(
`
<div class="cell">
    <div class="card">
    <div class="card-section">
        <button class="button floating-menu" type="button" data-toggle="scheduleMenuDropdown${idx}"><i class="fa fa-bars"></i></button>
    </div>
    <div class="card-section">
        <h4>${schedule.schedule_name}</h4>
        <p>${schedule.average_appointment_length}</p>
        <p>${schedule.M_START}</p>
        <p>${schedule.M_END}</p>
        <p>${schedule.T_START}</p>
        <p>${schedule.T_END}</p>
        <p>${schedule.W_START}</p>
        <p>${schedule.W_END}</p>
        <p>${schedule.Th_START}</p>
        <p>${schedule.Th_END}</p>
        <p>${schedule.F_START}</p>
        <p>${schedule.F_END}</p>
        <p>${schedule.S_START}</p>
        <p>${schedule.S_END}</p>
        <p>${schedule.Su_START}</p>
        <p>${schedule.Su_END}</p>
    </div>
    </div>
</div>
<div class="dropdown-pane" id="scheduleMenuDropdown${idx}" data-dropdown data-close-on-click="true" data-auto-focus="true">
    <div class="button-group stacked">
    <a class="alert button" id="deleteScheduleButton${idx}" schedule="${idx}">Delete</a>
    </div>
</div>
                `).appendTo('#schedulesDiv')
                $(`#deleteScheduleButton${idx}`).on('click', elem => {
                    $('#schedule_name').text(schedule.schedule_name)
                    $('#lastnameDelete').text(schedule.average_appointment_length)
                    $('#M_START').text(schedule.M_START)
                    $('#M_END').text(schedule.M_END)
                    $('#T_START').text(schedule.T_START)
                    $('#T_END').text(schedule.T_END)
                    $('#W_START').text(schedule.W_START)
                    $('#W_END').text(schedule.W_END)
                    $('#Th_START').text(schedule.Th_START)
                    $('#Th_END').text(schedule.Th_END)
                    $('#F_START').text(schedule.F_START)
                    $('#F_END').text(schedule.F_END)
                    $('#S_START').text(schedule.S_START)
                    $('#S_END').text(schedule.S_END)
                    $('#Su_START').text(schedule.Su_START)
                    $('#Su_END').text(schedule.Su_END)
                    $('#deleteScheduleButton').off('click')
                    $('#deleteScheduleButton').on('click', event => {
                        $.ajax({
                            url: '/api/deleteSchedule',
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json',
                            error: function (err) {
                                doError(err)
                            },
                            success: function (data) {
                                search($('#searchInput').val())
                                $('#deleteScheduleModal').foundation('close')
                            },
                            data: JSON.stringify({
                                _id: contact._id,
                            })
                        })
                    })
                    $('#deleteScheduleModal').foundation('open')
                })

            })
            $('#scheduleDiv').foundation()
        },
        data: JSON.stringify({
            search: searchTerm
        })
    })
}

$('#searchButton').on('click', (evt) => {
    search($('#searchInput').val())
})

$("#searchInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        search($('#searchInput').val())
    }
});

$(document).ready(() => {
    if (cookies.get('email')) {
        $('#signupButton').hide()
        $('#loginButton').hide()
        $('#logoutButton').text(`Logout (${cookies.get('email')})`)
        $('#logoutButton').show()
        $('#searchContainer').show()
        $('#createScheduleContainer').show()
        $('#schedulesDiv').show()
        $('#splashDiv').hide()
        search()
    }
    else {
        $('#signupButton').show()
        $('#loginButton').show()
        $('#logoutButton').hide()
        $('#searchContainer').hide()
        $('#createScheduleContainer').hide()
        $('#createScheduleButton').hide()
    }
    cookies.erase('email')

    $('#signupButton').on('click', (evt) => {
        window.location.replace('/signup.html')
    })

    $('#loginButton').on('click', (evt) => {
        window.location.replace('/login.html')
    })

    $('#logoutButton').on('click', (evt) => {
        $.ajax({
            url: '/api/userLogout',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            error: function (err) {
                doError(err)
            },
            success: function (data) {
                $('body').on('animationend', () => {
                    window.location.replace('/index.html')
                })
                $('body').addClass('animated hinge')
            }
        })

        return false
    })

    $('#termsAndConditions').on('change', () => {
        if ($('#termsAndConditions').is(':checked')) {
            $('#SchedulerSignupForm').off('animationend')
            $('#SchedulerSignupForm').css('visibility', 'hidden')
            $('#SchedulerSignupForm').show()
            $('html, body').animate({ scrollTop: $(document).height() }, 'fast', 'linear', () => {
                $('#SchedulerSignupForm').css('visibility', 'visible')
                $('#SchedulerSignupForm').removeClass('rollOut')
                $('#SchedulerSignupForm').addClass('rollIn')
            });
        }
        else {
            $('#SchedulerSignupForm').on('animationend', () => {
                $('#SchedulerSignupForm').hide()
            })
            $('#SchedulerSignupForm').removeClass('rollIn')
            $('#SchedulerSignupForm').addClass('rollOut')
        }
    })

    window.load()
})
