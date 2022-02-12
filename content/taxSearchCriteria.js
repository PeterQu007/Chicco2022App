//Query tax information
// 地税详情报告
// 提取地税和评估数据

console.log("Tax Search Tab1_1_1");
/// 当前页面转到保存的搜索清单tab3
let tabSavedSearches = top.document.querySelectorAll("a[href='#tab3']");
tabSavedSearches[0].click();
let btnSearch = $("#Search"); /// 用以启动taxDetails网页;
/// 填入一个代用的PID, 查询地税记录
var inputPID = $("#f_22");
var inputTaxRollNumber = $("#f_1");
var liPID = $('div[rel="f_22"] ul li.acfb-data');
var inputHidenPID = $("#hdnf_22");
liPID.remove();
inputPID.focus().val("008-115-150").blur();
inputHidenPID.val("");
var keydown = new KeyboardEvent("keydown", {
  bubbles: true,
  cancelable: true,
  keyCode: 13,
});
/// 模拟按下ESC案件, 触发地税记录是否存在的查询操作
document.querySelector("#f_22").dispatchEvent(keydown);
/// 查询初始的PID地税详细记录
// btnSearch.trigger("click");

let taxDetailsFrame = top.document
  .getElementById("tab1_1_2")
  .contentDocument.getElementById("ifView");

if (taxDetailsFrame) {
  taxDetailsFrame.contentWindow.postMessage("Send Back TaxInfo");
}

window.addEventListener("message", (event) => {
  if (
    event.origin.indexOf(
      "https://bcres.paragonrels.com/ParagonLS/Reports/TaxReport.mvc?listingIDs"
    )
  ) {
    console.log(event.data);
  }
});

/// 事件句柄
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (String(msg.todo).indexOf("taxSearchFor") > -1) {
    //console.log("I am in mls-tax.js");
    //console.log("mls-tax got msg: ", msg);

    chrome.storage.local.get(["PID", "taxYear"], function (result) {
      inputPID = $("#f_22");
      liPID = $('div[rel="f_22"] ul li.acfb-data');
      inputHidenPID = $("#hdnf_22");
      liPID.remove();
      inputHidenPID.val("");
      //inputHidenPID.val("['" + result.PID + "']");
      var $count = $("#CountResult");

      inputPID.focus().val(msg.PID).blur();
      // var keydown = new KeyboardEvent("keydown", {
      //   bubbles: true,
      //   cancelable: true,
      //   keyCode: 13,
      // });
      document.querySelector("#f_22").dispatchEvent(keydown);

      var btnSearch = $("#Search");

      var monitorCounter = 1;
      var checkTimer = setInterval(checkSearchResult, 100);

      function checkSearchResult() {
        if (parseInt($count.val()) == 1) {
          clearInterval(checkTimer);
          chrome.storage.local.set({
            totalValue: 0,
            landValue: 0,
            improvementValue: 0,
            planNum: "",
            taxSearchRequester: msg.todo,
          });
          btnSearch.click();
          // response("mls-tax find a tax record");

          // 等待Tax Details
          let interCheck = setInterval(taxDetails, 250);
          let waitingDetailsCounter = 0;

          // taxDetailsFrame.contentWindow.postMessage("Send Back TaxInfo"); // 无需向服务方发送信息
          /// 添加事件句柄
          window.addEventListener("message", eventHandler);

          /// 定义事件句柄
          function eventHandler(event) {
            if (
              event.origin.indexOf(
                "https://bcres.paragonrels.com/ParagonLS/Reports/TaxReport.mvc?listingIDs"
              )
            ) {
              clearInterval(interCheck); /// 获得Tax Details页面的回应
              let assessInfo = {
                msg: "<<< Tax Search Find A Detailed Record",
                data: event.data,
                status: "OK",
              };
              response(assessInfo);
              window.removeEventListener("message", eventHandler);
            }
          }

          function taxDetails() {
            waitingDetailsCounter++;
            console.log(
              `<<< waiting for detailed tax info counter : ${waitingDetailsCounter} >>>`
            );
            let taxDetailsFrame = top.document
              .getElementById("tab1_1_2")
              .contentDocument.getElementById("ifView");
            if (taxDetailsFrame) {
            }
          }
        } else if (parseInt($count.val()) == 0 || monitorCounter++ > 100) {
          clearInterval(checkTimer);
          console.log("Tax Search Failed!");
          //inform background the tax search does not work
          let assess = {
            _id: msg.PID + "-" + msg.taxYear,
            landValue: 0,
            improvementValue: 0,
            totalValue: 0,
            planNum: "",
            PID: msg.PID,
            taxYear: msg.taxYear,
            bcaSearch: "failed",
            from:
              "assess-" +
              msg.todo +
              "-TaxSearchFailed" +
              Math.random().toFixed(8),
            dataFromDB: false,
          };
          chrome.storage.local.set(assess, function () {
            console.log("Tax Search Failed...", assess);
            // self.getReportLink(function () {
            // 	self.reportLink[0].click();
            // 	console.log("1 Current Tab When Doing Tax Search is : ", curTabID);
            // 	let curTabContentContainer = $('div' + curTabID, top.document);
            // 	curTabContentContainer.attr("style", "display:block!important");
            // });
          });
          chrome.runtime.sendMessage(
            {
              todo: "saveTax",
              taxData: assess,
            },
            function (response) {
              console.log("tax Data has been save to the database!");
            }
          );
          response("mls-tax could not find a tax record");
        }
        console.log("Waiting for tax Search result...", checkTimer);
      }
    });
    return true;
  }
});
