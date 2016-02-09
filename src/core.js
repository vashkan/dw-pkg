var TypeChart;
(function (TypeChart) {
    TypeChart[TypeChart.Unknown = 0] = "Unknown";
    TypeChart[TypeChart.Histogram = 1] = "Histogram";
    TypeChart[TypeChart.Scatter = 2] = "Scatter";
    TypeChart[TypeChart.Line = 3] = "Line";
    TypeChart[TypeChart.StackedBar = 4] = "StackedBar";
})(TypeChart || (TypeChart = {}));

var dw;
(function (dw) {
    function addStyleRule(selector, styleString) {
        if (!dw.styleSheet) {
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.head.appendChild(style);
            dw.styleSheet = style.sheet;
        }
        var styleSheet = dw.styleSheet;

        if (styleSheet.insertRule) {
            styleSheet.insertRule(selector + '{' + styleString + '}', 0);
        }
        else if (styleSheet.addRule) {
            styleSheet.addRule(selector, styleString, 0);
        }
        else console.warn('addStyleRule failed');
    }
    dw.addStyleRule = addStyleRule;

    function tableSize(count) {
        var r = Math.sqrt(window.innerHeight * count / window.innerWidth);
        r = Math.floor(r) == r ? r : Math.floor(r) + 1;
        var c = count / r;
        c = Math.floor(c) == c ? c : Math.floor(c) + 1;
        return { col: c, row: r };
    }
    dw.tableSize = tableSize;
    function getRuleSellectorAll(styleSheet, selector) {
        return Array.prototype.filter.call(styleSheet.rules,
            (function (filter) {
                return function (r) {
                    return r.selectorText === filter;
                };
            })(selector));
    }
    function getRuleSellector(styleSheet, selector) {
        return getRuleSellectorAll(styleSheet, selector)[0] || null;
    }
    function clearStyle() {
        Array.prototype.forEach.call(dw.styleSheet.rules,
            function (v, i, a) {
                if (v.selectorText.match(/#chart\d+/)) {
                    dw.styleSheet.removeRule(i);
                }
            });
    }
    function refreshStyle() {
        var count = dw.graphs.length;
        if (count) {
            //clearStyle();
            graphs.forEach(function (g) { g.container.style.width = ''; });
            var size = tableSize(count);
            var r = size.row, c = size.col;
            var ruleCommon = getRuleSellector(dw.styleSheet, "#chartsContainer svg");
            if (ruleCommon && ruleCommon.style) {
                ruleCommon.style.width = Math.floor(1 / c * 100) + '%';
                ruleCommon.style.height = Math.floor(1 / r * 100) + '%';
            }
            if (size.col * size.row > count) {
                dw.graphs.slice(c * (r - 1)).forEach(function (w) {
                    return function (g, i) {
                        g.container.style.width = w;
                    };
                } (Math.floor(100 / ((count) % (c * (r - 1)))) + '%'));
            }
            dw.graphs.forEach(function (g) {
                g.update();
            });
        }
    }
    dw.refreshStyle = refreshStyle;
    var graphs = [];
    dw.graphs = graphs;
    dw._chartId=0;
})(dw = dw || {});


function detectType(obj) {
    if (obj instanceof Array) {
        if (obj.length > 0) {
            if (typeof obj[0] == 'number' || typeof obj[0] == 'string') {
                return TypeChart.Histogram;
            } else if (obj[0] instanceof Array) {
                return TypeChart.StackedBar;
            } else if (obj[0] instanceof Object) {
                return TypeChart.Scatter;
            }
            return TypeChart.Unknown;
        }
    } else if (obj instanceof Object) {
        return TypeChart.Line;
    }
}

function loadLib(callback) {

    function ff() {
        if (window.d3 && window.nv) {
            callback();
        } else {
            setTimeout(ff, 100);
        }
    }
    if (!dw.d3lib) {
        dw.d3lib = document.createElement('script');
        dw.d3lib.type = 'text/javascript';
        dw.d3lib.charset = 'UTF-8';
        dw.d3lib.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.js';
        dw.d3lib.onload = (function (callback) {
            return function () {
                if (typeof (dw.nvlib) === 'undefined') {
                    var nvcss = document.createElement('link');
                    nvcss.rel = 'stylesheet';
                    nvcss.type = 'text/css';
                    nvcss.href = '../node_modules/nvd3/build/nv.d3.css';
                    document.head.appendChild(nvcss);
                    dw.nvlib = document.createElement('script');
                    dw.nvlib.type = 'text/javascript';
                    dw.nvlib.src = '../node_modules/nvd3/build/nv.d3.js';
                    dw.nvlib.onload = callback;
                    document.head.appendChild(dw.nvlib);
                    (function () {
                        var rules = {
                            "html, body, div": "margin: 0px;padding: 0px;",
                            "#chartsContainer svg": "position: relative;min-height: 1px;padding-right: 0px;padding-left: 0px;float: left;height: 45%;width:30%;",
                            "#chartsContainer": "overflow:hidden;width: 100%;",
                            ".last-row": "width:30%;"
                        };
                        for (var sl in rules) {
                            dw.addStyleRule(sl, rules[sl]);
                        }
                    })();
                } else {
                    ff();
                }
            };
        })(callback);
        document.head.appendChild(dw.d3lib);
    } else {
        ff();
    }
}
dw.loadLib = loadLib;

function draw() {
    var _self = this;
    var chartsContainer;
    function createChartElement() {
        var chId = dw._chartId++;
        chartsContainer = chartsContainer ||
        document.getElementById("chartsContainer") ||
        (function () {
            var re = document.createElement('div');
            re.id = 'chartsContainer';
            re.style.cssText = "overflow:hidden; width: 100%;";
            re.style.height = (window.innerHeight - 16) + 'px';
            document.body.appendChild(re);
            window.onresize = function () {
                re.style.height = (window.innerHeight - 16) + 'px';
                re.style.width = (window.innerWidth - 16) + 'px';
            };
            return document.body.appendChild(re), re;
        })();
        chartsContainer.appendChild((function (i) {
            var el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            el.id = "chart" + i;
            return el;
        })(chId));
        return chId;
    }

    function appendChart() {
        var chId;
        var data;
        switch (detectType(_self)) {
            case TypeChart.Line:
                chId = createChartElement();
                data = dw.adapters.toLine(_self);
                dw.charts.Line(chId, data);
                break;
            case TypeChart.Scatter:
                chId = createChartElement();
                data = dw.adapters.toScatter(_self);
                dw.charts.Scatter(chId, data);
                break;
            case TypeChart.Histogram:
                chId = createChartElement();
                data = dw.adapters.toHistogram(_self);
                dw.charts.Histogram(chId, data);
                break;
            case TypeChart.StackedBar:
                chId = createChartElement();
                data = dw.adapters.toStackedBar(_self);
                dw.charts.StackedBar(chId, data);
                break;
            default:
                console.log('Unavalible chart');
                break;
        }
        //dw.refreshStyle();
    }

    console.log('Drawing chart type: ', TypeChart[detectType(this)]);
    console.log('Source data', this);
    dw.loadLib(appendChart);
}
Object.defineProperty(Object.prototype, 'draw', { enumerable: false, value: draw });