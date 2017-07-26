class ToGraph {
  constructor(container, data) {
    this.data = data.series

    this.acumAxesY = this.getAcumAxesY
    this.allAxesY = this.getAllAxesY

    this.maxAcumAxesY = this.getMaxAcumAxesY
    this.maxAllAxesY = this.getMaxAllAxesY

    this.container = container
    this.type = data.type || 'bar3d'

    this.width =  data.width || 1000
    this.height = data.height || 500

    this.background = data.background || '#f3f3f3'
    this.color = data.palette
    this.fontColor = data.color
    this.rotate = data.rotate || 90
    this.widthAxe = this.getWidthAxe

  }

  get getAcumAxesY () {
    let data = this.data
    let acum = []
    for(let key in data) {
      let a = 0
      let arr = data[key].map(d=>{
        a += d.axeY
      })
      acum.push(a)
    }
    return acum

  }
  get getAllAxesY () {
    let data = this.data
    let all = []
    for(let key in data) {
      let arr = data[key].map(d=>{
        all.push(d.axeY)
      })
    }
    return all
  }
  get getMaxAllAxesY () {
    let axesY = this.allAxesY
    return d3.max(axesY)
  }
  get getMaxAcumAxesY () {
    let axesY = this.acumAxesY
    return d3.max(axesY)
  }

  get getWidthAxe () {
    let data = this.data
    let dataLegth = Object.keys(this.data).length
    let coutChart = 0
    for(let key in data) {
      coutChart += (data[key].length)
    }

    let widthForchart = (this.width - 60) / (coutChart + dataLegth -1)
    // let widthForchart = parseInt(widthForLabel / d3.max(coutChart) + 1)

    return widthForchart
  }


  createSVG () {

    let container = d3.select(this.container)
    container.selectAll('svg')
              .remove()
    let svg = container
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .style('background-color', this.background)

    svg.append('defs')



    this.svg = svg
    this.graphContainer = container


    this.createAxesGraph()

    if(this.color[0].length > 1) {

        this.addGradient()
      }
  }
  shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}
  addGradient () {
    let self = this
    let svg =  $(this.container)[0].querySelector('svg')
    let color = this.color
    let rotate = this.rotate

    let gradients = color.map(function(palette, i){
      let brakePoints = 100/(palette.length-1)
      let id = $(svg).parent().attr('id')+i
      let stops = palette.map(function (color, i) {

        return {
          offset: `${ i == 0 ? 0 : Math.round(brakePoints * (i))}%`,
          'stop-color': `${color}`
       }
      })

      self.createGradient(svg,id,stops,rotate);
    })


  }
  createGradient(svg,id,stops,rotate){
    var svgNS = svg.namespaceURI;
    var grad  = document.createElementNS(svgNS,'linearGradient');
    grad.setAttribute('id',id);
    grad.setAttribute('gradientTransform', `rotate(${rotate})`)
    for (var i=0;i<stops.length;i++){
      var attrs = stops[i];
      var stop = document.createElementNS(svgNS,'stop');
      for (var attr in attrs){
        if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
      }
      grad.appendChild(stop);
    }

    var defs = svg.querySelector('defs') ||
        svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);

    return defs.appendChild(grad);

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
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.5')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAllAxesY * d) -30)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAllAxesY * d) -30)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAllAxesY * d) -25)
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 +  poinacum+ (wchart*counterLabel) + (wchart/2)
                poinacum += wchart

                return x
              })
              .attr('y', function(d,i){
                return h  - 35
              })
              .style('text-anchor', 'middle')
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')
              .transition()
              .delay(function(d, i){return i*50 })
              .duration(500)
              .attr('y', function(d,i){
                return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 35
              })


      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 +  wacum+ (wchart*counterLabel)
            wacum += wchart
            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[0].length == 1) {
              return self.color[i]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              let url = `url(#${myCont}${i})`

              return url
            }
          })
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .attr('height', function(d){
            return (h-60)/self.maxAllAxesY * d.axeY
          })
          .attr('y', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30
          })

      counterLabel++

    }
  }
  get printData () {
    console.log(this.data)
  }
}
