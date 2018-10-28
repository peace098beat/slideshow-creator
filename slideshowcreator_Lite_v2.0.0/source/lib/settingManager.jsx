/********************************************************

	---- settingMagager   ver.2.0.0 ----
	ユーザ定義変数から環境変数を作成する

		by fifi  2015/11/07

	参考
	「日本語 After Effects Script リファレンス」
	http://aejsx.hiroshisaito.net/
	「AfterEffects 7.0自動化作戦 with JavaScript」
	http://www.openspc2.org/book/AfterEffects7.0/

	変更履歴
	(2015.11.07) 設定保存機能を追加
	(2015.11.07) 編集機能を追加


/********************************************************/

/**
* ハマりポイント
* CompItem.layer(i)
* CompItem.layers[i]
* どちらも同じオブジェクト
* CompItem.numlayers
* layerCollection = CompItem.layers; コレクションを返す
* layerCollection.length
 * CompItem.layers[i]　= AVLayer
 * AVLayer
 */

(function(me){

// Project Info
systemFunc(app);

// 保存されていないプロジェクトでのエラー回避
checkProject(app);

// GUI内のグローバル変数
CONFIG = {}
CONFIG.ver = '1.2.2';
CONFIG.state = 'init';

/**
 * ユーザの設定を呼び出す
 */
prefFile = new File($.fileName.changeExt(".pref"));

loadPref();


//***********************************************//
// UI SETTING
// スライドショーを作る画面を作る
//***********************************************//
var res = 
"window {\
	info0: Panel{orientation:'column',  alignment:['fill', 'left'], alignChildren:'left',\
		text:'コンポジション名',\
		n1: Group{ orientation: 'row',\
			st: StaticText{text:'コンポジション名 :'},\
			et: EditText{characters:15, text:'"+SlidePageCompName+"'},\
			bt: Button{text:'set'}, \
		},\
	},\
	info1: Panel{orientation:'column',  alignment:['fill', 'left'], alignChildren:'left',\
		text:'Movie time setting',\
		n1: Group{ orientation: 'row',\
			st: StaticText{text:'長さ :'},\
			etm: EditText{characters:3, text:'"+COMP_DURAT_RENDER_MIN+"'},\
			st: StaticText{text:'分'},\
			ets: EditText{characters:3, text:'"+COMP_DURAT_RENDER_SEC+"'},\
			st: StaticText{text:'秒'},\
			bt: Button{text:'set',property:{name:'movieTimesetBtn'}}, \
		},\
	},\
	info2: Panel{orientation:'column', alignChildren:'left',  alignment:['fill', 'left']\
		text:'Zoom In/Out Scale',\
		n1: Group{ orientation: 'row',\
			st: StaticText{text:'In :'},\
			etm: EditText{characters:3, text:'"+SCALE_IN+"'},\
			st: StaticText{text:'Out:'},\
			ets: EditText{characters:3, text:'"+SCALE_OUT+"'},\
			st: StaticText{text:'%'},\
			bt: Button{text:'set',property:{name:'movieTimesetBtn'}}, \
		},\
	},\
	info3: Panel{orientation:'column', alignChildren:'left',  alignment:['fill', 'left']\
		text:'フェードの長さ[%]',\
		n1: Group{ orientation: 'row',\
			st: StaticText{text:'Cross feade:'},\
			et: EditText{characters:3, text:'"+CROSS+"'},\
			st2: StaticText{text:'%'},\
			bt: Button{text:'変更'}, \
		},\
	},\
	info4: Panel{orientation:'column', alignment:['fill', 'left'], alignChildren:'left', \
		text:'フォント設定',\
		n1: Group{ orientation: 'row',\
			st_text1: StaticText{characters:9,\
					text:'Fontを選んで', property:{name:'movieTimesetBtn'}}, alignment:'left', \
			dlist: DropDownList{characters:10, alignment:['fill', 'right']}\
		},\
	},\
	info6: Panel { orientation: 'column', alignment:['fill', 'left'], alignChildren:'left',\
		text: 'Resource Dirs',\
		n1: Group{ orientation: 'row', alignment:['', 'left'],alignChildren:'left',\
			st: StaticText{characters:10, text:'images:'},\
			et: EditText{characters:15, text:'"+LOCAL_PATH_PHOTO+"'},\
			bt: Button { text:'set'} \
		},\
		n2: Group{ orientation: 'row', alignment:['', 'left'],\
			st: StaticText{characters:10, text:'message:'},\
			et: EditText{characters:15, text:'"+LOCAL_PATH_MSG_TXT+"'},\
			bt: Button { text:'set' } \
		},\
		st: StaticText{ text:'※プロジェクト直下のフォルダ/ファイルを指定してください'},\
	}, \
	info5: Panel { orientation: 'column', alignment:['fill', 'right'], alignChildren:'right',\
		text: 'Create movie',\
		createBtn: Button { text: 'スライドショーを作る', alignment:['fill','top'] ,property:{name:'createBtn'}}\
		deleteBtn: Button { text:'スライドショーコンポを削除する', alignment:['fill','top'] ,property:{name:'deleteBtn'}} \
		resetBtn: Button { text:'プロジェクトをリセットする', alignment:['fill','top'] ,property:{name:'ccBtn'}} \
	}, \
	dlg: Group { orientation: 'row', \
			okBtn: Button { text: 'OK',property:{name:'okBtn'}}, \
			ccBtn: Button { text:'Cancel',property:{name:'ccBtn'}} \
	} \
}";





/**
 * windowの生成とオープン
 */
var win = (this instanceof Panel) ? me : new Window(res, 'スライドショーを作る');
win.center();
win.opacity = 0.95;
win.show();

/**
 * フォント.ドロップダウンリストの初期設定
 * (DropDownList P96)
 * http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/scripting/pdfs/javascript_tools_guide.pdf
 */
for(var i=0; i<FONT_SCP_LIST.length; i++){
	win.info4.n1.dlist.add('item', FONT_SCP_LIST[i])
	if(FONT_SCP_LIST[i] == FONT_SCP){
		win.info4.n1.dlist.selection = win.info4.n1.dlist.items[i];
	}
}
//win.info4.n1.dlist.selection = win.info4.n1.dlist.items[0];




////////////////////////////////////////////////////////
//
// ボタン動作の設定
//
////////////////////////////////////////////////////////
win.info0.n1.bt.onClick=function(){
	SlidePageCompName = win.info0.n1.et.text;
	alert("SlidePageCompName:"+SlidePageCompName);
}

/**
 * ムービの時間設定
 */
//***********************************************//
win.info1.n1.bt.onClick= function(){
	// ユーザが決めた、ムービー時間を保存する
	set_movie_time();
	
	debuglog('> Change COMP_DURAT_REN' + COMP_DURAT_REN);

	// 設定変更関数の呼び出し
	slideshow_time_setting_manager()
}


/**
 * ズームインアウトの設定
 */
//***********************************************//
win.info2.n1.bt.onClick= function(){
	// ユーザが決めた、ズームサイズを保存する
	set_zoom();
	// 設定変更関数の呼び出し
	slideshow_time_setting_manager()
}


/**
 * フェードの変更
 */
//***********************************************//
win.info3.n1.bt.onClick = function(){

	debuglog('\n> win_editor.info3.n1.bt.onClick')

	CROSS = win.info3.n1.et.text / 1.0;

	debuglog('>> CROSS change : ' + CROSS);

	slideshow_time_setting_manager();
}


/**
 * フォントの設定
 */
//***********************************************//
win.info4.n1.dlist.onChange =function(){

	debuglog('DropDownList on change')
	debuglog(this.selection)

	FONT_SCP = this.selection;
	FONT_SCP = this.selection.text;

	/**
	 * フォントの変更
	 */
	if(CONFIG.state == 'edit'){
		var txtDoc = {font : FONT_SCP};
		for(var i = 1; i<= CONFIG.MesObjList.length; i++){
			setTextDocument(CONFIG.MesObjList[i], txtDoc)
		}
	}
}


/**
 * スライドショー作成ボタン
 */
//***********************************************//
win.info5.createBtn.onClick= function(){
	// スライドショー時間をグローバル変数へ保存
	set_movie_time();
	// スライドのズーム設定をグローバル変数へ保存
	set_zoom();

	// 一つ戻るように、セッションを保存
	app.beginUndoGroup("main function");

	// スライドショークリエイターを実行
	state = slideShowCreater();
	// スライドショーの作成に成功したら, 状態変更
	if(state == 'SUCCESE'){CONFIG.state = 'edit'}

	// 一つ戻るのセッション終了
	app.endUndoGroup();
}


/**
 * プロジェクトのリセットボタン
 */
//***********************************************//
win.info5.resetBtn.onClick= function(){
	// Project Reset
	flag = confirm("プロジェクト内のレイヤをすべて削除してもよいですか?");
	if(flag){
		resetProject(app)
		CONFIG.state = 'init';
	};
}


/**
 * スライドショーコンプのDeleteボタン
 */
//***********************************************//
win.info5.deleteBtn.onClick= function(){
	// Project Reset
	CONFIG.SlidePageComp.remove();
	CONFIG.SlideShowFolder.remove();

	CONFIG.state = 'init';
}


/**
 * ディレクトリの設定
 */
//***********************************************//
win.info6.n1.bt.onClick= function(){
	// 画像ディレクトリの変更(グローバル変数)
	LOCAL_PATH_PHOTO = win.info6.n1.et.text;
	debuglog("LOCAL_PATH_PHOTO:"+LOCAL_PATH_PHOTO);
}
win.info6.n2.bt.onClick= function(){
	// message.txtの変更(グローバル変数)
	LOCAL_PATH_MSG_TXT = win.info6.n2.et.text;
	debuglog("LOCAL_PATH_MSG_TXT:"+LOCAL_PATH_MSG_TXT);
	
}



/**
 * OKボタン
 */
//***********************************************//
win.dlg.okBtn.onClick= function(){
	debuglog(this.text);
	win.close();
	savePref();
}


/**
 * Cancelボタン
 */
//***********************************************//
win.dlg.ccBtn.onClick= function(){
	debuglog(this.text);
	win.close();
}


////////////////////////////////////////////////////////
//
// サブ関数
//
////////////////////////////////////////////////////////

/************************************/
// パネルの設定を取得し保存
// コンポジションの時間の設定
/************************************/
function set_movie_time(){
	var min = win.info1.n1.etm.text * 1.0;
	var sec = win.info1.n1.ets.text * 1.0;
	var time = min*60+sec*1;
	COMP_DURAT_RENDER_MIN = min;
	COMP_DURAT_RENDER_SEC = sec;
	// コンポジションの総時間を計算しグローバル変数へ保存
	COMP_DURAT_REN = time;
}


/************************************/
// パネルの設定を取得し保存
// スライドのズーム率の設定
/************************************/
function set_zoom(){
	var z_in = win.info2.n1.etm.text;
	var z_out = win.info2.n1.ets.text;
	// ズーム開始と終了のサイズ
	SCALE_IN    = z_in * 1.0; //%
	SCALE_OUT   = z_out * 1.0; //%
}


/*************************************
 *
 * 一度作成したスライドショーを編集する関数
 * 
 *************************************/
function slideshow_time_setting_manager(){
	debuglog('\n>> RUN.. slideshow_time_setting_manager')

	if(CONFIG.state == 'init'){return 0};

	/**
	 * グローバル変数の処理
	 */
	// スライドショーコンポジションの総時間長さの変更
	CONFIG.SlidePageComp.duration = COMP_DURAT_REN;
	// COMP_DURAT_PAGE = COMP_DURAT_REN/(PAGE_NUM - PAGE_NUM*CROSS + CROSS);
	COMP_DURAT_PAGE = getCompDuration_page(COMP_DURAT_REN, PAGE_NUM, CROSS);

	// デバッグ
	debuglog('PAGE_NUM : ' + PAGE_NUM);
	debuglog('COMP_DURAT_REN : ' + COMP_DURAT_REN);
	debuglog('COMP_DURAT_PAGE : ' + COMP_DURAT_PAGE);
	debuglog('CROSS : ' + CROSS);
	debuglog('COMP_DURAT_PAGE x PAGE_NUM : ' + (PAGE_NUM*COMP_DURAT_PAGE));


	/**
	 * スライドショーの各ページの長さの変更
	 * CompItemのdurationを変更
	 */
	for (var i=PAGE_NUM; 0 < i ; i--){
		CONFIG.PageCompList[i].duration =  COMP_DURAT_PAGE*1.0;
	}

	/**
	 * 透過アニメーションの設定
	 * AVLayerのアニメーションの設定
	 * AVLayerはCompItemから.layers
	 * avLayer = CompItem.layers
	 * avLayer[i]
	 */
	function setAnimationOpacity(avlayer, comp_duration, cross){
		var myAVLay = avlayer;
		// 型チェック
		if (myAVLay instanceof AVLayer){
		}else{
			return 0
		}
		myLayProp = myAVLay.property("ADBE Transform Group").property("ADBE Opacity");
		debuglog(myAVLay instanceof AVLayer)

		// シーケンスの設定
		myAVLay.startTime =  0

		// AVLayerのタイムコードを削除
		len_keys = myLayProp.numKeys;
		for(var l=0; l<len_keys; l++){
			n = myLayProp.numKeys;
			try{
				myLayProp.removeKey(n);
			}catch(e){
				debuglog(e);
			}
		}
		
		// 透過の設定
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE * 0.0, 0);
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE * CROSS, 100);
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE * (1 - CROSS), 100);
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE * 1.0, 0);

		return 1;
	}

	/**
	 * AVLayerのスター十タイムを設定
	 */
	function setStartTime_AVLayer(avlayer, start_time){
		var myAVLay = avlayer;
		if (myAVLay instanceof AVLayer){
		}else{
			return 0;
		}
		myAVLay.startTime = start_time;
		return 1;

	}

	/**
	 * スライドショーページコンポジション(PageComp_1)のアニメーション設定
	 * 透過のキーフレームの打ち直しと、
	 * シーケンスの再設定
	 */
	// myLays = AVLayer
	var myLays = CONFIG.SlidePageComp.layers;
	for (var i=myLays.length; 0 < i ; i--){

		// まずはstartTimeを0に戻す
		setStartTime_AVLayer(myLays[i], 0.0);

		// アウトポイントの設定
		myLays[i].outPoint = COMP_DURAT_PAGE;

		// 透過のアニメーションキーフレームを追加
		if(! setAnimationOpacity(myLays[i], COMP_DURAT_PAGE, CROSS)){
			// myLays[i]がAVLayerではないときにエラー
			debuglog(myLays[i].name+' is not AVLayer')
		}
		// StartTimeをもとに戻す
		setStartTime_AVLayer(myLays[i], COMP_DURAT_PAGE * (i-1) * (1-CROSS));

	}

	/**
	 * ズームイン・ズームアウトの設定
	 * CONFIG.PhotoLayersはただの配列.
	 * 格納されているのは[1]～[myLays.length-1]までなので注意.
	 * AVLayer
	 */
	var myLays = CONFIG.PhotoLayers;
	for (var i=1; i<myLays.length; i++){
		var myLay = myLays[i]
		var myLayProp = myLay.property("ADBE Transform Group").property("ADBE Scale");

		// AVLayerのタイムコードを削除
		len_keys = myLayProp.numKeys;
		for(var l=0; l<len_keys; l++){
			n = myLayProp.numKeys;
			try{
				myLayProp.removeKey(n);
			}catch(e){
				debuglog('!!! ERROR !!! ')
				debuglog('!!! settingManager:: slideshow_time_setting_manager :: Zoom in Zoom out!!! ')
				debuglog(e);
			}
		}

		// サイズをコンポジションの縦幅に合わせる。
		var newHeight = COMP_HEIGHT;
		var orgHeight = myLay.height
		var scaleValY = newHeight/myLay.height*100;
		var scaleVal = scaleValY;
		myLay.transform.scale.setValue([scaleVal, scaleVal, scaleVal]);
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE *0.0, [SCALE_IN*scaleVal/100, SCALE_IN*scaleVal/100]);
		myLayProp.setValueAtTime(  COMP_DURAT_PAGE *1.0, [SCALE_OUT*scaleVal/100, SCALE_OUT*scaleVal/100]);

		// テスト
		myLay.outPoint = COMP_DURAT_PAGE;
	}

	/**
	 * テキストオブジェクトの長さ変更
	 */
	for(var i = 1; i<= CONFIG.MesObjList.length; i++){
		CONFIG.MesObjList[i].outPoint = COMP_DURAT_PAGE;
	}

}

/*************************************
 *
 * 設定ファイル
 * 
 *************************************/
function savePref()
{
	debuglog('> savePref()')
	var p = new Object;
	// 変数を保存
	p.SCALE_IN = SCALE_IN;
	p.SCALE_OUT = SCALE_OUT;
	p.COMP_DURAT_RENDER_MIN = COMP_DURAT_RENDER_MIN;
	p.COMP_DURAT_RENDER_SEC = COMP_DURAT_RENDER_SEC;
	p.FONT_SCP = FONT_SCP;

	var str = p.toSource();
	if (prefFile.open("w")){
		try{
			prefFile.write(str);
			prefFile.close();
		}catch(e){
			debuglog('> !!! ERROR !!! write() and close()> savePref()')
			debuglog(e)
			return false;
		}
	}else{
		return false;
	}
}

function loadPref()
{
	debuglog('\n> loadPref');

	if ( (prefFile == null)||(prefFile.exists == false)) return;
	var str ="";
	if (prefFile.open("r")){
		try{
			str = prefFile.read();
		}catch(e){
			debuglog(e)
			return;
		}finally{
			prefFile.close();
		}
	}
	if ( str == "") return;
	var p = eval(str);
	if (p!=null){
		if (p.COMP_DURAT_RENDER_MIN != undefined)
			COMP_DURAT_RENDER_MIN = p.COMP_DURAT_RENDER_MIN;
		if (p.COMP_DURAT_RENDER_SEC != undefined)
			COMP_DURAT_RENDER_SEC = p.COMP_DURAT_RENDER_SEC;
		if (p.SCALE_IN != undefined)
			SCALE_IN = p.SCALE_IN;
		if (p.SCALE_OUT != undefined)
			SCALE_OUT = p.SCALE_OUT;
		if (p.FONT_SCP != undefined)
			FONT_SCP = p.FONT_SCP;

	}
}


})(this);
