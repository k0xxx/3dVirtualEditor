// Объявление сцены, камеры, управления, визуализатора
var scene, camera, controls, renderer;

// Список загруженых обьектов
var meshesList = new Object();

var centerPoint = {x: 0, y: 0, z: 0, xArray: [], yArray: [], zArray: []};

// Обьявление mainMesh
var mainMesh = new THREE.Mesh();
mainMesh.name = 'mainMesh';

// Проверка webgl
if(!Detector.webgl) Detector.addGetWebGLMessage();

function init(){
	// Обьявление сцены
	scene = new THREE.Scene();
	
	// Получение контейнера для рендеринга
	var rendererContainer = document.getElementById('rendererContainer');

	// Обьявление камеры
	camera = new THREE.PerspectiveCamera(45, rendererContainer.clientWidth / rendererContainer.clientHeight, 1, 1000);
	camera.position.set(-200, 200, 100);
	camera.lookAt(scene.position);
	
	// Обьявление визуализатора и установка полноэкранного режима
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		logarithmicDepthBuffer: true
	});
	renderer.setSize(rendererContainer.clientWidth, rendererContainer.clientHeight);
	
	// Расстановка источников света
	addLight();
	
	// Добавление управления
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.enableZoom = true;
	
	// Добавление mainMesh
	scene.add(mainMesh);
	
	// Добавление осей координат (Опционально)
	var axes = new THREE.AxisHelper( 20 );
	scene.add(axes);
	
	// Добавление плоскости (Опционально)
	//addPlane();
	
	// Добавление в контейнер визуализатора
	rendererContainer.appendChild(renderer.domElement);
	
	// Проверка источника моделей и загрузка существующих моделей
	if(stlFiles.length){
		refreshStlFilesList();
	}
	
	// Запуск рендера
	render();
}

// Ререндеринг сцены
function render() {
	renderer.render( scene, camera );
}

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

function addPlane(){
	var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
	var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x = 15;
	plane.position.y = 0;
	plane.position.z = 0;
	scene.add(plane);
}

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
	refreshStlFilesList();
}

// Добавление файла в MainMesh
function addToMainMesh(stlFile){
	var loader = new THREE.STLLoader();
	loader.load(stlFile.url, createNamedMesh(stlFile.name));
}

// Расчет средней точки для MainMesh
function calcCenterPoint(){
	//centerPoint
}

// Создание меша с именем
function createNamedMesh(meshName){
	return function(geometry) {
		var material = new THREE.MeshPhongMaterial({color: 0xFF8243, specular: 0x111111, shininess: 200});
		//geometry.translate( 0, 0, 200 );
		//console.log(geometry.getAttribute('position'));
		//console.log(geometry);
		
		mesh = new THREE.Mesh(geometry, material);
		mesh.name = meshName;
		mesh.rotation.set(-Math.PI/2, 0, Math.PI);
		mesh.position.set(0, 0, 0);
		//mesh.scale.set(0.5, 0.5, 0.5);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		meshesList[meshName] = mesh;
		mainMesh.add(mesh);
		
		//console.log(mesh.geometry.boundingSphere.center.z);
		
		//console.log(mesh.geometry.boundingSphere.center.x);
		//centerPoint.xArray.push(material.geometry.boundingSphere.center.x);
		//centerPoint.yArray.push(material.geometry.boundingSphere.center.y);
		//centerPoint.zArray.push(material.geometry.boundingSphere.center.z);
		
		//mainMesh.rotation.set(0, 0, 0);
		
		//render();
		reCenterModels();
		//scene.add(mesh);
		//getCenters(meshName);
	};
}

function reCenterModels(){
	var editedMesh = scene.getObjectByName('mainMesh');
	console.log(editedMesh);
	
	/*for(var item in editedMesh.children){
		console.log(item);
		//console.log(editedMesh.children[item].geometry);
		//console.log(editedMesh.children[i].geometry);
		//console.log(editedMesh.children[i].geometry.boundingSphere.center.x);
		//editedMesh.children[i].rotation.set(-Math.PI/2, 0, Math.PI);
		//editedMesh.children[i].position.set( 0, 200, 0 );
	}*/
	
	mainMesh.position.set(0, 200, 0);
	render();
}

function refreshModels(){
	centerPoint = {x: 0, y: 0, z: 0, xArray: [], yArray: [], zArray: []};
	meshesList = new Object();
	for(var i=0; i<stlFiles.length; i++){
		addToMainMesh(stlFiles[i]);
	}
}

// Обновление списка добавленых файлов
function refreshStlFilesList(){
	var stlFilesList = document.getElementById('stlFilesList');
	stlFilesList.innerHTML = '';
	for(var i = 0; i<stlFiles.length; i++){
		var li = document.createElement('li');
		var editor = '<span>'+stlFiles[i].name+'</span>'
					+'<a href="#" onclick="setTransparent(this)">Включить прозрачность</a>';
		li.innerHTML = editor;
		stlFilesList.appendChild(li);
	}
	refreshModels();
}

init(); // Иницализация stlViewer