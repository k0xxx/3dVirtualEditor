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
	camera.position.set(-75, 75, 75);
	camera.lookAt(scene.position);
	
	// Добавление осей координат (Опционально)
	//var axes = new THREE.AxisHelper( 20 );
	//scene.add(axes);

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( rendererContainer.clientWidth, rendererContainer.clientHeight );
	rendererContainer.appendChild(renderer.domElement);
	renderer.setClearColor(0x423C63, 0);
	
	// Добавление управления
	/*controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.enableZoom = true;*/
	
	controls = new THREE.TrackballControls( camera, rendererContainer );
	controls.rotateSpeed = 4.0;
	controls.zoomSpeed = 4.0;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	//controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );



	//Добавление источников света
	addLight();

	// Добавление основной группы
	mainGroup = new THREE.Group();
	mainGroup.updateMatrixWorld(true);
	scene.add(mainGroup);
	
	// Проверка пред загруженных файлов
	if(stlFiles){
		for(var i=0; i<stlFiles.length; i++){
			addToMainMesh(stlFiles[i]);
		}
	}
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
	controls.update();
};

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

// Добавление файла в MainMesh
function addToMainMesh(stlFile){
	var loader = new THREE.STLLoader();
	loader.load(stlFile.url, createNamedMesh(stlFile.name));
}

// Создание меша с именем
function createNamedMesh(meshName){
	return function(geometry) {
		console.log(geometry);
		
		geometry.computeBoundingSphere();

		var material = new THREE.MeshPhongMaterial({color: 0xFF8243, specular: 0x111111, shininess: 200});
		
		var mesh = new THREE.Mesh(geometry, material);
		mainGroup.add(mesh);

		/*var geometry1 = new THREE.SphereGeometry( 5, 32, 32 );
		var material1 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		var sphere1 = new THREE.Mesh( geometry1, material1 );
		mainGroup.add( sphere1 );*/

		//mesh.rotation.set(-Math.PI/2, 0, Math.PI);
		mesh.name = meshName;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		var stlFilesList = document.getElementById('stlFilesList');
		var li = document.createElement('li');
		li.className = "stlFileItem";
		var editor = '<div class="stlFileControls">'
				+'		<a href="#" data-name="'+meshName+'" data-type="1" onclick="changeOpacity(this); return false;" class="opacity_1 active"></a>'
				+'		<a href="#" data-name="'+meshName+'" data-type="05" onclick="changeOpacity(this); return false;" class="opacity_0_5"></a>'
				+'		<a href="#" data-name="'+meshName+'" data-type="0" onclick="changeOpacity(this); return false;" class="opacity_0"></a>'
				+'	</div>'
				+'	<span class="text_on_dropdown">'+meshName+'</span>'
				+'	<a href="#" data-name="'+meshName+'" data-color="0xff0000" onclick="changeColor(this)">Красный</a>'
				+'	<a href="#" data-name="'+meshName+'" data-color="0xFF8243" onclick="changeColor(this)">Оранжевый</a>'
				+'	<a href="#" data-name="'+meshName+'" data-color="0xff00ff" onclick="changeColor(this)">Розовый</a>'
				+'	<a href="#" data-name="'+meshName+'" onclick="deleteFile(this); return false;"><i class="fa fa-close ml-1"></i></a>';
		li.innerHTML = editor;
		stlFilesList.appendChild(li);

		render();
	};
}

function setTransparent(elName, type){
	var editedObject = mainGroup.getObjectByName(elName);
	switch(type){
		case '1': 
			editedObject.material.transparent = false;
			editedObject.material.opacity = 1;
			editedObject.visible = true;
			break;
		case '05': 
			editedObject.material.transparent = true;
			editedObject.material.opacity = 0.5;
			editedObject.visible = true;
			break;
		case '0': 
			editedObject.visible = false;
			break;
	}
	render();
}

function changeColor(el){
	var element = el.getAttribute('data-name'),
		color = el.getAttribute('data-color');
	
		console.log(color)
	setColor(element, color);
}

function setColor(elName, color){
	var editedObject = mainGroup.getObjectByName(elName);
	editedObject.material.color.setHex( color );
}

function removeElement(elName){
	var selectedObject = mainGroup.getObjectByName(elName);
	mainGroup.remove( selectedObject );
	render();
}

function calcCenter(){
	centerPoint = {x: 0, y: 0, z: 0, xArray: [], yArray: [], zArray: []};
	console.log(mainGroup);
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
	//console.log(centerPoint);
	mainGroup.position.set( centerPoint.x, centerPoint.y, centerPoint.z );
}

// Resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	if(camera && renderer) {
		camera.aspect = rendererContainer.clientWidth / rendererContainer.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(rendererContainer.clientWidth, rendererContainer.clientHeight);
	}
}

// Для добавление откуда угодно вызов следующей функции
//addToMainMesh({url: 'models/low.stl', name: 'low'});