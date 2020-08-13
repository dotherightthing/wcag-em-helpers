chrome.runtime.onMessage.addListener((message, callback) => {
    if (message === 'runContentScript') {
        chrome.tabs.executeScript({
            file: 'contentScript.js'
        });
    }
});
