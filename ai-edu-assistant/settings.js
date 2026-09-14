// Load settings
(function () {
    document.getElementById("userType").value =
        localStorage.getItem("userType") || "student";

    document.getElementById("defaultLevel").value =
        localStorage.getItem("defaultLevel") || "easy";

    document.getElementById("notifications").checked =
        localStorage.getItem("notifications") === "true";
})();

// Save settings
function saveSettings() {
    localStorage.setItem("userType", document.getElementById("userType").value);
    localStorage.setItem("defaultLevel", document.getElementById("defaultLevel").value);
    localStorage.setItem("notifications", document.getElementById("notifications").checked);

    alert("Settings Saved!");
}

// Reset data
function resetData() {
    localStorage.clear();
    alert("All data reset!");
    location.reload();
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        // If you later add auth, clear here
        localStorage.removeItem("isLoggedIn");

        // Redirect to login
        window.location.href = "login.html";
    }
}