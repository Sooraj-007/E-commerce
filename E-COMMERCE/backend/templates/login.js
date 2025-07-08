function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include", // send session cookies
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            // ✅ Redirect after successful login
            window.location.href = "/index";
        } else {
            document.getElementById('login-message').innerText = data.error || "Invalid credentials";
        }
    })
    .catch(err => {
        document.getElementById('login-message').innerText = `Network error: ${err}`;
    });
}
