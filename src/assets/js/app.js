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

$("#loginForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/userLogin',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#loginForm').on('animationend', () => {
                window.location.replace('/index.html')
            })
            $('#loginForm').removeClass('bounceInUp')
            $('#loginForm').addClass('rotateOut')
        },
        data: JSON.stringify({
            username: $('#username').val(),
            password: $('#password').val()
        })
    })
});

$('#loginForm').submit(() => {
    // cancel the actual submit...we'll take it from here
    return false
})

$('#createContactButton').on('click', (evt) => {
    $('#createContactModal').foundation('open')
})

$("#createContactForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/createContact',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#createContactModal').foundation('close')
        },
        data: JSON.stringify({
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        })
    })
});

$('#createContactForm').submit(() => {
    // cancel the actual submit...we'll take it from here
    return false
})

$("#signupForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/signup',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            alert('success: ' + util.inspect(data))
            $('#signupForm').on('animationend', () => {
                window.location.replace('/index.html')
            })
            $('#signupForm').removeClass('rollIn')
            $('#signupForm').addClass('hinge')
        },
        data: JSON.stringify({
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#password').val()
        })
    })

    return false
})

$('#signupForm').on('submit', () => {
    // cancel the actual submit...we'll take it from here
    return false
})

function search(search) {
    $.ajax({
        url: '/api/listContacts',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            $('#contactsDiv').empty()
            for (const contact of data) {
                $(
                `
                <div class="cell">
                <div class="card">
                  <div class="card-section">
                    <img src="${contact.pic}">
                  </div>
                  <div class="card-section">
                    <h4>${contact.firstname} ${contact.lastname}</h4>
                    <p>${contact.phone}</p>
                    <p>${contact.email}</p>
                  </div>
                </div>
              </div>
              `).appendTo('#contactsDiv')
            }
        },
        data: JSON.stringify({
            search: search
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
    if (cookies.get('username')) {
        $('#signupButton').hide()
        $('#loginButton').hide()
        $('#logoutButton').text(`Logout (${cookies.get('username')})`)
        $('#logoutButton').show()
        $('#searchContainer').show()
        $('#createContactContainer').show()
        $('#splashDiv').hide()
        search()
    }
    else {
        $('#signupButton').show()
        $('#loginButton').show()
        $('#logoutButton').hide()
        $('#searchContainer').hide()
        $('#createContactContainer').hide()
    }
    cookies.erase('username')

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
            $('#signupForm').off('animationend')
            $('#signupForm').css('visibility', 'hidden')
            $('#signupForm').show()
            $('html, body').animate({ scrollTop: $(document).height() }, 'fast', 'linear', () => {
                $('#signupForm').css('visibility', 'visible')
                $('#signupForm').removeClass('rollOut')
                $('#signupForm').addClass('rollIn')
            });
        }
        else {
            $('#signupForm').on('animationend', () => {
                $('#signupForm').hide()
            })
            $('#signupForm').removeClass('rollIn')
            $('#signupForm').addClass('rollOut')
        }
    })

    window.load()
})
