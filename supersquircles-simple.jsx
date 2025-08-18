// シンプルなスーパー楕円描画スクリプト（テスト用）
// 基本的なパラメータのみで確実に動作するバージョン

// ダイアログでパラメータ入力
var dlg = new Window('dialog', 'シンプルスーパー楕円');
dlg.orientation = 'column';
dlg.alignChildren = ['fill', 'top'];
dlg.preferredSize.width = 300;

dlg.add('statictext', undefined, 'シンプルなスーパー楕円を作成します');

var sizeGroup = dlg.add('group');
sizeGroup.orientation = 'row';
sizeGroup.alignChildren = ['left', 'center'];

sizeGroup.add('statictext', undefined, 'サイズ:');
var sizeInput = sizeGroup.add('edittext', undefined, '200');
sizeInput.characters = 8;

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

// スーパー楕円の頂点計算（シンプル版）
var anchorpoint = [];
var pointCount = 32;
var radius = size / 2;

for (var i = 0; i < pointCount; i++) {
    var angle = (2 * Math.PI * i) / pointCount;
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    
    // スーパー楕円の計算
    var x = radius * Math.pow(Math.abs(cosAngle), 2/n) * sign(cosAngle);
    var y = radius * Math.pow(Math.abs(sinAngle), 2/n) * sign(sinAngle);
    
    anchorpoint.push([x + centerX, y + centerY]);
}

// パスオブジェクト作成
var pObj = docObj.pathItems.add();
pObj.setEntirePath(anchorpoint);
pObj.filled = false;
pObj.stroked = true;
pObj.strokeWidth = 2;
pObj.closed = true;

// ハンドルを設定（シンプルな方法）
for (var i = 0; i < pointCount; i++) {
    var angle = (2 * Math.PI * i) / pointCount;
    var tangentAngle = angle + Math.PI / 2;
    
    var handleLength = radius * 0.3;
    var tangentX = Math.cos(tangentAngle) * handleLength;
    var tangentY = Math.sin(tangentAngle) * handleLength;
    
    var pt = pObj.pathPoints[i];
    pt.anchor = anchorpoint[i];
    pt.leftDirection = [anchorpoint[i][0] - tangentX, anchorpoint[i][1] - tangentY];
    pt.rightDirection = [anchorpoint[i][0] + tangentX, anchorpoint[i][1] + tangentY];
    pt.pointType = PointType.SMOOTH;
}

pObj.selected = true;
alert('シンプルスーパー楕円を作成しました！\nサイズ: ' + size + 'px\n指数: ' + n);

function sign(x){
    return ((x > 0) - (x < 0)) || +x;
}
