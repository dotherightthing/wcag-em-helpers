/**
 * @file WCAG EM Helpers Options
 * @author dan@dotherightthing.co.nz
 */

/**
 * @function saveOptions
 * @summary Saves options to chrome.storage
 */
function saveOptions() {
    console.log('saveOptions');

    const showExpandControls = document.getElementById('show-expand-controls').checked;

    const options = {
        showExpandControls
    };

    chrome.storage.sync.set(options, () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';

        setTimeout(() => {
            status.textContent = '';
        }, 1250);
    });
}

/**
 * @function restoreOptions
 * @summary Restores select box and checkbox state using the preferences stored in chrome.storage.
 */
function restoreOptions() {
    console.log('restoreOptions');

    const defaults = {
        showExpandControls: true
    };

    chrome.storage.sync.get(defaults, (items) => {
        document.getElementById('show-expand-controls').checked = items.showExpandControls;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
