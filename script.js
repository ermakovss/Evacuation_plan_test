let container = document.getElementById('svgcontainer');
let image = document.getElementById('image');

let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

let imageLoad = document.getElementById("image");
let testImage = document.getElementById("testImage");

let svgContainer = document.getElementById("svgcontainer");

let counter = 0;

svgContainer.style.width = "1200px";
canvas.style.display = "none";
imageLoad.style.display = "none";
testImage.style.display = "none";

getCanvasData();

async function getCanvasData(){
    let plan = await loadImage(imageLoad.src);

    canvas.height = imageLoad.height;
    canvas.width = imageLoad.width;

    context.drawImage(plan, 0, 0, canvas.width, canvas.height);


	let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let scannedData = imageData.data;

    changeWhiteToAlpha(scannedData);

    imageData.data = scannedData;
    context.putImageData(imageData, 0, 0);


    testImage.src = canvas.toDataURL("image/png");
   	getSVG(testImage.src);
}

function loadImage(src){
    return new Promise((resolve) => {
        let image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
    });
}

/*
let max_call_i=300;
let k = 0;
let call_i = 0;

findTagPath({k:k+1, call_i:call_i+1});

function findTagPath(args){
	var k=args.k;
	var call_i=args.call_i;

	let paths = document.getElementsByTagName("path");
	if(paths.length != 0){
		removeWhiteSVGElements(paths);
		return;
	}

    if (call_i>=max_call_i)
    {     
        setTimeout(function(){ findTagPath({k:k+1, call_i:call_i+1}) }, 0);
    }
    else
    {
        findTagPath({k:k+1, call_i:call_i+1});
    }
}


function removeWhiteSVGElements(paths){
	let maxWhiteCode = [255, 255, 255];
	let minWhiteCode = [90, 90, 90];

	for(let i = 0; i < paths.length; i++){
		let fillValue = window.getComputedStyle(paths[i]).stroke;
		let spl = fillValue.split(',');

		let red = spl[0].match(/(\d+)/);
		let green = spl[1].match(/(\d+)/);
		let blue = spl[2].match(/(\d+)/);

		if(Number(red[0]) <= maxWhiteCode[0] && Number(red[0]) >= minWhiteCode[0] &&
           Number(green[0]) <= maxWhiteCode[1] && Number(green[0]) >= minWhiteCode[1] && 
           Number(blue[0]) <= maxWhiteCode[2] && Number(blue[0]) >= minWhiteCode[2]){
        
        	paths[i].parentNode.removeChild(paths[i]);
    	}
	}

	console.log(counter);

	if(counter < 20){
		counter++;
		findTagPath({k:k+1, call_i:call_i+1});
	}
}

function Test(){
	findTagPath({k:k+1, call_i:call_i+1});
}
*/

function changeWhiteToAlpha(scannedData){
	let maxWhiteCode = [255, 255, 255];
	let minWhiteCode = [90, 90, 90];

	for(let i = 0; i < scannedData.length; i+=4){

	    let red = scannedData[i];
	    let green = scannedData[i + 1];
	    let blue = scannedData[i + 2];
	    let alpha = scannedData[i + 3]; 

	    if(red <= maxWhiteCode[0] && red >= minWhiteCode[0] &&
	       green <= maxWhiteCode[1] && green >= minWhiteCode[1] && 
	       blue <= maxWhiteCode[2] && blue >= minWhiteCode[2]){
	        
	        alpha = 0;
	        scannedData[i + 3] = alpha;
	    }
	}
}

function getSVG(image){

	ImageTracer.imageToSVG(
		image,
		
		function(svgstr){ ImageTracer.appendSVGString( svgstr, 'svgcontainer' ); },

		//{ pathomit:0, roundcoords:2, ltres:0.5, qtres:0.5, rightangleenhance: true, corsenabled: false, linefilter: false, numberofcolors:64 }
		// norm{pathomit:0, colorsampling:1, numberofcolors:64, strokewidth: 0.0000000000000001, ltres: 0, qtres:  0}
		// notm{ colorsampling:2, rightangleenhance: true, pathomit: 0, blurdelta: 0, ltres: 0, qtres:  0, corsenabled: false, linefilter: false, numberofcolors:64, scale:0.6, strokewidth:0.000001 }
		// standart 'randomsampling2'

		{	corsenabled : false,
			ltres : 0,
			qtres : 0,
			pathomit : 0,
			rightangleenhance : true,
			
			// Color quantization
			colorsampling : 2,
			numberofcolors : 256,
			mincolorratio : 0,
			colorquantcycles : 0.1,
			
			// Layering method
			layering : 0,
			
			// SVG rendering
			strokewidth : 0.1,
			linefilter : false,
			scale : 1,
			roundcoords : 0,
			viewbox : true,
			desc : false,
			lcpr : 0,
			qcpr : 0,
			
			// Blur
			blurradius : 0,
			blurdelta : 20}
	);
}