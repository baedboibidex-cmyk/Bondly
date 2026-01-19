// Clear old service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then(r => r.forEach(reg => reg.unregister()))
      .catch(err => console.log(err));
  });
}

const auth = firebase.auth();
const db = firebase.firestore();

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  if (!email || !password || !username) { alert("Fill all fields"); return; }

  auth.createUserWithEmailAndPassword(email, password)
    .then(u => db.collection("users").doc(u.user.uid).set({
      username, email, is18Verified: false, isPremium: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }))
    .then(() => { alert("Account created!"); window.location.href="matches.html"; })
    .catch(e => alert(e.message));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) { alert("Fill all fields"); return; }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href="chat.html")
    .catch(e => alert(e.message));
}
