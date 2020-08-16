/**
 * @file WCAG EM Helpers
 * @author dan@dotherightthing.co.nz
 */

/**
 * @class WcagEmHelpers
 *
 * @param {object}  options                                 - Module options
 * @param {string}  options.checkboxLabelClassChecked      - Class of selected checkbox label in Angular app
 * @param {string}  options.checkboxLabelClassUnchecked    - Class of unselected checkbox label in Angular app
 * @param {string}  options.componentSelectorBase           - Base of helper selector
 * @param {string}  options.criteriaExpandButtonSelector    - Selector of button which opens criteria panels
 * @param {Array}   options.criteriaIndicesWcag21           - Copied from WCAG EM filter output (WCAG 2.0 succeeds WCAG 1.0, WCAG 2.1 extends WCAG 2.0)
 * @param {string}  options.criterionPanelHeadingSelector   - Selector of success criterion panel heading element
 * @param {string}  options.criterionSelector               - Selector of success criteria elements
 * @param {string}  options.criterionTitleSelector          - Selector of success criterion title element
 * @param {string}  options.criterionTitleIndexSelector     - Selector of success criterion title index element
 * @param {string}  options.criterionValueUntested          - Value of untested success criterion
 * @param {string}  options.sampleControlContainerSelector - Selector of container wrapping sample page checkboxes
 * @param {string}  options.sampleExpandButtonSelector      - Selector of button which opens sample panels
 * @param {string}  options.samplesSelectedSelector         - Selector of extra checkbox which Angular checks when a sample page is selected
 * @param {string}  options.sampleSelectionSelector         - Selector of checked sample page checkbox
 * @param {string}  options.scContainerSelector             - Selector of success criteria container
 * @param {string}  options.statsParentSelector             - Selector of element to append the stats after
 * @param {Array}   options.statuses                        - Status state strings
 */
class WcagEmHelpers {
    constructor(options = {}) {
        // public options
        this.checkboxLabelClassChecked = options.checkboxLabelClassChecked || '';
        this.checkboxLabelClassUnchecked = options.checkboxLabelClassUnchecked || '';
        this.componentSelectorBase = options.componentSelectorBase || '';
        this.criteriaExpandButtonSelector = options.criteriaExpandButtonSelector || '';
        this.criteriaIndicesWcag21 = options.criteriaIndicesWcag21 || [];
        this.criterionPanelHeadingSelector = options.criterionPanelHeadingSelector || '';
        this.criterionSelector = options.criterionSelector || '';
        this.criterionTitleSelector = options.criterionTitleSelector || '';
        this.criterionTitleIndexSelector = options.criterionTitleIndexSelector || '';
        this.criterionValueUntested = options.criterionValueUntested || '';
        this.sampleControlContainerSelector = options.sampleControlContainerSelector || '';
        this.sampleExpandButtonSelector = options.sampleExpandButtonSelector || '';
        this.samplesSelectedSelector = options.samplesSelectedSelector || '';
        this.sampleSelectionSelector = options.sampleSelectionSelector || '';
        this.scContainerSelector = options.scContainerSelector || '';
        this.statsParentSelector = options.statsParentSelector || '';
        this.statuses = options.statuses || [];
    }

    /**
     * @function expandCriteria
     * @summary Expand all success criteria, so that results for the entire sample can be seen at a glance.
     * @memberof WcagEmHelpers
     */
    expandCriteria() {
        const collapsed = document.querySelectorAll(this.criteriaExpandButtonSelector);

        collapsed.forEach((collapsedItem) => {
            collapsedItem.click();
        });
    }

    /**
     * @function expandSampleResults
     * @summary Expand individual sample results, so that page specific results can be seen at a glance.
     * @memberof WcagEmHelpers
     */
    expandSampleResults() {
        const anySelected = document.querySelectorAll(this.samplesSelectedSelector);

        if (anySelected.length) {
            const collapsed = document.querySelectorAll(this.sampleExpandButtonSelector);

            collapsed.forEach(function (collapsedItem) {
                collapsedItem.click();
            });
        }
    }

    /**
     * @function collapseTextAreas
     * @summary Collapse populated textareas, to save space.
     * @memberof WcagEmHelpers
     */
    collapseTextAreas() {
        const elements = document.querySelectorAll('textarea');

        elements.forEach((el) => {
            el.style.height = ''; // collapse
        });
    }

    /**
     * @function expandTextAreas
     * @summary Expand populated textareas, so that observations can be seen at a glance.
     * @memberof WcagEmHelpers
     */
    expandTextAreas() {
        const elements = document.querySelectorAll('textarea');

        elements.forEach((el) => {
            if (el.value !== '') {
                el.style.height = 'auto'; // expand
            } else {
                el.style.height = ''; // collapse
            }
        });
    }

    /**
     * @function generateCriteriaStats
     * @summary Adds success criteria statistics to page.
     * @memberof WcagEmHelpers
     */
    generateCriteriaStats() {
        let html = '';
        const sc = document.querySelectorAll(`${this.scContainerSelector} ${this.criterionSelector}`);
        const statsParent = document.querySelector(`${this.scContainerSelector} ${this.statsParentSelector}`);
        let wcagEmHelpersContainer = document.querySelector(`.${this.componentSelectorBase}`);

        if (wcagEmHelpersContainer === null) {
            wcagEmHelpersContainer = document.createElement('div');
            wcagEmHelpersContainer.setAttribute('class', this.componentSelectorBase);

            statsParent.appendChild(wcagEmHelpersContainer);
        }

        html = `<p class="${this.componentSelectorBase}__totals">Totals:</p>`;
        html += `<ul class="${this.componentSelectorBase}__counts">`;

        this.statuses.forEach((status) => {
            let statusMsg = status;
            let count = 0;

            if (status === 'canttell') {
                statusMsg = 'cannot tell';
            } else if (status === 'total') {
                count = sc.length;
            }

            html += `<li class="${this.componentSelectorBase}__count ${this.componentSelectorBase}__count--${status}">`;
            html += `<span class="${this.componentSelectorBase}__count-inner">`;
            html += `<strong class="${this.componentSelectorBase}__count-int" id="${this.componentSelectorBase}__${status}-count">${count}</strong> `;

            if (status === 'untested') {
                // skiplink to first untested criterion
                html += `<a id="${this.componentSelectorBase}-skiplink">${statusMsg}</a>`;

                // skiplink fallback when no untested criteria
                html += `<span id="${this.componentSelectorBase}-noskiplink">${statusMsg}</span>`;
            } else {
                html += statusMsg;
            }

            html += '</span>';
            html += '</li>';
        });

        html += '</ul>';

        wcagEmHelpersContainer.innerHTML = html;

        sc.forEach((scItem, i) => {
            this.setCriterionIndex(scItem, i + 1, sc.length);
            this.setCriterionWcagVersion(scItem);
        });

        // can't use regular HTML anchor as Angular uses a hashbang to set virtual page views
        const skiplink = document.querySelector(`#${this.componentSelectorBase}-skiplink`);
        skiplink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = skiplink.getAttribute('href')
            document.querySelector(`${target}`).focus();
        });        
    }

    /**
     * @function generateExpandControls
     * @summary Adds global expand/collapse controls to page.
     * @memberof WcagEmHelpers
     */
    generateExpandControls() {
        let _self = this;
        let controls = ['panels', 'textareas'];
        let html = '';
        let wcagEmHelpersContainer = document.querySelector(`.${this.componentSelectorBase}`);

        html += '<fieldset class="wcag-em-helpers__controls">';
        html += '<legend>Expand:</legend>';

        controls.forEach((control) => {
            html += `<label class="${this.checkboxLabelClassUnchecked}">`;
            html += `<input type="checkbox" id="${this.componentSelectorBase}-expand-${control}"><span>Expand ${control}</span>`;
            html += '</label>';
        });

        html += '</fieldset>';

        wcagEmHelpersContainer.innerHTML = wcagEmHelpersContainer.innerHTML + html;

        controls.forEach((control) => {
            wcagEmHelpersContainer.querySelector(`#${this.componentSelectorBase}-expand-${control}`).addEventListener('change', function() {
                if (this.checked) {
                    this.parentNode.className = _self.checkboxLabelClassChecked;

                    if (this.id === `${_self.componentSelectorBase}-expand-panels`) {
                        _self.expandCriteria();
                        _self.expandSampleResults();
                        this.setAttribute('disabled', '');
                    } else if (this.id === `${_self.componentSelectorBase}-expand-textareas`) {
                        _self.expandTextAreas();
                    }
                } else {
                    this.parentNode.className = _self.checkboxLabelClassUnchecked;

                    if (this.id === `${_self.componentSelectorBase}-expand-textareas`) {
                        _self.collapseTextAreas();
                    }
                }
            });
        });
    }

    /**
     * @function setSkiplinkTarget
     * @summary Jump to the first untested success criterion.
     * @memberof WcagEmHelpers
     */
    setSkiplinkTarget() {
        const selects = document.querySelectorAll(`${this.criterionPanelHeadingSelector} select`);
        const skiplink = document.querySelector(`#${this.componentSelectorBase}-skiplink`);
        const noskiplink = document.querySelector(`#${this.componentSelectorBase}-noskiplink`);
        let target = null;

        for (let s = 0; s < selects.length; s++) {
            if (selects[s].value === this.criterionValueUntested) {
                target = selects[s].parentNode.nextElementSibling.querySelector('textarea');
                break;
            }
        }

        if (target !== null) {
            // show skiplink
            skiplink.setAttribute('href', `#${target.id}`);
            skiplink.removeAttribute('hidden');
            noskiplink.setAttribute('hidden', ''); // boolean attribute
        } else {
            // hide skiplink
            noskiplink.removeAttribute('hidden');
            skiplink.setAttribute('hidden', ''); // boolean attribute
        }
    }

    /**
     * @function setCriterionIndex
     * @summary Add index (n/total) to each relevant criterion, to track progress.
     * @memberof WcagEmHelpers
     *
     * @param {object} domNode - DOM Node
     * @param {number} index - Index
     * @param {number} total - Total
     */
    setCriterionIndex(domNode, index, total) {
        const countSelector = `.${this.componentSelectorBase}__title-count`;
        const parentEl = domNode.querySelector(this.criterionTitleIndexSelector);

        if (parentEl !== null) {
            if (parentEl.querySelector(countSelector) === null) {
                const countEl = document.createElement('span');
                countEl.setAttribute('class', countSelector.substring(1));
                parentEl.appendChild(countEl);
            }

            parentEl.querySelector(countSelector).innerHTML = `[${index}/${total}]`;
        }
    }

    /**
     * @function setCriterionWcagVersion
     * @summary Add WCAG version label to individual criteria, as a learning tool.
     * @memberof WcagEmHelpers
     *
     * @param {object} domNode - DOM Node
     */
    setCriterionWcagVersion(domNode) {
        const criterionTitleEl = domNode.querySelector(this.criterionTitleSelector);

        if (criterionTitleEl !== null) {
            const criterionTitle = criterionTitleEl.innerHTML;
            const criterionIndexMatch = criterionTitle.match(/([0-9])+.([0-9])+.([0-9])+/);
            const criterionLevelMatch = criterionTitle.match(/(\(Level )+(A)+(\))/);
            let criterionVersionLabel = 'WCAG 2.0';
            let newCriterionTitle;

            if (criterionIndexMatch) {
                const criterionIndex = criterionIndexMatch[0];

                if (this.criteriaIndicesWcag21.includes(criterionIndex)) {
                    criterionVersionLabel = 'WCAG 2.1';
                };

                if (criterionLevelMatch) {
                    newCriterionTitle = criterionTitle.replace(criterionLevelMatch[0], `(${criterionLevelMatch[0].replace('(', '').replace(')', '')}, ${criterionVersionLabel})`);

                    criterionTitleEl.innerHTML = newCriterionTitle;
                }
            }
        }
    }

    /**
     * @function hostColoursToVariables
     * @summary Get relevant colours from host stylesheet and store as CSS variables.
     * @memberof WcagEmHelpers
     */
    hostColoursToVariables() {
        let stylesheetRef = document.querySelector(`#${this.componentSelectorBase}-variables`);

        if (stylesheetRef === null) {
            const stylesheet = document.createElement('style');
            stylesheet.setAttribute('id', `${this.componentSelectorBase}-variables`);
            document.head.appendChild(stylesheet);
            stylesheetRef = stylesheet.sheet;

            let variablesRule = ':root {';

            this.statuses.forEach((status, i) => {
                let panel = document.createElement('div');

                if (status === 'untested') {
                    panel.setAttribute('class', `panel criterion panel-default`);
                } else {
                    panel.setAttribute('class', `panel criterion ${status}`);
                }

                panel.setAttribute('hidden', '');
                document.querySelector(`.${this.componentSelectorBase}`).appendChild(panel);

                let panelStyles = window.getComputedStyle(panel);
                let color = panelStyles.getPropertyValue('border-left-color');
                variablesRule += ` --color-${status}: ${color};`
            });

            variablesRule += '}';
            stylesheetRef.insertRule(variablesRule, 0);
        }
    }

    /**
     * @function setup
     * @summary Set up the app.
     * @memberof WcagEmHelpers
     */
    setup() {
        // get extension options
        chrome.storage.sync.get(null, (items) => {
            this.showExpandControls = items.showExpandControls;

            // timeout allows for Angular render time
            setTimeout(() => {
                this.generateCriteriaStats();
                this.hostColoursToVariables();
                this.updateCriteriaStats();
                this.setSkiplinkTarget();
                this.watchForCriteriaUpdates();

                if (this.showExpandControls) {
                    this.generateExpandControls();
                }
            }, 1000);
        });
    }

    /**
     * @function updateCriteriaStats
     * @summary Update status of Success Criteria pass/fail/todo statistics on page.
     * @memberof WcagEmHelpers
     */
    updateCriteriaStats() {
        const scContainerElement = document.querySelector(this.scContainerSelector);
        const sc = document.querySelectorAll(`${this.scContainerSelector} ${this.criterionSelector}`);

        this.statuses.forEach((status) => {
            let count;

            if (status === 'total') {
                count = scContainerElement.querySelectorAll(this.criterionSelector).length;
            } else {
                count = scContainerElement.querySelectorAll(`${this.criterionSelector}.${status}`).length;
            }

            document.querySelector(`#${this.componentSelectorBase}__${status}-count`).innerHTML = count;
        });

        sc.forEach((scItem, i) => {
            this.setCriterionIndex(scItem, i + 1, sc.length);
            this.setCriterionWcagVersion(scItem);
        });
    }

    /**
     * @function watchForCriteriaUpdates
     * @summary When the success criteria update to show a pass/fail/todo status, update the stats.
     * @memberof WcagEmHelpers
     */
    watchForCriteriaUpdates() {
        // The mutations to observe
        // https://stackoverflow.com/a/40195712/6850747

        // innerHTML
        // const config = { characterData: true, attributes: false, childList: false, subtree: true };

        // textContent
        // const config = { characterData: false, attributes: false, childList: true, subtree: false };

        const config = {
            attributes: true,
            attributesFilter: ['class'],
            characterData: false,
            childList: false,
            subtree: true,
        };

        const _self = this;

        const callback = function(mutationsList) {
            let classChange = false;
            let classRegx = new RegExp(_self.criterionSelector.substring(1));

            mutationsList.some(function (mutationsListItem) {
                let mutationRecord = mutationsListItem;

                if (typeof mutationRecord !== 'undefined') {
                    if (mutationRecord.type === 'attributes') {
                        let target = mutationRecord.target;
                        let tag = target.tagName;
                        let attr = mutationRecord.attributeName;

                        if ((tag === 'DIV') && (attr === 'class')) {
                            if (target.className.match(classRegx)) {
                                classChange = true;

                                return classChange; // continue (false) or break (true) loop
                            }
                        }
                    }
                }
            });
            
            if (classChange === true) {
                _self.updateCriteriaStats();
                _self.setSkiplinkTarget();
            }
        };

        // The node that will be observed for mutations
        const targetNode = document.querySelector(_self.scContainerSelector);

        // Create an observer instance with a callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        // observer.disconnect();
    }

    /**
     * @function init
     * @summary Initialise the app.
     * @memberof WcagEmHelpers
     * @public
     */
    init() {
        if (document.location.hash === '#!/evaluation/audit') {
            this.setup();
        }

        window.onpopstate = () => {
            if (document.location.hash === '#!/evaluation/audit') {
                this.setup();
            }
        };
    }
}

const wcagEmHelpers = new WcagEmHelpers({
    checkboxLabelClassChecked: 'btn btn-sm btn-primary',
    checkboxLabelClassUnchecked: 'btn btn-sm btn-primary-invert',
    componentSelectorBase: 'wcag-em-helpers',
    criteriaExpandButtonSelector: '.collapse-button[aria-expanded="false"]',
    criteriaIndicesWcag21: [
        '1.3.4',
        '1.3.5',
        '1.3.6',
        '1.4.10',
        '1.4.11',
        '1.4.12',
        '1.4.13',
        '2.1.4',
        '2.2.6',
        '2.3.3',
        '2.5.1',
        '2.5.2',
        '2.5.3',
        '2.5.4',
        '2.5.5',
        '2.5.6',
        '4.1.3',
    ],
    criterionPanelHeadingSelector: '.criterion > .panel-heading',
    criterionSelector: '.criterion',
    criterionTitleSelector: '.criterion-title',
    criterionTitleIndexSelector: '.criterion-title > strong',
    sampleControlContainerSelector: '[ng-controller="AuditSamplePagesCtrl"]',
    sampleExpandButtonSelector: '.crit-detail-btn > [aria-expanded="false"]',
    samplesSelectedSelector: '.sample input:checked',
    sampleSelectionSelector: '.ng-not-empty',
    scContainerSelector: '[ng-controller="AuditCriteriaCtrl"]',
    statsParentSelector: '.sc-filters',
    statuses: [
        'total',
        'untested',
        'passed',
        'failed',
        'inapplicable',
        'canttell'
    ],
    criterionValueUntested: 'string:earl:untested'
});

wcagEmHelpers.init();
