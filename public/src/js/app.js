'use strict';

import h from 'hyperscript';

const main = () =>
    firebase.database().ref('/node-bbs/posts').limitToLast(10).on('value', snapshot => {
        const posts = snapshot.exists() ? snapshot.val() : {}
        let body = ''
        for (const [id, {
                name,
                content,
                date
            }] of Object.entries(posts).reverse())
            body += makeReply(id, name, content, date)
        document.querySelector('#replies').innerHTML = body
    })

const makeReply = (id, name, content, date) =>
    h('div.replies__content',
        h('div.replies__name',
            h('p', "Name:", name),
            h('span.replies__date', date)
        ),
        h('div.replies__content',
            h('p', content)),
        h('button.replies__button--delete', 
        'delete')
    ).outerHTML;

const postReply = () => post('/api/post', {
    name: document.querySelector('#reply__name').value,
    content: document.querySelector('#reply__body').value,
    key: document.querySelector('#reply__key').value,
}).then(e => {
    document.querySelector('#reply__body').value = ''
})

window.postReply = postReply;

const deleteReply = id => post('/api/delete', {
    id,
    key: prompt('key?') || ''
})

window.deleteReply = deleteReply;

const post = (path, jsonData) => fetch(path, {
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})

document.addEventListener('DOMContentLoaded', main)