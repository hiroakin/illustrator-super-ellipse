-- Midjourney Fashion Prompt Generator - 完全安定版
-- 機能: 衣装カテゴリ, ソックス, 靴, アクセサリー, 絵スタイル, 背景, ボディライン5択, 全身固定, --ar 9:16, Style Tags（NG語なし）

on run
	-- メインカテゴリ
	set mainCategories to {"カスタム", "ビジネス・プロフェッショナル", "カジュアル", "フィットネス・アクティブ", "フォーマル・イベント", "季節・天候対応", "ファッションスタイル", "高級ファッション・芸術系", "サブカルチャー・ストリート系", "学生服", "制服・ユニフォーム系", "医療・ヘルスケア系", "ミリタリー・セキュリティ系", "サービス・接客系", "アンダーウェア・ベーシック", "特殊スタイル"}
	set selectedMainCategory to choose from list mainCategories with prompt "ファッションのメインカテゴリを選択してください:" default items {"ビジネス・プロフェッショナル"}
	if selectedMainCategory is false then return
	
	set mainCat to item 1 of selectedMainCategory
	set selectedOutfit to ""
	set categoryDisplayName to ""
	
	-- カテゴリ別処理
	if mainCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "a white blouse and tailored pants, silk, minimalist accessories")
		if customResult is false or customResult is "" then return
		set selectedOutfit to customResult
		set categoryDisplayName to "custom style"
		
	else if mainCat is "ビジネス・プロフェッショナル" then
		set resultList to my handleBusinessCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "カジュアル" then
		set resultList to my handleCasualCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "フィットネス・アクティブ" then
		set resultList to my handleFitnessCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "フォーマル・イベント" then
		set resultList to my handleFormalCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "サブカルチャー・ストリート系" then
		set resultList to my handleSubcultureCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "季節・天候対応" then
		set resultList to my handleSeasonalCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "ファッションスタイル" then
		set resultList to my handleStyleCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "高級ファッション・芸術系" then
		set resultList to my handleLuxuryCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "医療・ヘルスケア系" then
		set resultList to my handleMedicalCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "ミリタリー・セキュリティ系" then
		set resultList to my handleMilitaryCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "サービス・接客系" then
		set resultList to my handleServiceCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "アンダーウェア・ベーシック" then
		set resultList to my handleBasicCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "特殊スタイル" then
		set resultList to my handleSpecialStyleCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "学生服" then
		set resultList to my studentUniform()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
		
	else if mainCat is "制服・ユニフォーム系" then
		set resultList to my handleUniformCategory()
		if resultList is false then return
		set selectedOutfit to item 1 of resultList
		set categoryDisplayName to item 2 of resultList
	end if
	
	-- ストッキング・ソックス
	set stockingOptions to {"none", "カスタム", "black stockings", "white stockings", "loose socks", "black thigh-high socks", "knee-high socks", "ankle socks"}
	set selectedStockingList to choose from list stockingOptions with prompt "ストッキング・ソックスを選択してください（不要なら none）:" default items {"none"}
	if selectedStockingList is false then return
	set selectedStocking to item 1 of selectedStockingList
	if selectedStocking is "カスタム" then
		set customStocking to my inputWithSample("カスタムストッキング・ソックスを入力してください:", "black sheer stockings")
		if customStocking is false or customStocking is "" then return
		set selectedStocking to customStocking
	end if
	
	-- アクセサリー
	set accessoryOptions to {"none", "カスタム", "headphones", "hair ribbon", "headband", "hair clips", "beret hat", "wristwatch", "glasses"}
	set selectedAccessoryList to choose from list accessoryOptions with prompt "アクセサリーを選択してください（不要なら none）:" default items {"none"}
	if selectedAccessoryList is false then return
	set selectedAccessory to item 1 of selectedAccessoryList
	if selectedAccessory is "カスタム" then
		set customAccessory to my inputWithSample("カスタムアクセサリーを入力してください:", "thin leather belt, pearl earrings")
		if customAccessory is false or customAccessory is "" then return
		set selectedAccessory to customAccessory
	end if
	
	-- 靴
	set footwearOptions to {"none", "カスタム", "black pump shoes", "white sneakers", "ankle boots", "flat sandals", "running shoes", "platform shoes", "combat boots", "designer heels", "mary jane shoes", "loafer shoes", "espadrille shoes", "waterproof boots", "low-heel pumps", "comfortable flats", "tactical boots", "soft slippers", "barefoot"}
	set selectedFootwearList to choose from list footwearOptions with prompt "靴を選択してください:" default items {"black pump shoes"}
	if selectedFootwearList is false then return
	set selectedFootwear to item 1 of selectedFootwearList
	if selectedFootwear is "カスタム" then
		set customFootwear to my inputWithSample("カスタム靴を入力してください:", "black pump shoes, matte leather")
		if customFootwear is false or customFootwear is "" then return
		set selectedFootwear to customFootwear
	end if
	if selectedFootwear is "barefoot" then set selectedStocking to "none"
	
	-- 絵のスタイル（冒頭に差し替え）
	set artStyleOptions to {"fashion portrait photography", "anime style illustration", "digital painting style", "magazine cover photo style", "カスタム"}
	set selectedArtStyleList to choose from list artStyleOptions with prompt "絵のスタイルを選択してください（冒頭に反映）:" default items {"fashion portrait photography"}
	if selectedArtStyleList is false then return
	set selectedArtStyle to item 1 of selectedArtStyleList
	if selectedArtStyle is "カスタム" then
		set customArtStyle to my inputWithSample("カスタム絵スタイルを入力してください:", "oil painting style")
		if customArtStyle is false or customArtStyle is "" then return
		set selectedArtStyle to customArtStyle
	end if
	
	-- 背景
	set backgroundOptions to {"studio lighting and gray background", "outdoor natural sunlight", "urban street background", "night city lights", "scenic park background", "fashion runway background", "カスタム"}
	set selectedBackgroundList to choose from list backgroundOptions with prompt "背景を選択してください:" default items {"studio lighting and gray background"}
	if selectedBackgroundList is false then return
	set selectedBackground to item 1 of selectedBackgroundList
	if selectedBackground is "カスタム" then
		set customBackground to my inputWithSample("カスタム背景を入力してください:", "sunset beach background, warm light")
		if customBackground is false or customBackground is "" then return
		set selectedBackground to customBackground
	end if
	
	-- ボディライン 5択
	set bodyLineOptions to {"perfect body line", "slim body line", "healthy body line", "muscular body line", "curvy body line"}
	set selectedBodyLineList to choose from list bodyLineOptions with prompt "モデルのボディラインを選択してください:" default items {"perfect body line"}
	if selectedBodyLineList is false then return
	set selectedBodyLine to item 1 of selectedBodyLineList
	
	-- ===== プロンプト生成 =====
	set finalPrompt to "Full-body shot, " & selectedArtStyle & ", Japanese female model in a " & selectedBodyLine & " and smooth hair. She is wearing " & selectedOutfit
	
	-- 追加要素
	set extras to {}
	if selectedStocking is not "none" then set end of extras to selectedStocking
	if selectedAccessory is not "none" then set end of extras to selectedAccessory
	if selectedFootwear is not "none" then set end of extras to selectedFootwear
	if (count of extras) > 0 then
		set AppleScript's text item delimiters to ", "
		set extrasText to extras as text
		set AppleScript's text item delimiters to ""
		set finalPrompt to finalPrompt & ", " & extrasText
	end if
	
	set styleTags to my getStyleTags(categoryDisplayName)
	set finalPrompt to finalPrompt & ", head to toe visible. Style tags: " & styleTags & ". She is standing, " & selectedBackground & ". --ar 9:16"
	
	-- クリップボードへ
	set the clipboard to finalPrompt
	display dialog "プロンプトが生成され、クリップボードにコピーされました!" & return & return & finalPrompt buttons {"OK"} default button "OK"
	return finalPrompt
end run

--========================
-- ヘルパー
--========================
on inputWithSample(msgText, sampleText)
	try
		set dlg to display dialog msgText default answer sampleText buttons {"キャンセル", "OK"} default button "OK" with icon note
		if button returned of dlg is "キャンセル" then return false
		return text returned of dlg
	on error
		return false
	end try
end inputWithSample

on getStyleTags(categoryDisplayName)
	if categoryDisplayName is "formal business" then
		return "(formal business, corporate, elegant, professional)"
	else if categoryDisplayName is "business casual" then
		return "(business casual, professional, elegant, minimalist)"
	else if categoryDisplayName is "creative professional" then
		return "(creative professional, stylish, modern, minimal)"
	else if categoryDisplayName is "interview formal" then
		return "(interview, formal business, refined, professional)"
	else if categoryDisplayName is "daily casual" then
		return "(casual, relaxed, natural, everyday)"
	else if categoryDisplayName is "smart casual" then
		return "(smart casual, neat, polished, minimal)"
	else if categoryDisplayName is "street style" then
		return "(streetwear, urban, edgy, casual)"
	else if categoryDisplayName is "travel" then
		return "(travel, functional, comfortable, practical)"
	else if categoryDisplayName is "gym workout" then
		return "(fitness, athletic, performance, breathable)"
	else if categoryDisplayName is "yoga pilates" then
		return "(yoga, pilates, flexible, soft)"
	else if categoryDisplayName is "outdoor running" then
		return "(running, outdoor, technical, breathable)"
	else if categoryDisplayName is "party cocktail" then
		return "(party, cocktail, chic, elegant)"
	else if categoryDisplayName is "formal event" then
		return "(formal, evening, refined, glamorous)"
	else if categoryDisplayName is "casual party" then
		return "(party, casual, fun, stylish)"
	else if categoryDisplayName is "date dinner" then
		return "(date night, elegant, romantic, chic)"
	else if categoryDisplayName is "kawaii harajuku" then
		return "(kawaii, colorful, playful, harajuku fashion)"
	else if categoryDisplayName is "gothic dark" then
		return "(gothic, dark, mysterious, alternative)"
	else if categoryDisplayName is "elegant frilly fashion" then
		return "(elegant frilly fashion, classic, ornate, bow details)"
	else if categoryDisplayName is "uniform" then
		return "(uniform, professional, clean, structured)"
	else if categoryDisplayName is "school uniform" then
		return "(school uniform, youthful, neat, classic)"
	else if categoryDisplayName is "sailor uniform" then
		return "(sailor uniform, classic, neat, youthful)"
	else if categoryDisplayName is "blazer uniform" then
		return "(school blazer, classic, neat, preppy)"
	else if categoryDisplayName is "school uniform set" then
		return "(school uniform, coordinated, neat, classic)"
	else if categoryDisplayName is "spring autumn" then
		return "(spring autumn, light layers, neutral, natural)"
	else if categoryDisplayName is "summer" then
		return "(summer, breezy, light, airy)"
	else if categoryDisplayName is "winter" then
		return "(winter, layered, warm, cozy)"
	else if categoryDisplayName is "minimalist" then
		return "(minimalist, clean lines, neutral, refined)"
	else if categoryDisplayName is "bohemian" then
		return "(bohemian, flowing, layered, earthy)"
	else if categoryDisplayName is "edgy mode" then
		return "(edgy, modern, monochrome, bold)"
	else if categoryDisplayName is "vintage" then
		return "(vintage, retro, classic, timeless)"
	else if categoryDisplayName is "haute couture" then
		return "(haute couture, luxury, handcrafted, exquisite)"
	else if categoryDisplayName is "high fashion" then
		return "(high fashion, runway, bold, sculptural)"
	else if categoryDisplayName is "avant-garde" then
		return "(avant-garde, conceptual, experimental, artistic)"
	else if categoryDisplayName is "medical" then
		return "(medical, clean, professional, healthcare)"
	else if categoryDisplayName is "service" then
		return "(service industry, professional, approachable, neat)"
	else if categoryDisplayName is "military" then
		return "(military, uniform, tactical, strong)"
	else if categoryDisplayName is "basics" then
		return "(basics, simple, neutral, essential)"
	else if categoryDisplayName is "fitness base" then
		return "(fitness base, athletic, seamless, stretchy)"
	else if categoryDisplayName is "nightwear" then
		return "(nightwear, cozy, soft, comfortable)"
	else if categoryDisplayName is "racing motorsports" then
		return "(racing, motorsports, protective, dynamic)"
	else if categoryDisplayName is "space sci-fi" then
		return "(space, sci-fi, futuristic, high-tech)"
	else if categoryDisplayName is "anime cosplay" then
		return "(anime cosplay, vibrant, playful, fantasy)"
	else if categoryDisplayName is "historical period" then
		return "(historical, period costume, ornate, authentic)"
	else if categoryDisplayName is "custom style" then
		return "(custom style, tailored, unique, signature)"
	else
		return "(" & categoryDisplayName & ", stylish, modern)"
	end if
end getStyleTags

--========================
-- 各カテゴリ・ハンドラ
--========================
on handleBusinessCategory()
	set subCategories to {"カスタム", "フォーマルビジネス", "ビジネスカジュアル", "クリエイティブプロフェッショナル", "面接・重要会議"}
	set selectedSub to choose from list subCategories with prompt "ビジネスのサブカテゴリを選択してください:" default items {"フォーマルビジネス"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "navy blazer, white blouse, pencil skirt")
		if customResult is false or customResult is "" then return false
		return {customResult, "business"}
	else if subCat is "フォーマルビジネス" then
		set options to {"カスタム", "a professional navy business suit with white blouse", "a professional charcoal blazer with white shirt and pencil skirt", "a conservative tailored pantsuit"}
		set selected to choose from list options with prompt "フォーマルビジネス衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "navy suit, white blouse, closed-toe pumps")
			if picked is false or picked is "" then return false
		end if
		return {picked, "formal business"}
	else if subCat is "ビジネスカジュアル" then
		set options to {"カスタム", "a professional blouse with cardigan and dress pants", "a business casual knit sweater and tailored pants", "a professional blazer over collared shirt with chinos"}
		set selected to choose from list options with prompt "ビジネスカジュアル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "knit sweater, tailored pants, loafers")
			if picked is false or picked is "" then return false
		end if
		return {picked, "business casual"}
	else if subCat is "クリエイティブプロフェッショナル" then
		set options to {"カスタム", "a stylish turtleneck and tailored trousers", "an artistic blouse and wide-leg pants"}
		set selected to choose from list options with prompt "クリエイティブプロフェッショナル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "turtleneck, tailored trousers, minimal accessories")
			if picked is false or picked is "" then return false
		end if
		return {picked, "creative professional"}
	else if subCat is "面接・重要会議" then
		set options to {"カスタム", "a conservative navy suit with crisp white blouse", "a formal professional dress with blazer", "a business formal tailored pantsuit"}
		set selected to choose from list options with prompt "面接・重要会議衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "navy suit, white blouse, minimal jewelry")
			if picked is false or picked is "" then return false
		end if
		return {picked, "interview formal"}
	end if
end handleBusinessCategory

on handleCasualCategory()
	set subCategories to {"カスタム", "デイリーカジュアル", "スマートカジュアル", "ストリートスタイル", "旅行・観光"}
	set selectedSub to choose from list subCategories with prompt "カジュアルのサブカテゴリを選択してください:" default items {"デイリーカジュアル"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "oversized knit sweater, straight-leg jeans")
		if customResult is false or customResult is "" then return false
		return {customResult, "casual"}
	else if subCat is "デイリーカジュアル" then
		set options to {"カスタム", "a white cotton t-shirt and blue jeans", "an oversized sweater and leggings", "a casual button-down and khaki pants", "a casual maxi dress with floral print", "a comfortable midi dress in solid color", "a flowy sundress with spaghetti straps", "a casual shirt dress with belt", "a simple t-shirt dress with sneakers", "a wrap dress in cotton fabric", "a casual fit-and-flare dress", "a comfortable shift dress", "a casual tank top and high-waisted shorts", "a loose blouse and straight-leg jeans", "a casual cardigan over tank top and jeans", "a comfortable hoodie and joggers", "a casual blouse and wide-leg pants", "a simple tank top and midi skirt", "a casual sweater dress", "a comfortable jumpsuit in cotton", "a casual blouse and culottes", "a simple t-shirt and maxi skirt", "a casual button-down and shorts", "a comfortable tunic and leggings"}
		set selected to choose from list options with prompt "デイリーカジュアル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "relaxed tee, straight jeans, sneakers")
			if picked is false or picked is "" then return false
		end if
		return {picked, "daily casual"}
	else if subCat is "スマートカジュアル" then
		set options to {"カスタム", "a knit polo and dark jeans", "a white blouse and high-waisted trousers", "a cardigan over basic tee with slim pants"}
		set selected to choose from list options with prompt "スマートカジュアル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "white blouse, high-waisted trousers, loafers")
			if picked is false or picked is "" then return false
		end if
		return {picked, "smart casual"}
	else if subCat is "ストリートスタイル" then
		set options to {"カスタム", "an oversized graphic tee and distressed jeans", "a cropped hoodie and wide sweatpants"}
		set selected to choose from list options with prompt "ストリートスタイル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "graphic tee, cargo pants, chunky sneakers")
			if picked is false or picked is "" then return false
		end if
		return {picked, "street style"}
	else if subCat is "旅行・観光" then
		set options to {"カスタム", "a comfortable tunic and leggings", "a casual dress with denim jacket", "a breathable top and travel pants"}
		set selected to choose from list options with prompt "旅行・観光衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "breathable top, travel pants, light jacket")
			if picked is false or picked is "" then return false
		end if
		return {picked, "travel"}
	end if
end handleCasualCategory

on handleFitnessCategory()
	set subCategories to {"カスタム", "ジム・ワークアウト", "ヨガ・ピラティス", "アウトドア・ランニング"}
	set selectedSub to choose from list subCategories with prompt "フィットネス・アクティブのサブカテゴリを選択してください:" default items {"ジム・ワークアウト"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "fitted athletic top, high-waisted leggings")
		if customResult is false or customResult is "" then return false
		return {customResult, "fitness active"}
	else if subCat is "ジム・ワークアウト" then
		set options to {"カスタム", "a fitted tank top and high-waisted leggings", "a fitted athletic top and matching workout set", "a moisture-wicking tee and shorts"}
		set selected to choose from list options with prompt "ジム・ワークアウト衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "moisture-wicking tee, compression leggings")
			if picked is false or picked is "" then return false
		end if
		return {picked, "gym workout"}
	else if subCat is "ヨガ・ピラティス" then
		set options to {"カスタム", "a fitted athletic top and yoga pants", "a flowy tank top and leggings", "a soft athletic top and wide-leg yoga pants"}
		set selected to choose from list options with prompt "ヨガ・ピラティス衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "soft athletic top, yoga pants, grip socks")
			if picked is false or picked is "" then return false
		end if
		return {picked, "yoga pilates"}
	else if subCat is "アウトドア・ランニング" then
		set options to {"カスタム", "a technical running shirt and shorts", "a windbreaker and athletic leggings", "a long-sleeve athletic top and tights"}
		set selected to choose from list options with prompt "アウトドア・ランニング衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "windbreaker, running tights, reflective details")
			if picked is false or picked is "" then return false
		end if
		return {picked, "outdoor running"}
	end if
end handleFitnessCategory

on handleFormalCategory()
	set subCategories to {"カスタム", "パーティー・カクテル", "フォーマルイベント", "カジュアルパーティー", "デート・ディナー"}
	set selectedSub to choose from list subCategories with prompt "フォーマル・イベントのサブカテゴリを選択してください:" default items {"パーティー・カクテル"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "floor-length gown, satin fabric, minimal jewelry")
		if customResult is false or customResult is "" then return false
		return {customResult, "formal event"}
	else if subCat is "パーティー・カクテル" then
		set options to {"カスタム", "an elegant little black dress", "a sophisticated midi dress", "a chic wrap dress"}
		set selected to choose from list options with prompt "パーティー・カクテル衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "little black dress, satin, subtle jewelry")
			if picked is false or picked is "" then return false
		end if
		return {picked, "party cocktail"}
	else if subCat is "フォーマルイベント" then
		set options to {"カスタム", "a floor-length evening gown", "a glamorous sequined dress", "a classic cocktail dress"}
		set selected to choose from list options with prompt "フォーマルイベント衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "evening gown, sequins, elegant heels")
			if picked is false or picked is "" then return false
		end if
		return {picked, "formal event"}
	else if subCat is "カジュアルパーティー" then
		set options to {"カスタム", "a stylish jumpsuit with belt", "a fun midi skirt and fitted top", "a flowy blouse and high-waisted jeans"}
		set selected to choose from list options with prompt "カジュアルパーティー衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "stylish jumpsuit, belt, block heels")
			if picked is false or picked is "" then return false
		end if
		return {picked, "casual party"}
	else if subCat is "デート・ディナー" then
		set options to {"カスタム", "a romantic midi dress", "a silk blouse and dark jeans", "a wrap dress with statement jewelry"}
		set selected to choose from list options with prompt "デート・ディナー衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "silk blouse, dark jeans, delicate necklace")
			if picked is false or picked is "" then return false
		end if
		return {picked, "date dinner"}
	end if
end handleFormalCategory

on handleSubcultureCategory()
	set subCategories to {"カスタム", "Kawaii・原宿系", "ゴシック・ダーク系", "ロリータ系"}
	set selectedSub to choose from list subCategories with prompt "サブカルチャーのサブカテゴリを選択してください:" default items {"Kawaii・原宿系"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "pastel layered dress, frilly details, cute hair clips")
		if customResult is false or customResult is "" then return false
		return {customResult, "subculture"}
	else if subCat is "Kawaii・原宿系" then
		set options to {"カスタム", "a kawaii pastel dress with frilly details and cute accessories", "a harajuku style colorful layered outfit with anime motifs", "a kawaii oversized sweater with character prints and mini skirt"}
		set selected to choose from list options with prompt "Kawaii・原宿系衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "colorful layered outfit, anime motifs, playful accessories")
			if picked is false or picked is "" then return false
		end if
		return {picked, "kawaii harajuku"}
	else if subCat is "ゴシック・ダーク系" then
		set options to {"カスタム", "a gothic black dress with lace details and corset", "a dark romantic blouse with leather pants and chains", "a gothic frilly dress with petticoat and dark accessories"}
		set selected to choose from list options with prompt "ゴシック・ダーク系衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "black lace dress, corset, silver chain accessories")
			if picked is false or picked is "" then return false
		end if
		return {picked, "gothic dark"}
	else if subCat is "ロリータ系" then
		set options to {"カスタム", "a sweet Victorian-inspired dress with bows and frills in pastel colors", "a classic elegant blouse with high-waisted skirt and vest", "a gothic elegant dress in black and white with lace details"}
		set selected to choose from list options with prompt "ロリータ系衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "Victorian-inspired dress, bows and frills, pastel palette")
			if picked is false or picked is "" then return false
		end if
		return {picked, "elegant frilly fashion"}
	end if
end handleSubcultureCategory

on handleUniformCategory()
	set options to {"カスタム", "a navy blue work uniform with utility belt", "a professional pilot uniform with cap and wings pin", "a clean French chef's uniform with tall hat and apron", "a traditional Japanese chef's uniform with headband and apron", "a firefighter uniform with safety gear and firefighter boots", "a deep-sea diving suit with helmet and diving boots", "a hazmat suit with protective equipment and safety boots"}
	set selected to choose from list options with prompt "制服・ユニフォーム衣装を選択してください:" default items {item 2 of options}
	if selected is false then return false
	set picked to item 1 of selected
	if picked is "カスタム" then
		set picked to my inputWithSample("カスタム衣装を入力してください:", "pilot uniform, cap, wings pin")
		if picked is false or picked is "" then return false
	end if
	return {picked, "uniform"}
end handleUniformCategory

on studentUniform()
	set subCategories to {"カスタム", "セーラー服系制服", "ブレザー系制服", "制服セット"}
	set selectedSub to choose from list subCategories with prompt "学生服のサブカテゴリを選択してください:" default items {"セーラー服系制服"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム学生服を入力してください:", "white sailor uniform, navy skirt")
		if customResult is false or customResult is "" then return false
		return {customResult, "school uniform"}
	else if subCat is "セーラー服系制服" then
		set options to {"カスタム", "white sailor uniform, navy skirt, school uniform", "black sailor uniform, red neckerchief", "short sleeve sailor uniform", "sailor uniform, cardigan"}
		set selected to choose from list options with prompt "セーラー服系制服を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタムセーラー服を入力してください:", "sailor uniform, navy skirt, ribbon")
			if picked is false or picked is "" then return false
		end if
		return {picked, "sailor uniform"}
	else if subCat is "ブレザー系制服" then
		set options to {"カスタム", "beige blazer, plaid skirt", "black blazer, red ribbon, plaid skirt", "navy blazer with striped tie and gray skirt"}
		set selected to choose from list options with prompt "ブレザー系制服を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタムブレザー制服を入力してください:", "navy blazer, plaid skirt, striped tie")
			if picked is false or picked is "" then return false
		end if
		return {picked, "blazer uniform"}
	else if subCat is "制服セット" then
		set options to {"カスタム", "school uniform, scarf, winter", "school uniform, hoodie", "school uniform with school bag"}
		set selected to choose from list options with prompt "制服セットを選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム制服セットを入力してください:", "school uniform, scarf, winter")
			if picked is false or picked is "" then return false
		end if
		return {picked, "school uniform set"}
	end if
end studentUniform

on handleSeasonalCategory()
	set subCategories to {"カスタム", "春・秋", "夏", "冬"}
	set selectedSub to choose from list subCategories with prompt "季節・天候対応のサブカテゴリを選択してください:" default items {"春・秋"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "trench coat, lightweight knit, spring palette")
		if customResult is false or customResult is "" then return false
		return {customResult, "seasonal"}
	else if subCat is "春・秋" then
		set options to {"カスタム", "a light cardigan over blouse with jeans", "a trench coat over sweater and pants", "a denim jacket with sundress"}
		set selected to choose from list options with prompt "春・秋衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "trench coat, knit, jeans")
			if picked is false or picked is "" then return false
		end if
		return {picked, "spring autumn"}
	else if subCat is "夏" then
		set options to {"カスタム", "a breezy sundress", "a linen shirt and shorts", "a sleeveless top and flowy skirt"}
		set selected to choose from list options with prompt "夏衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "linen shirt, shorts, sandals")
			if picked is false or picked is "" then return false
		end if
		return {picked, "summer"}
	else if subCat is "冬" then
		set options to {"カスタム", "a wool coat over sweater and jeans", "a cashmere coat over turtleneck and trousers", "a puffer jacket with thermal layers"}
		set selected to choose from list options with prompt "冬衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "cashmere coat, turtleneck, trousers, boots")
			if picked is false or picked is "" then return false
		end if
		return {picked, "winter"}
	end if
end handleSeasonalCategory

on handleStyleCategory()
	set subCategories to {"カスタム", "ミニマリスト", "ボヘミアン", "エッジー・モード", "ヴィンテージ"}
	set selectedSub to choose from list subCategories with prompt "ファッションスタイルのサブカテゴリを選択してください:" default items {"ミニマリスト"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "simple white shirt, black pants, clean lines")
		if customResult is false or customResult is "" then return false
		return {customResult, "style"}
	else if subCat is "ミニマリスト" then
		set options to {"カスタム", "a simple white shirt and black pants", "a neutral sweater and straight jeans", "a basic turtleneck and midi skirt"}
		set selected to choose from list options with prompt "ミニマリスト衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "neutral palette, clean silhouette, minimal accessories")
			if picked is false or picked is "" then return false
		end if
		return {picked, "minimalist"}
	else if subCat is "ボヘミアン" then
		set options to {"カスタム", "a flowing maxi dress with layered jewelry", "a peasant blouse and wide-leg pants", "a kimono-style top and flared jeans"}
		set selected to choose from list options with prompt "ボヘミアン衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "flowing maxi dress, layered jewelry, earthy tones")
			if picked is false or picked is "" then return false
		end if
		return {picked, "bohemian"}
	else if subCat is "エッジー・モード" then
		set options to {"カスタム", "a leather jacket over band tee with ripped jeans", "a mesh top and leather skirt", "an oversized blazer and all-black outfit"}
		set selected to choose from list options with prompt "エッジー・モード衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "leather jacket, all-black outfit, bold accents")
			if picked is false or picked is "" then return false
		end if
		return {picked, "edgy mode"}
	else if subCat is "ヴィンテージ" then
		set options to {"カスタム", "a 1950s fit-and-flare dress", "a retro blouse and high-waisted trousers", "a vintage band tee and high-waisted jeans"}
		set selected to choose from list options with prompt "ヴィンテージ衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "retro blouse, high-waisted trousers, classic accessories")
			if picked is false or picked is "" then return false
		end if
		return {picked, "vintage"}
	end if
end handleStyleCategory

on handleLuxuryCategory()
	set subCategories to {"カスタム", "オートクチュール", "ハイファッション", "アヴァンギャルド"}
	set selectedSub to choose from list subCategories with prompt "高級ファッション・芸術系のサブカテゴリを選択してください:" default items {"オートクチュール"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "haute couture gown, architectural draping, elaborate embellishments")
		if customResult is false or customResult is "" then return false
		return {customResult, "luxury fashion"}
	else if subCat is "オートクチュール" then
		set options to {"カスタム", "an exquisite haute couture gown with intricate hand-sewn details", "a luxurious couture dress with architectural draping", "an opulent couture creation with elaborate embellishments"}
		set selected to choose from list options with prompt "オートクチュール衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "haute couture gown, hand-sewn details")
			if picked is false or picked is "" then return false
		end if
		return {picked, "haute couture"}
	else if subCat is "ハイファッション" then
		set options to {"カスタム", "a high fashion statement dress with bold geometric lines", "a luxury fashion piece with innovative silhouette", "a runway-inspired outfit with dramatic proportions"}
		set selected to choose from list options with prompt "ハイファッション衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "statement dress, bold geometric lines, runway-inspired")
			if picked is false or picked is "" then return false
		end if
		return {picked, "high fashion"}
	else if subCat is "アヴァンギャルド" then
		set options to {"カスタム", "an avant-garde sculptural dress with unconventional materials", "a conceptual fashion piece with experimental structure", "an avant-garde creation with abstract forms"}
		set selected to choose from list options with prompt "アヴァンギャルド衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "sculptural dress, unconventional materials, conceptual")
			if picked is false or picked is "" then return false
		end if
		return {picked, "avant-garde"}
	end if
end handleLuxuryCategory

on handleMedicalCategory()
	set options to {"カスタム", "a professional white lab coat over scrubs", "a surgical scrubs in teal with medical accessories", "a nurse uniform in white with medical badge", "a pharmacy coat over professional attire", "a crisp white medical scrubs with stethoscope"}
	set selected to choose from list options with prompt "医療・ヘルスケア衣装を選択してください:" default items {item 2 of options}
	if selected is false then return false
	set picked to item 1 of selected
	if picked is "カスタム" then
		set picked to my inputWithSample("カスタム衣装を入力してください:", "white lab coat, scrubs, stethoscope")
		if picked is false or picked is "" then return false
	end if
	return {picked, "medical"}
end handleMedicalCategory

on handleServiceCategory()
	set options to {"カスタム", "a hotel concierge uniform with name tag", "a flight attendant uniform with scarf and wings pin", "a restaurant server uniform in black and white", "a retail uniform with company logo"}
	set selected to choose from list options with prompt "サービス・接客衣装を選択してください:" default items {item 2 of options}
	if selected is false then return false
	set picked to item 1 of selected
	if picked is "カスタム" then
		set picked to my inputWithSample("カスタム衣装を入力してください:", "flight attendant uniform, scarf, wings pin")
		if picked is false or picked is "" then return false
	end if
	return {picked, "service"}
end handleServiceCategory

on handleMilitaryCategory()
	set options to {"カスタム", "a military-style uniform in olive green", "a professional security uniform with badge", "a police-style uniform in dark blue with utility belt", "a military dress uniform with decorations"}
	set selected to choose from list options with prompt "ミリタリー・セキュリティ衣装を選択してください:" default items {item 2 of options}
	if selected is false then return false
	set picked to item 1 of selected
	if picked is "カスタム" then
		set picked to my inputWithSample("カスタム衣装を入力してください:", "olive green uniform, tactical belt")
		if picked is false or picked is "" then return false
	end if
	return {picked, "military"}
end handleMilitaryCategory

on handleBasicCategory()
	set subCategories to {"カスタム", "フィットネスベース", "ナイトウェア"}
	set selectedSub to choose from list subCategories with prompt "アンダーウェア・ベーシックのサブカテゴリを選択してください:" default items {"フィットネスベース"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム衣装を入力してください:", "seamless tank top, leggings, neutral color")
		if customResult is false or customResult is "" then return false
		return {customResult, "basics"}
	else if subCat is "フィットネスベース" then
		set options to {"カスタム", "a simple white fitness top and bottom", "a fitted athletic top and matching shorts", "a seamless tank top and leggings"}
		set selected to choose from list options with prompt "フィットネスベース衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "fitness top and bottom, seamless")
			if picked is false or picked is "" then return false
		end if
		return {picked, "fitness base"}
	else if subCat is "ナイトウェア" then
		set options to {"カスタム", "comfortable cotton pajamas", "a silk camisole and shorts set", "a cozy nightgown"}
		set selected to choose from list options with prompt "ナイトウェア衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "silk camisole, shorts, cozy")
			if picked is false or picked is "" then return false
		end if
		return {picked, "nightwear"}
	end if
end handleBasicCategory

on handleSpecialStyleCategory()
	set subCategories to {"カスタム", "レーシング・モータースポーツ", "宇宙・SF", "アニメ・コスプレ", "時代劇・歴史"}
	set selectedSub to choose from list subCategories with prompt "特殊スタイルのサブカテゴリを選択してください:" default items {"レーシング・モータースポーツ"}
	if selectedSub is false then return false
	set subCat to item 1 of selectedSub
	
	if subCat is "カスタム" then
		set customResult to my inputWithSample("カスタム特殊スタイルを入力してください:", "futuristic suit, metallic details, sci-fi aesthetics")
		if customResult is false or customResult is "" then return false
		return {customResult, "special style"}
	else if subCat is "レーシング・モータースポーツ" then
		set options to {"カスタム", "a professional racing suit with helmet and gloves and racing shoes", "a Formula 1 racing suit with sponsor logos and racing boots", "a motorcycle racing suit with protective gear and racing boots", "a NASCAR racing suit with team colors and racing shoes"}
		set selected to choose from list options with prompt "レーシング・モータースポーツ衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "racing suit, helmet, gloves, boots")
			if picked is false or picked is "" then return false
		end if
		return {picked, "racing motorsports"}
	else if subCat is "宇宙・SF" then
		set options to {"カスタム", "a futuristic space suit with helmet and space boots", "a sleek astronaut suit with NASA patches and astronaut boots", "a sci-fi jumpsuit with high-tech elements and futuristic shoes", "a space exploration suit with life support systems and space boots"}
		set selected to choose from list options with prompt "宇宙・SF衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "astronaut suit, NASA patches, space boots")
			if picked is false or picked is "" then return false
		end if
		return {picked, "space sci-fi"}
	else if subCat is "アニメ・コスプレ" then
		set options to {"カスタム", "a magical girl costume with colorful details and magical shoes", "a ninja outfit with traditional elements and ninja sandals", "a maid cafe costume with frilly apron and maid shoes", "a school idol costume with stage accessories and idol shoes"}
		set selected to choose from list options with prompt "アニメ・コスプレ衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "magical girl costume, colorful, playful")
			if picked is false or picked is "" then return false
		end if
		return {picked, "anime cosplay"}
	else if subCat is "時代劇・歴史" then
		set options to {"カスタム", "a medieval knight armor with chainmail and leather boots", "a Victorian era dress with corset and Victorian shoes", "a samurai armor with traditional helmet and samurai sandals", "a Renaissance noble costume with elaborate decorations and period shoes"}
		set selected to choose from list options with prompt "時代劇・歴史衣装を選択してください:" default items {item 2 of options}
		if selected is false then return false
		set picked to item 1 of selected
		if picked is "カスタム" then
			set picked to my inputWithSample("カスタム衣装を入力してください:", "samurai armor, kabuto helmet, sandals")
			if picked is false or picked is "" then return false
		end if
		return {picked, "historical period"}
	end if
end handleSpecialStyleCategory