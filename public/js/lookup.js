const form = document.querySelector('.lookup-label-form');
const url = "https://us-central1-theblackfashionfinderv1.cloudfunctions.net/graphql";

function handleFormSubmit() {
  let name = form.querySelector("#label_name").value;
  let query = `
    query {
      fashionLabelByNameUnsafe(name: "${name}") {
        id
        labelName
      }
    }
  `;
  let opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  };

  fetch(url, opts)
    .then(res => res.json())
    .then(data => handleLookupResults(data));
}

function handleLookupResults(response) {
  let htmlResponse = response.data === null ? "Not found." : JSON.stringify(response.data.fashionLabelByNameUnsafe);
  let container = document.querySelector('.lookup-results');
  container.innerHTML = htmlResponse;
}

if (form) {
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    handleFormSubmit();
    form.reset();
  });
}
