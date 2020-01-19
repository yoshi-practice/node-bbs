const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

const moment = require('moment');
moment.locale("ja");

const rep = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

exports.post = functions.https.onRequest((request, response) => {
    const {
        name,
        content,
        key
    } = request.body
    const date = moment().format('LLL');
    db.ref('/node-bbs/posts').push({
            name: rep(name),
            content: rep(content),
            date
        })
        .then(e => db.ref(`/node-bbs/keys/${e.key}`).set(key))
        .then(e => response.status(200).end())
})

exports.delete = functions.https.onRequest((request, response) => {
    const {
        id,
        key
    } = request.body
    db.ref(`/node-bbs/keys/${id}`).once('value').then(sKey => {
        if (!sKey.exists() || sKey.val() !== key)
            return response.status(400).send('invalid id or incorrect key').end()
        db.ref(`/node-bbs/posts/${id}`).remove()
            .then(e => sKey.ref.remove())
            .then(e => response.status(200).end())
    })
})