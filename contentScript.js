/**
 * @file WCAG EM Helpers
 * @author dan@dotherightthing.co.nz
 */

/**
 * @class WcagEmHelpers
 *
 * @param {object}  options                                 - Module options
 * @param {string}  options.checkboxLabelClassChecked       - Class of selected checkbox label in Angular app
 * @param {string}  options.checkboxLabelClassDisabled      - Class of disabled checkbox label in Angular app
 * @param {string}  options.checkboxLabelClassUnchecked     - Class of unselected checkbox label in Angular app
 * @param {string}  options.criteriaContainerSelector       - Selector of success criteria container
 * @param {Array}   options.criteriaIndicesWcag21           - WCAG 2.1 success criteria indices, copied from WCAG EM filter output (WCAG 2.0 succeeds WCAG 1.0, WCAG 2.1 extends WCAG 2.0)
 * @param {string}  options.criterionHeadingSelector        - Selector of guideline panel heading element
 * @param {string}  options.criterionSelector               - Selector of guideline elements
 * @param {string}  options.criterionTitleIndexSelector     - Selector of guideline title index element
 * @param {string}  options.criterionTitleSelector          - Selector of guideline title element
 * @param {string}  options.criterionValueUntested          - Value of untested guideline
 * @param {string}  options.guidelineCollapseButtonSelector - Selector of button which closes guideline panels
 * @param {string}  options.guidelineExpandButtonSelector   - Selector of button which opens guideline panels
 * @param {string}  options.helpersElementName              - Element to use for generated helpers container
 * @param {string}  options.helpersParentSelector           - Selector of element to append the helpers after
 * @param {string}  options.helpersSiblingSelector          - Selector of element to append the helpers before
 * @param {string}  options.helpersSelectorBase             - Base of helper selector
 * @param {string}  options.helpersStatsHeadingSelector     - Selector of heading above generated criteria stats
 * @param {string}  options.sampleCheckboxSelector          - Selector of sample page checkbox
 * @param {string}  options.sampleCollapseButtonSelector    - Selector of button which closes sample panels
 * @param {string}  options.sampleControlContainerSelector  - Selector of container wrapping sample page checkboxes
 * @param {string}  options.sampleExpandButtonSelector      - Selector of button which opens sample panels
 * @param {string}  options.sampleSelectionSelector         - Selector of checked sample page checkbox
 * @param {Array}   options.statuses                        - Status state strings
 * @param {string}  options.visuallyhiddenSelector          - Class of visually hidden elements in Angular app
 */
class WcagEmHelpers {
    constructor(options = {}) {
        // public options
        this.checkboxLabelClassChecked = options.checkboxLabelClassChecked || '';
        this.checkboxLabelClassDisabled = options.checkboxLabelClassDisabled || '';
        this.checkboxLabelClassUnchecked = options.checkboxLabelClassUnchecked || '';
        this.criteriaContainerSelector = options.criteriaContainerSelector || '';
        this.criteriaIndicesWcag21 = options.criteriaIndicesWcag21 || [];
        this.criterionHeadingSelector = options.criterionHeadingSelector || '';
        this.criterionSelector = options.criterionSelector || '';
        this.criterionTitleIndexSelector = options.criterionTitleIndexSelector || '';
        this.criterionTitleSelector = options.criterionTitleSelector || '';
        this.criterionValueUntested = options.criterionValueUntested || '';
        this.guidelineCollapseButtonSelector = options.guidelineCollapseButtonSelector || '';
        this.guidelineExpandButtonSelector = options.guidelineExpandButtonSelector || '';
        this.helpersElementName = options.helpersElementName || '';
        this.helpersParentSelector = options.helpersParentSelector || '';
        this.helpersSelectorBase = options.helpersSelectorBase || '';
        this.helpersSiblingSelector = options.helpersSiblingSelector || '';
        this.helpersStatsHeadingSelector = options.helpersStatsHeadingSelector || '';
        this.sampleCheckboxSelector = options.sampleCheckboxSelector || '';
        this.sampleCollapseButtonSelector = options.sampleCollapseButtonSelector || '';
        this.sampleControlContainerSelector = options.sampleControlContainerSelector || '';
        this.sampleExpandButtonSelector = options.sampleExpandButtonSelector || '';
        this.sampleSelectionSelector = options.sampleSelectionSelector || '';
        this.statuses = options.statuses || [];
        this.visuallyhiddenSelector = options.visuallyhiddenSelector || '';
    }

    /**
     * @function expandGuidelines
     * @summary Expand all guidelines, so that results for the entire sample can be seen at a glance.
     * @memberof WcagEmHelpers
     *
     * @param {boolean} expand - Expand (true) or collapse (false)
     */
    expandGuidelines(expand) {
        const collapseControls = document.querySelectorAll(this.guidelineCollapseButtonSelector);
        const expandControls = document.querySelectorAll(this.guidelineExpandButtonSelector);

        if (expand) {
            expandControls.forEach((expandControl) => {
                expandControl.click();
            });
        } else {
            collapseControls.forEach((collapseControl) => {
                collapseControl.click();
            });
        }
    }

    /**
     * @function expandSampleResults
     * @summary Expand individual sample results, so that page specific results can be seen at a glance.
     * @memberof WcagEmHelpers
     *
     * @param {boolean} expand - Expand (true) or collapse (false)
     */
    expandSampleResults(expand) {
        const collapseControls = document.querySelectorAll(this.sampleCollapseButtonSelector);
        const expandControls = document.querySelectorAll(this.sampleExpandButtonSelector);

        if (expand) {
            expandControls.forEach(function (expandControl) {
                expandControl.click();
            });
        } else {
            collapseControls.forEach(function (collapseControl) {
                collapseControl.click();
            });
        }
    }

    /**
     * @function expandTextareas
     * @summary Expand populated textareas, so that observations can be seen at a glance.
     * @memberof WcagEmHelpers
     *
     * @param {boolean} expand - Expand (true) or collapse (false)
     */
    expandTextareas(expand) {
        const elements = document.querySelectorAll('textarea');

        elements.forEach((el) => {
            if (expand && (el.value !== '')) {
                el.style.height = 'auto'; // expand
            } else {
                el.style.height = ''; // collapse
            }
        });
    }

    /**
     * @function generateHelpersContainer
     * @summary Create and inject container for helpers.
     * @memberof WcagEmHelpers
     */
    generateHelpersContainer() {
        let helpersParentElement = null;
        let helpersElement = document.querySelector(`.${this.helpersSelectorBase}`);
        let helpersSiblingElement = null;

        if (this.helpersParentSelector) {
            helpersParentElement = document.querySelector(`${this.helpersParentSelector}`);
        } else if (this.helpersSiblingSelector) {
            helpersSiblingElement = document.querySelector(`${this.helpersSiblingSelector}`);
        }

        if (helpersElement === null) {
            helpersElement = document.createElement(this.helpersElementName);
            helpersElement.setAttribute('class', this.helpersSelectorBase);

            if (this.helpersElementName === 'fieldset') {
                helpersElement.innerHTML = `<legend class="${this.visuallyhiddenSelector}">Helpers</legend>`;
            }

            if (helpersParentElement !== null) {
                helpersParentElement.appendChild(helpersElement);
            } else if (helpersSiblingElement !== null) {
                helpersSiblingElement.parentNode.insertBefore(helpersElement, helpersSiblingElement);
            }
        }
    }

    /**
     * @function scaffoldCriteriaStats
     * @summary Adds success criteria statistics to page.
     * @memberof WcagEmHelpers
     */
    scaffoldCriteriaStats() {
        let html = '';
        const helpersStatsContainer = document.createElement('div');
        let helpersElement = document.querySelector(`.${this.helpersSelectorBase}`);

        html = `<${this.helpersStatsHeadingSelector} class="${this.helpersSelectorBase}__totals">Success Criteria:</${this.helpersStatsHeadingSelector}>`;
        html += `<ul class="${this.helpersSelectorBase}__counts">`;

        this.statuses.forEach((status) => {
            let statusMsg = status;

            if (status === 'canttell') {
                statusMsg = 'cannot tell';
            }

            html += `<li class="${this.helpersSelectorBase}__count ${this.helpersSelectorBase}__count--${status}">`;
            html += `<span class="${this.helpersSelectorBase}__count-inner">`;
            html += `<strong class="${this.helpersSelectorBase}__count-int" id="${this.helpersSelectorBase}__${status}-count">0</strong> `;

            if (status === 'untested') {
                // skiplink to first untested criterion
                html += `<a id="${this.helpersSelectorBase}-skiplink">${statusMsg}</a>`;

                // skiplink fallback when no untested criteria
                html += `<span id="${this.helpersSelectorBase}-noskiplink">${statusMsg}</span>`;
            } else {
                html += statusMsg;
            }

            html += '</span>';
            html += '</li>';
        });

        html += '</ul>';

        helpersStatsContainer.innerHTML = html;

        helpersElement.appendChild(helpersStatsContainer);

        // can't use regular HTML anchor as Angular uses a hashbang to set virtual page views
        const skiplink = document.querySelector(`#${this.helpersSelectorBase}-skiplink`);
        skiplink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = skiplink.getAttribute('href')
            document.querySelector(`${target}`).focus();
        });        
    }
    
    /**
     * @function enhanceCriteria
     * @summary Add count and WCAG version to each criterion.
     * @memberof WcagEmHelpers
     */
    enhanceCriteria() {
        const criteriaElements = document.querySelectorAll(`${this.criteriaContainerSelector} ${this.criterionSelector}`);

        criteriaElements.forEach((criteriaElement, i) => {
            this.setCriterionIndex(criteriaElement, i + 1, criteriaElements.length);
            this.setCriterionWcagVersion(criteriaElement);
        });
    }

    /**
     * @function setCheckboxClassname
     * @summary Apply the classnames available in the Angular app.
     * @memberof WcagEmHelpers
     *
     * @param {object} checkboxElement - DOM checkbox element
     */
    setCheckboxClassname(checkboxElement) {
        if (checkboxElement.checked) {
            checkboxElement.parentNode.className = this.checkboxLabelClassChecked;
        } else if (checkboxElement.disabled) {
            checkboxElement.parentNode.className = this.checkboxLabelClassDisabled;
        } else {
            checkboxElement.parentNode.className = this.checkboxLabelClassUnchecked;
        }
    }

    /**
     * @function generateExpandControls
     * @summary Adds global expand/collapse controls to page.
     * @memberof WcagEmHelpers
     */
    generateExpandControls() {
        let _self = this;
        let controls = ['guidelines', 'samples', 'textareas'];
        const controlsContainer = document.createElement('div');
        let extraAttrs = '';
        let html = '';
        const sampleCheckboxEls = document.querySelectorAll(this.sampleCheckboxSelector);
        let helpersElement = document.querySelector(`.${this.helpersSelectorBase}`);

        controls.forEach((control) => {
            // default Angular state is open
            if (control === 'guidelines') {
                extraAttrs = ' checked="checked"';
            } else {
                extraAttrs = '';
            }

            html += `<label class="${this.checkboxLabelClassUnchecked}">`;
            html += `<input type="checkbox" id="${this.helpersSelectorBase}-expand-${control}"${extraAttrs}><span>Expand ${control}</span>`;
            html += '</label>';
        });

        controlsContainer.innerHTML = html;
        helpersElement.appendChild(controlsContainer);

        // trigger listener to set up element
        sampleCheckboxEls[0].dispatchEvent(new Event('change', { 'bubbles': true }));

        controls.forEach((control) => {
            const controlSelector = helpersElement.querySelector(`#${this.helpersSelectorBase}-expand-${control}`);

            // add change listener
            controlSelector.addEventListener('change', function () {

                if (this.checked) {
                    if (this.id === `${_self.helpersSelectorBase}-expand-guidelines`) {
                        _self.expandGuidelines(true);
                        document.querySelector(`#${_self.helpersSelectorBase}-expand-textareas`).removeAttribute('disabled');
                        document.querySelector(`#${_self.helpersSelectorBase}-expand-samples`).removeAttribute('disabled');
                    } else if (this.id === `${_self.helpersSelectorBase}-expand-samples`) {
                        _self.expandSampleResults(true);
                    } else if (this.id === `${_self.helpersSelectorBase}-expand-textareas`) {
                        _self.expandTextareas(true);
                    }
                } else {
                    if (this.id === `${_self.helpersSelectorBase}-expand-guidelines`) {
                        _self.expandGuidelines(false);
                        document.querySelector(`#${_self.helpersSelectorBase}-expand-samples`).setAttribute('disabled', '');
                        document.querySelector(`#${_self.helpersSelectorBase}-expand-textareas`).setAttribute('disabled', '');
                    } else if (this.id === `${_self.helpersSelectorBase}-expand-samples`) {
                        _self.expandSampleResults(false);
                    } else if (this.id === `${_self.helpersSelectorBase}-expand-textareas`) {
                        _self.expandTextareas(false);
                    }
                }

                controls.forEach((control) => {
                    const el = document.querySelector(`#${_self.helpersSelectorBase}-expand-${control}`);
                    _self.setCheckboxClassname(el);
                });
            });
        });

        // trigger listener to set up element
        controls.forEach((control) => {
            helpersElement.querySelector(`#${this.helpersSelectorBase}-expand-${control}`).dispatchEvent(new Event('change', { 'bubbles': true }));
        });
    }

    /**
     * @function setSkiplinkTarget
     * @summary Jump to the first untested success criterion.
     * @memberof WcagEmHelpers
     */
    setSkiplinkTarget() {
        const selects = document.querySelectorAll(`${this.criterionHeadingSelector} select`);
        const skiplink = document.querySelector(`#${this.helpersSelectorBase}-skiplink`);
        const noskiplink = document.querySelector(`#${this.helpersSelectorBase}-noskiplink`);
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
        const countSelector = `.${this.helpersSelectorBase}__title-count`;
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
        let stylesheetRef = document.querySelector(`#${this.helpersSelectorBase}-variables`);

        if (stylesheetRef === null) {
            const stylesheet = document.createElement('style');
            stylesheet.setAttribute('id', `${this.helpersSelectorBase}-variables`);
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
                document.querySelector(`.${this.helpersSelectorBase}`).appendChild(panel);

                let panelStyles = window.getComputedStyle(panel);
                let color = panelStyles.getPropertyValue('border-left-color');
                variablesRule += ` --color-${status}: ${color};`
            });

            variablesRule += '}';
            stylesheetRef.insertRule(variablesRule, 0);
        }
    }

    /**
     * @function enhanceAuditPage
     * @summary Enhance the audit page with the helpers.
     * @memberof WcagEmHelpers
     */
    enhanceAuditPage() {
        // get extension options
        chrome.storage.sync.get(null, (items) => {
            this.showExpandControls = items.showExpandControls;

            // timeout allows for Angular render time
            setTimeout(() => {
                this.criteriaContainerSelector = '[ng-controller="AuditCriteriaCtrl"]';
                this.helpersElementName = 'fieldset';
                this.helpersParentSelector = '[ng-controller="AuditCriteriaCtrl"] .sc-filters';
                this.helpersSiblingSelector = false;
                this.helpersStatsHeadingSelector = 'p';

                this.generateHelpersContainer();

                if (this.showExpandControls) {
                    this.generateExpandControls();
                }

                this.scaffoldCriteriaStats();
                this.enhanceCriteria();
                this.hostColoursToVariables();
                this.updateCriteriaStats();
                this.setSkiplinkTarget();
                this.watchForCriteriaUpdates();
            }, 1000);
        });
    }

    /**
     * @function enhanceReportPage
     * @summary Enhance the report page with the helpers.
     * @memberof WcagEmHelpers
     */
    enhanceReportPage() {
        // get extension options

        // timeout allows for Angular render time
        setTimeout(() => {
            this.criteriaContainerSelector = '[data-ng-controller="ReportFindingsCtrl"]';
            this.helpersElementName = 'div';
            this.helpersParentSelector = false;
            this.helpersSiblingSelector = '[data-ng-controller="ReportFindingsCtrl"]';
            this.helpersStatsHeadingSelector = 'h3';

            this.generateHelpersContainer();

            this.scaffoldCriteriaStats();
            this.enhanceCriteria();
            this.hostColoursToVariables();
            this.updateCriteriaStats();
            this.setSkiplinkTarget();
        }, 1000);
    }

    /**
     * @function updateCriteriaStats
     * @summary Update status of Success Criteria pass/fail/todo statistics on page.
     * @memberof WcagEmHelpers
     */
    updateCriteriaStats() {
        const criteriaContainerElement = document.querySelector(this.criteriaContainerSelector);
        const criteriaElements = document.querySelectorAll(`${this.criteriaContainerSelector} ${this.criterionSelector}`);

        this.statuses.forEach((status) => {
            let count;

            if (status === 'total') {
                count = criteriaContainerElement.querySelectorAll(this.criterionSelector).length;
            } else {
                count = criteriaContainerElement.querySelectorAll(`${this.criterionSelector}.${status}`).length;
            }

            document.querySelector(`#${this.helpersSelectorBase}__${status}-count`).innerHTML = count;
        });

        criteriaElements.forEach((criteriaElement, i) => {
            this.setCriterionIndex(criteriaElement, i + 1, criteriaElements.length);
            this.setCriterionWcagVersion(criteriaElement);
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
        const targetNode = document.querySelector(_self.criteriaContainerSelector);

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
            this.enhanceAuditPage();
        } else if (document.location.hash === '#!/evaluation/report') {
            this.enhanceReportPage();
        }

        window.onpopstate = () => {
            if (document.location.hash === '#!/evaluation/audit') {
                this.enhanceAuditPage();
            } else if (document.location.hash === '#!/evaluation/report') {
                this.enhanceReportPage();
            }
        };
    }
}

const wcagEmHelpers = new WcagEmHelpers({
    checkboxLabelClassChecked: 'btn btn-sm btn-primary',
    checkboxLabelClassDisabled: 'btn btn-sm btn-primary-invert disabled',
    checkboxLabelClassUnchecked: 'btn btn-sm btn-primary-invert',
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
    criterionHeadingSelector: '.criterion > .panel-heading',
    criterionSelector: '.criterion',
    criterionTitleIndexSelector: '.criterion-title > strong',
    criterionTitleSelector: '.criterion-title',
    criterionValueUntested: 'string:earl:untested',
    guidelineCollapseButtonSelector: '.collapse-button[target="g"][aria-expanded="true"]',
    guidelineExpandButtonSelector: '.collapse-button[target="g"][aria-expanded="false"]',
    helpersSelectorBase: 'wcag-em-helpers',
    helpersStatsHeadingSelector: 'p',
    sampleCheckboxSelector: '[ng-controller="AuditSamplePagesCtrl"] input[type="checkbox"]',
    sampleCollapseButtonSelector: '.crit-detail-btn > [aria-expanded="true"]',
    sampleControlContainerSelector: '[ng-controller="AuditSamplePagesCtrl"]',
    sampleExpandButtonSelector: '.crit-detail-btn > [aria-expanded="false"]',
    sampleSelectionSelector: '.ng-not-empty',
    statuses: [
        'total',
        'untested',
        'passed',
        'failed',
        'inapplicable',
        'canttell'
    ],
    visuallyhiddenSelector: 'sr-only'
});

wcagEmHelpers.init();
