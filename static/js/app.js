function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var culturedata = `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(culturedata).then((sample) => {
      var requestculture = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
    requestculture.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(([key,value]) => {
        var row = requestculture.append("p");
        row.text(`${key}:${value}`)})
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var graphculture = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(graphculture).then((data) => {
      var colonycount = data.sample_values;
      var colors = data.otu_ids;      
      
      var trace =[{
        x: data.otu_ids,
        y: data.sample_values,
        mode: `markers`,
        marker: {size:colonycount,color:colors}}];
  
      var layout = {
        title: "Belly-Button Culture Bacteria Colony Count",
        xaxis: {title: "---- OTU  -  ID ---- "}
      };
      Plotly.newPlot("bubble", trace, layout);
    
    // @TODO: Build a Pie Chart done
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each)
    d3.json(graphculture).then((data) => {
      var trace1 = {
        values: data.sample_values.slice(0,10),
        lables: data.otu_ids,
        type: "pie",
        hole: .5,
        //name = data.otu_ids
        };
      var data = [trace1];  
      var layout = {
        title: "Interactive Chart",
      };

      Plotly.newPlot('pie',data, layout);});
  });
};

//restaync
function init() {
  console.log('hello');
  // Grab a reference to the dropdown select element as coded
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(function(sampleNames) {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots done
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected done
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard done
init();
