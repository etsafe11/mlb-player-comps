$wordToSearch = "bitter";

var w = 960,
	h = 960,
	node,
	link,
	root,
	title;
	
var jsonURL = 'http://desolate-taiga-6759.herokuapp.com/word/' + $wordToSearch;

d3.json(jsonURL, function(json) {
	root = json.words[0]; //set root node
	root.fixed = true;
	root.x = w / 2;
	root.y = h / 2 - 80;
	update();
});

d3.csv("https://github.com/etsafe11/social_listening/blob/master/players.csv", function(data){
	console.log(data);
})

var force = d3.layout.force()
	.on("tick", tick)
	.charge(-700)
	.gravity(0.1)
	.friction(0.9)
	.linkDistance(50)
	.size([w, h]);

var svg = d3.select(".graph").append("svg")
	.attr("width", w)
	.attr("height", h);



//Update the graph
function update() {
	var nodes = flatten(root),
	links = d3.layout.tree().links(nodes);

	// Restart the force layout.
	force
		.nodes(nodes)
		.links(links)
		.start();

	// Update the links…
	link = svg.selectAll("line.link")
		.data(links, function(d) { return d.target.id; });

	// Enter any new links.
	link.enter().insert("svg:line", ".node")
		.attr("class", "link")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	// Exit any old links.
	link.exit().remove();

	// Update the nodes…
	node = svg.selectAll(".node")
		.data(nodes);
    
    var nodeE = node
		.enter();
    
    var nodeG = nodeE.append("g")
		.attr("class", "node")
		.call(force.drag);

	nodeG.append("circle")	
		.attr("r", 10)
		.on("click", click)
		.style("fill", "red");

	nodeG.append("text")
    	.attr("dy", 10 + 15)
    	.attr("text-anchor", "middle")
    	.text(function(d) { return d.word });

    node.exit().remove();

}

function tick() {
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}




/***********************
*** CUSTOM FUNCTIONS ***
***********************/

//Request extended JSON objects when clicking a clickable node
function click(d) {
	$wordClicked = d.word;

	var jsonURL = 'http://desolate-taiga-6759.herokuapp.com/word/' + $wordClicked;
	console.log(jsonURL);

	updateGraph(jsonURL);
}

// Returns a list of all nodes under the root.
function flatten(root) {
	var nodes = [], i = 0;

	function recurse(node) {
		if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
		if (!node.id) node.id = ++i;
		nodes.push(node);
		return node.size;
	}

	root.size = recurse(root);
	return nodes;

}



//Update graph with new extended JSON objects
function updateGraph(newURL) {
  d3.json(newURL, function(json) {
		root = json.words[0]; //set root node
		root.fixed = true;
		root.x = w / 2;
		root.y = h / 2 - 80;
		
		update();
	});
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)  {
            return sParameterName[1];
        }
    }
} 
