on run {input, parameters}
	-- Photoshopを起動
	tell application "Adobe Photoshop 2025"
		launch
		activate
		
		-- 新規ドキュメントを作成
		make new document with properties {name:"Artboard Layout", width:2000, height:2000, resolution:72}
		
		-- 各ファイルを処理
		set currentX to 0
		set currentY to 0
		set processedFiles to {}
		set fileIndex to 0
		
		repeat with filePath in input
			if (filePath as string) ends with ".png" then
				set fileIndex to fileIndex + 1
				
				-- 重複チェック
				if filePath is not in processedFiles then
					try
						-- ファイル名を取得（拡張子なし）
						set fileName to do shell script "basename " & quoted form of POSIX path of filePath & " .png"
						
						-- ファイルを開く
						open filePath
						
						-- 開いたPNGファイル（最新のドキュメント）をアクティブにする
						set current document to document (count of documents)
						
						-- PNGファイルの元のサイズを取得
						set pngWidth to width of current document
						set pngHeight to height of current document
						
						-- 背景レイヤーを通常のレイヤーに変換（レイヤー名を設定）
						set name of layer 1 of current document to fileName
						
						-- 全選択してコピー
						select all
						copy
						
						-- メインドキュメント（document 1）に戻る
						set current document to document 1
						
						-- PNGファイルの元のサイズを使用してアートボードを作成
						do javascript "
							var desc6 = new ActionDescriptor();
							var ref1 = new ActionReference();
							ref1.putClass(stringIDToTypeID('artboardSection'));
							desc6.putReference(charIDToTypeID('null'), ref1);
							var desc7 = new ActionDescriptor();
							desc7.putString(charIDToTypeID('Nm  '), '" & fileName & "');
							desc6.putObject(charIDToTypeID('Usng'), stringIDToTypeID('artboardSection'), desc7);
							var desc8 = new ActionDescriptor();
							desc8.putDouble(charIDToTypeID('Top '), " & currentY & ");
							desc8.putDouble(charIDToTypeID('Left'), " & currentX & ");
							desc8.putDouble(charIDToTypeID('Btom'), " & (currentY + pngHeight) & ");
							desc8.putDouble(charIDToTypeID('Rght'), " & (currentX + pngWidth) & ");
							desc6.putObject(stringIDToTypeID('artboardRect'), stringIDToTypeID('classFloatRect'), desc8);
							executeAction(charIDToTypeID('Mk  '), desc6, DialogModes.NO);
						"
						
						-- 現在のレイヤー数を記録
						set beforePasteCount to count of layers of current document
						
						-- ペースト
						paste
						
						-- ペースト後のレイヤー数を確認
						set afterPasteCount to count of layers of current document
						
						-- ペーストされたレイヤーを取得（最新のレイヤー）
						set pastedLayer to layer 1 of current document
						
						-- レイヤー名をファイル名に設定
						set name of pastedLayer to fileName
						
						-- 次の位置を計算
						set currentX to currentX + pngWidth + 50
						
						-- 処理済みファイルリストに追加
						set end of processedFiles to filePath
						
						-- 開いたPNGファイルを閉じる
						set current document to document (count of documents)
						close current document saving no
						
						-- メインドキュメント（document 1）に戻る
						set current document to document 1
						
					on error errMsg
						display dialog "=== ファイル " & fileIndex & " エラー ===" & return & "ファイル: " & (filePath as string) & return & "エラー: " & errMsg buttons {"続行"}
					end try
				else
					display dialog "警告: ファイル " & (filePath as string) & " は既に処理済みです。" buttons {"続行"}
				end if
			end if
		end repeat
		
		-- 最終結果を表示
		set finalLayerCount to count of layers of current document
		set processedCount to count of processedFiles
		display dialog "=== 最終結果 ===" & return & "処理したファイル数: " & processedCount & return & "総ファイル数: " & fileIndex & return & "レイヤー数: " & finalLayerCount & return & "各ファイルに対応するアートボードが作成されました。" & return & return & "注意: 1つ目のアートボードは2レイヤー（新規ドキュメントの1レイヤー + ペーストレイヤー）になります。" buttons {"OK"}
	end tell
	
	return input
end run
