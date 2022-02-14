/**
 *  程序功能说明
 *  根据PID查询地税/评估数据
 *  提取地税和评估数据, 返回给后端服务程序background page - eventPage.js
 *  目标框架网页iframe为 Tax Search Tab1_1_1, 框架网页的id为 tab1_1_1
 *  https://bcres.paragonrels.com/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1&searchID=tab1_1
 */

/// 查询一级TAB的title
let tabID = "#tab1";
let tabNo = 1;
let x = $("ul#tab-bg", top.document); ///find the top tab panel
let y = x.children("li")[tabNo];
let tabTitle = $(y).children().find("span").text().trim(); ///LOOK FOR TAB.TITLE
console.log(`Tab1 Title: ${tabTitle}`);

var pressCRKey = new KeyboardEvent("keydown", {
  /// 函数说明: 模拟按下CR回车键
  bubbles: true,
  cancelable: true,
  keyCode: 13, // CR 回车键
});

/// 填入一个代用的PID, 查询地税记录
let fillPIDField = (pid) => {
  /// 功能说明: 把PID填入表单, 模拟按下回车键, 触发记录数量的查询操作
  let inputPID = $("#f_22");
  let liPID = $('div[rel="f_22"] ul li.acfb-data');
  let inputHidenPID = $("#hdnf_22");
  liPID.remove();
  inputHidenPID.val("");
  inputPID.focus().val(pid).blur();
  document.querySelector("#f_22").dispatchEvent(pressCRKey);
};
fillPIDField("000-000-000");

// /// 获取地税详细数据报表的框架网页元素
// let taxDetailsFrame = top.document
//   .getElementById("tab1_1_2")
//   .contentDocument.getElementById("ifView");
// /// 发送信息
// if (taxDetailsFrame) {
//   taxDetailsFrame.contentWindow.postMessage("Send Back TaxInfo");
// }
// /// 等待回信
// window.addEventListener("message", (event) => {
//   if (
//     event.origin.indexOf(
//       "https://bcres.paragonrels.com/ParagonLS/Reports/TaxReport.mvc?listingIDs"
//     )
//   ) {
//     console.log(event.data);
//   }
// });

/// 地税查询事件句柄, 处理后台background page eventPage.js发来的地税查询请求
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (String(msg.todo).indexOf("taxSearchFor") === -1) {
    return;
  }

  /// 填入PID号码, 触发记录数量的查询操作
  fillPIDField(msg.PID);

  let $count = $("#CountResult");
  var monitorCounter = 1;
  var checkCountResultTimer = setInterval(checkTaxCountResult, 100);

  function checkTaxCountResult() {
    /// 功能说明, 等待记录数量的查询结果

    if (parseInt($count.val()) == 1) {
      /// 如果记录数量显示为1, 表明该PID有当前的地税记录
      let btnSearch = $("#Search");
      /// 清除定时器
      clearInterval(checkCountResultTimer);
      /// 启动地税/评估详细数据搜索
      btnSearch.trigger("click");
      /// 等待和返回查询结果
      waitTaxDetails(response);
    } else if (parseInt($count.val()) == 0 || monitorCounter++ > 100) {
      /// 查询失败的处理代码
      clearInterval(checkCountResultTimer);
      console.log(`[] Tax Search Failed Or Timeout! [${monitorCounter}]`);
      ///  处理查询失败, 并向后台请求方返回数据
      processFailedSearch(msg, response);
    }
    console.log("Waiting for tax Search result...", checkCountResultTimer);
  }
  return true;
});

///////////////////////////////////////////////
/// 功能函数 ///
///////////////////////////////////////////////

function waitTaxDetails(response) {
  /// 功能说明: 等待Tax Details
  /// 本模块每次查询只执行一次
  /// 取得地税数据后, 移除事件句柄
  let checkTaxDetailsSearchTimer = setInterval(taxDetails, 350);
  let waitingDetailsCounter = 0;

  /// 定义间隔查询结果程序
  function taxDetails() {
    waitingDetailsCounter++;
    console.log(
      `[] waiting for detailed tax info counter : [${checkTaxDetailsSearchTimer}]`
    );
    if (waitingDetailsCounter > 100) {
      /// 避免等待过久, 陷入死循环
      clearInterval(checkTaxDetailsSearchTimer);
      let assessInfo = {
        msg: `[] Tax Remote Search Timeout [${waitingDetailsCounter}]`,
        data: null,
        status: "timeout",
      };
      response(assessInfo);
    }
  }

  /// 添加事件句柄
  window.addEventListener("message", eventHandler);

  /// 定义事件句柄
  /// 等待返回地税/评估详细数据
  function eventHandler(event) {
    if (
      event.origin.indexOf(
        "https://bcres.paragonrels.com/ParagonLS/Reports/TaxReport.mvc?listingIDs"
      )
    ) {
      clearInterval(checkTaxDetailsSearchTimer); /// 获得Tax Details页面的回应
      let assessInfo = {
        msg: "[] Tax Search Find A Detailed Record []",
        data: event.data,
        status: "OK",
      };
      /// 向后台申请程序, 返还数据包
      response(assessInfo);
      /// 查询完成后, 移除事件句柄
      window.removeEventListener("message", eventHandler);
    }
  }
}

function processFailedSearch(msg, response) {
  /// 功能说明: 处理失败的地税查询
  let assess = {
    _id: msg.PID + "-" + msg.taxYear,
    landValue: 0,
    improvementValue: 0,
    totalValue: 0,
    planNum: "",
    PID: msg.PID,
    taxYear: msg.taxYear,
    bcaSearch: "failed",
    from: "assess-" + msg.todo + "-TaxSearchFailed" + Math.random().toFixed(8),
    dataFromDB: false,
  };
  let assessInfo = {
    msg: "[] No Tax Record Found []",
    data: assess,
    status: "failed",
  };
  // chrome.storage.local.set(assess, function () {
  //   console.log("Tax Search Failed...", assess);
  // });
  /// 向后台请求方, 发出保存数据的指令
  // chrome.runtime.sendMessage(
  //   {
  //     todo: "saveFailedTaxSearch",
  //     taxData: assess,
  //     PID: assess.PID,
  //     taxYear: assess.taxYear,
  //     from: "[] taxSearchCriteria.js []",
  //   },
  //   function (response) {
  //     console.log("tax Data has been save to the database!", response);
  //   }
  // );
  /// 返回查询数据包
  response(assessInfo);
}
