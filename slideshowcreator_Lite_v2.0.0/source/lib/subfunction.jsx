/********************************************************

	---- subfunction ver 2.0.0 ----
	サブ関数定義

		by fifi  2015/11/07

(2015.11.07) getCompDuration_pageを追加
(2015.11.03) resetTextDocument()を追加

/********************************************************/
// メモ
//***********************************************//
// app.project.save( new File(PATH_CURRENT + "/" + wel_txt_List[PROJ_NAME_NUM]));


// フォルダの選択。キャンセル時にはnullを返す。
//***********************************************//
// var folder=Folder.selectDialog("output to folder");

// システム変数
//***********************************************//
var systemFunc = function(app){
	$.os;
	$.locale;
	$.screens;
	app.version;
	app.isoLanguaage;
}

// プロジェクト初期化関数
//***********************************************//
var resetProject = function(app){
	while ( 0 <  app.project.items.length){
    		app.project.item(1).remove();
	}
}

// デバッグ用ログ関数
// log.txtに書き込む。
//***********************************************//
var debuglog = function(str){
	$.writeln(str);
	PATH_CURRENT = File.decode(app.project.file.parent);
	path = PATH_CURRENT+'/'+'log.txt';

	f = File(path);
	if(f instanceof File){fl = f}

	if(typeof(f) =="string"){fl = new File(f)}

	if (fl.open("a",'UTF-8')){
		try{
			fl.writeln(str);
			fl.close();

		}catch(e){}
	}
}
// デバッグ用ログ関数
// log.txtの中身を削除
//***********************************************//
var resetLog = function(){
	$.writeln('resetlog');
	PATH_CURRENT = File.decode(app.project.file.parent);
	path = PATH_CURRENT+'/'+'log.txt';

	f = File(path);
	if(f instanceof File){fl = f}

	if(typeof(f) =="string"){fl = new File(f)}

	if (fl.open("w", 'UTF-8')){
		try{
			fl.writeln('>>');
			fl.close();

		}catch(e){}
	}
}

// 保存されていないプロジェクトでのエラー回避
//***********************************************//
var checkProject = function(app){
	try{
		chk = app.project.file.parent;
	}catch(e){
		alert('ERROR::保存されたファイルを使用してください');
	}
	return chk;
}

// テキストファイルのインポートとパース関数
//***********************************************//
var parseTextFile = function(PATH){
	var fileObj = new File(PATH);
	var txt_List = [];
	var line=1;
	if (fileObj.open("r")){
		while(!fileObj.eof){
			var s = fileObj.readln();
			txt_List[line] = s.split("%n").join(String.fromCharCode(13));
			line++;
		}
		fileObj.close();
	}else{
		alert("parseTextFile::ERROR::ファイルがひらけませんでした::"+PATH);
	}
	return txt_List;
}

// コンポジション作成用関数
//***********************************************//
var makeComp = function(param){

	var new_comp = app.project.items.addComp(
		param.name, 
		param.width, 
		param.height, 
		param.pixasp, 
		param.duration, 
		param.fps);

	return new_comp;
}

// フッテージファイルのインポート用関数
//***********************************************//
var importFootage = function(PATH){

	// ファイルのインポート (おまじない)
	try{
		var io = new ImportOptions( File( PATH ));
		if ( io.canImportAs( ImportAsType.COMP)){
			io.ImportAs = ImportAsType.COMP;
		}else{
			io.ImportAs = ImportAsType.FOOTAGE;
		}
		var footage = app.project.importFile(io);
	}catch(e){
		// ファイルが読み込めなかたときの処理
		alert(e);	
		var footage = "shutdown!";
	}

	return footage;

}

// テキストのみのコンポジションの作成用関数
//***********************************************//
// あるコンポジションの元にテキストレイヤのみのコンポジションを作成する
var makeSubCompToText = function(Comp, TEXT_WIDTH, TEXT_HEIGHT, a_txt, txt_pos){

	var txt = a_txt || "";

	// あるコンポジションにテキストボックスオブジェクトを作成
	var myLay=[]
	try{
		myLay = Comp.layers.addBoxText([ TEXT_WIDTH, TEXT_HEIGHT ], txt);
	}catch(e){
		alert('makeSubCompToTextでのテキストボックスの生成に失敗')
		debug('makeSubCompToTextでのテキストボックスの生成に失敗')
		alert(Comp.name);
	}

	// テキストプロパティの設定
	// var txtDoc = getTextDocDefault();
	// setTextDocument(myLay, txtDoc);
	
	// テキストレイヤーのポジションの設定
	myLay.position.setValue( txt_pos);

	// テキストの読み込み
	myLay.text.sourceText.setValue(txt);
	
	return myLay;

}

// (初期設定)テキストオブジェクトの初期プロパティ
//***********************************************//
var getTextDocDefault = function(){
	var txtDocDefault = {
		font: "MS UI Gothic",	 //"MS Gothic" "Meiryo UI" 
		// font: "azukifontB",
		fontSize: 40,	  //40
		applyFill: true,	 //塗り色の指定を受けるか
		fillColor: [0,0,0],	 //テキストレイヤーの色
		applyStroke: true,	 //文字の周りの囲みの色の有無：trueでアリ
		strokeColor: [1,1,1],		//囲みの色指定
		strokeOverFill: false,	 //false 線の上に塗り
		strokeWidth: 4,	 //囲み幅
		tracking: 50,	 //字詰め幅の指定
		justification: ParagraphJustification.LEFT_JUSTIFY	 //段落タブの段落指定。この場合テキストの中央揃え。
	}
	return txtDocDefault;
}

// (低級関数)テキストオブジェクトのプロパティの設定
//***********************************************//
var setTextDocument = function(txtLay, txtDoc){
	var textProp = txtLay.property("Source Text");
	var textDocument = textProp.value;
	// textDocument.resetCharStyle(); //文字パネルをモトの状態に戻す
	for (var key in txtDoc){
		textDocument[key] = txtDoc[key];
	}

	try{
		textProp.setValue(textDocument); //上部値をプロパティに入れる。
	}catch(e){
		alert('setTextDocumt ERROR')
		alert(e);
	}
	return 0
}

/**
 * 文字パネルをモトの状態に戻す
 */
var resetTextDocument = function(txtLay){
	var textProp = txtLay.property("Source Text");
	var textDocument = textProp.value;
	//文字パネルをモトの状態に戻す
	textDocument.resetCharStyle();
}


/**
 * objの型を表示
 */
var checkCompItem = function(obj){
	if(obj instanceof CompItem){
		str = ('>>> '+obj.name+' is CompItem :'+(typeof obj))
		str += ('\n>>> comp layer number :' + obj.numLayers)
	}else{
		str = ('obj is not CompItem::'+(typeof obj))
	}
	return str
}

/**
 * objがCompItemかどうかの型チェック
 */
var isCompItem = function(obj){
	if(obj instanceof CompItem){
		return 1;
	}else{
		return 0;
	}
}

/**
 * ページの長さ(時間)を返す。共通化するための関数.
 */
var getCompDuration_page = function(comp_durat_ren, page_num, cross){
	duration = comp_durat_ren/(page_num - page_num*cross + cross);
	return duration;
} 


/**
 * Stringオブジェクトの拡張子変更
 * (Prototype UNO)
 */
//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
String.prototype.changeExt=function(s){
	var i=this.lastIndexOf(".");
	if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
}