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
            $('#SchedulerLoginForm').addClass('bounceOutUp')
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
            max_capacity: $('#max_capacity').val(),
            M: $('#M').val(),
            T: $('#T').val(),
            Th: $('#Th').val(),
            F: $('#F').val(),
            S: $('#S').val(),
            Su: $('#Su').val()
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
            $('#SchedulerSignupForm').removeClass('bounceInUp')
            $('#SchedulerSignupForm').addClass('bounceOutUp')
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
        <img src="${contact.pic}">
        <button class="button floating-menu" type="button" data-toggle="contactMenuDropdown${idx}"><i class="fa fa-bars"></i></button>
    </div>
    <div class="card-section">
        <h4>${schedule.schedule_name}</h4>
        <p>${schedule.average_appointment_length}</p>
        <p>${schedule.max_capacity}</p>
        <p>${schedule.M}</p>
        <p>${schedule.T}</p>
        <p>${schedule.W}</p>
        <p>${schedule.Th}</p>
        <p>${schedule.F}</p>
        <p>${schedule.S}</p>
        <p>${schedule.Su}</p>
    </div>
    </div>
</div>
<div class="dropdown-pane" id="scheduleMenuDropdown${idx}" data-dropdown data-close-on-click="true" data-auto-focus="true">
    <div class="button-group stacked">
    <a class="alert button" id="deleteContactButton${idx}" contact="${idx}">Delete</a>
    </div>
</div>
                `).appendTo('#schedulesDiv')
                $(`#deleteScheduleButton${idx}`).on('click', elem => {
                    $('#schedule_name').text(schedule.schedule_name)
                    $('#lastnameDelete').text(schedule.average_appointment_length)
                    $('#max_capacity').text(schedule.max_capacity)
                    $('#M').text(schedule.M)
                    $('#T').text(schedule.T)
                    $('#W').text(schedule.W)
                    $('#Th').text(schedule.Th)
                    $('#F').text(schedule.F)
                    $('#S').text(schedule.S)
                    $('#Su').text(schedule.Su)
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
        $('#logoutButton').text(`Logout (${cookies.get('group')})`)
        $('#logoutButton').show()
        $('#searchContainer').show()
        $('#createScheduleContainer').show()
        $('#createScheduleButton').show()
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
                $('body').addClass('rollOut')
            }
        })

        return false
    })

    /*

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
*/
    window.load()
})
