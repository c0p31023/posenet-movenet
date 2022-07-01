
let video;
let poseNet;
let keypoint;
let poses = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      keypoint = pose.keypoints[j];
    }
}
}

//to draw the skeletonsfunction
function drawSkeleton() {
    //Loop through all the skeletons detected
	for (let i = 0; i < poses.length; i++) {
		let skeleton = poses[i].skeleton;
		//For every skeleton, loop through all body connections
		for (let j = 0; j < skeleton.length; j++) {
			let partA = skeleton[j][0];
			let partB = skeleton[j][1];
			stroke(255, 0, 0);
			line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
		}
	}
}

/*

・使用しているライブラリ

　　p5.min.js　：　アーティスト、デザイナー、教育者、初心者、その他誰にとってもコーディングにアクセスしやすく、包括的にすることに重点を置いた、クリエイティブコーディングのためのJavaScriptライブラリ
            p5.min.jsの「min」は軽量化されたファイルであることを示している
	    
 p5.dom.js　：　p5,jsの拡張機能的なライブラリ

　　ml5.min.js　：　アーティストやクリエィティブ・コーダー、学生などの幅広いユーザーが機械学習を親しみやすく触れるられるように作られたライブラリ
             ml5.min.jsの「min」は軽量化されたファイルであることを示している
	     
・関数の呼び出し順（ライブラリから呼び出した関数は一旦考えない）

　　setup()　→　modelReady() → draw() → drawKeypoints() → drawSkeleton()
  
 

*/
