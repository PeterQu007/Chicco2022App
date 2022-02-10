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

  //receive message from iframes, then transfer the message to Main Page content script
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      `onMessage.eventPage got a message from: ${request.from}; todo: ${request.todo} `
    );

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

    switch (request.todo) {
      // CouchDB数据库 - 处理查询和保存地税/评估数据程序模块
      case "taxSearch":
        // get request to search tax info of Property with PID saved to storage
        // 查询请求来自前端paragon的Full Realtor Report 或者是 搜索结果列表 Spreadsheet Report
        // 纳税年份, 应该使用当前年份.
        // 测试async/await Class QueryTaxAndAssess
        queryTaxAndAssess = new QueryTaxAndAssess(request, db);
        try {
          assessInfo = await queryTaxAndAssess.getAssessInfoPromise();
          console.log(assessInfo);
          // 发送数据包
          try {
            let resp = await chrome.storage.promise.local.set(assessInfo);
            console.log(resp);
            sendResponse(">>>tax search has been processed in EventPage: ");
          } catch (err) {
            // 发送数据包错误处理
            console.log(err);
          }
        } catch (err) {
          // CouchDB 数据库中没有地税数据
          let tabs = await chrome.tabs.promise.query({
            active: true,
            windowId: null,
          });
          chrome.tabs.sendMessage(tabs[0].id, {
            todo: "taxSearchFor" + request.from,
          });
          sendResponse(
            ">>>tax search has been sent to front end query service: "
          );
        }
        return;
      case "saveTax":
        //console.log(">>>I got save tax info: ");
        var assess = request.taxData;
        assess._id = assess.PID + "-" + assess.taxYear;
        // db.writeAssess(assess);
        queryTaxAndAssess = new QueryTaxAndAssess(request, db);
        try {
          let resp = await queryTaxAndAssess.setAssessInfoPromise(assess);
          console.log(resp);
        } catch (err) {
          console.log(err);
        }
        sendResponse(assess);
        return;
    }

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

    if (request.todo == "searchComplexInfo") {
      var complexID = request._id;
      var requestFrom = request.from;
      delete request.from;
      var complexInfo = request;

      db.readComplex(complexInfo, function (cInfo) {
        //console.log('>>>read the complex info from database:', complexInfo);
        if (cInfo) {
          if (cInfo.name.length > 0) {
            cInfo.from += "-" + requestFrom;
            cInfo.complexName = cInfo.name;
          } else {
            cInfo.from += "-" + requestFrom;
            cInfo.complexName = "::";
          }

          chrome.storage.local.set(cInfo, function () {
            console.log("complexInfo is: ", cInfo);
          });
        } else {
          //error for complexInfo
          console.log("Complex Name does not exist in Database");
        }
      });
    }

    if (request.todo == "saveComplexInfo") {
      var complexID = request._id;
      if (request.complexName.trim().length > 0) {
        db.writeComplex(request);
      }
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
              console.log("addLock response:", response);
              // chrome.storage.local.set(
              // 	{getTabID:result.tabID,
              // 	getTabTitle:result.tabTitle,
              // 	todo: 'getTabTitle'+Math.random().toFixed(8),
              // 	from: 'EventPage.getTabTitle'});
              sendResponse(response);
            }
          );
        });
      });

      // chrome.tabs.query(
      //   {
      //     active: true,
      //     currentWindow: true,
      //   },
      //   function (tabs) {
      //     chrome.tabs.sendMessage(
      //       tabs[0].id,
      //       {
      //         todo: "addLock",
      //         tabID: request.tabID,
      //       },
      //       function (response) {
      //         result = response;
      //         console.log("addLock response:", response);
      //         // chrome.storage.local.set(
      //         // 	{getTabID:result.tabID,
      //         // 	getTabTitle:result.tabTitle,
      //         // 	todo: 'getTabTitle'+Math.random().toFixed(8),
      //         // 	from: 'EventPage.getTabTitle'});
      //         sendResponse(response);
      //       }
      //     );
      //   }
      // );
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

  //End of Main Function
})();

// OBSOLETE CODES ////////////////////////////////////
// tax search callback version:
// try {
//   chrome.storage.local.get(["PID", "taxYear"], function (result) {
//     //check database, if assess exist, send it back
//     //console.log(">>>PID is: ", result.PID);
//     taxYear = result.taxYear; // 纳税年份有调用程序, 设定在local storage中
//     var taxID = result.PID + "-" + taxYear;
//     var requester = request.from;
//     db.readAssess(taxID, function (assess) {
//       //console.log(">>>read from , assess is: ", assess)
//       //读取地税/评估数据
//       if (!assess._id) {
//         // 如果数据库中没有该年的地税/评估数据, 则发送请求去地税查询程序
//         //other wise , send out tax research command:
//         try {
//           console.info("Chrome Tab ID is: ", chromeTabID);
//           // 从后端向前端发送请求, 需要使用chrome.tabs.sendmessage()
//           // TODO 计划改为 async/await
//           chrome.windows.getCurrent((w) => {
//             chrome.tabs.query(
//               {
//                 active: true,
//                 windowId: w.id,
//               },
//               function (tabs) {
//                 console.warn("taxSearch get chrome tabs:", tabs);
//                 if (tabs.length > 0) {
//                   chrome.tabs.sendMessage(tabs[0].id, {
//                     todo: "taxSearchFor" + requester,
//                   });
//                 } else {
//                   if (
//                     String(assess.from).indexOf(
//                       "taxSearchFor" + requester
//                     ) < 0
//                   ) {
//                     assess.from =
//                       assess.from + "-taxSearchFor" + requester;
//                   }
//                   assess.from += "-TaxSearchFailed";
//                   // 发送数据, 是否引发前端程序不需要的动作??
//                   chrome.storage.local.set(assess);
//                 }
//               }
//             );
//           });
//         } catch (err) {
//           console.error("taxSearch Errors: ", err);
//         }
//       } else {
//         // 在CouchDB中查询到地税/评估数据
//         // CouchDB中的数据如果是没有用的空记录, 就需要重新查询
//         if (String(assess.bcaSearch).indexOf("failed") > -1) {
//           if (String(assess.addedDate).indexOf($today) > -1) {
//             // 如果今天已经查过了, 就不要再重复查询了. 因为Paragon不会这么快有更新.
//             assess.from =
//               assess.from + "-TaxSearchFailed-taxSearchFor" + requester;
//           } else {
//             //Re-Search the tax Data EveryDay
//             // 如果是过去曾经查询过, 现在可以再试一下
//             // 同样还是发送查询请求到前端
//             try {
//               console.info("Chrome Tab ID is: ", chromeTabID);
//               chrome.windows.getCurrent((w) => {
//                 chrome.tabs.query(
//                   {
//                     active: true,
//                     windowId: w.id,
//                   },
//                   function (tabs) {
//                     console.warn("taxSearch get chrome tabs:", tabs);
//                     if (tabs.length > 0) {
//                       // 向前端地税/评估查询程序发出服务请求
//                       chrome.tabs.sendMessage(tabs[0].id, {
//                         todo: "taxSearchFor" + requester,
//                       });
//                     } else {
//                       if (
//                         String(assess.from).indexOf(
//                           "taxSearchFor" + requester
//                         ) < 0
//                       ) {
//                         assess.from =
//                           assess.from + "-taxSearchFor" + requester;
//                       }
//                       assess.from += "-TaxSearchFailed";
//                       chrome.storage.local.set(assess);
//                     }
//                   }
//                 );
//               });
//             } catch (err) {
//               console.error("taxSearch Errors: ", err);
//             }
//           }
//         } else if (
//           String(assess.from).indexOf("taxSearchFor" + requester) < 0
//         ) {
//           assess.from = assess.from + "-taxSearchFor" + requester;
//         }
//         // 发送地税/评估数据包
//         chrome.storage.local.set(assess);
//       }
//     });
//   });
//   sendResponse(">>>tax search has been processed in EventPage: ");
// } catch (err) {
//   sendResponse(">>>tax search gets errors in EventPage: ");
// }
