/********************************************************

	---- SlideShowCreater  ver.2.0.0 ----

	welcom comp, end compを削除する。


		by fifi  2015/11/07

(2015.11.07) ver2.0としてローンチ!
(2015.11.07) 写真コメントの修正完了
(2015.11.07) getCompDuration_pageの追加
(2015.11.03) エラーもなく終了したらグローバル変数の見直し.
(2015.11.03) COMP_DURAT_TIT, WEL, SLP, END, BUFFの削除
(2015.11.03) bgm_timeの削除
(2015.11.03) flg_duratの削除

ノウハウ
AEのLayersオブジェクト配列は1～から始まるので注意
(例) Layers.length = 29なら
Layers[1] ～ Layers[29]

TODO: img, msgフォルダのチェックとOpenDlg
/********************************************************/


function slideShowCreater()
{
resetLog();
debuglog("run..slideShowCreater");
// Project Reset
// resetProject(app);


/**************************************************

	テキストファイルの読み込み
	各読み込み用テキストファイルから文字列と、行数を格納
	message.txtの行数が、スライドページ枚数になる。

**************************************************/
// カレントパスの取得(aepファイルのpath)
var PATH_CURRENT = File.decode(app.project.file.parent);
// メッセージファイルへのパス
var PATH_MSG_TXT = PATH_CURRENT + LOCAL_PATH_MSG_TXT;
// 写真フォルダのパス
var PATH_PHOTO = PATH_CURRENT + LOCAL_PATH_PHOTO;


debuglog('PATH_CURRENT:'+PATH_CURRENT); //デバッグlog.txtへ吐き出し
debuglog('PATH_MSG_TXT:'+PATH_MSG_TXT); //デバッグlog.txtへ吐き出し
debuglog('MAX_COL_MSG_TXT:'+MAX_COL_MSG_TXT);
debuglog('msg_txt_List.length:'+ MAX_COL_MSG_TXT)
debuglog('msg_txt_List.length:'+ MAX_COL_MSG_TXT);

/**
 * 写真フォルダの読み込み
 */
folderObj = new Folder(PATH_PHOTO);
if(folderObj.exists){
	fileList = folderObj.getFiles("*.jpg");
	
	// alert(fileList.length+"個のファイルがあります");
	// fileList_jpg = folderObj.getFiles("*.jpg");
	// fileList_JPG = folderObj.getFiles("*.JPG");

	// var fileList = fileList_jpg.concat(fileList_JPG);

	PAGE_NUM = fileList.length;

	
}else{
	alert('写真が読み込めませんでした。。\nプロジェクトファイルの直下に/img/フォルダを作成してください。ファイル名は001.jpg形式です. \n※jpg以外のファイルを読み込ませたい場合は制作者に問い合わせてください。\
		\n※また、個人で設定するならばuser-config.jsxのTYPE_PHOT = .jpgを書き換えてください');
	return 0;
}


/**
 * メッセージフォルダの読み込み
 */
fileObj = new File(PATH_MSG_TXT);
if(fileObj.exists){
}else{
	alert('コメントファイルが読み込めませんでした。。プロジェクト(.aep)ファイル直下に'+LOCAL_PATH_MSG_TXT+'を作成してください。\n※注意: 一行一ページです。\n※ヒント: 改行は%nと入れておくと、自動で改行するよ.')
	return 0;
}

/**
 * テキストファイルを開く
 */
var msg_txt_List = [];
msg_txt_List = parseTextFile(PATH_MSG_TXT);
var MAX_COL_MSG_TXT = msg_txt_List.length-1; // EOF除去


/**
 * 写真枚数とコメント行数のエラー処理
 */
if(PAGE_NUM == MAX_COL_MSG_TXT){
	debuglog('PAGE_NUM:'+PAGE_NUM+', MAX MSG: '+MAX_COL_MSG_TXT);
}else if(PAGE_NUM < MAX_COL_MSG_TXT){
	debuglog('PAGE_NUM:'+PAGE_NUM+', MAX MSG: '+MAX_COL_MSG_TXT);
}else if(PAGE_NUM > MAX_COL_MSG_TXT){
	debuglog('PAGE_NUM:'+PAGE_NUM+', MAX MSG: '+MAX_COL_MSG_TXT);
}



debuglog('>> Fin.. Photo exits Check!!')
/**************************************************
	コンポジションの作成
	コンポジションの時間の定義(重要)
**************************************************/
function getDefaultCompParam(){
	// 各コンポジションのパラメータ
	this.name = "Default";
	this.width = COMP_WIDTH;
	this.height = COMP_HEIGHT;
	this.pixasp = COMP_PIXASP;
	this.duration = 1; //COMP_DURAT_REN;
	this.fps = COMP_FPS;
}

// コンポジションの全体の長さ(COMP_DURAT_RENから
// 1ページの長さを計算
COMP_DURAT_PAGE = getCompDuration_page(COMP_DURAT_REN, PAGE_NUM, CROSS);

// コンポジションのパラメータ
var SlidePageComp_param = new getDefaultCompParam();
SlidePageComp_param.name = SlidePageCompName;
SlidePageComp_param.duration = COMP_DURAT_REN;
// SlidePageComp_param.stime = COMP_DURAT_TIT+COMP_DURAT_WEL; //常に0

// 各コンポジションの作成
var SlidePageComp 	= makeComp( SlidePageComp_param );


/**************************************************
	SlidePageCompの作成
**************************************************/
// 各ページ用 コンポジションの作成
var PageCompList = [];		// ページコンポジションバッファー
try{
	// (順番重要)
	for (var i = PAGE_NUM ; i > 0; i--) {
		// ページ用コンポジションの作成と格納
		COMP_NAME = "PageComp_" + i;
		PageCompList[i] = app.project.items.addComp(COMP_NAME, COMP_WIDTH, COMP_HEIGHT, COMP_PIXASP, COMP_DURAT_PAGE, COMP_FPS);
		// スライドショー用コンポジションへの格納
		SlidePageComp.layers.add(PageCompList[i]);
	}
}catch(e){
	debuglog("SlidePageCompの作成でエラー");
	debuglog(e);
}

debuglog('>> Fin.. Create Slideshow Composition')


// 写真の読み込み
// 事前に/img/に000.jpgで入れておく。
//***********************************************//
var PhotoList=[];
var PhotoLayers=[]

for (var i = 1; i <= PAGE_NUM ; i++) {
	// ファイルの指定
	var pNUM = ("00"+i).slice(-3);	// ゼロ埋め
	var loadFile = PATH_CURRENT+LOCAL_PATH_PHOTO+pNUM+TYPE_PHOT;
	// // ファイルのインポート
	PhotoList[i] = importFootage(loadFile);
	if(PhotoList[i] == "shutdown!"){
		alert("写真を読み込めませんでした."+loadFile);
		return 0;
	}

	//コンポジションに追加
	var myLay = PageCompList[i].layers.add( PhotoList[i] );
	PhotoLayers[i] = myLay;

	var scaleVal=1;

    if(PHOTO_SCALE_TYPE == "V"){
		// サイズをコンポジションの縦幅に合わせる。
		var newHeight = COMP_HEIGHT;
		var orgHeight = myLay.height
		var scaleValY = newHeight/myLay.height*100;
		scaleVal = scaleValY;
    }
    if(PHOTO_SCALE_TYPE == "H"){
		// サイズをコンポジションの縦幅に合わせる。
		var newWidth = COMP_WIDTH;
		var orgWidth = myLay.width
		var scaleValX = newWidth/myLay.width*100;
		scaleVal = scaleValX;
	}

	myLay.transform.scale.setValue([scaleVal, scaleVal, scaleVal]);
	// alert('スライドショー画像のサイズ変更でえらー')

	// スケールアニメーションの設定
	var myLayProp = myLay.property("ADBE Transform Group").property("ADBE Scale");
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE *0.0, [SCALE_IN*scaleVal/100, SCALE_IN*scaleVal/100]);
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE *1.0, [SCALE_OUT*scaleVal/100, SCALE_OUT*scaleVal/100]);
}


// メッセージ用オブジェクト テキストオブジェクトの作成
//***********************************************//
// ユーザ定義定数
debuglog('>> CreateText Objects');
var TEXTPOS_X = COMP_WIDTH * TXTPOS_X_SPC;
var TEXTPOS_Y = COMP_HEIGHT* TXTPOS_Y_SPC;
var TEXT_WIDTH = TXT_WIDTH_SPC;
var TEXT_HEIGHT = TXT_HEIGHT_SPC;

var MesObjList=[]; // テキストフッテージ
for (var i = 1; i <= PAGE_NUM ; i++) {
	debuglog('>>> Load Text :'+i+'[line]');

	MesObjList[i] = makeSubCompToText(
							PageCompList[i], 
							TEXT_WIDTH, 
							TEXT_HEIGHT, 
							msg_txt_List[i],
							[TEXTPOS_X, TEXTPOS_Y]
							);
	MesObjList[i].name = "Message Text"+i;

	// テキストのプロパティの設定
	var txtDoc = getTextDocDefault();
	txtDoc.fillColor = [1, 1, 1];
	txtDoc.strokeColor = [0, 0, 0];
	// フォントの縁の太さ
	// txtDoc.strokeWidth = 4;
	txtDoc.strokeWidth = FONT_STROKEWIDHT;
	// フォントサイズ
	txtDoc.fontSize = FONT_SIZE_SPC;
	// フォント名
	txtDoc.font = FONT_SCP;
	// カーニング(http://aejsx.hiroshisaito.net/textdocument-object/attributes/justification)
	txtDoc.justification = ParagraphJustification.LEFT_JUSTIFY	 //段落タブの段落指定。この場合テキストの中央揃え。
	

	// テキスト設定を反映
	resetTextDocument(MesObjList[i]);
	setTextDocument(MesObjList[i], txtDoc)

	delete txtDoc;
}

// スライドショーの作成
//***********************************************//
var myLays = SlidePageComp.layers;
for (var i=myLays.length; 0 < i ; i--){

	// 透過の設定
	myLayProp = myLays[i].property("ADBE Transform Group").property("ADBE Opacity");
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE * 0.0, 0);
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE * CROSS, 100);
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE * (1 - CROSS), 100);
	myLayProp.setValueAtTime(  COMP_DURAT_PAGE * 1.0, 0);

	// シーケンスの設定
	myLays[i].startTime =  COMP_DURAT_PAGE * (i-1) * (1-CROSS);
}


/**************************************************

	フォルダリング

**************************************************/
// 写真用フォルダの作成
// -----------------
var photoFolder = app.project.items.addFolder("Photo ("+ (PhotoList.length-1) +")");
var fNum = PhotoList.length;
for (var i = 1; i <= fNum-1; i++) {
	PhotoList[i].parentFolder = photoFolder;
};

// スライドページコンポジション用フォルダ作成
// ----------------------------
var pageFolder = app.project.items.addFolder("PageComp ("+ (PageCompList.length-1) +")");
for (var i = 1; i <= PhotoList.length-1; i++){
	PageCompList[i].parentFolder = pageFolder;
};

// スライドページコンポジションをまとめたフォルダ
// ---------------------------------
var SlideShowFolder = app.project.items.addFolder(SlidePageCompName);
photoFolder.parentFolder = SlideShowFolder;
pageFolder.parentFolder = SlideShowFolder;


debuglog(">> SUCCESE!! Slide Show Created!!");

// コンポジションをコンポジションパネルで開き最前面に移動してフォーカスします。
// -------------------------------------------------
try{
	SlidePageComp.openInViewer();
}catch(e){
	debuglog('\n>> ERROR! openInViewer')
	debuglog(e);
}

/**************************************************

	スライドショーコンポジション、写真、メッセージ等の重要オブジェクトを
	グローバルに保存

**************************************************/
CONFIG.SlidePageComp = SlidePageComp;
CONFIG.SlideShowFolder = SlideShowFolder;

// Array
CONFIG.PageCompList = PageCompList;
CONFIG.PhotoList = PhotoList;
CONFIG.PhotoLayers = PhotoLayers;
CONFIG.MesObjList = MesObjList;

return 'SUCCESE';

};
