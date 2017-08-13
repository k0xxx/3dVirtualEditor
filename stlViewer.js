// Проверка webgl
if(!Detector.webgl) Detector.addGetWebGLMessage();
// Объявление сцены, камеры, управления, визуализатора
var scene, camera, controls, renderer, rendererContainer;
var mainGroup;
var centerPoint = {x: 0, y: 0, z: 0, xArray: [], yArray: [], zArray: []};
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
	
	//Добавление источников света
	addLight();

	mainGroup = new THREE.Group();
	mainGroup.updateMatrixWorld(true);
	scene.add(mainGroup);

	//refreshStlFilesList();
}

// Ререндеринг сцены
function render() {
	renderer.render( scene, camera );
	calcCenter();
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

// Добавить файл c локального диска
function getFile() {
	var file = document.getElementById('stlFile').files[0];
	var reader = new FileReader();

	reader.onloadend = function (file) {
		addFile(reader.result, reader.fileName);
		document.getElementById('stlFile').value = '';
	}
		
	if (file) {
		var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
		reader.fileName = fileName;
		reader.readAsDataURL(file);
	}else{
		console.log('can not readAsDataURL');
	}
}

// Добавить файл через URL
function getFileUrl(){
	var file = document.getElementById('stlFileUrl').value;
	if(file){
		var regex = /(\w+\.\w+)$/i;    
		var url = regex.exec(file);
		if (url){
			var fileName = file.substring(0, file.lastIndexOf('.'));
			addFile(file, fileName);
		}else{
			console.log('its not file');
		}
	}else{
		console.log('file input is empty');
	}
}

// Добавление файла в пространство
function addFile(url, name){
	if(url && name){
		var stlFile = {'name': name, 'url': url};
		stlFiles.push(stlFile);
	}
	addToMainMesh(stlFile);
	//refreshStlFilesList();
}

// Обновление списка добавленых файлов
function refreshStlFilesList(){
	var stlFilesList = document.getElementById('stlFilesList');
	stlFilesList.innerHTML = '';
	//mainGroup.children = [];
	for(var i = 0; i<stlFiles.length; i++){
		var li = document.createElement('li');
		var editor = '<span>'+stlFiles[i].name+'</span>'
					+'<a href="#" onclick="setTransparent(this)">Включить прозрачность</a>';
		li.innerHTML = editor;
		stlFilesList.appendChild(li);
		//addToMainMesh({url: stlFiles.url, name: stlFiles.name});
	}
	//refreshModels();
}

// Добавление света
function addLight(){
	var directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight1.position.set(0, 0, 1);
	scene.add(directionalLight1);
	var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight2.position.set(0, 1, 0);
	scene.add(directionalLight2);
	var directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight3.position.set(1, 0, 0);
	scene.add(directionalLight3);
	var directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight4.position.set(0, 0, -1);
	scene.add(directionalLight4);
	var directionalLight5 = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight5.position.set(0, -1, 0);
	scene.add(directionalLight5);
	var directionalLight6 = new THREE.DirectionalLight(0xffffff, 0.5);
	scene.add(directionalLight6);
	directionalLight6.position.set(-1, 0, 0);
	var directionalLight7 = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
	scene.add(directionalLight7)
}

//addToMainMesh({url: 'models/up.stl', name: 'up'});
//addToMainMesh({url: 'models/low.stl', name: 'low'});
// Добавление файла в MainMesh
function addToMainMesh(stlFile){
	var loader = new THREE.STLLoader();
	loader.load(stlFile.url, createNamedMesh(stlFile.name));
}
// Создание меша с именем
function createNamedMesh(meshName){
	return function(geometry) {
		var material = new THREE.MeshPhongMaterial({color: 0xFF8243, specular: 0x111111, shininess: 200});
		//var material = new THREE.MeshNormalMaterial();
		//console.log(geometry);
		var mesh = new THREE.Mesh(geometry, material);
		mainGroup.add(mesh);
		mesh.rotation.set(-Math.PI/2, 0, Math.PI);
		mesh.name = meshName;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		console.log(meshName);
		var stlFilesList = document.getElementById('stlFilesList');
		var li = document.createElement('li');
		var editor = '<span>'+meshName+'</span>'
					+'<a href="#" data-name="'+meshName+'" data-transparent="false" onclick="setTransparent(this); return false;">Включить прозрачность</a>';
		li.innerHTML = editor;
		stlFilesList.appendChild(li);
		/*mesh.position.set(0, 0, 0);
		//mesh.scale.set(0.5, 0.5, 0.5);
		
	stlFilesList.innerHTML = '';
	//mainGroup.children = [];
	for(var i = 0; i<stlFiles.length; i++){
		
		
		//addToMainMesh({url: stlFiles.url, name: stlFiles.name});
	}
		meshesList[meshName] = mesh;
		mainMesh.add(mesh);*/
		render();
	};
}

function setTransparent(el){
	var elName = el.getAttribute('data-name'); 
	var isTransparent = el.getAttribute('data-transparent'); 
	var editedObject = mainGroup.getObjectByName(elName);
	if(isTransparent == 'true'){
		editedObject.material.transparent = false;
		editedObject.material.opacity = 1;
		el.setAttribute('data-transparent', 'false');
		el.innerHTML = 'Включить прозрачность';
	}else{
		editedObject.material.transparent = true;
		editedObject.material.opacity = 0.5;
		el.setAttribute('data-transparent', 'true');
		el.innerHTML = 'Выключить прозрачность';
	}
	
	
	render();
}

function calcCenter(){
	centerPoint = {x: 0, y: 0, z: 0, xArray: [], yArray: [], zArray: []};
	for(var i=0; i<mainGroup.children.length; i++){
		centerPoint.xArray.push(mainGroup.children[i].geometry.boundingSphere.center.x);
		centerPoint.yArray.push(mainGroup.children[i].geometry.boundingSphere.center.y);
		centerPoint.zArray.push(mainGroup.children[i].geometry.boundingSphere.center.z);
	}
	if(centerPoint.xArray.length){
		centerPoint.x = -[].reduce.call(centerPoint.xArray, function(p,c){return c+p;}) / centerPoint.xArray.length;
	}
	if(centerPoint.yArray.length){
		centerPoint.y = -[].reduce.call(centerPoint.yArray, function(p,c){return c+p;}) / centerPoint.yArray.length;
	}
	if(centerPoint.zArray.length){
		centerPoint.z = -[].reduce.call(centerPoint.zArray, function(p,c){return c+p;}) / centerPoint.zArray.length;
	}

	mainGroup.position.set( centerPoint.x, centerPoint.z, centerPoint.y );
}
