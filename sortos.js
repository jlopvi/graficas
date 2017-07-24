class ToGraph {
  constructor(container, data, type = 'bar3d', width = null, height = null, widthAxe = 30) {
    this.data = data
    this.acumAxesY = this.getAcumAxesY
    this.allAxesY = this.getAllAxesY
    this.maxAcumAxesY = this.getMaxAcumAxesY
    this.maxAllAxesY = this.getMaxAllAxesY
    this.container = container
    this.type = type
    this.width = width || parseInt($(container).css('width'))
    this.height = height || parseInt($(container).css('height'))
    this.widthAxe = widthAxe
    this.color = [d3.scaleOrdinal()
                  .range(["#C0392B", "#E74C3C", "#884EA0","#6C3483", "#1F618D","#2874A6", "#148F77", "#117A65", "#1E8449", "#239B56", "#D4AC0D", "#D68910", "#CA6F1E", "#A04000"]),
                  d3.scaleOrdinal()
                    .range(["#148F77", "#117A65", "#1E8449", "#239B56", "#D4AC0D", "#D68910", "#CA6F1E", "#A04000"]),
                  d3.scaleOrdinal()
                    .range([ "#D4AC0D", "#D68910", "#CA6F1E", "#A04000", "#148F77", "#117A65", "#1E8449", "#239B56"])
                ]

  }
  get getMaxAllAxesY () {
    let axesY = this.allAxesY
    return d3.max(axesY)
  }
  get getMaxAcumAxesY () {
    let axesY = this.acumAxesY
    return d3.max(axesY)
  }
  get getAcumAxesY () {
    let data = this.data
    return data.map(d=>{
      let y = 0
      for(let key in d.axeY) {
        y += parseInt(d.axeY[key])
      }
      return y
    })
  }
  get getAllAxesY () {
    let data = this.data
    let y = []
    let d = data.map(d=>{
      for(let key in d.axeY) {
        y.push(parseInt(d.axeY[key]))
      }
    })
    return y
  }
  createSVG () {
    let container = d3.select(this.container)
    container.selectAll('svg')
              .remove()
    let svg = container
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .append('g')


    this.svg = svg
    this.graphContainer = container
    this.createAxesGraph()
  }
  createAxesGraph () {
    if(this.type == 'bar') {
      this.createBars()
    }
  }
  createBars () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)
    let max = (Math.round(this.maxAllAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()
    let it = 0
    let wchart = this.widthAxe

    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', 'black')
                  .style('stroke-width', '1')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -40)/self.maxAllAxesY * d) -30)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -40)/self.maxAllAxesY * d) -30)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -40)/self.maxAllAxesY * d) -25)
            })
            .style('fill', 'red')
            .style('text-anchor', 'end')
    axesText.data(data)
            .enter().append('text')
            .text(function(d){
              return d.axeX;
            })
            .attr('x', function(d, i){

              let l = Object.keys(d.axeY).length
              return (wchart * l  + 40 ) * (i+1) - (20*i) - (wchart * l)
            })
            .attr('y', function(d, i){
              return Math.round(h - 10)
            })
            .style('fill', 'red')



    for(let key in bar.datum().axeY) {
      let space = Object.keys(bar.datum().axeY).length
      let distance = 40 + (wchart*it)

      bar.append('rect')
        // .attr('x', 0)
        .attr('y', 0)
        .attr('width',wchart)
        // .attr('height', 100)
        .attr('x', function(d, i) {
          return i * wchart * space + distance + (40/2*i)
        })
        .attr('height', function(d){
          // return (h-40)/self.maxAxesY * d.axeY[key]
          return 0
        })
        .attr('y', function(d){
          return h - 30
        })
        .style('fill', function(d) {

          return self.color[it](d.axeY)
        })
        .transition()
        .delay(function(d, i){return i*50})
        .duration(500)
        .attr('height', function(d){
          return Math.round((h -40)/self.maxAllAxesY * d.axeY[key])
        })
        .attr('y', function(d){
          return Math.round(h - ((h -40)/self.maxAllAxesY * d.axeY[key]) -30)
        })
        .style('stroke', function(d) {

          return self.color[it](d.axeY)
        })
        .style('stroke-width', '1')
        console.log(it)
        it++

    }



  }
  get printData () {
    console.log(this.data)
  }
}
