// Photoshop アートボード一括リネームスクリプト (JavaScript版)
// 作成日: 2025年9月26日
// 説明: アートボードの名前を一括で変更するスクリプト

// メイン関数
function main() {
    // ドキュメントが開いているかチェック
    if (app.documents.length === 0) {
        alert("Photoshopでドキュメントを開いてから実行してください。");
        return;
    }
    
    var doc = app.activeDocument;
    
    // アートボードの存在チェック（簡素化版）
    var artboardCount = 0;
    
    try {
        // 方法1: artboardsプロパティをチェック
        if (doc.artboards && doc.artboards.length > 0) {
            artboardCount = doc.artboards.length;
        } else {
            // 方法2: レイヤー数をチェック（アートボードがある場合、通常は複数のレイヤーが存在）
            if (doc.layers.length > 1) {
                // レイヤーが複数ある場合、アートボードの可能性を仮定
                artboardCount = doc.layers.length;
            } else {
                alert("このドキュメントにはアートボードがありません。\n\nアートボードを作成するには：\n1. レイヤーパネルでレイヤーを右クリック\n2. 'アートボードに変換'を選択\nまたは\n1. 長方形選択ツールで選択範囲を作成\n2. レイヤーパネルで'アートボードに変換'をクリック");
                return;
            }
        }
    } catch (e) {
        alert("アートボードの検出中にエラーが発生しました: " + e.message + "\n\n手動でアートボードが存在することを確認してください。");
        return;
    }
    
    // リネーム方法を選択するダイアログ
    var renameMethod = showRenameMethodDialog();
    if (renameMethod === null) return; // キャンセルされた場合
    
    // 選択された方法に応じて処理
    switch (renameMethod) {
        case "sequential":
            renameSequential(doc, artboardCount);
            break;
        case "custom":
            renameCustom(doc, artboardCount);
            break;
        case "replace":
            renameReplace(doc, artboardCount);
            break;
        case "add":
            renameAdd(doc, artboardCount);
            break;
    }
}

// リネーム方法選択ダイアログ
function showRenameMethodDialog() {
    var dialog = new Window("dialog", "アートボードリネーム方法を選択");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    
    // 説明テキスト
    var infoText = dialog.add("statictext", undefined, "アートボードのリネーム方法を選択してください：");
    infoText.preferredSize.width = 400;
    
    // ラジオボタン
    var radioGroup = dialog.add("panel", undefined, "リネーム方法");
    radioGroup.orientation = "column";
    radioGroup.alignChildren = "left";
    
    var sequentialRadio = radioGroup.add("radiobutton", undefined, "1. 連番でリネーム（例：Artboard 1, Artboard 2...）");
    var customRadio = radioGroup.add("radiobutton", undefined, "2. カスタムプレフィックス + 連番（例：Banner 1, Banner 2...）");
    var replaceRadio = radioGroup.add("radiobutton", undefined, "3. 既存の名前を置換");
    var addRadio = radioGroup.add("radiobutton", undefined, "4. 既存の名前の前後に文字を追加");
    
    // デフォルト選択
    sequentialRadio.value = true;
    
    // ボタン
    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "キャンセル");
    
    var result = null;
    
    okButton.onClick = function() {
        if (sequentialRadio.value) {
            result = "sequential";
        } else if (customRadio.value) {
            result = "custom";
        } else if (replaceRadio.value) {
            result = "replace";
        } else if (addRadio.value) {
            result = "add";
        }
        dialog.close();
    };
    
    cancelButton.onClick = function() {
        result = null;
        dialog.close();
    };
    
    dialog.show();
    return result;
}

// 連番でリネーム
function renameSequential(doc, artboardCount) {
    try {
        var renamedCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                doc.artboards[i].name = "Artboard " + (i + 1);
                renamedCount++;
            }
        } else {
            // 方法2: レイヤーを直接リネーム（安全な方法）
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    doc.layers[i].name = "Artboard " + (i + 1);
                    renamedCount++;
                } catch (e) {
                    // 個別レイヤーのリネームでエラーが発生した場合はスキップ
                }
            }
        }
        
        alert("アートボードを連番でリネームしました。\n変更されたアートボード数: " + renamedCount);
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// カスタムプレフィックスでリネーム
function renameCustom(doc, artboardCount) {
    var dialog = new Window("dialog", "カスタムプレフィックス");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    
    dialog.add("statictext", undefined, "プレフィックスを入力してください：");
    var prefixInput = dialog.add("edittext", undefined, "Banner");
    prefixInput.characters = 20;
    
    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "キャンセル");
    
    var prefix = null;
    
    okButton.onClick = function() {
        prefix = prefixInput.text;
        if (prefix === "") {
            alert("プレフィックスを入力してください。");
            return;
        }
        dialog.close();
    };
    
    cancelButton.onClick = function() {
        prefix = null;
        dialog.close();
    };
    
    dialog.show();
    if (prefix === null) return;
    
    try {
        var renamedCount = 0;
        var artboardIndex = 1;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                doc.artboards[i].name = prefix + " " + (i + 1);
                renamedCount++;
            }
        } else {
            // 方法2: レイヤーを直接リネーム（安全な方法）
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    doc.layers[i].name = prefix + " " + artboardIndex;
                    artboardIndex++;
                    renamedCount++;
                } catch (e) {
                    // 個別レイヤーのリネームでエラーが発生した場合はスキップ
                }
            }
        }
        
        alert("アートボードを「" + prefix + "」プレフィックスでリネームしました。\n変更されたアートボード数: " + renamedCount);
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// 置換でリネーム
function renameReplace(doc, artboardCount) {
    // 検索文字列入力
    var searchDialog = new Window("dialog", "置換設定");
    searchDialog.orientation = "column";
    searchDialog.alignChildren = "fill";
    
    searchDialog.add("statictext", undefined, "検索する文字列：");
    var searchInput = searchDialog.add("edittext", undefined, "");
    searchInput.characters = 20;
    
    var searchButtonGroup = searchDialog.add("group");
    var searchOkButton = searchButtonGroup.add("button", undefined, "次へ");
    var searchCancelButton = searchButtonGroup.add("button", undefined, "キャンセル");
    
    var searchText = null;
    
    searchOkButton.onClick = function() {
        searchText = searchInput.text;
        if (searchText === "") {
            alert("検索する文字列を入力してください。");
            return;
        }
        searchDialog.close();
    };
    
    searchCancelButton.onClick = function() {
        searchText = null;
        searchDialog.close();
    };
    
    searchDialog.show();
    if (searchText === null) return;
    
    // 置換文字列入力
    var replaceDialog = new Window("dialog", "置換設定");
    replaceDialog.orientation = "column";
    replaceDialog.alignChildren = "fill";
    
    replaceDialog.add("statictext", undefined, "置換後の文字列：");
    var replaceInput = replaceDialog.add("edittext", undefined, "");
    replaceInput.characters = 20;
    
    var replaceButtonGroup = replaceDialog.add("group");
    var replaceOkButton = replaceButtonGroup.add("button", undefined, "実行");
    var replaceCancelButton = replaceButtonGroup.add("button", undefined, "キャンセル");
    
    var replaceText = null;
    
    replaceOkButton.onClick = function() {
        replaceText = replaceInput.text;
        replaceDialog.close();
    };
    
    replaceCancelButton.onClick = function() {
        replaceText = null;
        replaceDialog.close();
    };
    
    replaceDialog.show();
    if (replaceText === null) return;
    
    try {
        var changedCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                var oldName = doc.artboards[i].name;
                var newName = oldName.replace(new RegExp(escapeRegExp(searchText), 'g'), replaceText);
                if (oldName !== newName) {
                    doc.artboards[i].name = newName;
                    changedCount++;
                }
            }
        } else {
            // 方法2: レイヤーを直接置換（安全な方法）
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    var oldName = doc.layers[i].name;
                    var newName = oldName.replace(new RegExp(escapeRegExp(searchText), 'g'), replaceText);
                    if (oldName !== newName) {
                        doc.layers[i].name = newName;
                        changedCount++;
                    }
                } catch (e) {
                    // 個別レイヤーの置換でエラーが発生した場合はスキップ
                }
            }
        }
        
        alert("アートボードの名前を置換しました。\n変更されたアートボード数: " + changedCount);
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// 追加でリネーム
function renameAdd(doc, artboardCount) {
    // 追加位置選択
    var positionDialog = new Window("dialog", "追加設定");
    positionDialog.orientation = "column";
    positionDialog.alignChildren = "fill";
    
    positionDialog.add("statictext", undefined, "追加位置を選択してください：");
    
    var positionGroup = positionDialog.add("panel", undefined, "追加位置");
    positionGroup.orientation = "column";
    positionGroup.alignChildren = "left";
    
    var beforeRadio = positionGroup.add("radiobutton", undefined, "前に追加");
    var afterRadio = positionGroup.add("radiobutton", undefined, "後に追加");
    
    beforeRadio.value = true;
    
    var positionButtonGroup = positionDialog.add("group");
    var positionOkButton = positionButtonGroup.add("button", undefined, "次へ");
    var positionCancelButton = positionButtonGroup.add("button", undefined, "キャンセル");
    
    var position = null;
    
    positionOkButton.onClick = function() {
        position = beforeRadio.value ? "before" : "after";
        positionDialog.close();
    };
    
    positionCancelButton.onClick = function() {
        position = null;
        positionDialog.close();
    };
    
    positionDialog.show();
    if (position === null) return;
    
    // 追加文字列入力
    var addDialog = new Window("dialog", "追加文字列");
    addDialog.orientation = "column";
    addDialog.alignChildren = "fill";
    
    addDialog.add("statictext", undefined, "追加する文字列：");
    var addInput = addDialog.add("edittext", undefined, "");
    addInput.characters = 20;
    
    var addButtonGroup = addDialog.add("group");
    var addOkButton = addButtonGroup.add("button", undefined, "実行");
    var addCancelButton = addButtonGroup.add("button", undefined, "キャンセル");
    
    var addText = null;
    
    addOkButton.onClick = function() {
        addText = addInput.text;
        if (addText === "") {
            alert("追加する文字列を入力してください。");
            return;
        }
        addDialog.close();
    };
    
    addCancelButton.onClick = function() {
        addText = null;
        addDialog.close();
    };
    
    addDialog.show();
    if (addText === null) return;
    
    try {
        var renamedCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                if (position === "before") {
                    doc.artboards[i].name = addText + doc.artboards[i].name;
                } else {
                    doc.artboards[i].name = doc.artboards[i].name + addText;
                }
                renamedCount++;
            }
        } else {
            // 方法2: レイヤーを直接追加（安全な方法）
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    if (position === "before") {
                        doc.layers[i].name = addText + doc.layers[i].name;
                    } else {
                        doc.layers[i].name = doc.layers[i].name + addText;
                    }
                    renamedCount++;
                } catch (e) {
                    // 個別レイヤーの追加でエラーが発生した場合はスキップ
                }
            }
        }
        
        var positionText = position === "before" ? "前に" : "後に";
        alert("アートボードの名前に文字列を" + positionText + "追加しました。\n変更されたアートボード数: " + renamedCount);
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// 正規表現の特殊文字をエスケープ
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// スクリプト実行
main();
