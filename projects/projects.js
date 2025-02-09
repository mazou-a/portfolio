import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const titleElement = document.querySelector('.projects-title');
  if (titleElement) {
    titleElement.textContent = `${projects.length} Projects`;
  }

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  d3.select('svg').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  if (projectsGiven.length === 0) return;

  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );


  let newData = newRolledData.map(([year, count]) => ({
    label: year,
    value: count,
  }));

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcs = newSliceGenerator(newData);


  let svg = d3.select("svg");

  newArcs.forEach((arc, i) => {
    svg
      .append("path")
      .attr("d", arcGenerator(arc))
      .attr("fill", d3.schemeTableau10[i])
      .attr("class", `arc-${i}`)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, "h2");
          } else {
            const filteredProjects = projects.filter(
              (project) => project.year === newData[selectedIndex].label
            );
            renderProjects(filteredProjects, projectsContainer, "h2");
          }
        renderPieChart(projectsGiven);
      })
      .classed("selected", selectedIndex === i);
  });


  let newLegend = d3.select('.legend');
  newData.forEach((d, i) => {
    newLegend
      .append("li")
      .attr("class", `legend-item legend-item-${i}`)
      .classed("selected", selectedIndex === i)
      .html(
        `<span class="swatch" style="background-color: ${
          d3.schemeTableau10[i]
        }"></span>${d.label} (${d.value})`
      )
      .style("cursor", "pointer")
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;


        renderPieChart(projectsGiven);
      });
  });
}


renderPieChart(projects);

let query = '';
const searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});


