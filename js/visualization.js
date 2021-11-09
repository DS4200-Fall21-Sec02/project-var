// Immediately Invoked Function Expression to limit access to our
// variables and prevent
d3.csv("data/VAR_Incidents_19_20.csv").then((data) => {
for (let i = 0; i < 10; i++){
  console.log(data[i]);
}
});
