
let canvas;
let detector;
let detectorConfig;
let poses;
let video;
let keypoint;
let score;
let sound_btn = document.getElementById('button');
let skeleton_list = [
  [5,7],
  [7,9],
  [6,8],
  [8,10],
  [5,6],
  [5,11],
  [6,12],
  [11,12],
  [11,13],
  [13,15],
  [12,14],
  [14,16]
];

async function init() {
  detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet, detectorConfig
  );

  await getPoses();
}

async function videoReady() {
  //console.log("video ready");
}

async function getPoses() {
  poses = await detector.estimatePoses(video.elt);
  console.log(poses);
  setTimeout(getPoses, 0);
}

function drawKeypoints()  {
  //if (poses.length > 0) {
  //console.log(poses.length);
    for (let kp of poses[0].keypoints) {
      // キーポイントは、体の一部を表すオブジェクトです（rightArmやleftShoulderなど）
      keypoint = kp;
      //console.log(keypoint);
      // ポーズ確率が0.2より大きい場合のみ楕円を描く
      if (keypoint.score > 0.3) {
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(keypoint.x, keypoint.y, 16);
      }
    }
   //}
  }

  function drawSkeleton() {

    for (let i = 0; i < skeleton_list.length; i++) {
      const p1 = skeleton_list[i][0];
      const p2 = skeleton_list[i][1];

      const x1 = poses[0].keypoints[p1].x;
      const y1 = poses[0].keypoints[p1].y;
      const c1 = poses[0].keypoints[p1].score;
      const x2 = poses[0].keypoints[p2].x;
      const y2 = poses[0].keypoints[p2].y;
      const c2 = poses[0].keypoints[p2].score;

      score = 0.3;

      if ((c1 > score) && (c2 > score)) {
        strokeWeight(3);
        stroke(255, 0, 0);
        line(x1, y1, x2, y2);
      }

    }
}

async function setup() {
  canvas = createCanvas(640, 480);
  video = {
    video: {
            width: 640,
            height: 480,
    },
    audio: false
  };
  video = createCapture(video, videoReady);
  canvas.parent('canvas');
  video.parent('canvas');
  video.hide();
  await init();

  // createButton('pose').mousePressed(getPoses);
}

function draw() {
  /*background(220);*/
  let img = video.get();
  image(img, 0, 0, width, height);
  if (poses && poses.length > 0) {
    drawKeypoints();
    drawSkeleton();
  }
}

if ('speechSynthesis' in window) {

  sound_btn.addEventListener('click', function(){

  // 発言を設定（必須）
  const uttr = new SpeechSynthesisUtterance()

  // テキストを設定 (必須)
  uttr.text = "からだがそりすぎています"

  // 言語を設定
  uttr.lang = "ja-JP"

  // 速度を設定
  uttr.rate = 1

  // 高さを設定
  uttr.pitch = 0.9

  // 音量を設定
  uttr.volume = 2

  // 発言を再生
  window.speechSynthesis.speak(uttr)

  });

} else {
  alert('大変申し訳ありません。このブラウザは音声合成に対応していません。')
}
