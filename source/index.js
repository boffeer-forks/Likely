// This module is an entry point for CommonJS modules.
// It’s written with CommonJS imports and exports to make possible doing `module.exports = likely`.
// This is required so that users work with `require('likely')`, not `require('likely').default`
const { bools, getDefaultUrl, merge } = require('./utils');

const Likely = require('./widget').default;
const config = require('./config').default;
const { findAll } = require('./dom');
const history = require('./history').default;
require('./index.styl');

/**
 * @param {Node} node
 * @param {Object} options
 * @private
 * @returns {Likely}
 */
const initWidget = (node, options) => {
    const fullOptions = options || {};
    const defaults = {
        counters: true,
        timeout: 1e3,
        zeroes: false,
        title: document.title,
        wait: 0.7e3,
        url: getDefaultUrl(),
    };

    const realOptions = merge({}, defaults, fullOptions, bools(node));
    const widget = node[config.name];
    if (widget) {
        widget.update(realOptions);
    }
    else {
        // Attaching widget to the node object for future re-initializations
        node[config.name] = new Likely(node, realOptions);
    }

    return widget;
};

const likely = {
    /**
     * Initiate Likely buttons on load
     * @param {Node|Array<Node>|Object} [nodes] a particular node or an array of widgets,
     *                                     if not specified,
     *                                     tries to init all the widgets
     * @param {Object} [options] additional options for each widget
     */
    initiate(nodes, options) {
        let realNodes;
        let realOptions;

        if (Array.isArray(nodes)) {
            // An array of nodes was passed
            realNodes = nodes;
            realOptions = options;
        }
        else if (nodes instanceof Node) {
            // A single node was passed
            realNodes = [nodes];
            realOptions = options;
        }
        else {
            // Options were passed, or the function was called without arguments
            realNodes = findAll(`.${config.name}`);
            realOptions = nodes;
        }

        initWidgets();
        history.onUrlChange(initWidgets);

        function initWidgets() {
            realNodes.forEach((node) => {
                initWidget(node, realOptions);
            });
        }
    },
};

module.exports = likely;
