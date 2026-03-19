const LASTPASS_ID = "hdokiejnpimakedhajhdlcegeplioahd";

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const errorDiv = document.getElementById("error");

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}

function updateStatus(enabled) {
  status.textContent = enabled ? "Enabled" : "Disabled";
  toggle.checked = enabled;
}

function checkLastPassStatus() {
  chrome.management.get(LASTPASS_ID, (info) => {
    if (chrome.runtime.lastError) {
      showError("LastPass extension not found. Please install LastPass first.");
      status.textContent = "Not Found";
      toggle.disabled = true;
      return;
    }

    hideError();
    updateStatus(info.enabled);
    toggle.disabled = false;
  });
}

toggle.addEventListener("change", (e) => {
  const enabled = e.target.checked;

  chrome.management.setEnabled(LASTPASS_ID, enabled, () => {
    if (chrome.runtime.lastError) {
      showError(`Failed to ${enabled ? "enable" : "disable"} LastPass: ${chrome.runtime.lastError.message}`);
      // Revert toggle state
      toggle.checked = !enabled;
      return;
    }

    hideError();
    updateStatus(enabled);
  });
});

// Initialize on popup open
checkLastPassStatus();
