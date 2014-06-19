

// STANDARD GLOBAL VARIABLES
var scene,camera,renderer,stats;

// CUSTOM GLOBAL VARIABLES
var projector,raycaster,mouseVector,cube,INTERSECTED;
var objects = [];
var currentObjectId;

function init()
{
	// SCENE
	scene = new THREE.Scene();

	//CAMERA
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 10;

	// STATS
	stats = new Stats();
	stats.setMode(1);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild(stats.domElement); 
	
	// RENDERER
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.sortObjects = false;
	document.body.appendChild(renderer.domElement);
	
	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	mouseVector = new THREE.Vector2();
	
	// CUBE
	var geometry = new THREE.BoxGeometry(5,5,5);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	/* add cube to the array objects for detect raycasting intersection */
	objects.push(cube);

	// LISTENER
	document.addEventListener('mousedown',onDocumentMouseDown,false);
	document.addEventListener('mousemove',onDocumentMouseMove,false);
}

function onDocumentMouseMove(event)
{
	event.preventDefault();
	mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

	var vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 1 );
	projector.unprojectVector( vector, camera );
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
	
	var intersects = raycaster.intersectObjects(objects);
	
	if ( intersects.length > 0 ) 
	{
		if(!INTERSECTED)
		{
			currentObjectId = intersects[ 0 ].object.id;
			intersects[ 0 ].object.material.color.setHex(0x9900FF );
			INTERSECTED = !INTERSECTED;
		}
	}
	else
	{
		if (currentObjectId != null)
		{
			var objectTouched = scene.getObjectById( currentObjectId, true );
			objectTouched.material.color.setHex(0x00ff00 );
			currentObjectId=null;
			INTERSECTED = !INTERSECTED;
		}
	}
}

function onDocumentMouseDown(event)
{
	event.preventDefault();
	
	var vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 1 );
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects(objects);
	
	if ( intersects.length > 0 ) 
	{
		intersects[ 0 ].object.material.color.setHex( Math.random() * 0x990FFF );	
	}
	
}

function animate() 
{
	requestAnimationFrame(animate);
	render();
	update();
	
}

function update()
{
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	stats.update();
}

function render ()
{
	renderer.render(scene, camera);
}

init();
animate();
