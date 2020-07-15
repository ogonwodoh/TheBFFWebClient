'use-strict';

import config from './secretConsts.js';

const form = document.querySelector('.feed-publish-form');

function firebasePush() {}

function verifyLabel() {
  let labelName = form.querySelector('#label_name').value;
  let id = form.querySelector('#label_id').value;
  let db = firebase.firestore();
  console.log(labelName);
  console.log(id);
  let fashionLabels = db.collection("fashionLabel")
                      .where('labelName', '==', labelName)
                      .where('id', '==', id)
                      .get()
                      .then(function (querySnapshot) {
                        console.log("hi");
                        return false;
                      })
                      .catch(function(error) {
                          console.log("Error getting documents: ", error);
                          return false;
                      });
}
  if (form) {
      form.addEventListener('submit', function(evt) {
          if (!firebase.apps.length) {
            firebase.initializeApp(config);
          }
          if (!verifyLabel()) {
            return alert('Unable to post because label not found');
          }
          form.reset();
          $('#post_pic_preview').removeAttr('src');
          return alert('Successfully published label.');
      })
  }
