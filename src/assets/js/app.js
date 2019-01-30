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

const cookies = require('browser-cookies');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

$('#loginForm').submit(() => {
    alert('you clicked the submit button')
    $.ajax({
        url: '/api/login',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            alert(data)
        },
        data: JSON.stringify({
            username: $('#username').val(),
            password: $('#password').val()
        })
    })

    // cancel the actual submit...we'll take it from here
    return false
})

$(document).ready(() => {
    if (cookies.get('sid') && cookies.get('username')) {
        $('#signupButton').hide()
        $('#loginButton').hide()
        $('#logoutButton').text(`Logout (${cookies.get('username')})`)
        $('#logoutButton').show()
        $('#searchContainer').show()
        $('#createContactButton').show()
    }
    else {
        $('#signupButton').show()
        $('#loginButton').show()
        $('#logoutButton').hide()
        $('#searchContainer').hide()
        $('#createContactButton').hide()
    }

    $('#signupButton').on('click', (evt) => {
        window.location.replace('/signup.html')
    })

    $('#loginButton').on('click', (evt) => {
        window.location.replace('/login.html')
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

    $('#signupForm').on('submit', () => {
        $.ajax({
            url: '/api/signup',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            error: function (err) {
                alert('error: ' + util.inspect(err))
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
})
