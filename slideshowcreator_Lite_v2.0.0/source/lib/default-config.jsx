/********************************************************

	---- setting   ver.0.5 ----
	システム初期値の環境変数

	※ 絶対に変更してはだめ!!

		by fifi  2015/11/07

/********************************************************/

var LOCAL_PATH_WEL_TXT = "/msg/welcome.txt";
var LOCAL_PATH_MSG_TXT = "/msg/message.txt";
var LOCAL_PATH_END_TXT = "/msg/end.txt";
var LOCAL_PATH_BGM ="/bgm/bgm_footage.mp3";
var PATH_TIT = "/movie/title_footage.avi";
var PATH_BG= "/movie/bg_footage.wmv";

/**************************************************
	コンポジションの作成
**************************************************/
// 共通パラメータ
//***********************************************//
var SlidePageCompName = "SlidePageComp";
var COMP_NAME = "Comp Name default";
var COMP_WIDTH = 720;
var COMP_HEIGHT = 480;
var COMP_PIXASP = 1.0;
var COMP_DURAT = 10;
var COMP_FPS = 29.97;

/**************************************************
	コンポジションの時間
*************************************************/
// global変数
// var COMP_DURAT_TIT 		= 0;
// var COMP_DURAT_WEL 	= 0;
// var COMP_DURAT_SLP 		= 0;
// var COMP_DURAT_END 		= 0;
// var COMP_DURAT_BUFF		/= 0;
// var bgm_time 				= 0;
// var flg_durat ="";

// 固定値
// -------------------------------
// タイトルの長さ
// var COMP_DURAT_TIT 	= 8;
// ウェルカムの長さ
// var COMP_DURAT_WEL = 15;
// エンドの長さ
// var COMP_DURAT_END 	= 10;
// スライドショーのフェードの長さ
// バッファー
// var COMP_DURAT_BUFF = 5;

var COMP_DURAT_PAGE 	= 0;
var COMP_DURAT_REN 		= 0;
var CROSS = 0.1; //Ratio[%]

//デフォルト
// flg_durat = "movietime";
COMP_DURAT_RENDER_MIN = 5;
COMP_DURAT_RENDER_SEC = 0;
COMP_DURAT_REN = COMP_DURAT_RENDER_MIN*60 + COMP_DURAT_RENDER_SEC;

/**************************************************
	TitleCompの作成
**************************************************/

/**************************************************
	WelcomeCompの作成
**************************************************/
// メッセージ用ボックステキストのサイズ
// var TXT_WIDTH_WEL = 600;
// var TXT_HEIGHT_WEL = 150;
// var FONT_FAMILY_WEL = "HuiFont";
// var FONT_SIZE_WEL = 40;
/**************************************************
	SlidePageCompの作成
**************************************************/
// 写真の読み込み  /img/に000.jpgで入れておく。
var LOCAL_PATH_PHOTO = "/img/"; // 相対パスではない。プロジェクト直下のフォルダのみ対応
var TYPE_PHOT = ".jpg"; // 拡張子は自由に変更可能

var PHOTO_SCALE_TYPE = "V"; // 縦合わせ
var PHOTO_SCALE_TYPE = "H"; // 横型

// テキストレイヤを作成
// メッセージ用ボックステキストのサイズ
var TXT_WIDTH_SPC = 600;
var TXT_HEIGHT_SPC = 150;
var TXTPOS_X_SPC 	= 0.5;
var TXTPOS_Y_SPC 	= 0.95;
var FONT_SIZE_SPC = 40;
var SCALE_IN 		= 95;
var SCALE_OUT 	= 90;

// フォントサイズ
var FONT_SIZE_SPC   = 32.2;
// フォントの縁の太さ
var FONT_STROKEWIDHT = 10;
// フォントの選択
// var FONT_SCP = "KFhimaji"
var FONT_SCP = "azukifontB"
var FONT_SCP_LIST = ["azukifontB", "KFhimaji"];

/**************************************************
	EndCompの作成
**************************************************/
// メッセージ用ボックステキストのサイズ
// var TXT_WIDTH_END = 600;
// var TXT_HEIGHT_END = 300;
// var FONT_FAMILY_END = "HuiFont";
// var FONT_SIZE_END = 40;

/**************************************************
	BGCompの作成
**************************************************/
// 背景動画のループ
var BG_LOOP = 70;
var BGCOMP_FIT = "width-fit";
