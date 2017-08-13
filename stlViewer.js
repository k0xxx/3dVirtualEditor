// Проверка webgl
if(!Detector.webgl) Detector.addGetWebGLMessage();
// Объявление сцены, камеры, управления, визуализатора
var scene, camera, controls, renderer, rendererContainer;
var mainGroup;
init();
animate();

function init(){
	scene = new THREE.Scene();

	rendererContainer = document.getElementById('rendererContainer');
	
	// Обьявление камеры
	camera = new THREE.PerspectiveCamera(45, rendererContainer.clientWidth / rendererContainer.clientHeight, 1, 1000);
	camera.position.set(-200, 200, 100);
	camera.lookAt(scene.position);
	
	// Добавление осей координат (Опционально)
	var axes = new THREE.AxisHelper( 20 );
	scene.add(axes);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( rendererContainer.clientWidth, rendererContainer.clientHeight );
	rendererContainer.appendChild(renderer.domElement);
	
	// Добавление управления
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.enableZoom = true;
	
	mainGroup = new THREE.Group();
	scene.add(mainGroup);
}

// Ререндеринг сцены
function render() {
	renderer.render( scene, camera );
	console.log(mainGroup.getWorldPosition());
}

// Анимация сцены
function animate () {
	requestAnimationFrame( animate );
	renderer.render(scene, camera);
};

/*
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/


addToMainMesh({url: 'models/up.stl', name: 'up'});
addToMainMesh({url: 'models/low.stl', name: 'low'});
// Добавление файла в MainMesh
function addToMainMesh(stlFile){
	var loader = new THREE.STLLoader();
	loader.load(stlFile.url, createNamedMesh(stlFile.name));
}
// Создание меша с именем
function createNamedMesh(meshName){
	return function(geometry) {
		//var material = new THREE.MeshPhongMaterial({color: 0xFF8243, specular: 0x111111, shininess: 200});
		var material = new THREE.MeshNormalMaterial();
		console.log(geometry);
		var mesh = new THREE.Mesh(geometry, material);
		mainGroup.add(mesh);
		/*mesh.name = meshName;
		mesh.rotation.set(-Math.PI/2, 0, Math.PI);
		mesh.position.set(0, 0, 0);
		//mesh.scale.set(0.5, 0.5, 0.5);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		meshesList[meshName] = mesh;
		mainMesh.add(mesh);*/
	};
}

