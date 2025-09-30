// Photoshop アートボード一括リネームスクリプト (JavaScript版 - 高度な機能)
// 作成日: 2025年9月26日
// 説明: アートボードの名前を一括で変更するスクリプト（高度な機能付き）

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
    
    // 高度なリネーム方法を選択するダイアログ
    var renameMethod = showAdvancedRenameMethodDialog();
    if (renameMethod === null) return; // キャンセルされた場合
    
    // 選択された方法に応じて処理
    switch (renameMethod) {
        case "sequential":
            renameSequentialAdvanced(doc, artboardCount);
            break;
        case "custom":
            renameCustomAdvanced(doc, artboardCount);
            break;
        case "replace":
            renameReplaceAdvanced(doc, artboardCount);
            break;
        case "add":
            renameAddAdvanced(doc, artboardCount);
            break;
        case "pattern":
            renamePattern(doc, artboardCount);
            break;
        case "size":
            renameBySize(doc, artboardCount);
            break;
        case "aspect":
            renameByAspectRatio(doc, artboardCount);
            break;
    }
}

// 高度なリネーム方法選択ダイアログ
function showAdvancedRenameMethodDialog() {
    var dialog = new Window("dialog", "アートボードリネーム方法を選択（高度な機能）");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    dialog.preferredSize.width = 500;
    
    // 説明テキスト
    var infoText = dialog.add("statictext", undefined, "アートボードのリネーム方法を選択してください：");
    infoText.preferredSize.width = 480;
    
    // ラジオボタン
    var radioGroup = dialog.add("panel", undefined, "リネーム方法");
    radioGroup.orientation = "column";
    radioGroup.alignChildren = "left";
    
    var sequentialRadio = radioGroup.add("radiobutton", undefined, "1. 連番でリネーム（例：Artboard 1, Artboard 2...）");
    var customRadio = radioGroup.add("radiobutton", undefined, "2. カスタムプレフィックス + 連番（例：Banner 1, Banner 2...）");
    var replaceRadio = radioGroup.add("radiobutton", undefined, "3. 既存の名前を置換");
    var addRadio = radioGroup.add("radiobutton", undefined, "4. 既存の名前の前後に文字を追加");
    var patternRadio = radioGroup.add("radiobutton", undefined, "5. パターンマッチング（正規表現対応）");
    var sizeRadio = radioGroup.add("radiobutton", undefined, "6. サイズに基づいてリネーム（例：Mobile, Tablet, Desktop）");
    var aspectRadio = radioGroup.add("radiobutton", undefined, "7. 縦横比に基づいてリネーム（例：9-16, 16-9, 1-1）");
    
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
        } else if (patternRadio.value) {
            result = "pattern";
        } else if (sizeRadio.value) {
            result = "size";
        } else if (aspectRadio.value) {
            result = "aspect";
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

// 連番でリネーム（高度版）
function renameSequentialAdvanced(doc, artboardCount) {
    var dialog = new Window("dialog", "連番リネーム設定");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    
    dialog.add("statictext", undefined, "連番リネームの設定：");
    
    var prefixGroup = dialog.add("group");
    prefixGroup.add("statictext", undefined, "プレフィックス:");
    var prefixInput = prefixGroup.add("edittext", undefined, "Artboard");
    prefixInput.characters = 15;
    
    var startGroup = dialog.add("group");
    startGroup.add("statictext", undefined, "開始番号:");
    var startInput = startGroup.add("edittext", undefined, "1");
    startInput.characters = 5;
    
    var paddingGroup = dialog.add("group");
    paddingGroup.add("statictext", undefined, "ゼロパディング:");
    var paddingInput = paddingGroup.add("edittext", undefined, "0");
    paddingInput.characters = 5;
    
    var separatorGroup = dialog.add("group");
    separatorGroup.add("statictext", undefined, "区切り文字:");
    var separatorInput = separatorGroup.add("edittext", undefined, " ");
    separatorInput.characters = 5;
    
    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "キャンセル");
    
    var settings = null;
    
    okButton.onClick = function() {
        var prefix = prefixInput.text || "Artboard";
        var startNum = parseInt(startInput.text) || 1;
        var padding = parseInt(paddingInput.text) || 0;
        var separator = separatorInput.text || " ";
        
        settings = {
            prefix: prefix,
            startNum: startNum,
            padding: padding,
            separator: separator
        };
        dialog.close();
    };
    
    cancelButton.onClick = function() {
        settings = null;
        dialog.close();
    };
    
    dialog.show();
    if (settings === null) return;
    
    try {
        var renamedCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                var num = settings.startNum + i;
                var numStr = settings.padding > 0 ? 
                    padNumber(num, settings.padding) : 
                    num.toString();
                doc.artboards[i].name = settings.prefix + settings.separator + numStr;
                renamedCount++;
            }
        } else {
            // 方法2: レイヤーを直接リネーム（安全な方法）
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    var num = settings.startNum + i;
                    var numStr = settings.padding > 0 ? 
                        padNumber(num, settings.padding) : 
                        num.toString();
                    doc.layers[i].name = settings.prefix + settings.separator + numStr;
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

// パターンマッチングでリネーム
function renamePattern(doc, artboardCount) {
    var dialog = new Window("dialog", "パターンマッチング設定");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    dialog.preferredSize.width = 400;
    
    dialog.add("statictext", undefined, "正規表現を使用したパターンマッチング：");
    
    var patternGroup = dialog.add("group");
    patternGroup.orientation = "column";
    patternGroup.add("statictext", undefined, "検索パターン（正規表現）:");
    var patternInput = patternGroup.add("edittext", undefined, "");
    patternInput.characters = 30;
    
    var replaceGroup = dialog.add("group");
    replaceGroup.orientation = "column";
    replaceGroup.add("statictext", undefined, "置換パターン:");
    var replaceInput = replaceGroup.add("edittext", undefined, "");
    replaceInput.characters = 30;
    
    var caseCheck = dialog.add("checkbox", undefined, "大文字小文字を区別しない");
    caseCheck.value = false;
    
    var previewButton = dialog.add("button", undefined, "プレビュー");
    var okButton = dialog.add("button", undefined, "実行");
    var cancelButton = dialog.add("button", undefined, "キャンセル");
    
    previewButton.onClick = function() {
        var pattern = patternInput.text;
        var replace = replaceInput.text;
        var caseInsensitive = caseCheck.value;
        
        if (pattern === "") {
            alert("検索パターンを入力してください。");
            return;
        }
        
        var preview = "プレビュー:\n";
        var previewCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < Math.min(doc.artboards.length, 5); i++) {
                var oldName = doc.artboards[i].name;
                var newName = replacePattern(oldName, pattern, replace, caseInsensitive);
                preview += oldName + " → " + newName + "\n";
                previewCount++;
            }
            if (doc.artboards.length > 5) {
                preview += "... 他 " + (doc.artboards.length - 5) + " 個";
            }
        } else {
            // 方法2: レイヤーからプレビュー
            for (var i = 0; i < Math.min(doc.layers.length, 5); i++) {
                try {
                    var oldName = doc.layers[i].name;
                    var newName = replacePattern(oldName, pattern, replace, caseInsensitive);
                    preview += oldName + " → " + newName + "\n";
                    previewCount++;
                } catch (e) {
                    // 個別レイヤーのプレビューでエラーが発生した場合はスキップ
                }
            }
            if (doc.layers.length > 5) {
                preview += "... 他 " + (doc.layers.length - 5) + " 個";
            }
        }
        alert(preview);
    };
    
    var settings = null;
    
    okButton.onClick = function() {
        var pattern = patternInput.text;
        var replace = replaceInput.text;
        var caseInsensitive = caseCheck.value;
        
        if (pattern === "") {
            alert("検索パターンを入力してください。");
            return;
        }
        
        settings = {
            pattern: pattern,
            replace: replace,
            caseInsensitive: caseInsensitive
        };
        dialog.close();
    };
    
    cancelButton.onClick = function() {
        settings = null;
        dialog.close();
    };
    
    dialog.show();
    if (settings === null) return;
    
    try {
        var changedCount = 0;
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                var oldName = doc.artboards[i].name;
                var newName = replacePattern(oldName, settings.pattern, settings.replace, settings.caseInsensitive);
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
                    var newName = replacePattern(oldName, settings.pattern, settings.replace, settings.caseInsensitive);
                    if (oldName !== newName) {
                        doc.layers[i].name = newName;
                        changedCount++;
                    }
                } catch (e) {
                    // 個別レイヤーの置換でエラーが発生した場合はスキップ
                }
            }
        }
        
        alert("パターンマッチングでリネームしました。\n変更されたアートボード数: " + changedCount);
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// サイズに基づいてリネーム
function renameBySize(doc, artboardCount) {
    try {
        var sizeCategories = [];
        
        // 方法1: artboardsプロパティを使用
        if (doc.artboards && doc.artboards.length > 0) {
            for (var i = 0; i < doc.artboards.length; i++) {
                try {
                    var artboard = doc.artboards[i];
                    var bounds = artboard.artboardRect;
                    var width = Math.abs(bounds[2] - bounds[0]);
                    var height = Math.abs(bounds[3] - bounds[1]);
                    var category = getSizeCategory(width, height);
                    sizeCategories.push(category);
                } catch (e) {
                    // 個別アートボードのサイズ取得でエラーが発生した場合はスキップ
                    sizeCategories.push("Unknown");
                }
            }
        } else {
            // 方法2: レイヤーからサイズを取得
            for (var i = 0; i < doc.layers.length; i++) {
                try {
                    var layer = doc.layers[i];
                    var bounds = layer.bounds;
                    var width = Math.abs(bounds[2] - bounds[0]);
                    var height = Math.abs(bounds[3] - bounds[1]);
                    var category = getSizeCategory(width, height);
                    sizeCategories.push(category);
                } catch (e) {
                    // 個別レイヤーのサイズ取得でエラーが発生した場合はスキップ
                    sizeCategories.push("Unknown");
                }
            }
        }
        
        // サイズカテゴリの統計を表示
        var stats = getSizeStats(sizeCategories);
        var message = "サイズ分析結果:\n";
        for (var category in stats) {
            message += category + ": " + stats[category] + "個\n";
        }
        message += "\nこの分類でリネームしますか？";
        
        if (confirm(message)) {
            var renamedCount = 0;
            
            // 方法1: artboardsプロパティを使用
            if (doc.artboards && doc.artboards.length > 0) {
                for (var i = 0; i < doc.artboards.length; i++) {
                    try {
                        var category = sizeCategories[i];
                        var count = getCategoryCount(sizeCategories, category, i);
                        doc.artboards[i].name = category + " " + count;
                        renamedCount++;
                    } catch (e) {
                        // 個別アートボードのリネームでエラーが発生した場合はスキップ
                    }
                }
            } else {
                // 方法2: レイヤーを直接リネーム
                for (var i = 0; i < doc.layers.length; i++) {
                    try {
                        var category = sizeCategories[i];
                        var count = getCategoryCount(sizeCategories, category, i);
                        doc.layers[i].name = category + " " + count;
                        renamedCount++;
                    } catch (e) {
                        // 個別レイヤーのリネームでエラーが発生した場合はスキップ
                    }
                }
            }
            
            alert("サイズに基づいてリネームしました。\n変更されたアートボード数: " + renamedCount);
        }
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// 縦横比に基づいてリネーム
function renameByAspectRatio(doc, artboardCount) {
    try {
        var aspectCategories = [];
        
        // アートボードのサイズを取得（レイヤーの境界ではなく、アートボード自体のサイズ）
        for (var i = 0; i < doc.layers.length; i++) {
            try {
                var layer = doc.layers[i];
                var width, height;
                
                // アートボードのサイズを取得する方法を試す
                if (layer.artboardRect) {
                    // アートボードのサイズを直接取得
                    var bounds = layer.artboardRect;
                    width = Math.abs(bounds[2] - bounds[0]);
                    height = Math.abs(bounds[3] - bounds[1]);
                } else {
                    // アートボードのサイズが取得できない場合は、レイヤーの境界を使用
                    var bounds = layer.bounds;
                    width = Math.abs(bounds[2] - bounds[0]);
                    height = Math.abs(bounds[3] - bounds[1]);
                }
                
                var category = getAspectRatioCategory(width, height);
                aspectCategories.push(category);
            } catch (e) {
                // 個別レイヤーの縦横比取得でエラーが発生した場合はスキップ
                aspectCategories.push("Unknown");
            }
        }
        
        // 縦横比カテゴリの統計を表示
        var stats = getSizeStats(aspectCategories);
        var message = "縦横比分析結果:\n";
        for (var category in stats) {
            message += category + ": " + stats[category] + "個\n";
        }
        message += "\nこの分類でリネームしますか？";
        
        if (confirm(message)) {
            var renamedCount = 0;
            
            // 方法1: artboardsプロパティを使用
            if (doc.artboards && doc.artboards.length > 0) {
                for (var i = 0; i < doc.artboards.length; i++) {
                    try {
                        var category = aspectCategories[i];
                        var count = getCategoryCount(aspectCategories, category, i);
                        doc.artboards[i].name = category + " " + count;
                        renamedCount++;
                    } catch (e) {
                        // 個別アートボードのリネームでエラーが発生した場合はスキップ
                    }
                }
            } else {
                // 方法2: レイヤーを直接リネーム
                for (var i = 0; i < doc.layers.length; i++) {
                    try {
                        var category = aspectCategories[i];
                        var count = getCategoryCount(aspectCategories, category, i);
                        doc.layers[i].name = category + " " + count;
                        renamedCount++;
                    } catch (e) {
                        // 個別レイヤーのリネームでエラーが発生した場合はスキップ
                    }
                }
            }
            
            alert("縦横比に基づいてリネームしました。\n変更されたアートボード数: " + renamedCount);
        }
    } catch (e) {
        alert("エラーが発生しました: " + e.message);
    }
}

// ユーティリティ関数
function padNumber(num, padding) {
    var str = num.toString();
    while (str.length < padding) {
        str = "0" + str;
    }
    return str;
}

function replacePattern(text, pattern, replace, caseInsensitive) {
    var flags = "g";
    if (caseInsensitive) flags += "i";
    var regex = new RegExp(pattern, flags);
    return text.replace(regex, replace);
}

function getSizeCategory(width, height) {
    var area = width * height;
    if (area < 100000) return "Small";
    if (area < 500000) return "Medium";
    if (area < 1000000) return "Large";
    return "XLarge";
}

function getAspectRatioCategory(width, height) {
    // 縦横比を計算
    var ratio = width / height;
    
    // 一般的な縦横比とその許容誤差
    var commonRatios = [
        { ratio: 1.0, name: "1-1", tolerance: 0.05 },      // 正方形
        { ratio: 0.75, name: "3-4", tolerance: 0.05 },     // 3:4
        { ratio: 1.333, name: "4-3", tolerance: 0.05 },    // 4:3
        { ratio: 0.5625, name: "9-16", tolerance: 0.05 },  // 9:16 (スマホ縦)
        { ratio: 1.778, name: "16-9", tolerance: 0.05 },   // 16:9 (スマホ横)
        { ratio: 0.5, name: "1-2", tolerance: 0.05 },      // 1:2
        { ratio: 2.0, name: "2-1", tolerance: 0.05 },      // 2:1
        { ratio: 0.6, name: "3-5", tolerance: 0.05 },      // 3:5
        { ratio: 1.667, name: "5-3", tolerance: 0.05 },    // 5:3
        { ratio: 0.667, name: "2-3", tolerance: 0.05 },    // 2:3
        { ratio: 1.5, name: "3-2", tolerance: 0.05 },      // 3:2
        { ratio: 0.8, name: "4-5", tolerance: 0.05 },      // 4:5
        { ratio: 1.25, name: "5-4", tolerance: 0.05 },     // 5:4
        { ratio: 0.333, name: "1-3", tolerance: 0.05 },    // 1:3
        { ratio: 3.0, name: "3-1", tolerance: 0.05 }       // 3:1
    ];
    
    // 最も近い一般的な縦横比を見つける
    var bestMatch = null;
    var minDifference = Infinity;
    
    for (var i = 0; i < commonRatios.length; i++) {
        var difference = Math.abs(ratio - commonRatios[i].ratio);
        if (difference < minDifference && difference <= commonRatios[i].tolerance) {
            minDifference = difference;
            bestMatch = commonRatios[i];
        }
    }
    
    // マッチする一般的な縦横比がある場合はそれを使用
    if (bestMatch) {
        return bestMatch.name;
    }
    
    // マッチしない場合は、簡略化された比率を計算
    // 最大公約数を求める関数（より安全な実装）
    function gcd(a, b) {
        a = Math.round(a);
        b = Math.round(b);
        while (b !== 0) {
            var temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    // 縦横比を最も簡単な整数比に変換
    var divisor = gcd(width, height);
    var ratioWidth = Math.round(width / divisor);
    var ratioHeight = Math.round(height / divisor);
    
    // 比率が大きすぎる場合は制限
    if (ratioWidth > 20 || ratioHeight > 20) {
        // 比率を制限して簡略化
        var maxRatio = Math.max(ratioWidth, ratioHeight);
        var scale = maxRatio > 20 ? 20 / maxRatio : 1;
        ratioWidth = Math.round(ratioWidth * scale);
        ratioHeight = Math.round(ratioHeight * scale);
    }
    
    return ratioWidth + "-" + ratioHeight;
}

function getSizeStats(categories) {
    var stats = {};
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        stats[category] = (stats[category] || 0) + 1;
    }
    return stats;
}

function getCategoryCount(categories, category, currentIndex) {
    var count = 1;
    for (var i = 0; i < currentIndex; i++) {
        if (categories[i] === category) count++;
    }
    return count;
}


// 基本的なリネーム関数（簡略版）
function renameCustomAdvanced(doc, artboardCount) {
    // 簡略化された実装
    renameCustom(doc, artboardCount);
}

function renameReplaceAdvanced(doc, artboardCount) {
    // 簡略化された実装
    renameReplace(doc, artboardCount);
}

function renameAddAdvanced(doc, artboardCount) {
    // 簡略化された実装
    renameAdd(doc, artboardCount);
}

// 基本的なリネーム関数（前のファイルから移植）
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
                    doc.layers[i].name = prefix + " " + (i + 1);
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

function renameReplace(doc, artboardCount) {
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

function renameAdd(doc, artboardCount) {
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

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// スクリプト実行
main();
