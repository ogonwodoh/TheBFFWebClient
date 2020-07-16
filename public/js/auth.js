   firebase.auth().onAuthStateChanged(user => {
     if(!user) {
       window.location = '../login.html'; //If User is not logged in, redirect to login page
     }
   });

   let signOut = function() {
     firebase.auth().signOut()
       .catch(function(error) {
         alert('Unable to sign out');
       });
     }
