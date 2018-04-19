var THREEx	= THREEx	|| {}

THREEx.DayNight	= {}

THREEx.DayNight.baseURL	= '../'

THREEx.DayNight.currentPhase	= function(sunDistance){
	if( sunDistance > 59){
		return 'day'
	}else if( sunDistance > 39 ){
		return 'twilight'
	}else if( sunDistance > 29 ){
		return 'dark'
	}else{
		return 'night'
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Stars																																			//
//////////////////////////////////////////////////////////////////////////////////

/*THREEx.DayNight.Stars	= function(){
	// create the mesh
	var texture	= THREE.ImageUtils.loadTexture(THREEx.DayNight.baseURL+'my-lighting/img/stars.png')
	var material	= new THREE.MeshBasicMaterial({
		map	: texture,
		side	: THREE.BackSide,
 		color	: 0x808080,
	})
	var geometry	= new THREE.SphereGeometry(100, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	this.object3d	= mesh

	this.update	= function(sunDistance){
		var phase	= THREEx.DayNight.currentPhase(sunDistance)
		if( phase === 'day' ){
			mesh.visible	= false
		}else if( phase === 'twilight' ){
			mesh.visible	= false
		} else {
			mesh.visible	= true
			mesh.rotation.y	= sunDistance / 5
	        	var intensity	= Math.abs(Math.sin(sunDistance))
	        	material.color.setRGB(intensity, intensity, intensity)
		}
	}
}*/

//////////////////////////////////////////////////////////////////////////////////
//		Sky																																				//
//////////////////////////////////////////////////////////////////////////////////

THREEx.DayNight.Sky	= function(){
	var geometry	= new THREE.SphereGeometry( 300, 32, 15 );
	var shader	= THREEx.DayNight.Sky.Shader
	var uniforms	= THREE.UniformsUtils.clone(shader.uniforms)
	var material	= new THREE.ShaderMaterial({
		/*For vertex shader if added in later
		vertexShader	: shader.vertexShader,*/
		//Colour the skybox
		fragmentShader	: shader.fragmentShader,
		//Parameters that are passed into the shader program
		uniforms	: uniforms,
		//Render the colour of the inside of the sky sphere
		side		: THREE.BackSide
	});

	var mesh	= new THREE.Mesh( geometry, material );
	this.object3d	= mesh;

	this.update	= function(sunDistance){
		var phase	= THREEx.DayNight.currentPhase(sunDistance);
		if( phase === 'day' ){
			uniforms.skyColor.value.set("rgb(0,120,255)");
			//uniforms.skyColor.value.set("rgb(255,"+ (Math.floor(Math.sin(sunDistance)*200)+55) + "," + (Math.floor(Math.sin(sunDistance)*200)) +")");
		} else if( phase === 'twilight' ){
			uniforms.skyColor.value.set("rgb(255, 69, 0)");
			//uniforms.skyColor.value.set("rgb(0," + (120-Math.floor(Math.sin(sunDistance)*240*-1)) + "," + (255-Math.floor(Math.sin(sunDistance)*510*-1)) +")");
			//uniforms.skyColor.value.set("rgb(" + (255-Math.floor(Math.sin(sunDistance)*510*-1)) + "," + (55-Math.floor(Math.sin(sunDistance)*110*-1)) + ",0)");
		} else if( phase === 'night' ){
			uniforms.skyColor.value.set("rgb(50, 0, 50)");
		} else {
			uniforms.skyColor.value.set('black');
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		GLSL CODE FOR SHADERS																											//
//////////////////////////////////////////////////////////////////////////////////
THREEx.DayNight.Sky.Shader	= {
	//Uniforms: Parameters that can be passed into the program
	uniforms	: {
		skyColor	: { type: "c", value: new THREE.Color()},
	},
	//Can add vertexShader here if added later
	fragmentShader	: [
		'uniform vec3 skyColor;',
		'void main() {',
			//gl_fragColor = vec4( Red, Green, Blue, Alpha)
			'	gl_FragColor = vec4(skyColor, 2.0 );',
		'}',
	].join('\n'),
}
