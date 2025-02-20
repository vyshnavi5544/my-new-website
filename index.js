let users = [];
let currentUser = null;

function showLogin() {
    document.getElementById('root').innerHTML = `
        <div class="form-container">
            <h2>Login</h2>
            <input type="text" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Password">
            <button onclick="chkUser()">Login</button>
            <p>Don't have an account? <button onclick="showForm()">Sign Up</button></p>
        </div>
    `;
}

function showForm() {
    document.getElementById('root').innerHTML = `
        <div class="form-container">
            <h2>Sign Up</h2>
            <input type="text" id="name" placeholder="Name">
            <input type="text" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Password">
            <input type="date" id="dob" placeholder="Date of Birth">
            <button onclick="addUser()">Sign Up</button>
        </div>
    `;
}

function showTransfer() {
    if (!currentUser) {
        alert("Please log in first.");
        return;
    }
    
    document.getElementById('root').innerHTML = `
        <div class="form-container">
            <h2>Transfer</h2>
            <select id="type" onchange="toggleRecipient()">
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
                <option value="transfer">Transfer</option>
            </select>
            <input type="text" id="recipientEmail" placeholder="Recipient Email" style="display: none;">
            <input type="number" id="amount" placeholder="Amount">
            <button onclick="processTransfer()">Submit</button>
            <p><b>Total Balance: <span id="totalBalance">${currentUser.balance}</span></b></p>
            <button onclick="logout()">Logout</button>
        </div>
    `;
}

function toggleRecipient() {
    let type = document.getElementById("type").value;
    let recipientField = document.getElementById("recipientEmail");
    recipientField.style.display = type === "transfer" ? "block" : "none";
}

function logout() {
    currentUser = null;
    showLogin();
}

function addUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let dob = document.getElementById("dob").value;
    users.push({ name, email, password, dob, balance: 0 });
    alert("Account created!");
    showLogin();
}

function chkUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    currentUser = users.find(user => user.email === email && user.password === password);
    if (currentUser) {
        alert("Login successful!");
        showTransfer();
    } else {
        alert("Invalid credentials.");
    }
}

function processTransfer() {
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let recipientEmail = document.getElementById("recipientEmail").value;
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    
    if (type === "deposit") {
        currentUser.balance += amount;
    } else if (type === "withdraw") {
        if (currentUser.balance < amount) {
            alert("Insufficient balance.");
            return;
        }
        currentUser.balance -= amount;
    } else if (type === "transfer") {
        if (!recipientEmail) {
            alert("Please enter a recipient email.");
            return;
        }
        if (currentUser.balance < amount) {
            alert("Insufficient balance.");
            return;
        }
        let recipient = users.find(user => user.email === recipientEmail);
        if (!recipient) {
            alert("Recipient not found.");
            return;
        }
        currentUser.balance -= amount;
        recipient.balance += amount;
    }
    document.getElementById("totalBalance").innerText = currentUser.balance;
    alert("Transaction successful!");
}
