// 🔥 Clear old Firebase / default service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      })
      .catch(err => {
        console.log("Service worker cleanup failed:", err);
      });
  });
}

// 🔐 SIGN UP
function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const username = document.getElementById("username").value.trim();

  if (!email || !password || !username) {
    alert("Please fill all fields!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      return db.collection("users").doc(user.uid).set({
        username: username,
        email: email,
        is18Verified: false,   // 🔞 age lock
        isPremium: false,      // 💳 paywall
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "matches.html"; // Next page
    })
    .catch(error => {
      alert(error.message);
    });
}

// 🔑 LOGIN
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "chat.html"; // Redirect logged-in users to chat
    })
    .catch(error => {
      alert(error.message);
    });
}

// ✅ Keep home page visible for all
// Optional: you can still check auth state for UI tweaks, but no auto redirect
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in:", user.email);
    // You can update UI here instead of redirecting
    // Example: show user's username or enable chat link
  } else {
    console.log("No user logged in");
  }
});
