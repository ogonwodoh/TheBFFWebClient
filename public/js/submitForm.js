'use-strict';

import config from './secretConsts.js';

const form = document.querySelector('.submit-business-form');

function firebasePush() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    let submitterFirstName = form.querySelector('#submitter_first_name').value;
    let submitterLastName = form.querySelector('#submitter_last_name').value;
    let submitterEmail = form.querySelector('#submitter_email').value;
    let labelName = form.querySelector('#label_name').value;
    let labelOwner = form.querySelector('#label_owner_name').value;
    let missionStatement = form.querySelector('#label_desc').value;
    let isBlackOwned = form.querySelector('input[name="black_owned"]:checked').value;
    let labelPictureUpload = form.querySelector('#label_picture');
    let lowestPrice = form.querySelector('#lowest_price').value;
    let highestPrice = form.querySelector('#highest_price').value;
    let range = form.querySelector('input[name="price_range"]:checked').value;
    let itemPic = form.querySelector('#item_picture');
    let itemDesc = form.querySelector('#item_description').value;
    let itemPrice = form.querySelector('#item_description_price').value;
    let igUrl = form.querySelector('#ig').value;
    let website = form.querySelector('#website').value;
    let phoneNumber = form.querySelector('#phoneNumber').value
    let labelEmail = form.querySelector('#labelEmail').value
    let offerings = [];

    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var checkbox of checkboxes) {
        offerings.push(checkbox.value);
    }

    // region UPLOAD PICS
    let mainPicFileName = labelName.toLowerCase().replace(/ /g, "_").concat('_main');
    let mainPicStorageRef = firebase.storage().ref(mainPicFileName);
    let mainPicFile = labelPictureUpload.files[0];
    let uploadTaskSnapshotMain = mainPicStorageRef.put(mainPicFile);

    let examplePicFileName = labelName.toLowerCase().replace(/ /g, "_").concat('_example');
    let examplePicStorageRef = firebase.storage().ref(examplePicFileName);
    let examplePicFile = itemPic.files[0];
    let uploadTaskSnapshotExample = examplePicStorageRef.put(examplePicFile);
    // endregion

    // region upload data
    let pendingCollectionsRef = firebase.firestore().collection('pendingFashionLabel').doc();
    let data = {
        id: pendingCollectionsRef.id,
        aboutStatement: missionStatement,
        avgPriceRange: range,
        exampleImgDesc: itemDesc,
        exampleImgPath: examplePicFileName,
        exampleImagePrice: parseInt(itemPrice, 10),
        highestPriceItem: parseInt(highestPrice, 10),
        instagramUrl: igUrl,
        isBlackOwned: true,
        labelImgPath: mainPicFileName,
        labelEmail: labelEmail,
        labelName: labelName,
        labelOwner: labelOwner,
        lowestPriceItem: parseInt(lowestPrice, 10),
        offerings: offerings,
        phoneNumber: phoneNumber,
        status: "PENDING",
        submittedBy: submitterFirstName + " " + submitterLastName,
        submittedByEmail: submitterEmail,
        websiteUrl: website
    };
    pendingCollectionsRef.set(data);
    pendingCollectionsRef.update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    // endregion
}

if (form) {
    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        let isBlackOwnedInput = form.querySelector('input[name="black_owned"]:checked').value;
        let isBlackOwned = isBlackOwnedInput.toLowerCase() === "true"
        if (isBlackOwned) {
            firebasePush();
        }
        form.reset();
        $('#label_picture_preview').removeAttr('src');
        $('#item_picture_preview').removeAttr('src');
        //shows alert if everything went well.
        return alert(isBlackOwned ? 'Successfully submitted form. We will review your submission.' : 'Failed to submit. Unfortunately we are only accepting Black owned fashion labels and you indicated this label was not Black owned.');
    })
}
