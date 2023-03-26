// Create context menu item on extension install
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "jisho-search",
    title: "Search Jisho \"%s\" (Ctrl+Shift+X)",
    contexts: ["selection"]
  });
});

// Function to open Jisho search page in new tab
function searchJisho(selectedText) {
  var linkUrl = "https://jisho.org/search/" + encodeURIComponent(selectedText);
  chrome.tabs.create({ url: linkUrl });
}

// Event listener for context menu item click
chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId === "jisho-search") {
    searchJisho(info.selectionText);
  }
});

// Event listener for keyboard shortcut
chrome.commands.onCommand.addListener(function(command) {
  if (command === "searchInJisho") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs || tabs.length === 0) throw new Error("No active tab found");
      var activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        function: function () {
          var selection = window.getSelection();
          if (!selection) throw new Error("No text selected");
          return selection.toString();
        }
      }, function(selection) {
        try {
          if (!selection || selection.length === 0) throw new Error("No text selected");
          var selectedText = selection[0].result;
          searchJisho(selectedText);
        }
        catch (error) {
          console.error(error.message);
        }
      });
    });
  }
});
