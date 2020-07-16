'use-strict';

import config from './secretConsts.js';

const form = document.querySelector('.feed-publish-form');

const FEED_POST_FILE = 'posts/';

// async function verifyLabel() {
//     if (!firebase.apps.length) {
//       firebase.initializeApp(config);
//     }
//     let labelName = form.querySelector('#label_name').value;
//     let id = form.querySelector('#label_id').value;
//     let db = firebase.firestore();
//     console.log(labelName);
//     console.log(id);
//     let res = await db.collection('fashionLabel').get();
//     console.log(res);
//     return res;
// }

async function firebasePush() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    let labelName = form.querySelector('#label_name').value;
    let id = form.querySelector('#label_id').value;
    let pic = form.querySelector('#post_pic');

    const fashionLabels = await firebase
        .firestore()
        .collection('fashionLabel')
        .where('labelName', '==', labelName)
        .where('id', '==', id)
        .get();
    if (fashionLabels.docs.length !== 1) {
      return false;
    }

    // region UPLOAD PICS
    let feedPicFileName = labelName.toLowerCase().replace(/ /g, "_").concat('_feed_post_' + Date.now());
    let feedPicStorageRef = firebase.storage().ref(FEED_POST_FILE + feedPicFileName);
    let feedPicFile = pic.files[0];
    let uploadTask = feedPicStorageRef.put(feedPicFile);

    // region upload data
    let postRef = firebase.firestore().collection('homeFeedPost').doc();
    let data = {
        id: postRef.id,
        fashionLabelName: labelName,
        fashionLabelId: id,
        imgPath: FEED_POST_FILE + feedPicFileName,
    };
    postRef.set(data);
    return true;
    // endregion
}

if (form) {
  form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      firebasePush().then((successful) => {
        form.reset();
        $('#post_pic_preview').removeAttr('src');
        //shows alert if everything went well.
        return alert(successful ? 'Posted' : 'Not posted because label name or id is incorrect.');
      });
    }, false);
}
