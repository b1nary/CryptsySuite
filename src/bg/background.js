

//chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
//	if(changeInfo.status == "complete"){
//		if( tab.url.indexOf("https://www.cryptsy.com") == 0 ){
//			if ( settings["sidebar"]["hide_USD"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-usd-markets')[0].style.display = 'none';"});
//			}
//			if ( settings["sidebar"]["hide_BTC"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-btc-markets')[0].style.display = 'none';"});
//			}
//			if ( settings["sidebar"]["hide_LTC"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-ltc-markets')[0].style.display = 'none';"});
//			}
//			if ( settings["sidebar"]["hide_XPM"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-xpm-markets')[0].style.display = 'none';"});
//			}
//			if ( settings["sidebar"]["hide_Cryptsy"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-cryptsy-points')[0].style.display = 'none';"});
//			}
//			if ( settings["sidebar"]["hide_Account"] == true ){
//				chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('moduletable-account-balances')[0].style.display = 'none';"});
//			}
//		}
//	}
//});