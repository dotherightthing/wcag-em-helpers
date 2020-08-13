/**
 * @file WCAG EM Helpers
 * @author dan@dotherightthing.co.nz
 */

/**
 * @namespace WcagEmHelpers
 */
const WcagEmHelpers = (function () {
  'use strict';

  /**
   * @function _expandCriteria
   * @summary Expand all success criteria, so that results for the entire sample can be seen at a glance.
   * @memberof WcagEmHelpers
   * @protected
   */
  const _expandCriteria = () => {
    const collapsed = document.querySelectorAll('.collapse-button[aria-expanded="false"]');

    collapsed.forEach((collapsedItem) => {
      collapsedItem.click();
    });
  };

  /**
   * @function _expandIndividualSampleResults
   * @summary Expand individual sample results, so that page specific results can be seen at a glance.
   * @memberof WcagEmHelpers
   * @protected
   */
  const _expandIndividualSampleResults = () => {
    const anySelected = document.querySelectorAll('.sample input:checked');

    if (anySelected.length) {
      const collapsed = document.querySelectorAll('.crit-detail-btn > [aria-expanded="false"]');

      collapsed.forEach(function (collapsedItem) {
        collapsedItem.click();
      });
    }
  };

  /**
   * @function _expandTextAreas
   * @summary Expand populated textareas, so that observations can be seen at a glance.
   * @memberof WcagEmHelpers
   * @protected
   */
  const _expandTextAreas = () => {
    const elements = document.querySelectorAll('textarea');

    elements.forEach((el) => {
      if (el.value !== '') {
        el.style.height = 'auto'; // expand
      } else {
        el.style.height = ''; // collapse
      }
    });
  };

  /**
   * @function _generateCriteriaStats
   * @summary Adds success criteria statistics to page.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {string} criterionSelector - Selector of success criteria elements
   * @param {string} scContainerSelector - Selector of success criteria container
   * @param {string} statsParentSelector - Selector of element to append the stats after
   */
  const _generateCriteriaStats = (criterionSelector, scContainerSelector, statsParentSelector) => {
    let html = '';
    const sc = document.querySelectorAll(`${scContainerSelector} ${criterionSelector}`);
    const statsParent = document.querySelector(`${scContainerSelector} ${statsParentSelector}`);
    const statuses = ['total', 'untested', 'passed', 'failed', 'inapplicable', 'canttell'];
    let wcagEmHelpersContainer = document.querySelector('.wcag-em-helpers');

    if (wcagEmHelpersContainer === null) {
      wcagEmHelpersContainer = document.createElement('div');
      wcagEmHelpersContainer.setAttribute('class', 'wcag-em-helpers');

      statsParent.appendChild(wcagEmHelpersContainer);
    }

    html = `<p class="wcag-em-helpers__showing">Showing:</p>`;
    html += '<ul class="wcag-em-helpers__counts">';

    statuses.forEach((status) => {
      let statusMsg = status;
      let count = 0;

      if (status === 'canttell') {
        statusMsg = 'cannot tell';
      } else if (status === 'total') {
        count = sc.length;
      }

      html += `<li class="wcag-em-helpers__count wcag-em-helpers__count--${status}"><span class="wcag-em-helpers__count-inner"><strong class="wcag-em-helpers__count-int" id="wcag-em-helpers__${status}-count">${count}</strong> ${statusMsg}</span></span></li>`;
    });

    html += '</ul>';

    wcagEmHelpersContainer.innerHTML = html;

    sc.forEach((scItem, i) => {
      _setCriterionIndex(scItem, i + 1, sc.length);
      _setCriterionWcagVersion(scItem);
    });
  };

  /**
   * @function _setCriterionIndex
   * @summary Add index (n/total) to each relevant criterion, to track progress.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {object} domNode - DOM Node
   * @param {number} index - Index
   * @param {number} total - Total
   */
  const _setCriterionIndex = (domNode, index, total) => {
    const countSelector = '.wcag-em-helpers__title-count';
    const parentEl = domNode.querySelector('.criterion-title > strong');

    if (parentEl !== null) {
      if (parentEl.querySelector(countSelector) === null) {
        const countEl = document.createElement('span');
        countEl.setAttribute('class', countSelector.substring(1));
        parentEl.appendChild(countEl);
      }

      parentEl.querySelector(countSelector).innerHTML = `[${index}/${total}]`;
    }
  };

  /**
   * @function _setCriterionWcagVersion
   * @summary Add WCAG version label to individual criteria, as a learning tool.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {object} domNode - DOM Node
   */
  const _setCriterionWcagVersion = (domNode) => {
    const criterionTitleEl = domNode.querySelector('.criterion-title');

    if (criterionTitleEl !== null) {
      const criterionTitle = criterionTitleEl.innerHTML;
      const criterionIndexMatch = criterionTitle.match(/([0-9])+.([0-9])+.([0-9])+/);
      const criterionLevelMatch = criterionTitle.match(/(\(Level )+(A)+(\))/);
      let criterionVersionLabel = 'WCAG 2.0';
      let newCriterionTitle;

      // array generated through manual inspection of WCAG EM filter output
      const criteriaIndicesWcag21 = [
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
      ];

      if (criterionIndexMatch) {
        const criterionIndex = criterionIndexMatch[0];

        if (criteriaIndicesWcag21.includes(criterionIndex)) {
          criterionVersionLabel = 'WCAG 2.1';
        };

        if (criterionLevelMatch) {
          newCriterionTitle = criterionTitle.replace(criterionLevelMatch[0], `(${criterionLevelMatch[0].replace('(', '').replace(')', '')}, ${criterionVersionLabel})`);

          criterionTitleEl.innerHTML = newCriterionTitle;
        }
      }
    }
  };

  /**
   * @function _hostColoursToVariables
   * @summary Get relevant colours from host stylesheet and store as CSS variables.
   * @memberof WcagEmHelpers
   * @protected
   */
  const _hostColoursToVariables = () => {
    let statuses = ['untested', 'passed', 'failed', 'inapplicable', 'canttell'];
    let stylesheetRef = document.querySelector('#wcag-em-helpers-variables');

    if (stylesheetRef === null) {
      const stylesheet = document.createElement('style');
      stylesheet.setAttribute('id', 'wcag-em-helpers-variables');
      document.head.appendChild(stylesheet);
      stylesheetRef = stylesheet.sheet;

      let variablesRule = ':root {';

      statuses.forEach((status, i) => {
        let panel = document.createElement('div');

        if (status === 'untested') {
          panel.setAttribute('class', `panel criterion panel-default wcag-em-helpers__hidden`);
        } else {
          panel.setAttribute('class', `panel criterion ${status} wcag-em-helpers__hidden`);
        }

        panel.setAttribute('aria-hidden', 'true');
        document.querySelector('.wcag-em-helpers').appendChild(panel);

        let panelStyles = window.getComputedStyle(panel);
        let color = panelStyles.getPropertyValue('border-left-color');
        variablesRule += ` --color-${status}: ${color};`
      });

      variablesRule += '}';
      stylesheetRef.insertRule(variablesRule, 0);
    }
  };

  /**
   * @function setup
   * @summary Set up the app.
   * @memberof WcagEmHelpers
   * @protected
   */
  const setup = () => {
    // timeout allows for Angular render time
    setTimeout(() => {
      _generateCriteriaStats('.criterion', '[ng-controller="AuditCriteriaCtrl"]', '.sc-filters');
      _expandCriteria();
      _expandIndividualSampleResults();
      _expandTextAreas();
      _hostColoursToVariables();
      _updateCriteriaStats('.criterion', '[ng-controller="AuditCriteriaCtrl"]');
      _watchForCriteriaUpdates('.criterion', '[ng-controller="AuditCriteriaCtrl"]');
      _watchForSampleUpdates('.ng-not-empty', '[ng-controller="AuditSamplePagesCtrl"]');
    }, 1000);
  };

  /**
   * @function _updateCriteriaStats
   * @summary Update status of Success Criteria pass/fail/todo statistics on page.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {string} criterionSelector - Selector of success criteria elements
   * @param {string} scContainerSelector - Selector of success criteria elements parent
   */
  const _updateCriteriaStats = (criterionSelector, scContainerSelector) => {
    const statuses = ['total', 'untested', 'passed', 'failed', 'inapplicable', 'canttell'];
    const scContainerElement = document.querySelector(scContainerSelector);
    const sc = document.querySelectorAll(`${scContainerSelector} ${criterionSelector}`);

    statuses.forEach((status) => {
      let count;

      if (status === 'total') {
        count = scContainerElement.querySelectorAll(criterionSelector).length;
      } else {
        count = scContainerElement.querySelectorAll(`${criterionSelector}.${status}`).length;
      }

      document.querySelector(`#wcag-em-helpers__${status}-count`).innerHTML = count;
    });

    sc.forEach((scItem, i) => {
      _setCriterionIndex(scItem, i + 1, sc.length);
      _setCriterionWcagVersion(scItem);
    });
  };

  /**
   * @function _watchForCriteriaUpdates
   * @summary When the success criteria update to show a pass/fail/todo status, update the stats.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {string} criterionSelector - Selector of success criteria elements
   * @param {string} scContainerSelector - Selector of success criteria elements parent
   */
  const _watchForCriteriaUpdates = (criterionSelector, scContainerSelector) => {
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

    const callback = function(mutationsList) {
      let classChange = false;
      let classRegx = new RegExp(criterionSelector.substring(1));

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
        _updateCriteriaStats(criterionSelector, scContainerSelector);
      }
    };

    // The node that will be observed for mutations
    const targetNode = document.querySelector(scContainerSelector);

    // Create an observer instance with a callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
    // observer.disconnect();
  };

  /**
   * @function watchForSampleUpdates
   * @summary When Angular updates the sample selection, expand the sample results.
   * @memberof WcagEmHelpers
   * @protected
   *
   * @param {string} sampleSelectionSelector - Selector applied when a sample selection is made
   * @param {string} sampleControlContainerSelector - Selector of sample control container
   */
  const _watchForSampleUpdates = (sampleSelectionSelector, sampleControlContainerSelector) => {
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

    const callback = function (mutationsList) {
      let classChange = false;
      let classRegx = new RegExp(sampleSelectionSelector.substring(1));

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
        _expandIndividualSampleResults();
        _expandTextAreas();
        
        // stop observing
        observer.disconnect();
      }
    };

    // The node that will be observed for mutations
    const targetNode = document.querySelector(sampleControlContainerSelector);

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
  const init = () => {
    if (document.location.hash === '#!/evaluation/audit') {
      setup();
    }

    window.onpopstate = () => {
      if (document.location.hash === '#!/evaluation/audit') {
        setup();
      }
    };
  };

  return {
    init: init,
  };
}());

WcagEmHelpers.init();
