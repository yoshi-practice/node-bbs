'use strict';

import h from 'hyperscript';

const main = () =>
    firebase.database().ref('/node-bbs/posts').limitToLast(10).on('value', snapshot => {
        const posts = snapshot.exists() ? snapshot.val() : {}
        let html = ''
        for (const [id, {
                name,
                content,
                date
            }] of Object.entries(posts).reverse())
            html += makeReply(id, name, content, date)
        document.querySelector('#replies').innerHTML = html
    });

const makeReply = (id, name, content, date) =>
    `<div class="replies__content">
  <div class="replies__name">Name: ${name} <span class="replies__date">${date}</span></div>
  <div class="replies__content">${content}</div>
  <button class="replies__button--delete" onclick="deleteReply('${id}')">delete</button> </div>
  `

let postReply = function postReply() {
    post('/api/post', {
        name: document.querySelector('#reply__name').value,
        content: document.querySelector('#reply__body').value,
        key: document.querySelector('#reply__key').value,
    }).then(e => {
        document.querySelector('#reply__body').value = ''
    });
}
window.postReply = postReply;

let deleteReply = function deleteReply(id) {
    post('/api/delete', {
        id,
        key: prompt('key?') || ''
    });
}
window.deleteReply = deleteReply;

const post = (path, jsonData) => fetch(path, {
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
});

document.addEventListener('DOMContentLoaded', main);