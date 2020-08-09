import { getArrayToStringToString } from './pendingLabels.js';

const button = document.getElementById("quickApproveBtn");
const url = "https://us-central1-theblackfashionfinderv1.cloudfunctions.net/graphql";

function checkTableCheckboxes() {
  let ids = []
  $('#pendingLabelsTable input[type=checkbox]:checked').each(function() {
    let id = this.value;
    ids.push(id);
    this.checked = false;
  });
  console.log(getArrayToStringToString(ids))

  var mutation = `
    mutation {
      newPublishes : publishPendingFashionLabels(input: {ids: ${getArrayToStringToString(ids)}}) {
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

function handlePendingLabelUpdates(response) {
  if(response.data === null) {
    return;
  }
  return alert("Refresh to see updates");
}

button.addEventListener('click', function(evt) {
  checkTableCheckboxes();
});
