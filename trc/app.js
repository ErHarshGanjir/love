const API_URL = "https://google.com";

// 1. Determine Operating System via standard Web APIs safely
function parseUserEnvironment() {
    const userAgent = window.navigator.userAgent;
    
    if (userAgent.indexOf("Win") !== -1) return "Windows OS";
    if (userAgent.indexOf("Mac") !== -1) return "macOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux Engine";
    if (/Android/.test(userAgent)) return "Android Mobile";
    if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS Mobile";
    
    return "Unknown Platform/Other";
}

// 2. Dispatch data payload to the web macro infrastructure
function transmitDiagnostics(osInfo, localTimestamp) {
    // Note: Public IP detection should be resolved directly on your server/gateway endpoint headers
    // rather than client-side manipulation to prevent browser intercept blocking.
    const logData = new URLSearchParams({
        message: "Portal Interface Initialization Completed",
        device: osInfo,
        timestamp: localTimestamp
    });

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: logData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Telemetry dispatched successfully:", data);
        updateUserInterface(osInfo, localTimestamp);
    })
    .catch(error => {
        console.error("Telemetry failed or blocked by local client policies:", error);
        // Gracefully display system variables even if network endpoint returns an error
        updateUserInterface(osInfo, localTimestamp);
    });
}

// 3. Reflect states cleanly in the DOM
function updateUserInterface(os, time) {
    document.getElementById("loading-text").classList.add("hidden");
    document.getElementById("diagnostic-details").classList.remove("hidden");
    
    document.getElementById("os-value").innerText = os;
    document.getElementById("time-value").innerText = new Date(time).toLocaleString();
}

// Execution Entry Point
document.addEventListener("DOMContentLoaded", () => {
    const currentOS = parseUserEnvironment();
    const currentTimestamp = new Date().toISOString();
    
    transmitDiagnostics(currentOS, currentTimestamp);
});
