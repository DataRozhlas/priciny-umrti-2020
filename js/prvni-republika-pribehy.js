import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";
import data_1919_men from "../data/1919-1948_m_std_clean.js"

const getKebabCase = (cat) => {
  return cat.replace(/\s+/g, '-').toLowerCase();
}

const animationDuration = 100;
const colors = {
  "default" : "#AFB1A9",
  "context" : "#E1E2DF",
  "cizopasne" : "#f95d6a",
  "krevni" : "#ffa600",
  "rakovina" : "#a05195",
  "valka": "#665191"
}

const initScrollama = ({ vizSvg, vizSteps }) => {
  // instantiate the scrollama
  const scroller = scrollama({ debug: true, offset: 0.5 });

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: "#prvni-republika-pribehy .step",
    })
    .onStepEnter(({ direction, index }) => {
      console.log('onStepEnter', { direction, index })

      if (direction === 'down' && vizSteps[index - 1] && vizSteps[index - 1].stepDown) {
        vizSteps[index - 1].stepDown({ vizSvg })
      }

      if (direction === 'up' && vizSteps[index + 1] && vizSteps[index + 1].stepUp) {
        vizSteps[index + 1].stepUp({ vizSvg })
      }
    })
    .onStepExit(({ direction, index }) => {
      console.log('onStepExit', { direction, index })
    });

  // setup resize event
  window.addEventListener("resize", scroller.resize);
}

const initViz = ({ vizSvg, data, axes }) => {
  const width = 500;
  const height = 500
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

  console.log("----", data)

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0))

  const x = d3.scaleLinear()
    .domain(d3.extent(axes.x))
    .range([margin.left, width - margin.right])

  // const max = d3.max(data.map(category => d3.max(category.data.map(d => (d.Std_umrti))) ))
  const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(category => d3.max(category.data.map(d => (d.Std_umrti))) ))]).nice()
    .range([height - margin.bottom, margin.top])

  const line = d3.line()
    .x(d => x(d.Rok))
    .y(d => y(d.Std_umrti))

  const svg = vizSvg.attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  // svg
  const lines = svg.selectAll("path.lines")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "lines")
    .attr("id", d => "line-" + getKebabCase(d.category))
    .attr("d", d => line(d.data) )
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("fill", "none")
    
}

const vizSteps = {
  0: {
    stepDown: ({ vizSvg }) => {
      // unhighlight all categories
      vizSvg
        .selectAll("path.lines")
        .transition()
        .duration(animationDuration)
        .ease(d3.easeLinear)
        .attr("stroke", colors["context"])
      
      // highlight n. nakazlive a cizopasne
      vizSvg
        .select("#line-nemoci-nakažlivé-a-cizopasné")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["cizopasne"])
        .attr("stroke-width", 2)
    }
  },
  1: {
    stepUp: ({ vizSvg }) => {
      // highlight all categories
      vizSvg
        .selectAll("path")
        .transition()
        .duration(animationDuration)
        .ease(d3.easeLinear)
        .attr("stroke", colors["default"])
        .attr("stroke-width", 1)
    },
    stepDown: ({ vizSvg }) => {
      // highlight n. obehu krevniho
      vizSvg
        .select("#line-nemoci-ústrojí-oběhu-krevního")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["krevni"])
        .attr("stroke-width", 2)
    }
  },
  2: {
    stepUp: ({ vizSvg }) => {
      // highlight n. obehu krevniho
      vizSvg
        .select("#line-nemoci-ústrojí-oběhu-krevního")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["context"])
        .attr("stroke-width", 1)

      // highlight n. nakazlive a cizopasne
      vizSvg
        .select("#line-nemoci-nakažlivé-a-cizopasné")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["cizopasne"])
        .attr("stroke-width", 2)
    },
    stepDown: ({ vizSvg }) => {
      // unhighlight n. nakazlive a cizopasne
      vizSvg
        .select("#line-nemoci-nakažlivé-a-cizopasné")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["default"])
        .attr("stroke-width", 1)

    }
  }, 
  3: {
    stepUp: ({ vizSvg }) => {
      // highlight n. nakazlive a cizopasne
      vizSvg
        .select("#line-nemoci-nakažlivé-a-cizopasné")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["cizopasne"])
        .attr("stroke-width", 2)
    },
    stepDown: ({ vizSvg }) => {
      // unhighlight n. obehu krevniho
      vizSvg
      .select("#line-nemoci-ústrojí-oběhu-krevního")
      .transition()
      .duration(animationDuration)
      .attr("stroke", colors["default"])
      .attr("stroke-width", 1)

      // highlight rakoviny
      vizSvg
      .select("#line-rakovina-a-jiné-nádory")
      .transition()
      .duration(animationDuration)
      .attr("stroke", colors["rakovina"])
      .attr("stroke-width", 2)
    }
  },
  4: {
    stepUp: ({ vizSvg }) => {
      // highlight n. obehu krevniho
      vizSvg
      .select("#line-nemoci-ústrojí-oběhu-krevního")
      .transition()
      .duration(animationDuration)
      .attr("stroke", colors["krevni"])
      .attr("stroke-width", 2)

      // unhighlight rakoviny
      vizSvg
      .select("#line-rakovina-a-jiné-nádory")
      .transition()
      .duration(animationDuration)
      .attr("stroke", colors["context"])
      .attr("stroke-width", 1)
    },
    stepDown: ({ vizSvg }) => {
      // unhighlight rakoviny
      vizSvg
        .select("#line-rakovina-a-jiné-nádory")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["default"])
        .attr("stroke-width", 1)

      // unhighlight rakoviny
      vizSvg
        .select("#line-válečné-akce-a-soudní-poprava")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["valka"])
        .attr("stroke-width", 2)
    }
  }, 
  5: {
    stepUp: ({ vizSvg }) => {
      // highlight rakoviny
      vizSvg
        .select("#line-rakovina-a-jiné-nádory")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["rakovina"])
        .attr("stroke-width", 2)

      // unhighlight rakoviny
      vizSvg
        .select("#line-válečné-akce-a-soudní-poprava")
        .transition()
        .duration(animationDuration)
        .attr("stroke", colors["context"])
        .attr("stroke-width", 1)
    },
    stepDown: ({ vizSvg }) => {

    }
  },
  // X: {
  //   stepUp: ({ vizSvg }) => {

  //   },
  //   stepDown: ({ vizSvg }) => {

  //   }
  // },
};

(() => {
  console.log(data_1919_men);

  const categories = new Set(data_1919_men.map(d => d.Skupina))
  const years = new Set(data_1919_men.map(d => d.Rok))
  let dataByCat = [];

  categories.forEach(c => {
    dataByCat.push({ 
        category: c,
        data: data_1919_men.filter(d => d.Skupina === c)
      }
    )
  })

  console.log(dataByCat);

  const vizSvg = d3.select("#prvni-republika-pribehy .viz")
  initViz({ vizSvg, data : dataByCat, axes: {x: years} });
  initScrollama({ vizSvg, vizSteps });  
})();

const sumup = (sum, value) => {
  return sum + value;
}

