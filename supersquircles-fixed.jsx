// 修正版スーパー楕円描画スクリプト
// Illustratorのベジェ曲線に最適化されたバージョン

// ダイアログでパラメータ入力
var dlg = new Window('dialog', 'スーパー楕円作成');
dlg.orientation = 'column';
dlg.alignChildren = ['fill', 'top'];
dlg.preferredSize.width = 350;

dlg.add('statictext', undefined, 'スーパー楕円のパラメータを設定してください');

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

// スーパー楕円の頂点計算
var anchorpoint = [];
var pointCount = 16; // 4の倍数にすることで、4つの象限で対称になる
var radius = size / 2;

// 各象限で4つの点を計算
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

// ベジェ曲線のハンドルを正しく設定
for (var i = 0; i < pointCount; i++) {
    var currentAngle = (2 * Math.PI * i) / pointCount;
    var nextAngle = (2 * Math.PI * ((i + 1) % pointCount)) / pointCount;
    
    // 現在の点でのスーパー楕円の接線方向を計算
    var cosCurrent = Math.cos(currentAngle);
    var sinCurrent = Math.sin(currentAngle);
    
    // スーパー楕円の微分（接線方向）
    var dx, dy;
    if (Math.abs(cosCurrent) < 0.0001) {
        // cos ≈ 0 の場合（上下の点）
        dx = 1;
        dy = 0;
    } else if (Math.abs(sinCurrent) < 0.0001) {
        // sin ≈ 0 の場合（左右の点）
        dx = 0;
        dy = 1;
    } else {
        // 通常の場合
        var cosPower = Math.pow(Math.abs(cosCurrent), 2/n - 1);
        var sinPower = Math.pow(Math.abs(sinCurrent), 2/n - 1);
        
        dx = -sinCurrent * cosPower * sign(cosCurrent);
        dy = cosCurrent * sinPower * sign(sinCurrent);
    }
    
    // ベクトルの正規化
    var length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
        dx = dx / length;
        dy = dy / length;
    }
    
    // ハンドル長の計算（円周の1/3を基準）
    var handleLength = radius * 0.4;
    
    // ハンドル位置の設定
    var outHandle = [
        anchorpoint[i][0] + dx * handleLength,
        anchorpoint[i][1] + dy * handleLength
    ];
    var inHandle = [
        anchorpoint[i][0] - dx * handleLength,
        anchorpoint[i][1] - dy * handleLength
    ];
    
    var pt = pObj.pathPoints[i];
    pt.anchor = anchorpoint[i];
    pt.leftDirection = inHandle;
    pt.rightDirection = outHandle;
    pt.pointType = PointType.SMOOTH;
}

// オブジェクトを選択状態にする
pObj.selected = true;

alert('スーパー楕円を作成しました！\nサイズ: ' + size + 'px\n指数: ' + n);

function sign(x){
    return ((x > 0) - (x < 0)) || +x;
}
