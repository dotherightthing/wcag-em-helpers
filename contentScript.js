/**
 * @file WCAG EM Helpers
 * @author dan@dotherightthing.co.nz
 */

/**
 * @class WcagEmHelpers
 *
 * @param {object}  options                                 - Module options
 * @param {boolean} options.autoExpandSampleResults         - Automatically expand sample results when samples are selected, note that this adds a delay to the interaction
 * @param {boolean} options.autoExpandTextAreas             - Automatically expand textareas (if textareas are populated)
 * @param {string}  options.componentSelectorBase           - Base of helper selector
 * @param {string}  options.criteriaExpandButtonSelector    - Selector of button which opens criteria panels
 * @param {Array}   options.criteriaIndicesWcag21           - Copied from WCAG EM filter output (WCAG 2.0 succeeds WCAG 1.0, WCAG 2.1 extends WCAG 2.0)
 * @param {string}  options.criterionSelector               - Selector of success criteria elements
 * @param {string}  options.criterionTitleSelector          - Selector of success criterion title element
 * @param {string}  options.criterionTitleIndexSelector     - Selector of success criterion title index element
 * @param {string}  options.sampleControlContainerSelector - Selector of container wrapping sample page checkboxes
 * @param {string}  options.sampleExpandButtonSelector      - Selector of button which opens sample panels
 * @param {string}  options.samplesSelectedSelector         - Selector of extra checkbox which Angular checks when a sample page is selected
 * @param {string}  options.sampleSelectionSelector         - Selector of checked sample page checkbox
 * @param {string}  options.scContainerSelector             - Selector of success criteria container
 * @param {string}  options.statsParentSelector             - Selector of element to append the stats after
 * @param {Array}   options.statuses                        - Status state strings
 * @param {string}  options.textareaSelector                - Selector of element which explanations are entered into
 */
class WcagEmHelpers {
    constructor(options = {}) {
        // public options
        this.autoExpandSampleResults = options.autoExpandSampleResults || false;
        this.autoExpandTextAreas = options.autoExpandTextAreas || false;
        this.componentSelectorBase = options.componentSelectorBase || '';
        this.criteriaExpandButtonSelector = options.criteriaExpandButtonSelector || '';
        this.criteriaIndicesWcag21 = options.criteriaIndicesWcag21 || [];
        this.criterionSelector = options.criterionSelector || '';
        this.criterionTitleSelector = options.criterionTitleSelector || '';
        this.criterionTitleIndexSelector = options.criterionTitleIndexSelector || '';
        this.sampleControlContainerSelector = options.sampleControlContainerSelector || '';
        this.sampleExpandButtonSelector = options.sampleExpandButtonSelector || '';
        this.samplesSelectedSelector = options.samplesSelectedSelector || '';
        this.sampleSelectionSelector = options.sampleSelectionSelector || '';
        this.scContainerSelector = options.scContainerSelector || '';
        this.statsParentSelector = options.statsParentSelector || '';
        this.statuses = options.statuses || [];
        this.textareaSelector = options.textareaSelector || '';
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
        if (this.autoExpandSampleResults) {
            const anySelected = document.querySelectorAll(this.samplesSelectedSelector);

            if (anySelected.length) {
                const collapsed = document.querySelectorAll(this.sampleExpandButtonSelector);

                collapsed.forEach(function (collapsedItem) {
                    collapsedItem.click();
                });
            }
        }
    }

    /**
     * @function expandTextAreas
     * @summary Expand populated textareas, so that observations can be seen at a glance.
     * @memberof WcagEmHelpers
     */
    expandTextAreas() {
        if (this.autoExpandTextAreas) {
            const elements = document.querySelectorAll(this.textareaSelector);

            elements.forEach((el) => {
                if (el.value !== '') {
                    el.style.height = 'auto'; // expand
                } else {
                    el.style.height = ''; // collapse
                }
            });
        }
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

        html = `<p class="${this.componentSelectorBase}__showing">Showing:</p>`;
        html += `<ul class="${this.componentSelectorBase}__counts">`;

        this.statuses.forEach((status) => {
            let statusMsg = status;
            let count = 0;

            if (status === 'canttell') {
                statusMsg = 'cannot tell';
            } else if (status === 'total') {
                count = sc.length;
            }

            html += `<li class="${this.componentSelectorBase}__count ${this.componentSelectorBase}__count--${status}"><span class="${this.componentSelectorBase}__count-inner"><strong class="${this.componentSelectorBase}__count-int" id="${this.componentSelectorBase}__${status}-count">${count}</strong> ${statusMsg}</span></span></li>`;
        });

        html += '</ul>';

        wcagEmHelpersContainer.innerHTML = html;

        sc.forEach((scItem, i) => {
            this.setCriterionIndex(scItem, i + 1, sc.length);
            this.setCriterionWcagVersion(scItem);
        });
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
                    panel.setAttribute('class', `panel criterion panel-default ${this.componentSelectorBase}__hidden`);
                } else {
                    panel.setAttribute('class', `panel criterion ${status} ${this.componentSelectorBase}__hidden`);
                }

                panel.setAttribute('aria-hidden', 'true');
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
        // timeout allows for Angular render time
        setTimeout(() => {
            this.generateCriteriaStats();
            this.expandCriteria();
            this.expandSampleResults();
            this.expandTextAreas();
            this.hostColoursToVariables();
            this.updateCriteriaStats();
            this.watchForCriteriaUpdates();
            this.watchForSampleUpdates();
        }, 1000);
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
     * @function watchForSampleUpdates
     * @summary When Angular updates the sample selection, expand the sample results.
     * @memberof WcagEmHelpers
     */
    watchForSampleUpdates() {
        // The mutations to observe
        // https://stackoverflow.com/a/40195712/6850747

        // innerHTML
        // const config = { characterData: true, attributes: false, childList: false, subtree: true };

        // textContent
        // const config = { characterData: false, attributes: false, childList: true, subtree: false };

        let observer;

        const config = {
            attributes: true,
            attributesFilter: ['class'],
            characterData: false,
            childList: false,
            subtree: true,
        };

        const _self = this;

        const callback = function (mutationsList) {
            let classChange = false;
            let classRegx = new RegExp(_self.sampleSelectionSelector.substring(1));

            mutationsList.some(function (mutationsListItem) {
                let mutationRecord = mutationsListItem;

                if (typeof mutationRecord !== 'undefined') {
                    if (mutationRecord.type === 'attributes') {
                        let target = mutationRecord.target;
                        let tag = target.tagName;
                        let attr = mutationRecord.attributeName;

                        if ((tag === 'INPUT') && (attr === 'class')) {
                            if (target.className.match(classRegx)) {
                                classChange = true;
                            }

                            return classChange; // continue (false) or break (true) loop
                        }
                    }
                }
            });

            if (classChange === true) {
                _self.expandSampleResults();
                _self.expandTextAreas();
                
                // stop observing
                observer.disconnect();
            }
        };

        // The node that will be observed for mutations
        const targetNode = document.querySelector(_self.sampleControlContainerSelector);

        // Create an observer instance with a callback function
        observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
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
    autoExpandSampleResults: true,
    autoExpandTextAreas: true,
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
    textareaSelector: 'textarea'
});

wcagEmHelpers.init();
