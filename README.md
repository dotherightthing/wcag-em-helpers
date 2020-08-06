# wcag-em-helpers

Google Chrome extension which supplements the WCAG EM reporting tool.

1. Adds success criteria statistics to page, to display total number of relevant success criteria and those which are unchecked/passing/failing/inapplicable/other
1. Adds count to criteria titles, so that progress can be seen at a glance.
1. Automatically expands all success criteria, so that results for the entire sample can be seen at a glance.
1. Automatically expands individual sample results, so that page specific results can be seen at a glance.
1. Automatically expands populated textareas, so that observations can be seen at a glance.

## manifest.json

- Available permissions - <https://developer.chrome.com/extensions/declare_permissions>

## Testing the extension

1. <chrome://extensions>
1. Check *Developer mode*
1. Click *Load unpacked extension*

## Roadmap

- Expand individual sample results when a sample page is checked (currently this requires navigating to another step then back again)
- Add WCAG version to each criterium (WCAG 1/2.0/2.1)
- Add field to describe testing method
- Consider using `aria-live` to expose new totals
