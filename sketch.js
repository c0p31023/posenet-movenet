
let canvas;
let video;
let poseNet;
let keypoint;
let poses = [];
let sound_btn = document.getElementById('button');
function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('canvas');
  video = createCapture(VIDEO);
  video.parent('canvas');
  video.size(width, height);
  // 1つの検出で新しいPoseNetメソッドを作成する
  poseNet = ml5.poseNet(video);
  // これは、グローバル変数 "poses" を満たすイベントを設定するものです
  // 新しいポーズが検出されるたびに，配列で返します
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // video 要素を非表示にして、canvas だけを表示します
  video.hide();

}
/*
function modelReady() {
  select('#status').html('Model Loaded');
}
*/
function draw() {
  image(video, 0, 0, width, height);
  if (poses.length > 0) {
  // 両方の関数を呼び出すことで、すべてのキーポイントとスケルトンを描画することができます
  drawKeypoints();
  drawSkeleton();
  }
}

// 検出されたキーポイントの上に楕円を描画する関数
function drawKeypoints()  {
  //if (poses.length > 0) {
  console.log(poses);
  // 検出されたすべてのポーズをループする
  for (let i = 0; i < poses.length; i++) {
    // 検出された各ポーズに対して、すべてのキーポイントをループする
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // キーポイントは、体の一部を表すオブジェクトです（rightArmやleftShoulderなど）
      keypoint = pose.keypoints[j];
      // ポーズ確率が0.2より大きい場合のみ楕円を描く
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
     }
    }
   //}
  }

// 骨格を描画するための関数
function drawSkeleton() {
    // 検出されたすべてのスケルトンをループする
	for (let i = 0; i < poses.length; i++) {
		let skeleton = poses[i].skeleton;
		// すべてのスケルトンについて、すべてのボディ接続をループする
		for (let j = 0; j < skeleton.length; j++) {
			let partA = skeleton[j][0];
			let partB = skeleton[j][1];
			stroke(255, 0, 0);
			line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
		}
	}
}

if ('speechSynthesis' in window) {

  sound_btn.addEventListener('click', function(){

  // 発言を設定（必須）
  const uttr = new SpeechSynthesisUtterance()

  // テキストを設定 (必須)
  uttr.text = "体が反りすぎています"

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
