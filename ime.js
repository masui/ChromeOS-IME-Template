var contextID = -1;

var pat = "";              // 入力パタン
var candidates = [];
var selectedCand = -1;

chrome.input.ime.onFocus.addListener(function(context) {
    contextID = context.contextID;
});

chrome.input.ime.onBlur.addListener(function(context) {
    contextID = -1;
});

function showCands(){
    var candmenus = [];

    candmenus.push({'candidate':"候補1", 'id':0});
    candmenus.push({'candidate':"候補2", 'id':1});
    candmenus.push({'candidate':"候補3", 'id':2});

    chrome.input.ime.setCandidates({
	contextID:contextID,
	candidates:candmenus
    });
}

function fix(){ // 確定
    chrome.input.ime.commitText({
    	"contextID": contextID,
    	"text": pat
    });
}

function showComposition(text){
    var obj = {
	contextID: contextID,
	text: text,
	cursor: text.length,
	selectionStart: 0,
	selectionEnd: text.length
    };
    chrome.input.ime.setComposition(obj); // カーソル位置に未変換文字列をアンダーライン表示
}

chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
	var handled = false;

        chrome.input.ime.setCandidateWindowProperties({
            engineID:engineID,
            properties:{
                visible:true,
                cursorVisible:false,
                vertical:true,
                pageSize:3
            }
        });
            
        if(keyData.type == "keydown" && keyData.key.match(/^[a-z0-9,'\-\.\{\}\(\)]$/)){
            pat += keyData.key;
	    showComposition(pat);
	    showCands();
            handled = true;
        }
        if(keyData.type == "keydown" && (keyData.key == "Enter" || keyData.key == ";")){
	    fix();
	    pat = "";
	    handled = true;
	}
	
	return handled;
    }
);

