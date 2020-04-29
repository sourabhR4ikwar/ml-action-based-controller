// var keyLeft = false;
// var keyRight = false;
// var keyFaster = false;
// var keySlower = false;

let webCam;
let mobilenet;
let mobilenet2;
let steerPredictor;
let accelerateClassifier;
let steerSlider;
let feedAccelerateButton;
let feedBrakeButton;
let trainButton;
let saveButton;
let labelContainer = document.getElementById('label');
let label = "Loading Model...";
let controls = {
    steer: 0,
    accelerate: 'brake'
}

function toggler(el) {
    el.parentNode.classList.toggle('open');
}

function modelReady(){
    console.log('Model Ready');
}

function model2Ready() {
    console.log('Model 2 Ready');
    label = "Models are Ready";
}

function steerPredictorReady(){
    console.log('Steer Predictor Ready.');
}

function accelerateClassifierReady(){
    console.log('Accelerate Classifier Ready');
}

function gotSteerResults(err, result){
    if(err){
        console.log(err);
    }
    else {
        controls.steer = result.value.toFixed(2);
        steerSlider.value = controls.steer;
        if(+controls.steer >= 0.4 && +controls.steer <= 0.6){
            keyLeft = false;
            keyRight = false;
        }
        else if(+controls.steer < 0.4 ){
            keyLeft = true;
            keyRight = false;
        }else {
            keyRight = true;
            keyLeft = false;
        }
        label = controls.steer + ' ' + controls.accelerate;
    }
}

function gotAccelerateResults(err, result){
    if (err){
        console.log(err);
    }
    else {
        controls.accelerate = result[0].label;
        if(controls.accelerate == 'brake'){
            keyFaster = false;
            keySlower = true;
        }else{
            keyFaster = true;
            keySlower = false;
        }
        label = controls.steer + ' ' + controls.accelerate;
    }
}

function whileAccelerateTraining(loss){
    if(loss== null){
        console.log("Accelerator Training Complete");
        setInterval(function(){
            accelerateClassifier.classify(gotAccelerateResults);
        },1000/60);
        setInterval(function () {
            steerPredictor.predict(gotSteerResults);
        }, 1000 / 60);
    }else{
        console.log("Trainig Accelerator");
    }
}

function whileSteerTraining(loss){
    if(loss == null){
        console.log("Steer Training Completed");
        accelerateClassifier.train(whileAccelerateTraining);
    }
    else{
        console.log("Trainig Steer");
    }
}


// function setup(){
//     createCanvas(320,240);
//     webCam = createCapture(VIDEO);
//     webCam.hide();
//     mobilenet = ml5.featureExtractor('MobileNet', modelReady);
//     mobilenet2 = ml5.featureExtractor('MobileNet', model2Ready);
//     label = "Loading Model..."
//     steerPredictor = mobilenet.regression(webCam, steerPredictorReady);
//     accelerateClassifier = mobilenet2.classification(webCam, accelerateClassifierReady);
//     steerSlider = createSlider(0,1,0.5,0.01);
//     feedAccelerateButton = createButton('Feed Accelerate');
//     feedBrakeButton = createButton('Feed Brake');
//     trainButton = createButton('Train Model');
//     feedAccelerateButton.mousePressed(function(){
//         steerPredictor.addImage(steerSlider.value());
//         accelerateClassifier.addImage('accelerate');
//     });
//     feedBrakeButton.mousePressed(function () {
//         // steerPredictor.addImage(steerSlider.value());
//         accelerateClassifier.addImage('brake');
//     });
//     trainButton.mousePressed(function(){
//         steerPredictor.train(whileSteerTraining);
//     });
//     steerSlider.hide();
//     feedAccelerateButton.hide();
//     feedBrakeButton.hide();
//     trainButton.hide();
// }

function draw() {
    labelContainer.innerText = label;
}

function setup(){
    webCam = document.getElementById('webCam');
    steerSlider = document.getElementById('steerSlider');
    feedAccelerateButton = document.getElementById('accelerateBtn');
    feedBrakeButton = document.getElementById('brakeBtn');
    trainButton = document.getElementById('trainBtn');
    saveButton = document.getElementById('saveBtn');
    let constraints = {
        audio: false,
        video: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        window.stream = stream;
        webCam.srcObject = stream;
        webCam.play();
        mobilenet = ml5.featureExtractor('MobileNet', modelReady);
        mobilenet2 = ml5.featureExtractor('MobileNet', model2Ready);
        steerPredictor = mobilenet.regression(webCam, steerPredictorReady);
        accelerateClassifier = mobilenet2.classification(webCam, accelerateClassifierReady);
    })
    .catch(err => console.log(err));
    feedAccelerateButton.addEventListener('click', function () {
        steerPredictor.addImage(steerSlider.value);
        accelerateClassifier.addImage('accelerate');
    });
    feedBrakeButton.addEventListener('click', function () {
        // steerPredictor.addImage(steerSlider.value());
        accelerateClassifier.addImage('brake');
    });
    trainButton.addEventListener('click', function () {
        steerPredictor.train(whileSteerTraining);
    });
    saveButton.addEventListener('click', function () {
    });
    setInterval(draw, 33);
}

setup();

// function draw(){
//     background(0);
//     push();
//     translate(width, 0);
//     scale(-1, 1);
//     image(webCam, 0, 0, 320, 260);
//     pop();
//     rectMode(CENTER);
//     fill(255, 0, 200);
//     rect(controls.steer * width, height/2, 50,50);
//     fill(255);
//     textSize(16);
//     text(label, 10, height-10);
// }