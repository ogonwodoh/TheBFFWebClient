const form = document.querySelector('.admin-login-form');


if (form) {
    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        let email = form.querySelector('#email').value;
        let password = form.querySelector('#password').value;
        var auth = null;
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then( function() {
              return firebase.auth().signInWithEmailAndPassword(email, password);
            })
          .then(function() {
            setTimeout(function(){
              window.location.replace("../admin/adminHome.html")
              }, 1000)
          })
          .catch(function(error){
            alert("Login Failed : " + error);
          });
        })
}
