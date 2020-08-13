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

    const autoExpandSampleResults = document.getElementById('auto-expand-sample-results').checked;
    const autoExpandTextareas = document.getElementById('auto-expand-textareas').checked;

    const options = {
        autoExpandSampleResults,
        autoExpandTextareas
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
        autoExpandSampleResults: true,
        autoExpandTextareas: true
    };

    chrome.storage.sync.get(defaults, (items) => {
        document.getElementById('auto-expand-sample-results').checked = items.autoExpandSampleResults;
        document.getElementById('auto-expand-textareas').checked = items.autoExpandTextareas;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
