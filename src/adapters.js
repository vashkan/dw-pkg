(function (dw)
{
    var adapters;
        (function (adapters) {
            function toHistogram(input_data) {

                var dat = {};
                input_data.forEach(function (v, i, a) {
                    if (v in dat) {
                        dat[v] += 1;
                    }
                    else {
                        dat[v] = 1;
                    }
                });
                var data = [{ key: "Cumulative Return", values: [] }];
                for (var l in dat) {
                    data[0].values.push({ "label": l, "value": dat[l] });
                }
                return data;
            }
            adapters.toHistogram = toHistogram;


            function toScatter(input_data) {
                return [{ key: 'Data ', values: input_data }];
            }
            adapters.toScatter = toScatter;


            function toLine(input_data) {
                var data = [];
                for (var k in input_data) {
                    var dat = input_data[k].map(function (v, i) {
                        return { x: i, y: v };
                    });
                    data.push({ key: k, values: dat });
                }
                return data;
            }
            adapters.toLine = toLine;


            function toStackedBar(input_data) {
                var data = [];
                if (input_data.length > 0) {
                    var maxlen = input_data.reduce(function (maxlen, v) { return Math.max(maxlen, v.length - 1); }, 0);

                    data=input_data.map(function (element, index) {
                        return { 
                            key: element[0], 
                        values: element.slice(1,maxlen+1)
                        .slice(0,maxlen).concat((Array(Math.abs(maxlen-Math.min(element.length-1,maxlen))+1).join(",0").split(",").splice(1).map(function(v){return Number(v);})))
                        .map(function(val,ind){return {x:ind,y:val};})};
                    });
                }
                return data;
            }
            adapters.toStackedBar = toStackedBar;


        })(adapters = dw.adapters || (dw.adapters = {}));
})(dw||(dw={}));