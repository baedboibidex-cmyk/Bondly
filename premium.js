// Wait until page is fully loaded
window.addEventListener("load", () => {

  const auth = firebase.auth();
  const db = firebase.firestore();

  const payBtn = document.getElementById("payButton");

  if (!payBtn) {
    console.error("Pay button not found");
    return;
  }

  payBtn.addEventListener("click", () => {

    auth.onAuthStateChanged(user => {
      if (!user) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
      }

      let handler = PaystackPop.setup({
        key: 'pk_test_01dccc55e7797eec7f39f897124d87c99a615883',
        email: user.email,
        amount: 1000 * 100,
        currency: 'NGN',
        ref: 'BON-' + Math.floor(Math.random() * 1000000000),

        callback: function (response) {
          alert("Payment successful!");

          db.collection("users").doc(user.uid).update({
            isPremium: true,
            premiumSince: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            alert("You are now Premium 🎉");
            window.location.href = "profile.html";
          })
          .catch(err => {
            console.error(err);
            alert("Upgrade failed");
          });
        },

        onClose: function () {
          alert("Payment cancelled");
        }
      });

      handler.openIframe();
    });

  });

});
