var appContext = {
    gl: null,
    vertexShader: null,
    fragmentShader: null,
    shaderProgram: null,
    vertexBuffer: null,
    indexBuffer: null
}

function start() {
    var canvas = document.getElementById('canvas');
    appContext.gl = initWebGL(canvas);
    initShaders();
    loadGeometry();
    render();
}

function initWebGL(canvas) {
    var gl = null;

    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch(e) {
        console.log(e);
    }

    console.log(gl);

    if(!gl) {
        alert("Navegador no compatible con WebGL");
        gl = null;
    } else {
        gl.clearColor(0.0,  0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    return gl;
}

function initShaders() {
    var gl = appContext.gl;
    var vertexShaderCode = `
        attribute vec3 vertex;
            
        void main(void) {
            gl_Position = vec4(vertex, 1.0);
        }
    `;
    appContext.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(appContext.vertexShader, vertexShaderCode);
    gl.compileShader(appContext.vertexShader);

    var fragmentShaderCode = `
        void main(void) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;
    appContext.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(appContext.fragmentShader, fragmentShaderCode);
    gl.compileShader(appContext.fragmentShader);
    appContext.shaderProgram = gl.createProgram();
    gl.attachShader(appContext.shaderProgram, appContext.vertexShader);
    gl.attachShader(appContext.shaderProgram, appContext.fragmentShader);
    gl.linkProgram(appContext.shaderProgram);
}

function render() {
    var gl = appContext.gl;
    gl.useProgram(appContext.shaderProgram);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, appContext.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, appContext.indexBuffer);
    var vertexLocation = gl.getAttribLocation(appContext.shaderProgram, 'vertex');
    gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLocation);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
}
  
  function loadGeometry() {
    var gl = appContext.gl;
    var vertex = [
         0.0,  0.5, 0.0,
        -0.5, -0.5, 0.0,
         0.5, -0.5, 0.0
    ];
    var index = [0, 1, 2];
    appContext.vertexBuffer = gl.createBuffer();
    appContext.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, appContext.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, appContext.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

start();