// works with Paragon's main window
// inject to Paragon's Url: http://bcres.paragonrels.com/ParagonLS/Default.mvc*
// the messages are passed between the defaultpage and iframes, all are the content scripts

//import Tabs from '../assets/scripts/modules/mlsTabs';
// import MainNavBar, {
//   mainNavItem
// } from "../assets/scripts/modules/MainNavBar";
// let mainNavItem = new MainnNavBar();
// import MainMenu from "../assets/scripts/modules/MainMenu";
// let MainMenu = new MainMenu();
// var _ = require("underscore");

(function ($) {
  $.fn.inlineStyle = function (prop) {
    return this.prop("style")[$.camelCase(prop)];
  };
})(jQuery);

async function setDebugMode() {
  /// 设定调试输出模式
  let debugSettingInfo = await chrome.runtime.promise.sendMessage({
    debugID: "debug_home_page", /// 保存在DouchDB debugsettings表格中
    from: "HomePage.js",
    todo: "readDebugSetting",
  });
  let debugSetting = debugSettingInfo.data.value;
  console.currentPage = {
    log: debugSetting ? console.log : () => {},
    logAlways: console.log,
    logDebug: (tag, pageName) => {
      if (!debugSetting) {
        console.log(`(${tag} DISABLED: ) ${pageName} ()`);
      }
    },
    warn: debugSetting ? console.warn : () => {},
  };

  console.currentPage.logDebug("Debug", "HomePage.js");
}

/// 程序入口 Start point
$(function () {
  setDebugMode().then(() => {
    DefaultPage.init();
  });
});

/// 程序模块
let DefaultPage = {
  init: function () {
    // Open frequently used tabs:
    this.mainMenu.openTaxSearch();
    this.mainMenu.openListingCarts();
    this.mainMenu.openSavedSearches();
    this.mainMenu.loadSubjectProperties();

    this.mainNavBar = new MainNavBar();
    //console.log(this.topTabs);
    this.onMessage();
    this.onChanged();
    this.post();
    chrome.storage.local.get("keywords", (results) => {
      console.currentPage.log(results.keywords);
      // this.powerSearch.text(results.keywords);
      this.powerSearch.val(results.keywords);
    });
  },

  mainMenu: new MainMenu(),
  //tabs: new Tabs(),
  mainNavBar: null,
  powerSearch: $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  ),

  onMessage() {
    (function (self) {
      chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
      ) {
        // get Warning message: the search results exceed the limit, ignore it
        if (request.todo == "ignoreWarning") {
          // Warning Form is a special page, the buttons are in the div,
          // the iframe is separate with the buttons
          // this message sent from mls-warning.js
          //console.currentPage.log('Main Home ignore warning message!', $('#OK'));
          var countTimer = setInterval(checkCount, 100);

          function checkCount() {
            // #OK button, "Continue", belongs to default page
            if (document.querySelector("#OK")) {
              clearInterval(countTimer);
              let btnOK = $("#OK");
              //console.currentPage.log('OK', btnOK);
              btnOK.click();
            }
          }
        }

        // Logout MLS Windows shows an annoying confirm box, pass it
        // The message sent from logout iframe , the buttons are inside the iframe
        if (request.todo == "logoutMLS") {
          //console.currentPage.log('Main Home got logout message!');
          //console.currentPage.log($('#confirm'));
          var countTimer = setInterval(checkCount, 100);

          function checkCount() {
            // the button is inside the iframe, this iframe belongs to default page
            if (document.querySelector("#confirm")) {
              clearInterval(countTimer);
              let btnYes = $("#confirm");
              //console.currentPage.log('confirm', btnYes);
              btnYes.click();
            }
          }
        }

        //Top Level Tabs Changed
        if (request.todo == "updateTopLevelTabMenuItems") {
          // update tabs
          self.tabs = $("ul#tab-bg li");
          console.currentPage.log(
            "default home page update top level tabs: ",
            tabs
          );
          self.curTabLink = $(
            "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
          );
          self.curTabID = curTabLink.attr("href");
          chrome.storage.local.set({
            curTabID: self.curTabID,
          });
        }

        //Read the Current TabID
        if (request.todo == "readCurTabID") {
          // read cur tabID
          self.tabs = $("ul#tab-bg li");
          console.currentPage.log(
            "default home page read top level tabs: ",
            self.tabs
          );
          self.curTabLink = $(
            "ul#tab-bg li.ui-tabs-selected.ui-state-active a"
          );
          self.curTabID = self.curTabLink.attr("href");
          console.currentPage.log("current Tab ID is: ", self.curTabID);
          // save the curTabID
          chrome.storage.local.set(
            {
              curTabID: self.curTabID,
            },
            function () {
              console.currentPage.log("curTabID has been save to storage.");
            }
          );
        }

        //Sync Tab to Content
        if (request.todo == "syncTabToContent") {
          console.group("defaultpage.syncTabToContent");
          self.mainNavBar.topTabInfos.forEach(function (tabInfo) {
            console.info("tab in topTabInfos: ", tabInfo);
            tabInfo.syncTabToContent();
          });
          console.groupEnd();
        }

        //Hide QuickSearch Tab Content
        if (request.todo == "hideQuickSearch") {
          console.group("defaultPage.hideQuickSearch.tabID:", request.tabID);
          self.mainNavBar.topTabInfos.forEach(function (tabInfo) {
            if (tabInfo.tabID == request.tabID) {
              console.info("defaultPage.QuickSearch.tabInfo:", tabInfo);
              tabInfo.DeactivateThisTab();
            }
          });
          console.groupEnd();
        }

        //get TabTitle by TabID
        if (request.todo == "getTabTitle") {
          console.group("getTabTitle", request.tabID);
          self.mainNavBar.mainNavItems.forEach(function (navItem) {
            if (navItem.ID == request.tabID) {
              console.currentPage.log(
                "find tabTitle:",
                navItem.ID,
                navItem.Title
              );
              sendResponse({
                tabID: navItem.ID,
                tabTitle: navItem.Title,
              });
            }
          });
          console.groupEnd();
        }

        //get TabTitle by TabID
        if (request.todo == "addLock") {
          console.currentPage.log("addLock", request.tabID);
          if (request.tabID != "#") {
            self.mainNavBar.update();
            self.mainNavBar.addLock(request.tabID);
            console.currentPage.log("addLock Succeed");
            sendResponse("[.HomePage] addLock Succeed []");
          } else {
            console.currentPage.log("Cannot addLock");
            sendResponse("[.HomePage] addLock Failed []");
          }
        }

        return true;
      });
    })(this);
  },

  onChanged() {
    let self = this;
    //listen the change from QuickSearch
    chrome.storage.onChanged.addListener(function (changes, area) {
      //hide QuickSearchTab & TabContent
      if (
        area == "local" &&
        "todo" in changes &&
        changes.todo.newValue.indexOf("hideQuickSearch") > -1
      ) {
        console.currentPage.log(
          "onTabStatusUpdate.command::",
          changes.todo.newValue
        );
        self.mainNavBar.topTabInfos.forEach(function (tabInfo) {
          if (tabInfo.tabTitle.trim() == "Quick Search") {
            tabInfo.DeactivateThisTab();
          }
        });
      }
    });
  },

  post() {
    var title = this.mainNavBar.mainNavItems[1].Title;
    var id = this.mainNavBar.mainNavItems[1].tabID;
    var array1 = [1, 2, 3, 4, 5, 6];
    console.currentPage.log({
      postTitle: title,
      postID: id,
    });
    console.currentPage.log(_);
    var subArray = _.max(array1);
    console.currentPage.log(subArray);

    // $.post('http://localhost/ChromeX/MLSHelper/app/test.php', {postTitle: title, postID: id}, function(data){
    //     console.currentPage.log(data);
    // })

    // http://pidrealty.local/wp-content/themes/realhomes-child/db/data.php

    // $.post(
    //   "http://pidrealty.local/wp-content/themes/realhomes-child/db/data.php",
    //   { postTitle: title, postID: id },
    //   function(data) {
    //     console.currentPage.log(data);
    //   }
    // );

    $.ajax({
      //url:
      //  "http://localhost/pidrealty4/wp-content/themes/RealHomes-child-3/db/data.php",
      //  "https://pidrealty4.local/wp-content/themes/RealHomes-child-3/db/data.php",
      url: "https://pidrealty.ca/wp-content/themes/realhomes-child-3/db/data.php", // 连接到Synology的MySQL数据库
      method: "post",
      data: {
        postTitle: title,
        postID: id,
      },
      success: function (res) {
        console.currentPage.log(res);
        $('input[name="textbox"]').val(
          JSON.stringify(res) + ":: connect to MySQL successfully!"
        );
      },
    });
  },
};
