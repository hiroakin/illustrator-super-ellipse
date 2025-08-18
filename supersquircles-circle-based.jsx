// 円形ベースのスーパー楕円描画スクリプト
// Illustratorの標準機能を活用した最も確実な方法

// ダイアログでパラメータ入力
var dlg = new Window('dialog', 'スーパー楕円作成（円形ベース）');
dlg.orientation = 'column';
dlg.alignChildren = ['fill', 'top'];
dlg.preferredSize.width = 350;

dlg.add('statictext', undefined, '円形をベースにしたスーパー楕円を作成します');

var sizeGroup = dlg.add('group');
sizeGroup.orientation = 'row';
sizeGroup.alignChildren = ['left', 'center'];

sizeGroup.add('statictext', undefined, 'サイズ:');
var sizeInput = sizeGroup.add('edittext', undefined, '200');
sizeInput.characters = 8;
sizeGroup.add('statictext', undefined, 'px');

var exponentGroup = dlg.add('group');
exponentGroup.orientation = 'row';
exponentGroup.alignChildren = ['left', 'center'];

exponentGroup.add('statictext', undefined, '指数:');
var exponentInput = exponentGroup.add('edittext', undefined, '2.5');
exponentInput.characters = 8;

var okBtn = dlg.add('button', undefined, 'OK');
var cancelBtn = dlg.add('button', undefined, 'キャンセル');

if (dlg.show() != 1) {
    exit();
}

var size = parseFloat(sizeInput.text) || 200;
var n = parseFloat(exponentInput.text) || 2.5;

// ドキュメントチェック
if (!app.documents.length) {
    alert('ドキュメントが開かれていません。');
    exit();
}

var docObj = app.activeDocument;

// アートボードの中心を取得
var artboard = docObj.artboards[docObj.artboards.getActiveArtboardIndex()];
var centerX = artboard.artboardRect[0] + (artboard.artboardRect[2] - artboard.artboardRect[0]) / 2;
var centerY = artboard.artboardRect[1] + (artboard.artboardRect[3] - artboard.artboardRect[1]) / 2;

// まず完全な円を作成
var circle = docObj.pathItems.ellipse(
    centerY + size/2,  // top
    centerX - size/2,  // left
    size,              // width
    size               // height
);

circle.filled = false;
circle.stroked = true;
circle.strokeWidth = 2;

// 円のパスポイントを取得してスーパー楕円に変換
var pointCount = circle.pathPoints.length;
var anchorpoint = [];

for (var i = 0; i < pointCount; i++) {
    var pt = circle.pathPoints[i];
    var x = pt.anchor[0] - centerX;
    var y = pt.anchor[1] - centerY;
    
    // 現在の角度を計算
    var angle = Math.atan2(y, x);
    var radius = Math.sqrt(x * x + y * y);
    
    // スーパー楕円の新しい半径を計算
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    
    var newRadius = size/2 * Math.pow(Math.abs(cosAngle), 2/n) * Math.pow(Math.abs(sinAngle), 2/n) / 
                   Math.pow(Math.pow(Math.abs(cosAngle), 2/n) + Math.pow(Math.abs(sinAngle), 2/n), 1/n);
    
    // 新しい座標を計算
    var newX = newRadius * Math.cos(angle);
    var newY = newRadius * Math.sin(angle);
    
    anchorpoint.push([newX + centerX, newY + centerY]);
}

// 新しいパスオブジェクトを作成
var pObj = docObj.pathItems.add();
pObj.setEntirePath(anchorpoint);
pObj.filled = false;
pObj.stroked = true;
pObj.strokeWidth = 2;
pObj.closed = true;

// ハンドルを設定（円のハンドルをベースに調整）
for (var i = 0; i < pointCount; i++) {
    var pt = circle.pathPoints[i];
    var newPt = pObj.pathPoints[i];
    
    // 円のハンドルを取得
    var leftHandle = pt.leftDirection;
    var rightHandle = pt.rightDirection;
    
    // ハンドルを中心からの相対位置に変換
    var leftX = leftHandle[0] - centerX;
    var leftY = leftHandle[1] - centerY;
    var rightX = rightHandle[0] - centerX;
    var rightY = rightHandle[1] - centerY;
    
    // スーパー楕円のハンドルに変換
    var leftAngle = Math.atan2(leftY, leftX);
    var rightAngle = Math.atan2(rightY, rightX);
    
    var leftCos = Math.cos(leftAngle);
    var leftSin = Math.sin(leftAngle);
    var rightCos = Math.cos(rightAngle);
    var rightSin = Math.sin(rightAngle);
    
    var leftRadius = size/2 * Math.pow(Math.abs(leftCos), 2/n) * Math.pow(Math.abs(leftSin), 2/n) / 
                    Math.pow(Math.pow(Math.abs(leftCos), 2/n) + Math.pow(Math.abs(leftSin), 2/n), 1/n);
    var rightRadius = size/2 * Math.pow(Math.abs(rightCos), 2/n) * Math.pow(Math.abs(rightSin), 2/n) / 
                     Math.pow(Math.pow(Math.abs(rightCos), 2/n) + Math.pow(Math.abs(rightSin), 2/n), 1/n);
    
    var newLeftX = leftRadius * Math.cos(leftAngle) + centerX;
    var newLeftY = leftRadius * Math.sin(leftAngle) + centerY;
    var newRightX = rightRadius * Math.cos(rightAngle) + centerX;
    var newRightY = rightRadius * Math.sin(rightAngle) + centerY;
    
    newPt.anchor = anchorpoint[i];
    newPt.leftDirection = [newLeftX, newLeftY];
    newPt.rightDirection = [newRightX, newRightY];
    newPt.pointType = PointType.SMOOTH;
}

// 元の円を削除
circle.remove();

// 新しいオブジェクトを選択
pObj.selected = true;

alert('スーパー楕円を作成しました！\nサイズ: ' + size + 'px\n指数: ' + n);
