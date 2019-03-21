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
            doError(err.responseJSON.message)
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
            doError(err.responseJSON.message)
        },
        success: function (data) {
            search($('#searchInput').val())
            $('#createContactModal').foundation('close')
        },
        data: JSON.stringify({
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            pic: $('#pic').val()
        })
    })
});

$('#createContactForm').submit(() => {
    // cancel the actual submit...we'll take it from here
    return false
})

$("#updateContactForm").on("formvalid.zf.abide", function (ev, frm) {
    $.ajax({
        url: '/api/updateContact',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err)
        },
        success: function (data) {
            search($('#searchInput').val())
            $('#updateContactModal').foundation('close')
        },
        data: JSON.stringify({
            _id: $('#idUpdate').val(),
            firstname: $('#firstnameUpdate').val(),
            lastname: $('#lastnameUpdate').val(),
            email: $('#emailUpdate').val(),
            phone: $('#phoneUpdate').val(),
            pic: $('#picUpdate').val()
        })
    })
});

$('#updateContactForm').submit(() => {
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
            doError(err.responseJSON.message)
        },
        success: function (data) {
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

function search(searchTerm) {
    $.ajax({
        url: '/api/listContacts',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function (err) {
            doError(err.responseJSON.message)
        },
        success: function (data) {
            $('#contactsDiv').empty()
            data.forEach((contact, idx) => {
                $(
`
<div class="cell">
    <div class="card">
    <div class="card-section">
        <img src="${contact.pic}">
        <button class="button floating-menu" type="button" data-toggle="contactMenuDropdown${idx}"><i class="fa fa-bars"></i></button>
    </div>
    <div class="card-section">
        <h4>${contact.firstname} ${contact.lastname}</h4>
        <p>${contact.phone}</p>
        <p>${contact.email}</p>
    </div>
    </div>
</div>
<div class="dropdown-pane" id="contactMenuDropdown${idx}" data-dropdown data-close-on-click="true" data-auto-focus="true">
    <div class="button-group stacked">
    <a class="button" id="updateContactButton${idx}" contact="${idx}">Update</a>
    <a class="alert button" id="deleteContactButton${idx}" contact="${idx}">Delete</a>
    </div>
</div>
                `).appendTo('#contactsDiv')
                $(`#updateContactButton${idx}`).on('click', elem => {
                    $('#idUpdate').val(contact._id)
                    $('#firstnameUpdate').val(contact.firstname)
                    $('#lastnameUpdate').val(contact.lastname)
                    $('#emailUpdate').val(contact.email)
                    $('#phoneUpdate').val(contact.phone)
                    $('#picUpdate').val(contact.pic)
                    $('#updateContactModal').foundation('open')
                })
                $(`#deleteContactButton${idx}`).on('click', elem => {
                    $('#firstnameDelete').text(contact.firstname)
                    $('#lastnameDelete').text(contact.lastname)
                    $('#deleteContactButton').off('click')
                    $('#deleteContactButton').on('click', event => {
                        $.ajax({
                            url: '/api/deleteContact',
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json',
                            error: function (err) {
                                doError(err)
                            },
                            success: function (data) {
                                search($('#searchInput').val())
                                $('#deleteContactModal').foundation('close')
                            },
                            data: JSON.stringify({
                                _id: contact._id,
                            })
                        })
                    })
                    $('#deleteContactModal').foundation('open')
                })

            })
            $('#contactsDiv').foundation()
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
