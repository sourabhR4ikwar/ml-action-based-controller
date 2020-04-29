let video;
let mobilenet;
let predictor;
let slider;
let addButton;
let trainButton;
let value = 'test';


function modelReady(){
    console.log('Model is Ready');
}

function videoReady(){
    console.log("video is ready");
}

function whileTraining(loss){
    if(loss == null){
        console.log('Training Complete');
        predictor.predict(gotResults);
    }
    else {
        console.log(loss);
    }
}

function gotResults(err, result){
    if(err){
        console.error(err);
    }
    else{
        value = result.value;
        predictor.predict(gotResults);
    }
}

function setup(){
    createCanvas(320,270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    predictor = mobilenet.regression(video, videoReady);
    slider = createSlider(0, 1, 0.5, 0.01);
    addButton = createButton('add Example');
    addButton.mousePressed(function(){
        predictor.addImage(slider.value());
    });

    trainButton = createButton("train");
    trainButton.mousePressed(function(){
        predictor.train(whileTraining);
    });

}

function draw(){
    background(0)
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, 320, 240);
    pop();
    rectMode(CENTER);
    fill(255, 0, 200);
    rect(value * width, height / 2, 50, 50);
    fill(255)
    textSize(16);
    text(value, 10, height-10);
}