const sendMessage = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, message, (response) => {
                // Handle the response from the content script if needed
            });
        }
    });
};

$(document).ready(function () {
    $("#showAll").click(function () {
        sendMessage({ message: "show-all" });
    });

    $("#getDate").click(function () {
        sendMessage({ message: "get-date" });
    });

    $("#sendDate").click(function () {
        sendMessage({ message: "send-date" });
    });

    $("#fillAll").click(function () {
        sendMessage({ message: "fill-all" });
    });

    $("#national").click(function () {
        sendMessage({ message: "national" });
    });

    $("#appointment").click(function () {
        sendMessage({ message: "appointment" });
    });
});
