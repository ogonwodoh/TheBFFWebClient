'use-strict';

import config from './secretConsts.js';

const form = document.querySelector('.blog-post-form');

const BLOG_POST_FOLDER = 'blogPosts/';

async function firebasePush() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    let title = form.querySelector('#blog_title').value;
    let type = form.querySelector('#post_type').value;
    let url = form.querySelector('#post_url').value;
    let pic = form.querySelector('#post_pic');

    // region UPLOAD PICS
    let pic_preview = document.getElementById('post_pic_preview');
    let height = pic_preview.height;
    let width = pic_preview.width;
    let blogPostPicName = title.toLowerCase().replace(/ /g, "_").concat('_blog_post_' + Date.now());
    let blogPostPicStorageRef = firebase.storage().ref(BLOG_POST_FOLDER + blogPostPicName);
    let blogPostPicFile = pic.files[0];
    let uploadTask = blogPostPicStorageRef.put(blogPostPicFile);

    // region upload data
    let postRef = firebase.firestore().collection('blogPost').doc();
    let data = {
        id: postRef.id,
        imgHeight: height,
        imgWidth: width,
        imgPath: BLOG_POST_FOLDER + blogPostPicName,
        postType: type,
        title: title,
        url: url,
        height: height,
    };
    postRef.set(data);
    postRef.update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
}

if (form) {
  form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      firebasePush().then((successful) => {
        form.reset();
        $('#post_pic_preview').removeAttr('src');
        //shows alert if everything went well.
        return alert('Posted');
      });
    }, false);
}
