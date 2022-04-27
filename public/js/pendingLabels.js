import config from './secretConsts.js';

const TABLE_ID = "pendingLabelsTable";
const form = document.querySelector('.update-pending-labels-form');

const query = `
  query {
    allpendingFashionLabels {
      id
      labelName
      status
      isBlackOwned
      aboutStatement
      avgPriceRange
      exampleImgDesc
      exampleImgPath
      exampleImagePrice
      highestPriceItem
      labelImgPath
      lowestPriceItem
      instagramUrl
      labelName
      labelOwner
      offerings
      websiteUrl
      phoneNumber
      labelEmail
      notes
      submittedBy
      submittedByEmail
      tags
      sustainable
    }
  }
`;
const url = "https://us-central1-theblackfashionfinderv1.cloudfunctions.net/graphql";
const queryOpts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};

function handleFormSubmit() {
  let approved = form.querySelector("#approve_pending_labels").value;
  let rejected = form.querySelector("#reject_pending_labels").value;
  let published = form.querySelector("#publish_pending_labels").value;

  let deleteAllRejected = form.querySelector("#delete_rejected").checked;
  let deleteAllPosted = form.querySelector("#delete_posted").checked;

  if (approved || rejected || published) {
    let approvedArr = approved ? approved.split(",") : [];
    let rejectedArr = rejected  ? rejected.split(",") : [];
    let publishedArr = published ? published.split(",") : [];

    var mutation = `
      mutation {
        newApprovals : updatePendingFashionLabelStatuses(input: {ids: ${getArrayToStringToString(approvedArr)}, newStatus: APPROVED}) {
          id
        }
        newRejects : updatePendingFashionLabelStatuses(input: {ids: ${getArrayToStringToString(rejectedArr)}, newStatus: REJECTED}) {
          id
        }
        newPublishes : publishPendingFashionLabels(input: {ids: ${getArrayToStringToString(publishedArr)}}) {
          id
        }
      }
    `;

    let mutationOpts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation })
    };

    fetch(url, mutationOpts)
      .then(res => res.json())
      .then(data => handlePendingLabelUpdates(data))
      .catch(console.error);
  }

  if (deleteAllPosted || deleteAllRejected) {
    let deleteAllPostedMutation = deleteAllPosted ? "deletePosted : deletePendingDocumentsOfStatus(status: POSTED)" : "";
    let deleteAllRejectedMutation = deleteAllRejected ? "deletePending : deletePendingDocumentsOfStatus(status: REJECTED)" : "";
    var mutation =`
    mutation {
      ${deleteAllPostedMutation}
      ${deleteAllRejectedMutation}
    }
    `;
    let mutationOpts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation })
    };

    fetch(url, mutationOpts)
      .then(res => res.json())
      .catch(console.error);
    }
}

export function getArrayToStringToString(arr) {
  if (arr === null || arr.length === 0) {
    return "[]";
  }
  return "[" + arr.map(x => `"${x}"`).toString() + "]";
}

function handlePendingLabelUpdates(response) {
  if(response.data === null) {
    return;
  }
  window.location.reload()
  return alert("New updates loaded");
}

function addRow(pendingFashionLabel) {
  if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    let storage = firebase.storage();

    let table = document.getElementById(TABLE_ID);

    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    var cellIndex = 0;

    let quickApproveCheckBox = row.insertCell(cellIndex++);
    let hasBeenPosted = pendingFashionLabel.status.toLowerCase() === "posted";
    quickApproveCheckBox.innerHTML = hasBeenPosted ? "N/A" : `<input type="checkbox" name="quick_approve" value="${pendingFashionLabel.id}"/>`;

    let quickRejectCheckBox = row.insertCell(cellIndex++);
    let hasBeenRejected = pendingFashionLabel.status.toLowerCase() === "rejected";
    quickRejectCheckBox.innerHTML = hasBeenRejected ? "N/A" : `<input type="checkbox" name="quick_reject" value="${pendingFashionLabel.id}"/>`;

    let idCell = row.insertCell(cellIndex++);
    idCell.innerHTML = pendingFashionLabel.id;

    let statusCell = row.insertCell(cellIndex++);
    statusCell.innerHTML = pendingFashionLabel.status;

    let labelNameCell = row.insertCell(cellIndex++);
    labelNameCell.innerHTML = pendingFashionLabel.labelName;

    let labelOwnerCell = row.insertCell(cellIndex++);
    labelOwnerCell.innerHTML = pendingFashionLabel.labelOwner;

    let aboutStatementCell = row.insertCell(cellIndex++);
    aboutStatementCell.innerHTML = pendingFashionLabel.aboutStatement.substring(0, 100);

    let sustainable = row.insertCell(cellIndex++);
    sustainable.innerHTML = pendingFashionLabel.sustainable ? pendingFashionLabel.sustainable : "false"

    let tags = row.insertCell(cellIndex++);
    let tagsFromDB =  pendingFashionLabel.tags ? pendingFashionLabel.tags : null
    if (tagsFromDB) {
      tags.innerHTML = pendingFashionLabel.tags.map(function (key) {
        return " " + key;
      }).toString();
    } else {
      tags.innerHTML = "none";
    }

    let labelImageCell = row.insertCell(cellIndex++);
    storage.ref(pendingFashionLabel.labelImgPath).getDownloadURL().then(function(url) {
      let cellContents = url ? "<a href=" + url + " target=\"_blank\"> Label Image </a>" : "Not found";
      labelImageCell.innerHTML = cellContents;
    });

    let priceRangeCell = row.insertCell(cellIndex++);
    priceRangeCell.innerHTML = pendingFashionLabel.avgPriceRange;

    let lowestPriceItemCell = row.insertCell(cellIndex++);
    lowestPriceItemCell.innerHTML = "$" + pendingFashionLabel.lowestPriceItem;

    let highestPriceItemCell = row.insertCell(cellIndex++);
    highestPriceItemCell.innerHTML = "$" + pendingFashionLabel.highestPriceItem;

    let offeringsCell = row.insertCell(cellIndex++);
    offeringsCell.innerHTML = pendingFashionLabel.offerings.map(function (key) {
      return " " + key;
    }).toString();

    let igUrlCell = row.insertCell(cellIndex++);
    igUrlCell.innerHTML = "<a href="+ pendingFashionLabel.instagramUrl + " target=\"_blank\">" + pendingFashionLabel.instagramUrl+ "</a>";

    let websiteUrlCell = row.insertCell(cellIndex++);
    websiteUrlCell.innerHTML = "<a href=" + pendingFashionLabel.websiteUrl + " target=\"_blank\">" + pendingFashionLabel.websiteUrl + "</a>";

    let labelEmailCell = row.insertCell(cellIndex++);
    labelEmailCell.innerHTML = pendingFashionLabel.labelEmail;

    let telephoneCell = row.insertCell(cellIndex++);
    telephoneCell.innerHTML = pendingFashionLabel.phoneNumber;

    let exampleImgPathCell = row.insertCell(cellIndex++);
    storage.ref(pendingFashionLabel.exampleImgPath).getDownloadURL().then(function(url) {
      let cellContents = url ? "<a href=" + url + " target=\"_blank\"> Example Item </a>" : "Not found";
      exampleImgPathCell.innerHTML = cellContents;
    });

    let exampleItemDescCell = row.insertCell(cellIndex++);
    exampleItemDescCell.innerHTML = pendingFashionLabel.exampleImgDesc;

    let exampleImgPriceCell = row.insertCell(cellIndex++);
    exampleImgPriceCell.innerHTML = "$" + pendingFashionLabel.exampleImagePrice;

    let submittedByCell = row.insertCell(cellIndex++);
    submittedByCell.innerHTML = pendingFashionLabel.submittedBy;

    let submittedByEmail = row.insertCell(cellIndex++);
    submittedByEmail.innerHTML = "<a href=mailto:" + pendingFashionLabel.submittedByEmail + ">" + pendingFashionLabel.submittedByEmail + "</a>"
}

function handlePendingLabelResponse(response) {
  if(response.data === null) {
    return;
  }
  let pendingLabelsArr = response.data.allpendingFashionLabels;
  if (pendingLabelsArr.length === 0) {
    document.getElementById('parent')
      .insertAdjacentHTML(
        'beforeend', '<div style="text-align: center; margin-bottom: 16px;"> No Items Found.</div>');
  }
  for (var pendingLabelKey in pendingLabelsArr) {
    addRow(pendingLabelsArr[pendingLabelKey]);
  }
}

fetch(url, queryOpts)
  .then(res => res.json())
  .then(data => handlePendingLabelResponse(data));

if (form) {
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    handleFormSubmit();
    form.reset();
  });
}
