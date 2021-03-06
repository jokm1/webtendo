'use strict'

import io from 'socket.io-client'
import $ from 'jquery'
// import * as analytics from './analytics';

let socket = io.connect()
let el = document.getElementById('room')
socket.on('room', room => {
  el.value = room
  window.location.hash = room
})

// Ask server for default room.
if (!window.location.hash) {
  socket.emit('get room')
} else {
  // Strip off leading hash.
  el.value = window.location.hash.slice(1)
}

// Let user manually override.
el.addEventListener('input', e => {
  window.location.hash = e.target.value.toLowerCase()
})

// Preserve hash on navigation.
let links = document.getElementsByTagName('a')
for (let i = 0; i < links.length; i++) {
  let link = links[i]
  if (!link.dataset.game) {
    continue
  }
  let ontouch = e => {
    window.location.pathname = `/${link.dataset.game}/${currentRole}.html`
  }
  // Both mobile and desktop.
  link.addEventListener('touchend', ontouch)
  link.addEventListener('click', ontouch)
}

const clientButton = document.getElementsByClassName('btn-client')[0]
const hostButton = document.getElementsByClassName('btn-host')[0]

let currentRole = 'client'
function changeRole (role) {
  return () => {
    $('button.selected').removeClass('selected')
    if (role === 'client') {
      $('.btn-client').addClass('selected')
    } else if (role === 'host') {
      $('.btn-host').addClass('selected')
    }
    currentRole = role
  }
}

changeRole('client')()

clientButton.addEventListener('touchend', changeRole('client'))
clientButton.addEventListener('click', changeRole('client'))

hostButton.addEventListener('touchend', changeRole('host'))
hostButton.addEventListener('click', changeRole('host'))
