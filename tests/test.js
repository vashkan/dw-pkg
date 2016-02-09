describe('dw', function(){
  describe('detectType', function(){
      
    it('Histogram', function(){
      chai.assert.equal(detectType([1, 2, 2, 2, 3, 3, 4, 5]),TypeChart.Histogram);
      chai.assert.equal(detectType(["a", "b", "a", "c", "d", "d", "d", "a"]),TypeChart.Histogram);
    });
    it('Scatter',function(){
        chai.assert.equal(detectType([
                {x: 10, y: 10, r: 37},
                {x: 20, y: 11.2, r: 2},
                {x: 22, y: 31, r: 17},
                {x: 40, y: 5.7, r: 11},
                {x: 32, y: 11, r: 28}
        ]),TypeChart.Scatter);
    });
    it('Line',function(){
        chai.assert.equal(detectType({
                1: [1, 12, 3],
                4: [12, 31, 4],
                5: [3, 24, 4],
                6: [12, 17, 6],
                12: [8, 2, 9],
                13: [21, 34, 6],
                21: [6, 7, 8]
        }),TypeChart.Line);
    });
    it('StackedBar',function(){
        chai.assert.equal(detectType([
                ["jan", 1, 4, 5, 6],
                ["jan", 2, 3, 5, 6],
                ["jan", 3, 10, 11],
                ["mar", 4, 9, 7, 10],
                ["may", 3, 10, 8, 1],
                ["sep", 11, 1, 9, 0]
        ]),TypeChart.StackedBar);
    });
  });
});