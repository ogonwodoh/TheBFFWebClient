import { getArrayToStringToString } from './pendingLabels.js';

const button = document.getElementById("quickApproveBtn");
const url = "https://us-central1-theblackfashionfinderv1.cloudfunctions.net/graphql";

function checkTableCheckboxes() {
  let approvedIds = new Set()
  $('#pendingLabelsTable input:checkbox[name=quick_approve]:checked').each(function() {
    let id = this.value;
    approvedIds.add(id);
    this.checked = false;
  });

  let rejectedIds = new Set()
  $('#pendingLabelsTable input:checkbox[name=quick_reject]:checked').each(function() {
    let id = this.value;
    this.checked = false;
    if(approvedIds.has(id)) {
      return alert(`Error: You are trying to approve and delete label with id ${id} which is undefined. Please fix the error.`)
    }
    rejectedIds.add(id);
  });

  var mutation = `
    mutation {
      newPublishes : publishPendingFashionLabels(input: {ids: ${getArrayToStringToString(Array.from(approvedIds))}}) {
        id
      }
      rejects : updatePendingFashionLabelStatuses(input:
        {
          ids: ${getArrayToStringToString(Array.from(rejectedIds))},
          newStatus: REJECTED,
        }) {
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
