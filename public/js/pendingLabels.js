const TABLE_ID = "pendingLabelsTable";

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
const opts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};
fetch(url, opts)
  .then(res => res.json())
  .then(data => handlePendingLabelResponse(data));

  function handlePendingLabelResponse(response) {
    if(response.data === null) {
      return;
    }
    let pendingLabelsArr = response.data.allpendingFashionLabels;
    for (var pendingLabelKey in pendingLabelsArr) {
      addRow(pendingLabelsArr[pendingLabelKey]);
    }
  }


  function addRow(pendingFashionLabel) {
    var table = document.getElementById(TABLE_ID);

			var rowCount = table.rows.length;
			var row = table.insertRow(rowCount);

			var idCell = row.insertCell(0);
      idCell.innerHTML = pendingFashionLabel.id;

      var statusCell = row.insertCell(1);
      statusCell.innerHTML = pendingFashionLabel.status;

      var labelNameCell = row.insertCell(2);
      labelNameCell.innerHTML = pendingFashionLabel.labelName;

      var labelOwnerCell = row.insertCell(3);
      labelOwnerCell.innerHTML = pendingFashionLabel.labelOwner;

      var aboutStatementCell = row.insertCell(4);
      aboutStatementCell.innerHTML = pendingFashionLabel.aboutStatement;

      var priceRangeCell = row.insertCell(5);
      priceRangeCell.innerHTML = pendingFashionLabel.avgPriceRange;

      var lowestPriceItemCell = row.insertCell(6);
      lowestPriceItemCell.innerHTML = "$" + pendingFashionLabel.lowestPriceItem;

      var highestPriceItemCell = row.insertCell(7);
      highestPriceItemCell.innerHTML = "$" + pendingFashionLabel.highestPriceItem;

      var offeringsCell = row.insertCell(8);
      offeringsCell.innerHTML = pendingFashionLabel.toString();

      var igUrlCell = row.insertCell(9);
      igUrlCell.innerHTML = "<a href=http://" + pendingFashionLabel.instagramUrl + ">" + pendingFashionLabel.instagramUrl+ "</a>";

      var websiteUrlCell = row.insertCell(10);
      websiteUrlCell.innerHTML = "<a href=http://" + pendingFashionLabel.websiteUrl + ">" + pendingFashionLabel.websiteUrl + "</a>";

      var exampleItemDescCell = row.insertCell(11);
      exampleItemDescCell.innerHTML = pendingFashionLabel.exampleImgDesc;

      var exampleImgPriceCell = row.insertCell(12);
      exampleImgPriceCell.innerHTML = "$" + pendingFashionLabel.exampleImagePrice;

      var submittedByCell = row.insertCell(13);
      submittedByCell.innerHTML = pendingFashionLabel.submittedBy;

      var submittedByEmail = row.insertCell(14);
      submittedByEmail.innerHTML = "<a href=mailto:" + pendingFashionLabel.submittedByEmail + ">" + pendingFashionLabel.submittedByEmail + "</a>"
	}
