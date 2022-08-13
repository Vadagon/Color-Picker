//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type == 'reInit')
		init(sender.tab);
  if(request.type == 'copy')
      copyTextToClipboard(request.text)
	// sendResponse();
	// return true;
});

// chrome.browserAction.onClicked.addListener(function(tab) {
//     init(tab);
// });

function get_screenshot(cb) {
        try {
            chrome.tabs.captureVisibleTab(null, {
                "format": "png"
            }, function(data) {
                if (chrome.runtime.lastError) {
                    return cb(false);
                }
                cb({type: "image_data", data: data });
            })
        } catch (e) {
            chrome.tabs.captureVisibleTab(null, function(data) {
                if (chrome.runtime.lastError) {
                    return cb(false);
                }
                cb({type: "image_data", data: data });
            })
        }
    }


function init(tab){
	chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["/src/content/inject.js"]
  }, function() {
		get_screenshot((e)=>{
			if(e) chrome.tabs.sendMessage(tab.id, e);
		})
  })
}


chrome.action.onClicked.addListener(init);