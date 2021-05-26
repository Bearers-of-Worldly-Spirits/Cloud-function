// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteMessages = functions.https.onRequest((req, res) => {
  const timeNow = Date.now();

  const conversationsRef = admin.database().ref('/conversations/');
  conversationsRef.once('value', (snapshot) => {
    snapshot.forEach(messageChild => {
      messageChild.ref.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if ((Number(child.val()['date']) + Number(7200)) <= timeNow) {
            console.log("Last Valid:", (
              Number(child.val()['date']) + Number(7200)),
              "Time now:",
              timeNow)
            child.ref.set(null);
          }
        });
      });
    })
  })

  return res.status(200).end();
});

// exports.deleteMessages = functions.https.onRequest((req, res) => {
//   const timeNow = Date.now();
//   const messagesRef = admin.database().ref('/conversations/3293602E-6E14-41D5-99F5-95F03888093F');
//   messagesRef.once('value', (snapshot) => {
//     snapshot.forEach((child) => {
//       if ((Number(child.val()['data']) + Number(7200)) <= timeNow) {
//         child.ref.set(null);
//       }
//     });
//   });
//   return res.status(200).end();
// });

// exports.makeUppercase = functions.firestore.document('/conversations/{conversationId}/{messagesID}')
//   .onCreate((snap, context) => {
//   // Grab the current value of what was written to Firestore.
//   const original = snap.data().original;

//   // Access the parameter `{documentId}` with `context.params`
//   functions.logger.log('Uppercasing', context.params.conversationId, original);
  
//   const uppercase = original.toUpperCase();
  
//   // You must return a Promise when performing asynchronous tasks inside a Functions such as
//   // writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return snap.ref.set({uppercase}, {merge: true});
// });

// Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


