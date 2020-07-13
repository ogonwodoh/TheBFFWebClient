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
      notes
      submittedBy
      submittedByEmail
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

function getArrayToStringToString(arr) {
  if (arr === null || arr.length === 0) {
    return "[]";
  }
  return "[" + arr.map(x => `"${x}"`).toString() + "]";
}

function handlePendingLabelUpdates(response) {
  if(response.data === null) {
    return;
  }
  return alert("Rejected : " + response.data.newRejects.toString()
    + "\nApproved: " + response.data.newApprovals.toString()
    + "\nPublished: " + response.data.newPublishes.toString());
}

function addRow(pendingFashionLabel) {
    let table = document.getElementById(TABLE_ID);

    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    let idCell = row.insertCell(0);
    idCell.innerHTML = pendingFashionLabel.id;

    let statusCell = row.insertCell(1);
    statusCell.innerHTML = pendingFashionLabel.status;

    let labelNameCell = row.insertCell(2);
    labelNameCell.innerHTML = pendingFashionLabel.labelName;

    let labelOwnerCell = row.insertCell(3);
    labelOwnerCell.innerHTML = pendingFashionLabel.labelOwner;

    let aboutStatementCell = row.insertCell(4);
    aboutStatementCell.innerHTML = pendingFashionLabel.aboutStatement;

    let priceRangeCell = row.insertCell(5);
    priceRangeCell.innerHTML = pendingFashionLabel.avgPriceRange;

    let lowestPriceItemCell = row.insertCell(6);
    lowestPriceItemCell.innerHTML = "$" + pendingFashionLabel.lowestPriceItem;

    let highestPriceItemCell = row.insertCell(7);
    highestPriceItemCell.innerHTML = "$" + pendingFashionLabel.highestPriceItem;

    let offeringsCell = row.insertCell(8);
    offeringsCell.innerHTML = pendingFashionLabel.offerings.map(function (key) {
      return " " + key;
    }).toString();

    let igUrlCell = row.insertCell(9);
    igUrlCell.innerHTML = "<a href=http://" + pendingFashionLabel.instagramUrl + ">" + pendingFashionLabel.instagramUrl+ "</a>";

    let websiteUrlCell = row.insertCell(10);
    websiteUrlCell.innerHTML = "<a href=http://" + pendingFashionLabel.websiteUrl + ">" + pendingFashionLabel.websiteUrl + "</a>";

    let exampleItemDescCell = row.insertCell(11);
    exampleItemDescCell.innerHTML = pendingFashionLabel.exampleImgDesc;

    let exampleImgPriceCell = row.insertCell(12);
    exampleImgPriceCell.innerHTML = "$" + pendingFashionLabel.exampleImagePrice;

    let submittedByCell = row.insertCell(13);
    submittedByCell.innerHTML = pendingFashionLabel.submittedBy;

    let submittedByEmail = row.insertCell(14);
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
