'use-strict';

import config from './secretConsts.js';

const form = document.querySelector('.feed-publish-form');

const FEED_POST_FILE = 'posts/';

async function firebasePush() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    let id = form.querySelector('#label_id').value;
    let pic = form.querySelector('#post_pic');

    const fashionLabels = await firebase
        .firestore()
        .collection('fashionLabel')
        .where('id', '==', id)
        .get();
    if (fashionLabels.docs.length !== 1) {
      return false;
    }
    let labelName = fashionLabels.docs[0].data().labelName
    // region UPLOAD PICS
    let pic_preview = document.getElementById('post_pic_preview');
    let height = pic_preview.height;
    let width = pic_preview.width;
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
        width: width,
        height: height,
    };
    postRef.set(data);
    postRef.update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
    // endregion
}

if (form) {
  form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      firebasePush().then((successful) => {
        if (successful) {
          form.reset();
          $('#post_pic_preview').removeAttr('src');
        }
        return alert(successful ? 'Posted' : 'Not posted because label name or id is incorrect.');
      });
    }, false);
}
