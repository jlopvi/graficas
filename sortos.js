class ToGraph {
  constructor(container, data, type = 'bar3d', width = null, height = null, widthAxe = 30) {
    this.data = data
    this.axesY = this.getAxesY
    this.maxAxesY = this.getMaxAxesY
    this.container = container
    this.type = type
    this.width = width || $(container).css('width')
    this.height = height || $(container).css('height')
    this.widthAxe = widthAxe

  }
  get getMaxAxesY () {
    let axesY = this.axesY
    return d3.max(axesY)
  }
  get getAxesY () {
    let data = this.data
    return data.map(d=>{
      let y = 0
      for(let key in d.axeY) {
        y += parseInt(d.axeY[key])
      }
      return y
    })
  }
  createSVG () {
    let container = d3.select(this.container)
    container.selectAll('svg')
              .remove()
    let svg = container
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
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
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()
    let it = 0
    let wchart = this.widthAxe
    for(let key in bar.datum().axeY) {
      let space = Object.keys(bar.datum().axeY).length
      let distance = 15 + (wchart*it)

      bar.append('rect')
        // .attr('x', 0)
        .attr('y', 0)
        .attr('width',wchart)
        // .attr('height', 100)
        .attr('x', function(d, i) {
          return i * wchart * space + distance + (15/2*i)
        })
        .attr('height', function(d){
          return (h-40)/self.maxAxesY * d.axeY[key]
        })
        .attr('y', function(d){
          return h - ((h-40)/self.maxAxesY * d.axeY[key]) - 20
        })
        .style('fill', `${['red','green'][it]}`)
        console.log(it)
        it++

    }



  }
  get printData () {
    console.log(this.data)
  }
}
