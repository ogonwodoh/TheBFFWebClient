import config from './secretConsts.js';

const TABLE_ID = "currentLabelsTable";
const url = "https://us-central1-theblackfashionfinderv1.cloudfunctions.net/graphql";
const limit = 20;
let nextId = null;
let hasMore = false;

function addRow(fashionLabel) {
  if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    let storage = firebase.storage();

    let table = document.getElementById(TABLE_ID);

    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    let idCell = row.insertCell(0);
    idCell.innerHTML = fashionLabel.id;

    let labelNameCell = row.insertCell(1);
    labelNameCell.innerHTML = fashionLabel.labelName;

    let labelOwnerCell = row.insertCell(2);
    labelOwnerCell.innerHTML = fashionLabel.labelOwner;

    let aboutStatementCell = row.insertCell(3);
    aboutStatementCell.innerHTML = fashionLabel.aboutStatement;

    let labelImageCell = row.insertCell(4);
    storage.ref(fashionLabel.labelImgPath).getDownloadURL().then(function(url) {
      let cellContents = url ? "<a href=" + url + " target=\"_blank\"> Label Image </a>" : "Not found";
      labelImageCell.innerHTML = cellContents;
    });

    let priceRangeCell = row.insertCell(5);
    priceRangeCell.innerHTML = fashionLabel.avgPriceRange;

    let lowestPriceItemCell = row.insertCell(6);
    lowestPriceItemCell.innerHTML = "$" + fashionLabel.lowestPriceItem;

    let highestPriceItemCell = row.insertCell(7);
    highestPriceItemCell.innerHTML = "$" + fashionLabel.highestPriceItem;

    let offeringsCell = row.insertCell(8);
    offeringsCell.innerHTML = fashionLabel.offerings.map(function (key) {
      return " " + key;
    }).toString();

    let igUrlCell = row.insertCell(9);
    igUrlCell.innerHTML = "<a href=http://" + fashionLabel.instagramUrl + " target=\"_blank\">" + fashionLabel.instagramUrl+ "</a>";

    let websiteUrlCell = row.insertCell(10);
    websiteUrlCell.innerHTML = "<a href=http://" + fashionLabel.websiteUrl + " target=\"_blank\">" + fashionLabel.websiteUrl + "</a>";

    let labelEmailCell = row.insertCell(11);
    labelEmailCell.innerHTML = fashionLabel.labelEmail;

    let telephoneCell = row.insertCell(12);
    telephoneCell.innerHTML = fashionLabel.phoneNumber;

    let exampleImgPathCell = row.insertCell(13);
    storage.ref(fashionLabel.exampleImgPath).getDownloadURL().then(function(url) {
      let cellContents = url ? "<a href=" + url + " target=\"_blank\"> Example Item </a>" : "Not found";
      exampleImgPathCell.innerHTML = cellContents;
    });

    let exampleItemDescCell = row.insertCell(14);
    exampleItemDescCell.innerHTML = fashionLabel.exampleImgDesc;

    let exampleImgPriceCell = row.insertCell(15);
    exampleImgPriceCell.innerHTML = "$" + fashionLabel.exampleImagePrice;
  }

function handleResponse(graphQLResponse) {
  if (graphQLResponse.data === null) {
    return;
  }
  let response = graphQLResponse.data.fashionLabelsPaginated;
  let labels = response.labels;
  if (labels.length === 0) {
    document.getElementById("fetchMore").style.display = "none";
    document.getElementById('parent')
      .insertAdjacentHTML(
        'beforeend', '<div style="text-align: center; margin-bottom: 16px;"> No More Items.</div>');
  }
  hasMore = response.hasMore === 'true';
  if (!hasMore) {
    document.getElementById("fetchMore").style.display = "none";
  }
  nextId = response.nextId;
  for (var labelKey in labels) {
    addRow(labels[labelKey]);
  }
}

function performFetch(isInitialFetch) {
  if (!hasMore && !isInitialFetch) {
    return;
  }
  let query = `
    query {
      fashionLabelsPaginated(input: {limit: ${limit}, startAt: ${nextId}}) {
        labels {
          id
          aboutStatement
          avgPriceRange
          exampleImgDesc
          exampleImgPath
          exampleImagePrice
          highestPriceItem
          instagramUrl
          labelImgPath
          labelName
          labelOwner
          lowestPriceItem
          offerings
          websiteUrl
          phoneNumber
          labelEmail
        }
        hasMore
        nextId
      }
    }
  `;
  let queryOpts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  };
  fetch(url, queryOpts)
    .then(res => res.json())
    .then(data => handleResponse(data));
}

performFetch(true);
