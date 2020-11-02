import * as d3 from "d3"
import { getSvgElementId } from "./utilities"
import { getCategoryColor, animationDuration } from "./visualization_config"

export const setHighlightLine = ({ svg, category }) => {
  svg.select("#" + getSvgElementId("line", category))
    .transition()
    .duration(animationDuration)
    .attr("stroke", getCategoryColor(category))
    .attr("stroke-width", 2)
}

export const setContextLine = ({ svg, category }) => {
  svg.select("#" + getSvgElementId("line", category))
    .transition()
    .duration(animationDuration)
    .attr("stroke", getCategoryColor("context"))
    .attr("stroke-width", 1)
}

export const setVisitedLine = ({ svg, category }) => {
  svg.select("#" + getSvgElementId("line", category))
    .transition()
    .duration(animationDuration)
    .attr("stroke", getCategoryColor("visited"))
    .attr("stroke-width", 1)
}

export const setHighlightToAllLines = ({ svg, svgClass }) => {
  svg.selectAll("path." + svgClass)
    .transition()
    .duration(animationDuration)
    .ease(d3.easeLinear)
    .attr("stroke", getCategoryColor("default"))
    .attr("stroke-width", 1)
}

export const setContextToAllLines = ({ svg, svgClass }) => {
  svg.selectAll("path." + svgClass)
    .transition()
    .duration(animationDuration)
    .ease(d3.easeLinear)
    .attr("stroke", getCategoryColor("context"))
    .attr("stroke-width", 1)
}

