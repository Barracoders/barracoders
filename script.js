// Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Firebase references
const auth = firebase.auth();
const db = firebase.database();

let currentUser;
let questionRef, imageRef, votesRef;

// Host login
function login() {
    const email = document.getElementById('hostEmail').value;
    const password = document.getElementById('hostPassword').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            currentUser = user.user;
            document.getElementById('auth').style.display = 'none';
            document.getElementById('hostPanel').style.display = 'block';
        })
        .catch(error => {
            console.error('Error logging in:', error);
            alert('Login failed: ' + error.message);
        });
}

// Host logout
function logout() {
    auth.signOut().then(() => {
        document.getElementById('hostPanel').style.display = 'none';
        document.getElementById('auth').style.display = 'block';
    });
}

// Upload image
function uploadImage(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child('images/' + file.name);
    imageRef.put(file).then(() => {
        imageRef.getDownloadURL().then(url => {
            imageRef = url;
        });
    });
}

// Start voting
function startVoting() {
    const question = document.getElementById('question').value;
    questionRef = db.ref('voting/question');
    imageRef = db.ref('voting/image');
    votesRef = db.ref('voting/votes');

    questionRef.set(question);
    imageRef.set(imageRef);

    document.getElementById('votingQuestion').innerText = question;
    if (imageRef) {
        document.getElementById('votingImage').src = imageRef;
        document.getElementById('votingImage').style.display = 'block';
    }
    document.getElementById('hostPanel').style.display = 'none';
    document.getElementById('votingPanel').style.display = 'block';
}

// Reset votes
function resetVotes() {
    votesRef.remove();
}

// Vote
function vote(color) {
    const voteRef = votesRef.push();
    voteRef.set(color);
}

// Listen for votes
votesRef.on('value', snapshot => {
    const votes = snapshot.val();
    const counts = { '#031c40': 0, '#64b242': 0 };
    for (let key in votes) {
        counts[votes[key]]++;
    }
    document.getElementById('results').innerText = `#031c40: ${counts['#031c40']}, #64b242: ${counts['#64b242']}`;
});