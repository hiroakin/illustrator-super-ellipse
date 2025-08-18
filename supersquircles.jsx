// スーパー楕円描画スクリプト（改良版）
// エラーハンドリングとパラメータ検証
function validateInput(value, min, max, defaultValue, name) {
    var num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
        alert(name + 'は' + min + 'から' + max + 'の間の数値を入力してください。\nデフォルト値(' + defaultValue + ')を使用します。');
        return defaultValue;
    }
    return num;
}

// ダイアログでパラメータ入力
var dlg = new Window('dialog', 'スーパー楕円パラメータ入力');
dlg.orientation = 'column';
dlg.alignChildren = ['fill', 'top'];
dlg.preferredSize.width = 450;
dlg.preferredSize.height = 350;

// タイトル
var titleGroup = dlg.add('group');
titleGroup.add('statictext', undefined, 'スーパー楕円のパラメータを設定してください', {multiline: true});

// サイズ設定グループ
var sizeGroup = dlg.add('panel', undefined, 'サイズ設定');
sizeGroup.orientation = 'column';
sizeGroup.alignChildren = ['fill', 'top'];

var widthRow = sizeGroup.add('group');
widthRow.orientation = 'row';
widthRow.alignChildren = ['left', 'center'];
widthRow.add('statictext', undefined, '横幅（width）:');
var widthInput = widthRow.add('edittext', undefined, '200');
widthInput.characters = 8;
widthRow.add('statictext', undefined, 'px');

var heightRow = sizeGroup.add('group');
heightRow.orientation = 'row';
heightRow.alignChildren = ['left', 'center'];
heightRow.add('statictext', undefined, '縦幅（height）:');
var heightInput = heightRow.add('edittext', undefined, '200');
heightInput.characters = 8;
heightRow.add('statictext', undefined, 'px');

// 形状設定グループ
var shapeGroup = dlg.add('panel', undefined, '形状設定');
shapeGroup.orientation = 'column';
shapeGroup.alignChildren = ['fill', 'top'];

var pointRow = shapeGroup.add('group');
pointRow.orientation = 'row';
pointRow.alignChildren = ['left', 'center'];
pointRow.add('statictext', undefined, 'ポイント数:');
var pointInput = pointRow.add('edittext', undefined, '16');
pointInput.characters = 8;
pointRow.add('statictext', undefined, '（8-64推奨）');

var exponentRow = shapeGroup.add('group');
exponentRow.orientation = 'row';
exponentRow.alignChildren = ['left', 'center'];
exponentRow.add('statictext', undefined, '指数（n）:');
var exponentInput = exponentRow.add('edittext', undefined, '2.5');
exponentInput.characters = 8;
exponentRow.add('statictext', undefined, '（0.5-10.0）');

// スタイル設定グループ
var styleGroup = dlg.add('panel', undefined, 'スタイル設定');
styleGroup.orientation = 'column';
styleGroup.alignChildren = ['fill', 'top'];

var strokeRow = styleGroup.add('group');
strokeRow.orientation = 'row';
strokeRow.alignChildren = ['left', 'center'];
strokeRow.add('statictext', undefined, '線幅:');
var strokeInput = strokeRow.add('edittext', undefined, '1');
strokeInput.characters = 8;
strokeRow.add('statictext', undefined, 'px');

var fillCheck = styleGroup.add('checkbox', undefined, '塗りつぶし');
fillCheck.value = false;

// 位置設定グループ
var positionGroup = dlg.add('panel', undefined, '位置設定');
positionGroup.orientation = 'column';
positionGroup.alignChildren = ['fill', 'top'];

var centerCheck = positionGroup.add('checkbox', undefined, 'アートボードの中心に配置');
centerCheck.value = true;

// ボタングループ
var buttonGroup = dlg.add('group');
buttonGroup.orientation = 'row';
buttonGroup.alignChildren = ['center', 'center'];

var okBtn = buttonGroup.add('button', undefined, 'OK');
var cancelBtn = buttonGroup.add('button', undefined, 'キャンセル');

// デフォルトボタン設定
okBtn.active = true;

// ダイアログ表示
if (dlg.show() != 1) {
    // キャンセルされた場合は終了
    exit();
}

// パラメータ取得と検証
var width = validateInput(widthInput.text, 1, 10000, 200, '横幅');
var height = validateInput(heightInput.text, 1, 10000, 200, '縦幅');
var pointCount = Math.round(validateInput(pointInput.text, 4, 100, 16, 'ポイント数'));
var n = validateInput(exponentInput.text, 0.1, 20, 2.5, '指数');
var strokeWidth = validateInput(strokeInput.text, 0, 100, 1, '線幅');
var isFilled = fillCheck.value;
var centerPosition = centerCheck.value;

// ドキュメントチェック
if (!app.documents.length) {
    alert('ドキュメントが開かれていません。');
    exit();
}

var docObj = app.activeDocument;

// スーパー楕円の頂点計算
var anchorpoint = [];
for (var i = 0; i < pointCount; i++) {
    var t = (2 * Math.PI) * (i / pointCount);
    var x = Math.pow(Math.abs(Math.cos(t)), 2 / n) * (width / 2) * sign(Math.cos(t));
    var y = Math.pow(Math.abs(Math.sin(t)), 2 / n) * (height / 2) * sign(Math.sin(t));
    
    // 中心位置に配置する場合
    if (centerPosition) {
        var artboard = docObj.artboards[docObj.artboards.getActiveArtboardIndex()];
        var centerX = artboard.artboardRect[0] + (artboard.artboardRect[2] - artboard.artboardRect[0]) / 2;
        var centerY = artboard.artboardRect[1] + (artboard.artboardRect[3] - artboard.artboardRect[1]) / 2;
        anchorpoint.push([x + centerX, y + centerY]);
    } else {
        anchorpoint.push([x + width / 2, y - height / 2]);
    }
}

// パスオブジェクト作成
var pObj = docObj.pathItems.add();
pObj.setEntirePath(anchorpoint);
pObj.filled = isFilled;
pObj.stroked = true;
pObj.strokeWidth = strokeWidth;
pObj.closed = true;

// 曲線用ハンドルを接線方向で設定（改良版）
for (var i = 0; i < pointCount; i++) {
    var t = (2 * Math.PI) * (i / pointCount);

    // スーパー楕円の接線ベクトル（より正確な計算）
    var cosT = Math.cos(t);
    var sinT = Math.sin(t);
    var absCosT = Math.abs(cosT);
    var absSinT = Math.abs(sinT);
    
    // スーパー楕円の微分
    var dx = -Math.sin(t) * Math.pow(absCosT, 2/n - 1) * sign(cosT);
    var dy = Math.cos(t) * Math.pow(absSinT, 2/n - 1) * sign(sinT);
    
    // ハンドル長の計算（曲率に基づく動的調整）
    var delta = (2 * Math.PI) / pointCount;
    var baseHandleLen = (4 / 3) * Math.tan(delta / 4);
    
    // 曲率に基づくハンドル長の調整
    var curvature = Math.abs(Math.cos(t) * Math.sin(t));
    var adjustedHandleLen = baseHandleLen * (1 + curvature * 0.5);

    // ハンドルの方向ベクトル
    var handleLength = adjustedHandleLen * Math.min(width, height) / 2;
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

// 完了メッセージ
alert('スーパー楕円を作成しました！\n\nパラメータ:\n横幅: ' + width + 'px\n縦幅: ' + height + 'px\nポイント数: ' + pointCount + '\n指数: ' + n);

// 符号関数
function sign(x){
    return ((x > 0) - (x < 0)) || +x;
}