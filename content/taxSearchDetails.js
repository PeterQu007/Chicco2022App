/// 地税/评估数据查询服务程序 ///
/// INJECT TO TAX SEARCH DETAIL REPORT VIEW
/// READ TAX DETAILS REPORT BY FIELDS - getTaxReportDetails()
/// SAVE TAX DATA TO DATABASE - CouchDB
/// 如果是新的房子, 地税和评估报告还没有, 要能判断出来这是刚刚建成的新的物业  newTaxAssessRecord
/// 新的物业, 可能已经有一份初始的地税报告, 其中的 Land Value 为 0

const divContainerID = "divHtmlReport";
var curTabID = null;
console.log("Tax Details Tab1_1_2");
/// 当前页面转到保存的搜索清单tab3
// let tabSavedSearches = top.document.querySelectorAll("a[href='#tab3']");
// tabSavedSearches[0].click();

/// 添加通讯句柄
// window.addEventListener("message", (event) => {
//   if (
//     event.origin.indexOf(
//       "https://bcres.paragonrels.com/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1&searchID=tab1_1"
//     )
//   ) {
//     event.source.postMessage(taxDetails.assessInfo, event.origin);
//   }
// });

let taxDetails = {
  /// 属性
  /// 模型化Paragon里面的地税报告, 读取各个数据字段:
  pid: $('div[style="top:113px;left:150px;width:221px;height:14px;"]').text(),
  address: $(
    'div[style="top:71px;left:150px;width:221px;height:14px;"]'
  ).text(),
  taxYear: $(
    'div[style="top:176px;left:150px;width:221px;height:14px;"]'
  ).text(), /// 这个年份是政府评估年份, 并不是实际交地税的年份, 这个值在后面会被更新
  taxRollNumber: $(
    'div[style="top:162px;left:150px;width:221px;height:14px;"]'
  ).text(),
  grossTaxes: $(
    'div[style="top:162px;left:525px;width:221px;height:14px;"]'
  ).text(),
  legal: $('div[style="top:264px;left:0px;width:746px;height:14px;"]').text(),
  legalFreeFormDescription: $(
    'div[style="top:303px;left:0px;width:746px;height:14px;"]'
  ).text(),

  reportTitleClass: $(
    "div[style='top:0px;left:0px;width:746px;height:17px;']"
  ).attr("class"), //base class for reading the variable position fields

  landValue: null,
  improvementValue: null,
  totalValue: null,
  bcaDescription: null,
  bcaDataUpdateDate: null,
  lotSize: null,
  planNum: null,
  reportLink: null,
  houseType: null,
  recentSaleDate: "",
  recentSalePrice: "",
  recentSaleDocNum: "",
  recentSaleType: "",
  assessInfo: null,
  assessInfoIsReady: false,

  /// 标记新建物业, 刚刚开始有初始的地税报告
  newTaxAssessRecord: false,

  init: async function () {
    let self = this;

    let result = await chrome.storage.promise.local.get([
      "houseType",
      "taxSearchRequester",
    ]);

    self.houseType = result.houseType;
    console.log("houseType is: ", result.houseType);
    console.log("TopPosition: ", self.ActualTotalsTopPosition);

    /// 读取地税报告字段
    self.getTaxReportDetails();

    /// 组装地税和评估数据包
    let assess = {
      _id: self.pid + "-" + self.taxYear, ///地税年份使用实际交税的年份, 不要使用政府评估的年份
      landValue: self.landValue,
      improvementValue: self.improvementValue,
      totalValue: self.totalValue,
      PID: self.pid,
      taxYear: self.taxYear,
      address: self.address,
      legal: self.legal,
      taxRollNumber: self.taxRollNumber,
      grossTaxes: self.grossTaxes,
      planNum: self.planNum,
      houseType: self.houseType,
      lotSize: self.lotSize,
      bcaDataUpdateDate: self.bcaDataUpdateDate,
      bcaDescription: self.bcaDescription,
      from: self.newTaxAssessRecord
        ? "assess-" +
          result.taxSearchRequester +
          "-TaxSearchFailed-" +
          Math.random().toFixed(8)
        : "assess-" +
          result.taxSearchRequester +
          "-" +
          Math.random().toFixed(8),
      bcaSearch: self.newTaxAssessRecord ? "failed" : "success",
      dataFromDB: false,
    };

    this.assessInfo = assess;
    this.assessInfoIsReady = true;

    /// 添加事件句柄
    this.onMessage();
    // this.onWindowPostMessage();

    /// 向服务请求程序发送数据包
    let taxSearchRequesterFrame = top.document.getElementById("tab1_1_1");
    taxSearchRequesterFrame.contentWindow.postMessage(this.assessInfo);

    /// 发送地税和评估数据包, 引发数据包变化事件, 在主程序中做处理
    // chrome.storage.local.set(assess, function () {
    //   console.log("TaxDetails.bcAssessment is...", assess);
    // });

    /// 发送数据包到后端服务程序, 将新的地税和评估数据存入数据库
    /// 如果本段代码是由paragon的Full Realtor Report中的tax按钮触发的, 由于没有调用读取数据库的过程
    /// 更新couchDB的doc不会成功完成.
    /////////////////////////////////////////////
    // chrome.runtime.sendMessage(
    //   {
    //     todo: "saveTax",
    //     taxData: assess,
    //   },
    //   function (response) {
    //     console.log("tax Data has been save to the database!");
    //   }
    // );
    //////////////////////////////////////////////////////////////////////////

    // chrome.storage.local.get(
    //   ["houseType", "taxSearchRequester"],
    //   function (result) {
    //     self.houseType = result.houseType;
    //     console.log("houseType is: ", self.houseType);
    //     console.log("TopPosition: ", self.ActualTotalsTopPosition);

    //     /// 读取地税报告字段
    //     self.getTaxReportDetails();

    //     /// 组装地税和评估数据包
    //     let assess = {
    //       _id: self.pid + "-" + self.taxYear, ///地税年份使用实际交税的年份, 不要使用政府评估的年份
    //       landValue: self.landValue,
    //       improvementValue: self.improvementValue,
    //       totalValue: self.totalValue,
    //       PID: self.pid,
    //       taxYear: self.taxYear,
    //       address: self.address,
    //       legal: self.legal,
    //       taxRollNumber: self.taxRollNumber,
    //       grossTaxes: self.grossTaxes,
    //       planNum: self.planNum,
    //       houseType: self.houseType,
    //       lotSize: self.lotSize,
    //       bcaDataUpdateDate: self.bcaDataUpdateDate,
    //       bcaDescription: self.bcaDescription,
    //       from: self.newTaxAssessRecord
    //         ? "assess-" +
    //           result.taxSearchRequester +
    //           "-TaxSearchFailed-" +
    //           Math.random().toFixed(8)
    //         : "assess-" +
    //           result.taxSearchRequester +
    //           "-" +
    //           Math.random().toFixed(8),
    //       bcaSearch: self.newTaxAssessRecord ? "failed" : "success",
    //       dataFromDB: false,
    //     };

    //     this.assessInfo = assess;
    //     this.assessInfoIsReady = true;

    //     /// 发送地税和评估数据包, 引发数据包变化事件, 在主程序中做处理
    //     chrome.storage.local.set(assess, function () {
    //       console.log("TaxDetails.bcAssessment is...", assess);
    //     });

    //     /// 发送数据包到后端服务程序, 将新的地税和评估数据存入数据库
    //     /// 如果本段代码是由paragon的Full Realtor Report中的tax按钮触发的, 由于没有调用读取数据库的过程
    //     /// 更新couchDB的doc不会成功完成.
    //     chrome.runtime.sendMessage(
    //       {
    //         todo: "saveTax",
    //         taxData: assess,
    //       },
    //       function (response) {
    //         console.log("tax Data has been save to the database!");
    //       }
    //     );
    //   }
    // );
  },

  /// 事件
  /// 从后台程序接受信息的事件句柄
  onMessage: function () {
    chrome.runtime.onMessage.addListener((msg, sender, response) => {
      if (msg.todo === "getTaxSearchDetailsFromFrontService") {
        // 读取地税详细信息
        // 监视地税数据是否完成
        let monitorCounter = 1;
        let checkTaxDetailsResult = async () => {
          if (this.assessInfoIsReady) {
            clearInterval(checkTimer);
            response(this.assessInfo);
          } else if (monitorCounter++ > 100) {
            clearInterval(checkTimer);
            response("Front End Tax Search is Failed");
          }
        };
        let checkTimer = setInterval(checkTaxDetailsResult, 100);
        return true;
      }
    });
  },

  /// 从前台旁边的网页接受信息的事件句柄
  onWindowPostMessage: function () {
    window.addEventListener("message", (event) => {
      if (
        event.origin.indexOf(
          "https://bcres.paragonrels.com/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1&searchID=tab1_1"
        )
      ) {
        event.source.postMessage(this.assessInfo, event.origin);
      }
    });
  },

  /// 方法
  getTaxReportDetails: function () {
    /// 读取地税和评估报告中的字段, 转入数组x0
    var x0 = $("div#" + divContainerID)
      .children(0)
      .children();
    var i;
    /// LOOP ALL THE CELLS IN THE "DETAILED TAX REPORT"
    /// 根据报告的数据位置, 读取相关的地税和评估信息
    for (i = 0; i <= x0.length; i++) {
      /// 在div元素中,包含数据名称和数值
      if ($(x0[i]).is("div")) {
        /// 设置相关字段数据
        let fieldName = x0[i].textContent;
        switch (fieldName) {
          case "Prop Address":
            this.address = x0[i + 1].textContent;
            if (x0[i + 2].textContent != "Jurisdiction") {
              this.address += x0[i + 2].textContent;
            }
            break;
          case "PropertyID":
            this.pid = x0[i + 1].textContent;
            break;
          case "Gross Taxes":
            this.grossTaxes = x0[i + 1].textContent;
            break;
          case "Actual Totals":
            let landValue = x0[i + 4].textContent;
            /// 如果landValue为$0.00, 则这是一个新建物业, 数据信息不全
            if (landValue == "$0.00") {
              this.newTaxAssessRecord = true;
              this.landValue = 0;
              this.improvementValue = 0;
              this.totalValue = 0;
            } else {
              this.newTaxAssessRecord = false;
              this.landValue = x0[i + 4].textContent;
              this.improvementValue = x0[i + 5].textContent;
              this.totalValue = x0[i + 6].textContent;
            }
            break;
          case "PlanNum":
            this.planNum = x0[i + 9].textContent;
            break;
          case "Legal Information":
            this.legal = x0[i + 1].textContent;
            break;
          case "BCA Description":
            this.bcaDescription = x0[i + 1].textContent;
            break;
          case "BCAData Update":
            /// taxYear的处理方法: 用Paragon地税数据更新的年份, 作为交税年份
            this.bcaDataUpdateDate = x0[i + 1].textContent;
            let bcaYear = new Date(this.bcaDataUpdateDate);
            let currentTaxYear = bcaYear.getFullYear(); /// USE BCA UPDATE DATE AS CURRENT TAX YEAR
            this.taxYear = currentTaxYear;
            chrome.storage.local.set({ taxYear: currentTaxYear }); /// PERSIST CURRENT TAX YEAR
            break;
          case "Lot Size":
            this.lotSize = x0[i + 1].textContent;
            break;
          case "BCA Description":
            this.bcaDescription = x0[i + 1].textContent;
            break;
          case "SaleTransaction Type":
            this.recentSaleDate = x0[i + 1].textContent;
            this.recentSalePrice = x0[i + 2].textContent;
            this.recentSaleDocNum = x0[i + 3].textContent;
            this.recentSaleType = x0[i + 4].textContent;
            break;
        }
      }
    }
  },

  getAssessClass: function (reportTitleClass) {
    var assessClass = "";
    console.log("reportTitleClass is: ", reportTitleClass);
    assessClass = "mls" + (Number(reportTitleClass.replace("mls", "")) + 7);

    return assessClass;
  },

  getPlanNumClass: function (reportTitleClass) {
    var planNumClass = "";
    console.log("reportTitleClass is: ", reportTitleClass);
    planNumClass = "mls" + (Number(reportTitleClass.replace("mls", "")) + 5);

    return planNumClass;
  },

  getOtherFieldsClass: function (reportTitleClass) {
    var otherFieldsClass = "";
    console.log("reportTitleClass is: ", reportTitleClass);
    otherFieldsClass =
      "mls" + (Number(reportTitleClass.replace("mls", "")) + 3);

    return otherFieldsClass;
  },
};

// start point:
$(function () {
  console.log("mls-taxdetails iFrame: ");
  taxDetails.init();
});
