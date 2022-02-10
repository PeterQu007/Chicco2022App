//SpreadSheet Summary Page
//show / hide as per needed

import uiSummaryTable from "../assets/scripts/ui/uiSummaryTable.js";
var $fx = L$();

var spreadSheetSummary = {
  init: function () {
    //link to iframe's tabID
    // this.tabID = $fx.getTabID(window.frameElement.src); //prefixed with # id-sign
    //this.$tabContentContainer = $('div' + this.tabID, top.document)
    //this.onMessage();
    // this.tabTitle = this.getTabTitle(this.tabID);

    console.log("Spreadsheet Document URL: ", document.URL); ///THIS URL CONTAINS TAB.ID

    this.tabID = $fx.getTabID(document.URL); ///LOOK FOR TAB.ID PREFIXED WITH # ID.SIGN
    this.searchTabID = $fx.getSearchTabID(document.URL);
    this.tabNo = parseInt(this.tabID.replace("#tab", "")); ///LOOK FOR TAB.NO
    var x = $("ul#tab-bg", top.document); ///find the top tab panel
    var y = x.children("li")[this.tabNo];
    this.tabTitle = $(y).children().find("span").text().trim(); ///LOOK FOR TAB.TITLE
    console.warn(
      "tabID, tabNo, tabTitle",
      this.tabID,
      this.tabNo,
      this.tabTitle
    );
    this.uiTable.tabTitle = this.tabTitle;
    this.uiTable.parent = this;

    //console.warn('tabID, tabTitle', this.tabID, this.tabTitle);
    //this.OnTabTitle();
    console.log(
      "Add Square Feet Price SummaryBox- document url:",
      document.URL
    );
    var $SummaryBox = $("div#dialogStats");
    console.warn("Summary box: ", $SummaryBox);
    this.uiTable.showUI_B($SummaryBox);
    // this.uiTable.setSumValues(
    //   /*id for panel 1 - assess change active listings*/
    //   1,
    //   [100, 101, 102, 103],
    //   12,
    //   "%"
    // );
    // this.uiTable.setSumValues(
    //   /*id for panel 2 - assess change sold listings*/
    //   2,
    //   [200, 201, 202, 203],
    //   2,
    //   "%"
    // );
    // this.uiTable.render_B(1);
    // this.uiTable.render_B(2);
    // this.uiTable.render_B(3);

    this.onPostMessage();

    // this.$mutationObserver = new MutationObserver(function(mutations) {
    //     mutations.forEach(function(mutation) {
    //       console.log(mutation);
    //     });
    //   });
    // this.$mutationObserver.observe(document.documentElement, {
    //     attributes: true,
    //     characterData: true,
    //     childList: false,
    //     subtree: true,
    //     attributeOldValue: true,
    //     characterDataOldValue: true
    //   });
  },

  tabID: null,
  tabTitle: null,
  $SummaryBox: null,
  $table: null,
  $mutationObserver: null,
  uiTable: new uiSummaryTable(this),
  //$loadingNotice: null,

  onPostMessage() {
    window.addEventListener("message", (event) => {
      if (
        event.origin.indexOf(
          "https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/"
        )
      ) {
        // The data has been sent from your site

        // The data sent with postMessage is stored in event.data
        console.log(event.data);
        let eventData = JSON.parse(event.data);

        if ((eventData.action = "showSummaryStats")) {
          console.log(eventData.sumInfo);
          this.showSummaryStats(eventData.sumInfo);
        }
      } else {
        // The data hasn't been sent from your site!
        // Be careful! Do not use it.
        return;
      }
    });
  },

  OnTabTitle: function () {
    let self = this;
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area == "local" && "todo" in changes) {
        if (changes.todo.newValue.indexOf("getTabTitle") > -1) {
          console.log("command::getTabTitle:", changes.todo.newValue);
          chrome.storage.local.get(
            ["getTabTitle", "from", "showTabQuickSearch"],
            function (result) {
              self.tabTitle = result.getTabTitle;
              console.log("OnTabTitle.getTabTitle:", result);
              //showQuickSearchTab
              if (
                !result.showTabQuickSearch &&
                result.getTabTitle.trim() == "Quick Search"
              ) {
                chrome.storage.local.set({
                  from: "QuickSearch",
                  todo: "hideQuickSearch" + Math.random().toFixed(8),
                  tabID: self.tabID,
                });
              }
            }
          );
        }
      }
    });
  },

  getTabTitle: function (tabID) {
    chrome.runtime.sendMessage(
      {
        todo: "getTabTitle",
        from: "quickSearch",
        tabID: tabID,
      },
      function (response) {
        //self.tabTitle = response.tabTitle;
        //self.updateQuickSearchTabStatus();
        console.warn("QuickSearch.getTabTitle::", response);
        return response;
      }
    );
  },

  getTabStatus: function () {
    let self = this;
    chrome.storage.local.get("showTabQuickSearch", function (result) {
      if (result.showTabQuickSearch) {
        self.showQuickSearch();
      } else {
        self.hideQuickSearch();
      }
    });
  },

  showQuickSearch: function () {
    chrome.runtime.sendMessage({
      from: "QuickSearch",
      todo: "showQuickSearch",
      tabID: this.tabID,
    });
  },

  hideQuickSearch: function () {
    chrome.runtime.sendMessage({
      from: "QuickSearch",
      todo: "hideQuickSearch",
      tabID: this.tabID,
    });
  },

  showSummaryStats: function (sumInfo) {
    this.uiTable.setSumValues(
      /*id for panel 1 - assess change active listings*/
      ...sumInfo.sumValues[0]
    );
    this.uiTable.setSumValues(
      /*id for panel 2 - assess change sold listings*/
      ...sumInfo.sumValues[1]
    );
    this.uiTable.render_B(1);
    this.uiTable.setSumValues(
      /*id for panel 1 - assess change active listings*/
      ...sumInfo.sumValues[2]
    );
    this.uiTable.setSumValues(
      /*id for panel 2 - assess change sold listings*/
      ...sumInfo.sumValues[3]
    );
    this.uiTable.render_B(2);
    this.uiTable.setSumValues(
      /*id for panel 1 - assess change active listings*/
      ...sumInfo.sumValues[4]
    );
    this.uiTable.setSumValues(
      /*id for panel 2 - assess change sold listings*/
      ...sumInfo.sumValues[5]
    );
    this.uiTable.render_B(3);
  },
};

//entry point:
// $(function () {
//     spreadSheetSummary.init();
// })

//Try window.on(load)
$(window).on("load", function () {
  this.console.log("document ready state:", document.readyState);
  spreadSheetSummary.init();
});
