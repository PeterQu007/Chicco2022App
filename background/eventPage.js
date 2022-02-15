//background script, event mode
//message passed between background - defaultpage - iframes

// import database from "../assets/scripts/modules/Database";
// import dbOffline from "../assets/scripts/modules/Database Offline";
// import { callbackify } from "util";

// import TaxAndAssessQuery from "./searchTax";

const db = new Database();
// var dbo = new dbOffline();
const $fx = L$();
// const newTaxYear = true; //beginning of new year, MLS tax db has not been updated, still use last year's assess. set newTaxYear to false
// const d = new Date(); // 当前日期
// let taxYear = d.getFullYear(); // 当前年份
let taxYear = $fx.currentTaxYear();
// const $today = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
const $today = $fx.getToday_yyyymmdd();
let chromeTabID;
// taxYear = newTaxYear ? taxYear : taxYear - 1; // 纳税年份, 总是使用当前年份
var complexInfoSearchResult = null;
var mlsTable = [];
var assessInfo = null;
let queryTaxAndAssess = null;
let result = null;

console.clear();

// 读取当前的tabID, 如果打开devTool, chrome有一个bug, 导致读取的tabID为空
// 参见: https://stackoverflow.com/questions/59974414/chrome-tabs-query-returning-empty-tab-array
// 更改代码

chrome.windows.getCurrent((w) => {
  chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
    chromeTabID = tabs[0].id;
    console.warn("当前Chrome的tabID是: ", chromeTabID);
  });
});

// chrome.tabs.query({ title: "Paragon 5" }, function (tabs) {
//   chromeTabID = tabs[0].id;
//   console.warn("background events page chromeTabID is: ", chromeTabID);
// });

(function () {
  //console.log("Hello!-1");

  chrome.storage.local.set({
    landValue: 0,
    improvementValue: 0,
    totalValue: 0,
    curTabID: null,
    taxYear: taxYear,
  });

  chrome.browserAction.onClicked.addListener(function (activeTab) {
    //open a link
    // var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
    let newURL = "https://gvfv.clareityiam.net/idp/login";
    chrome.tabs.create({
      url: newURL,
    });
  });

  chrome.webNavigation.onCompleted.addListener(
    function (details) {
      //console.log("Completed!");
      //alert("Completed!");
    },
    {
      url: [{ hostContains: ".paragonrels.com" }],
    }
  );

  /// 模块#0: 添加一般事件处理句柄
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    let generalRequests = [
      "warningMessage",
      "logoutMessage",
      "switchTab",
      "getTabTitle",
      "addLock",
      "hideQuickSearch",
      "updateTopLevelTabMenuItems",
      "readCurTabID",
      "syncTabToContent",
      "saveTableInfo",
      "readMLSTableInfo",
    ];
    if (!generalRequests.includes(request.todo)) return;

    console.eventpage.logRequest(request, sender, "0.General");
    //message from Warning iframe
    if (request.todo == "warningMessage") {
      //console.log("I got the warning message!");
      //pass the message to defaultpage(Main Home Page)
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "ignoreWarning",
          });
        }
      );
    }

    //message from Logout iframe
    if (request.todo == "logoutMessage") {
      //console.log("I got logout message!");
      //pass the message to defaultpage(Main Home Page)
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "logoutMLS",
          });
        }
      );
    }

    if (request.todo == "switchTab") {
      console.log("I got switch Tab message!");
      //pass the message to defaultpage(Main Home Page)
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "switchTab",
            showResult: request.showResult,
            saveResult: request.saveResult,
          });
        }
      );

      sendResponse("switchTab done!!!");
    }

    if (request.todo == "getTabTitle") {
      console.log("Command: ", request.todo, request.from);
      let result = null;
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              todo: "getTabTitle",
              tabID: request.tabID,
            },
            function (response) {
              result = response;
              console.log("getTabTitle response:", response);
              chrome.storage.local.set({
                getTabID: result.tabID,
                getTabTitle: result.tabTitle,
                todo: "getTabTitle" + Math.random().toFixed(8),
                from: "EventPage.getTabTitle",
              });
              sendResponse(response);
            }
          );
        }
      );
      //check(result); //wait for 1 sec, stop eventPage hit the exit point, send out null response
    }

    if (request.todo == "addLock") {
      //get command from sub content script to add lock to the sub content panel
      console.log("Command: ", request.todo, request.from, request.tabID);
      let result = null;
      console.info("Chrome Tab ID is: ", chromeTabID);

      chrome.windows.getCurrent((w) => {
        chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              todo: "addLock",
              tabID: request.tabID,
            },
            function (response) {
              result = response;
              console.eventpage.logResponse(response, sender, "0.AddLock");
              sendResponse(response);
            }
          );
        });
      });
    }
    if (request.todo == "hideQuickSearch") {
      console.log("New Command: showQuickSearch");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "hideQuickSearch",
            tabID: request.tabID,
          });
        }
      );
    }

    if (request.todo == "updateTopLevelTabMenuItems") {
      console.log("I got Update Top Level Tab Menu Items Command!");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "updateTopLevelTabMenuItems",
          });
        }
      );

      sendResponse("Update Top Level Tab Menu Items Command sent out!");
    }

    if (request.todo == "readCurTabID") {
      console.log("New Command: readCurTabID");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "readCurTabID",
          });
        }
      );

      sendResponse("readCurTabID Command sent out!");
    }

    if (request.todo == "syncTabToContent") {
      console.log("New Command: syncTabToContent");
      console.info("Chrome Tab ID is: ", chromeTabID);
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "syncTabToContent",
          });
        }
      );
    }

    if (request.todo == "saveTableInfo") {
      mlsTable = JSON.parse(request.table);
      sendResponse("Table Saved!");
    }

    if (request.todo == "readMLSTableInfo") {
      // sendResponse(mlsTable);
      let mlsNo = request.mlsNo;
      let listingInfo = [];
      // search tax value
      mlsTable.forEach((row) => {
        if (row["ML #"] == mlsNo) {
          listingInfo = row;
        }
      });
      sendResponse(listingInfo);
    }
    return true;
  });

  /// 模块#1: 添加地税/评估数据服务事件句柄
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    let taxRequests = [
      "taxSearch",
      "searchTaxFromCouchDB",
      "searchTaxFromRemoteDB",
      "saveFailedTaxSearch",
    ];
    if (!taxRequests.includes(request.todo)) return;

    console.eventpage.logRequest(request, sender, "1.Tax");
    switch (request.todo) {
      // CouchDB数据库 - 处理查询和保存地税/评估数据程序模块
      case "taxSearch":
        searchTax(request, db).then(sendResponse);
        return true;
      case "searchTaxFromCouchDB":
        searchTaxFromCouchDB(request, db).then(sendResponse);
        return true;
      case "searchTaxFromRemoteDB":
        searchTaxFromRemoteDB(request).then(sendResponse);
        return true;
      case "saveFailedTaxSearch":
        saveFailedTaxSearch(request, db).then(sendResponse);
        return true;
    }
  });

  /// 模块#2: 添加小区名字处理服务事件句柄
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    let complexRequests = [
      "processComplexInfo",
      "saveComplexInfo",
      "searchComplexInfo",
    ];
    if (!complexRequests.includes(request.todo)) return;
    console.eventpage.logRequest(request, sender, "2.Complex");

    /// 小区(Complex)信息处理(查询,保存)
    switch (request.todo) {
      case "processComplexInfo":
        /// 处理小区名字, 查询标准小区名, 创建新的小区名, 更新小区名
        processComplexInfo(request).then(sendResponse);
        return true;
      case "saveComplexInfo":
        let mode = 1; /// 强制更新数据库记录
        processComplexInfo(request, mode).then(sendResponse);
        return true;
      case "searchComplexInfo":
        searchComplexInfo(request.complexID).then(sendResponse);
        return true;
    }
  });

  /// 模块#3: 读取调试设定参数
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    let debugRequests = [
      "readDebugSetting",
      "saveDebugSetting",
      "loadDebugSettings",
    ];
    if (!debugRequests.includes(request.todo)) return;
    console.eventpage.logRequest(request, sender, "3.Debug");

    switch (request.todo) {
      case "readDebugSetting":
        readDebugSetting(request.debugID).then(sendResponse);
        return true;
      case "loadDebugSettings":
        loadDebugSettings(/**load all settings */).then(sendResponse);
        return true;
    }
  });

  ///  模块#x: 添加其他后台数据服务句柄
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    let miscRequests = [
      "searchStrataPlanSummary",
      "searchExposure",
      "saveExposure",
      "searchListing",
      "saveListing",
      "searchShowing",
      "saveShowing",
      "saveStrataPlanSummary",
      "saveSubjectInfo",
      "saveCMAInfo",
      "UpdateCommunityInfoToWP",
    ];
    if (!miscRequests.includes(request.todo)) return;
    console.eventpage.logRequest(request, sender, "x.Misc");

    if (request.todo == "searchStrataPlanSummary") {
      //get request to search tax info of Property with PID saved to storage
      //console.log(">>>I got search StrataPlanSummary command!");

      chrome.storage.local.get(
        ["strataPlan", "complexNameForListingCount"],
        function (result) {
          //check database, if assess exist, send it back
          //console.log(">>>strataPlan is: ", result.strataPlan);
          var strataPlan = result.strataPlan;
          var complexName = result.complexNameForListingCount;
          if (!strataPlan || strataPlan == "PLAN" || strataPlan == "PL") {
            return;
          }
          var today = $fx.getToday();
          db.readStrataPlanSummary(
            strataPlan + "-" + today,
            function (strataPlanSummaryToday) {
              //console.log(">>>read from , strataPlanSummary is: ", strataPlanSummaryToday)
              if (!strataPlanSummaryToday) {
                //other wise , send out tax research command:
                console.info("Chrome Tab ID is: ", chromeTabID);
                chrome.tabs.query(
                  {
                    active: true,
                    currentWindow: true,
                  },
                  function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                      todo: "searchComplexListingCount",
                      showResult: true,
                      saveResult: true,
                      strataPlan: strataPlan,
                      complexName: complexName,
                    });
                  }
                );
              }
            }
          );
        }
      );
      sendResponse(">>>complex search has been processed in eventpage: ");
    }

    if (request.todo == "searchExposure") {
      var requestFrom = request.from;
      delete request.from;
      var exposureInfo = request;

      db.readExposure(exposureInfo, function (cInfo) {
        console.log(">>>read the exposure info from database:", exposureInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.exposureName = "";
          }

          chrome.storage.local.set(cInfo, function () {
            console.log("exposureInfo is: ", cInfo);
          });
        } else {
          //error for exposureInfo
          console.log("Exposure Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveExposure") {
      console.log("write exposure info");
      var exposureID = request._id;
      if (request.exposureName.trim().length > 0) {
        db.writeExposure(request);
      }
    }

    // Listing
    if (request.todo == "searchListing") {
      var requestFrom = request.from;
      delete request.from;
      var listingInfo = request;

      db.readListing(listingInfo, function (cInfo) {
        console.log(">>>read the listing info from database:", listingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.listingName = "";
          }

          chrome.storage.local.set(cInfo, function () {
            console.log("listingInfo is: ", cInfo);
          });
        } else {
          //error for listingInfo
          console.log("Listing Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveListing") {
      console.log("write listing info");
      var listingID = request._id;
      if (request.listingName.trim().length > 0) {
        db.writeListing(request);
      }
    }

    // Showing Info
    if (request.todo == "searchShowing") {
      var requestFrom = request.from;
      delete request.from;
      var showingInfo = request;

      db.readShowing(showingInfo, function (cInfo) {
        console.log(">>>read the showing info from database:", showingInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.name = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.name = "";
          }

          chrome.storage.local.set(cInfo, function () {
            console.log("showingInfo is: ", cInfo);
          });
        } else {
          //error for listingInfo
          console.log("Showing Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveShowing") {
      console.log("write showing info");
      var showingID = request._id;
      if (request.name.trim().length > 0) {
        db.writeShowing(request);
      }
    }

    if (request.todo == "saveStrataPlanSummary") {
      //console.log(">>>I got save Complex info: ");
      var spSummary = request.spSummaryData;
      db.writeStrataPlanSummary(spSummary);
      sendResponse(spSummary);
    }

    // "https://pidrealty.local/wp-content/themes/pidHomes-PhaseI/db/dbAddSubjectProperty.php"
    if (request.todo == "saveSubjectInfo") {
      var subjectInfo = request;
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: subjectInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
        },
      });
    }

    if (request.todo == "saveCMAInfo") {
      var cmaInfo = request;
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: cmaInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
        },
      });
    }

    // sync community names to pidhomes.ca & cn.pidhomes.ca
    if (request.todo == "UpdateCommunityInfoToWP") {
      var listingInfo = { listingInfo: JSON.stringify(request.listings) };
      let ajax_url = request.ajax_url;
      $.ajax({
        url: ajax_url,
        method: "post",
        data: listingInfo,
        success: function (res) {
          console.log("res::", JSON.stringify(res));
          if (res.indexOf("sync RPS community names done:") > -1) {
            sendResponse("Page Update Done");
          } else {
            sendResponse("Page Update Failed");
          }
        },
      });
    }

    return true;
  });

  //End of Main Function
})();

////////////////////////////////////////////////
/// 子程序模块 ///
///////////////////////////////////////////////

async function searchTax(request, db) {
  // get request to search tax info of Property with PID saved to storage
  // 查询请求来自前端paragon的Full Realtor Report 或者是 搜索结果列表 Spreadsheet Report
  // 纳税年份, 应该使用当前年份.
  // 测试async/await Class QueryTaxAndAssess
  queryTaxAndAssess = new QueryTaxAndAssess(request, db);
  try {
    assessInfo = await queryTaxAndAssess.getAssessInfoPromise();
    console.log(assessInfo);
    // 发送数据包
    // let resp = await chrome.storage.promise.local.set(assessInfo);
    result = {
      msg: ">>> Tax Search Result From CouchDB <<<",
      data: assessInfo,
    };
    return result;
  } catch (err) {
    // CouchDB 数据库中没有地税数据
    let tabs = await chrome.tabs.promise.query({
      active: true,
      windowId: null,
    });
    // chrome.tabs.sendMessage(tabs[0].id, {
    //   todo: "taxSearchFor" + request.from,
    // });
    result = await chrome.tabs.promise.sendMessage(tabs[0].id, {
      todo: "taxSearchFor" + request.from,
    });
    console.log(result);
    assessInfo = await chrome.tabs.promise.sendMessage(tabs[0].id, {
      todo: "getTaxSearchDetailsFromFrontService",
    });

    result = {
      msg: ">>> Tax Search Return From Front Service <<<",
      data: assessInfo,
    };
    return result;
  }
}

async function searchTaxFromCouchDB(request, db) {
  // 从CouchDB中查询地税数据
  let queryTaxAndAssess = new QueryTaxAndAssess(request, db);
  let result = null;
  try {
    let assessInfo = await queryTaxAndAssess.getAssessInfoPromise();
    console.log(`#${request.searchSequenceNo}`, assessInfo);
    // 发送数据包
    // let resp = await chrome.storage.promise.local.set(assessInfo);
    result = {
      msg: ">>> Tax Search Result From CouchDB <<<",
      status: "OK",
      data: assessInfo,
    };
    return result;
  } catch (err) {
    result = {
      msg: ">>> Tax Search Result From CouchDB <<<",
      status: err.status,
      data: err,
    };
    return result;
  }
}

async function searchTaxFromRemoteDB(request) {
  // 向前端发出查询请求
  let tabs = await chrome.tabs.promise.query({
    active: true,
    windowId: null,
  });

  // BCA Page 1 发出查询请求
  let resultInfo = await chrome.tabs.promise.sendMessage(tabs[0].id, {
    todo: "taxSearchFor" + request.from,
    PID: request.PID,
    taxYear: request.taxYear,
  });
  let assessInfo = resultInfo.data; /// assessInfo 保存在data属性中
  console.log(`#${request.searchSequenceNo}`, assessInfo);

  /// 保存地税/评估数据
  resultInfo = await saveTax(assessInfo, db);
  console.log(`() Saved Tax/Assess to CouchDB: ${resultInfo}  ()`);

  let result = {
    msg: ">>> Tax Search Return From Front Service <<<",
    status: resultInfo.status ?? "OK",
    data: assessInfo,
  };
  return result;
}

async function saveTax(assessInfo, db) {
  //console.log(">>>I got save tax info: ");
  assessInfo._id = assessInfo.PID + "-" + assessInfo.taxYear;
  let request = {
    PID: assessInfo.PID,
    taxYear: assessInfo.taxYear,
    from: "eventPage_SaveTax",
  };
  // db.writeAssess(assess);
  queryTaxAndAssess = new QueryTaxAndAssess(request, db);
  try {
    let resp = await queryTaxAndAssess.setAssessInfoPromise(assessInfo);
    console.log(resp);
    return resp;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function saveFailedTaxSearch(request, db) {
  //console.log(">>>I got save tax info: ");
  let assessInfo = request.taxData;
  assessInfo._id = assessInfo.PID + "-" + assessInfo.taxYear;
  // db.writeAssess(assess);
  queryTaxAndAssess = new QueryTaxAndAssess(request, db);
  try {
    let resp = await queryTaxAndAssess.setAssessInfoPromise(assessInfo);
    console.log(resp);
    return resp;
  } catch (err) {
    console.log(err);
    return err;
  }
}

///////////////////////////////////////////////////
async function processComplexInfo(complexInfo, mode = 0) {
  /// 功能说明: 处理小区名
  /// 查询/更新/创建 标准的小区信息,
  /// 可选模式参数mode: 0 default, 1 force update the complexInfo
  /// 返回带小区信息的信息包
  const cNoNames = ["TBA", "::", ""];
  delete complexInfo.from;
  let resInfo = null;
  let resQueryDB = null;
  let cStandardInfo = null; // 保存数据库中的查询记录
  let cName = complexInfo.complexName.trim();
  cName = cNoNames.includes(cName) ? "TBA" : cName; // 整理小区名字, 去除前后空格符
  complexInfo.complexName = cName; // 待查记录名

  try {
    cStandardInfo = await db.readComplexPromise(complexInfo); // 读取数据库
    cNameInDB = cStandardInfo.complexName.trim(); // 已查记录名

    switch (true) {
      case !cNoNames.includes(cName) && cNoNames.includes(cNameInDB):
        /// 待查非空, 已查为空 - 更新记录, 返回
        cStandardInfo.complexName = complexInfo.complexName;
        resQueryDB = await db.updateComplexPromise(cStandardInfo); // 更新数据库
        resInfo = {
          msg: `<> Updated Complex Name: ${cStandardInfo.complexName} <>`,
          data: cStandardInfo,
          status: "OK",
        };
        return Promise.resolve(resInfo);
      case cNoNames.includes(cName) && cNoNames.includes(cNameInDB):
        /// 待查为空, 已查为空 - 改名TBA, 返回
        cStandardInfo.complexName = "TBA";
      case cNoNames.includes(cName) && !cNoNames.includes(cNameInDB):
      case !cNoNames.includes(cName) && !cNoNames.includes(cNameInDB):
        /// 待查为空, 已查非空 - 直接返回
        /// 待查非空, 已查非空 - 直接返回
        if (mode === 0) {
          /// 模式0, 返回数据库记录
          resInfo = {
            msg: `<> Found Complex Name: ${cStandardInfo.complexName} <>`,
            data: cStandardInfo,
            status: "OK",
          };
        }
        if (mode === 1) {
          /// 模式0, 强制更新数据库记录
          resQueryDB = await db.updateComplexPromise(complexInfo);
          resInfo = {
            msg: `<> Force Updated Complex Name: ${complexInfo.complexName} <>`,
            data: complexInfo,
            status: "OK",
          };
        }
        /// 返回查询结果数据包
        return Promise.resolve(resInfo);
    }
  } catch (err) {
    /// 数据库没有记录, 创建新记录
    try {
      resQueryDB = await db.createComplexPromise(complexInfo);
      resInfo = {
        msg: `<> Created Complex Record: ${complexInfo.complexName} <>`,
        data: complexInfo,
        status: "OK",
      };
      return Promise.resolve(resInfo);
    } catch (err) {
      resInfo = {
        msg: err.message,
        data: null,
        status: err.status,
      };
      return Promise.reject(resInfo);
    }
  }
}

async function searchComplexInfo(complexID) {
  let complexInfo = {
    _id: complexID,
  };
  try {
    let cStandardInfo = await db.readComplexPromise(complexInfo); // 读取数据库
    return Promise.resolve(cStandardInfo);
  } catch (err) {
    let resInfo = {
      msg: "<> Search Complex Info Error <>",
      data: err,
      status: err.status,
    };
    return Promise.reject(resInfo);
  }
}

/////////////////////////////////////////////////////////
async function readDebugSetting(debugID) {
  /// 功能说明: 读取调试设定, 返回1 为启用调试信息输出, 返回0, 为禁用调试信息输出
  /// debugID是每个功能模块的设定
  let resInfo;
  try {
    let debugSetting = await db.readDebugSetting(debugID);
    resInfo = {
      msg: "<> Debug Setting Found <>",
      data: debugSetting,
      status: "OK",
    };
    return Promise.resolve(resInfo);
  } catch (err) {
    resInfo = {
      msg: "<> Debug Setting Found <>",
      data: debugSetting,
      status: "OK",
    };
    return Promise.reject(resInfo);
  }
}

async function loadDebugSettings() {
  /// 功能说明: 读取所有的设定参数
  let resInfo;
  try {
    let debugSettings = await db.loadDebugSettings();
    resInfo = {
      msg: "<> Loaded All Debug Settings <>",
      data: debugSettings,
      status: "OK",
    };
    return Promise.resolve(resInfo);
  } catch (err) {
    resInfo = {
      msg: "<> Could Not Load All Settings <>",
      data: err,
      status: err.status,
    };
    return Promise.reject(resInfo);
  }
}

////////////////////////////////////////////////////////
console.eventpage = {
  logRequest: (request, sender, tag) => {
    console.log(
      `(${tag}) Request: ${request.todo} | from: ${$fx.getTabID3(
        sender.url
      )} | ${request.from} () `
    );
  },
  logResponse: (response, sender, tagToDo) => {
    console.log(
      `(${tagToDo}) Response: ${response} | from: ${$fx.getTabID3(
        sender.url
      )} () `
    );
  },
};
