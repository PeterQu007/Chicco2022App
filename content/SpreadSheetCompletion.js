/// CONTENT.SCRIPT TARGET PARAGON.MLS.DEFAULT.SPREADSHEET.VIEW.PAGE
/// COMPLETE THE INFORMATION IN THE SPREADSHEET.TABLE BY ADDING BCA.TAX.INFORMATION
/// LOOK FOR COMPLEX.NAME, LAND.TAX.VALUE, IMPROVEMENT.TAX.VALUE, TOTAL.TAX.VALUE
/// COMPUTE PRICE.CHANGE.PERCENTAGE VS TOTAL.TAX.VALUE
/// ADD STRATA.PLAN.COLUMN
/// NORMALIZE CIVIC.ADDRESS, COMPLEX.NAME

/// Residential Attached, Detached & Land Listing Search Results Page (Tab3/4/5_?_2),
/// Target: SubPage iframe #ifSpreadsheet : Listing Results Spreadsheet Table
/// Function: Computing Square Feet Price Summary From the Spreadsheet Table

/// 把模块的import加载更改为manifest加载
// import uiSummaryTable from "../assets/scripts/ui/uiSummaryTable.js";
// import addressInfo from "../assets/scripts/modules/AddressInfoExport.js";
// import Assess from "../assets/scripts/modules/Assessment";
// import Complex from "../assets/scripts/modules/Complex";

var $fx = L$(); //// add library module

var computeSFPrices = {
  /// 程序模块初始化
  init: function () {
    console.log("Spreadsheet Document URL: ", document.URL); ///THIS URL CONTAINS TAB.ID

    this.tabID = $fx.getTabID(document.URL); /// 获取第一季tab的ID, 例如#tab4
    this.tabID2 = $fx.getTabID2(document.URL); /// 获取第二级tab的ID, 例如#tab4_1
    this.searchTabID = $fx.getSearchTabID(document.URL); /// 第三级tab的ID, 例如#tab4_1_2, #tab4_2_2
    this.tabID3 = this.searchTabID; /// 获取第三级tab的ID

    /// 保存第一级框架网页元素
    this.elementContainerLevel1 = top.document.getElementById(
      this.tabID.replace("#", "")
    ); // 这是顶层Tab的框架页
    /// 保存第二级tab的div容器元素
    this.elementContainerLevel2 = top.document.getElementById(
      this.tabID2.replace("#", "")
    ); // 这是本元素的父级Div容器元素, 取得第二级tab4_1的Div容器元素
    /// 保存第三级(即本级)tab的网页元素
    this.elementContainerLevel3 = top.document.getElementById(
      this.tabID3.replace("#", "")
    ); // 这是本元素的tab容器元素, 取得第三级tab4_1的Div容器元素

    this.tabNo = parseInt(this.tabID.replace("#tab", "")); ///LOOK FOR TAB.NO
    var x = $("ul#tab-bg", top.document); ///find the top tab panel
    var y = x.children("li")[this.tabNo];
    /// 第一层的tab名称, 是按照物业种类的搜索分类, 例如: Residential Detached, Residential Attached
    this.tabTitle = $(y).children().find("span").text().trim(); ///LOOK FOR TAB.TITLE
    console.warn(
      "tabID, tabNo, tabTitle",
      this.tabID,
      this.tabNo,
      this.tabTitle
    );
    //this.setCols(this.tabTitle); ///COLUMNS FROM DIFFERENT SPREADSHEET.TABLES
    /// 根据物业的种类不同, 独立屋, 非独立屋的数据字段有区别
    this.cols = $fx.setCols(this.tabTitle);
    // this.uiTable.tabTitle = this.tabTitle; ///SUMMARY.TABLE FOR AVERAGE SQUARE.FEET.PRICES
    ///BC.TAX.SEARCH IS SET TO TAB1, ITS SEARCH.RESULT ALSO USE SPREADSHEET.VIEW, SHOULD NOT BE INCLUDED HERE
    /// 选择适用本程序的Paragon页面
    if (this.tabID >= "#tab2") {
      ///EXCLUDE #TAB1: BC.TAX.SEARCH.RESULTS
      this.addLock(this.tabID); /// 锁定当前的搜索结果页面
      this.$tabContentContainer = $("div" + this.tabID, top.document);

      this.$spreadSheet = $("#ifSpreadsheet");
      this.$searchCount = $("#SearchCount", parent.document);
      this.$grid = $("#grid");

      this.recordCount = $fx.getRecordCount(parent.document.URL); ////RECORD.COUNT IS EMBEDDED IN THE URL FOR MANY IFRAME PAGES
      if (this.recordCount == 0) {
        this.recordCount = parseInt(this.$searchCount.text()); ////SAME RECORD.COUNT SHOWS IN THE TOP.SECTION
      }
      console.log("[SPREADSHEET] Record Count: ", this.recordCount);

      // if not the correct table, skip all events
      let searchViewName = $(this.tabID, top.document)
        .find("[rel='" + this.searchTabID + "']")
        .text();
      // Update WP View :: update community and neighborhood to wordpress
      // 定制的报告模板 Listing Extra Info:: get bca, complex... extra info,
      let listingExtraInfo = "Listing Extra Info";
      let updateWPViewName = "Update WP View";
      if (searchViewName.indexOf(listingExtraInfo) > -1) {
        /// 事件侦听程序模块
        // this.onTaxSearch(); ///TAX.SEARCH EVENT
        /// this.onConnect(); ///long live port
        this.onMutation(); ///SPREADSHEET.TABLE READY EVENT
        this.onComplexSearch(); ///COMPLEX.NAME.SEARCH EVENT
        /// 增加一个事件侦听, 针对上级Frame的postMessage
        this.onPostMessageFromSumBoxButtons();
      } else {
        this.onMutation_Only_for_SummaryUi();
      }
    } else {
      console.warn(
        "THIS MODULE DOES NOT APPLY TO THIS TAB.ID: ",
        this.tabID,
        "TAB.TITLE: ",
        this.tabTitle
      );
    }
  },

  /// 对象属性 PROPERTIES:
  tabID: null, // 第一级(顶级)tabID, 带#, 例如#tab4, #tab5
  tabID2: null, // 第二级tabID, 例如#tab4_1, #tab5_1
  tabID3: null, // 第三级tabID, 例如#tab4_1_1, #tab4_1_2
  tabNo: 0,
  tabTitle: null,
  // uiTable: new uiSummaryTable(this), /// 本属性已经转移到了父级模块AddSFPriceSummaryBox.js
  $spreadSheet: null,
  $searchCount: null,
  $grid: null,
  $mutationObserver: null,
  recordCount: 0,
  table: [], //for assessment search
  assessInfos: [], //for assess search
  rowNumbers: [], //for table col 0 , keep the listing row number of spreadsheet
  complexInfos: [], //for complexName search
  cols: null,
  keyword: $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  ),
  stopSearch: $("input#inputstopsearch", top.document),
  sumValues: [], // for extra summary panels
  elementContainerLevel1: null, // 保存第一级tab容器, 这个元素的可见性, 会影响或者决定本元素的可见性
  elementContainerLevel2: null, // 保存第二级tab容器, 这个原始的可见性, 会影响或者决定本元素的可见性
  elementContainerLevel3: null, // 保存第三级tab容器, 这个原始的可见性, 会影响或者决定本元素的可见性

  /// 对象时间 EVENTS:
  // onConnect() {
  // chrome.runtime.onConnect.addListener(function(port) {
  //   port.onMessage.addListener(function(msg) {
  //     console.info("msg", msg.counter);
  //     port.postMessage({ counter: msg.counter + 1 });
  //   });
  // });
  // },

  /// 接受来自子级窗口的信息请求, 执行地税/评估数据搜索
  /// 本程序模块的子任务执行逻辑
  /// 1) 等待从原始数据库中下载搜索数据 onMutation
  /// 2) 提取挂牌数据, 保存在内存中 cacheTable
  /// 3) 查询地税/评估数据 searchTax
  /// 4) 查询小区数据 searchComplex
  /// 5) 保存地税/评估数据到MySQL数据库 assessment module
  /// 6) 保存小区数据到MySQL数据库 complex module
  /// 7) 更新搜索数据界面 updateSpreadsheet
  /// 8) 更新统计数据 updateSummaryStats

  onPostMessageFromSumBoxButtons() {
    /// 句柄功能: 接受来自父级框架网页的指令, 执行地税查询操作
    /// 这个指令位于父级框架网页的附加功能按键BCA(Resume Tax Searches)
    window.addEventListener("message", (event) => {
      // IMPORTANT: Check the origin of the data!
      if (
        event.origin.indexOf(
          "https://bcres.paragonrels.com/ParagonLS/Search/Results.mvc/Index/"
        )
      ) {
        // The data has been sent from your site
        // The data sent with postMessage is stored in event.data
        console.log(event.data);
        if ((event.data = "taxSearch")) {
          this.onTaxSearch();
        }
      } else {
        // The data hasn't been sent from your site!
        // Be careful! Do not use it.
        return;
      }
    });
  },

  /// 监控搜索结果数据表格的生成, 提取表格数据
  onMutation() {
    /// 句柄功能: 侦听网页内搜索结果列表的生成, 然后提取其中的挂牌数据
    /// AFTER THE SPREADSHEET.TABLE HAS BEEN FULLY LOADED TO THE FRONT.END
    /// 前端表格数据从服务器中传送完成后
    /// 提取数据到属性的挂牌数据table和小区数据表 POPULATE this.table AND this.complexInfos
    var self = this;
    var tableLoading = document.querySelector("#grid tbody"); ///MONITOR THE #grid.tbody, CHECK THE LISTING RECORDS

    var $mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var x = $("table#grid tbody"); //Spreadsheet table body
        var y = $("table.ui-jqgrid-htable thead"); //Spreadsheet Table header
        var rows = x.children("tr");
        var tableHeaderRow = y.children("tr");

        var name = mutation.attributeName;
        var value = mutation.target.getAttribute(name);
        /// 筛选表格节点元素
        if (
          mutation.type == "childList" &&
          mutation.target.tagName == "TBODY"
        ) {
          if (mutation.addedNodes.length != rows.length - 1) {
            return;
          } else {
            self.recordCount = mutation.addedNodes.length;
          }
        } else {
          return;
        }

        /// 提取挂牌数据, 缓存到table属性中
        self.cacheTable(self);

        /// Start to search Tax / Assess Info
        /// 通过Chrome的storage变化事件Event, 继续这个查询Tax/Assess的循环
        /// 后续的查询, 见OnTaxSearch子程序
        self.searchTax();
      });
    });

    /// 启动节点元素侦听事件
    $mutationObserver.observe(tableLoading, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: false,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
  },

  onMutation_Only_for_SummaryUi() {
    var self = this;
    var tableLoading = document.querySelector("#grid tbody"); /// MONITOR THE #grid.tbody, CHECK THE LISTING RECORDS
    var $mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var x = $("table#grid tbody"); //Spreadsheet table body
        var y = $("table.ui-jqgrid-htable thead"); //Spreadsheet Table header
        var rows = x.children("tr");
        var tableHeaderRow = y.children("tr");
        var name = mutation.attributeName;
        var value = mutation.target.getAttribute(name);
        if (
          mutation.type == "childList" &&
          mutation.target.tagName == "TBODY"
        ) {
          if (mutation.addedNodes.length != rows.length - 1) {
            return;
          } else {
            self.recordCount = mutation.addedNodes.length;
          }
        } else {
          return;
        }

        self.table.length = 0; ///INIT THIS.table
        self.rowNumbers.length = 0; ///INIT THIS.rowNumbers

        if (
          x.children("tr").length - 1 == self.recordCount ||
          x.children("tr").length - 1 == 250
        ) {
          self.recordCount = parseInt(self.$searchCount.text());
          console.log(
            "Table Rows currently is: ",
            x.children("tr").length,
            "RecordCount: ",
            self.recordCount
          );
          var x0 = $("div#dialogStats", parent.document); ///LOOK FOR THE SUMMARY.SECTION FOR ADDING EXTRA THIS.uiTable
          // self.uiTable.showUI(x0);
          self.table.length = 0;
        }
      });
    });

    $mutationObserver.observe(tableLoading, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: false,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
  },

  //////////////////////////////////////////////////////////////////////////////
  /// 查询地税的程序模块 ///
  //////////////////////////////////////////////////////////////////////////////

  // onTaxSearch: function (taxSearchInterval) {
  //   /// DEFINE THE TAX.SEARCH EVENT, 地税搜索间隔为50ms
  //   /// 句柄功能: 根据chrome缓存库里面数据的变化, 侦听地税搜索的结果
  //   /// 更新网页表格内相关的设置, 比如地址单元加上**号, 表示地税搜索的进度
  //   (function onEvents(self) {
  //     chrome.storage.onChanged.addListener(function (changes, area) {
  //       let frameVisible = self.getVisibility();
  //       /// 检查是否允许进行地税搜索
  //       /// 1: 人工标记stopSearch 2: 父级框架网页和同级框架页是否可见  classList.contains("ui-tabs-hide")
  //       /// 举例: tab4_1和tab4_2是同级别div元素, tab4是父级框架页
  //       if (
  //         self.$spreadSheet.css("display") == "none" ||
  //         !frameVisible ||
  //         self.stopSearch.is(":checked")
  //       ) {
  //         /// 新增加Visibie控制, 如果搜索价格不可见, 不执行地税查询
  //         // alert("No Tax Search For this property");
  //         console.log("No Tax Search For this property");
  //         return;
  //       }
  //       if (
  //         area == "local" &&
  //         "from" in changes &&
  //         changes.from.newValue.indexOf("assess") > -1 &&
  //         changes.from.newValue.indexOf("ForSpreadSheet") > -1
  //       ) {
  //         console.log(
  //           "==>Spreadsheet - TAX SEARCH EVENT: ",
  //           changes.from.newValue
  //         );
  //         if (changes.from.newValue.indexOf("-TaxSearchFailed") > -1) {
  //           self.updateAssessWhenTaxSearchFailed();
  //         } else {
  //           self.updateAssess();
  //         }
  //         setTimeout(
  //           function () {
  //             ///LOOP THE TAX.SEARCH IN THE SPREADSHEET.TABLE
  //             this.searchTax();
  //           }.bind(self),
  //           taxSearchInterval ?? 50
  //         );
  //       }
  //     });
  //   })(this);
  // },

  /// 对象的方法 METHODS

  searchTax: async function () {
    /// 功用说明: 根据物业的PID和当前的地税年份, 在本地的CouchDB或者远程数据库中, 提取地税/评估数据
    var self = this;
    var i = 0;
    var unTaxed = 0; // 是否完成地税查询的指针
    var searchResult = null;
    var x = $("table#grid tbody");
    var rows = x.children("tr");
    for (i = 0; i < self.table.length; i++) {
      /// 如果查询标记为真, 跳过该记录
      if (self.table[i][10]) continue; // 查询标记字段为字段序号10

      /// 更新地址单元, 增加***, 以表示该记录的地税查询操作已经开始
      let rowNo = i + 1;
      $($(rows[rowNo]).children("td")[self.cols.Address]).text(
        self.table[rowNo - 1][13] + "***"
      );

      /// 如果查询到表格尾, 更新表格, 完成循环
      if (i === self.table.length) {
        console.log("taxSearch done!");
        ///START TO SEARCH COMPLEX.NAME
        this.updateSpreadsheet();
        ///UPDATE THE STATS
        var i = 0;
        for (i = 0; i < self.table.length; i++) {
          var planNum = self.table[i][9];
          if (!planNum.trim()) {
            self.table[i][15] = true; ///BECAUSE OF PLAN.NUMBER ERROR, PASSED THIS RECORD
          }
        }
        self.searchComplex(); //FIRST Complex Search
      }

      /// 执行地税查询
      unTaxed = i;
      var pid = self.table[unTaxed][4];
      pid = $fx.normalizePID(pid);
      if (!pid) {
        return;
      }

      /// 本地查询: 向CouchDB发出查询请求
      try {
        searchResult = await chrome.runtime.promise.sendMessage({
          from: "SpreadSheet",
          todo: "searchTaxFromCouchDB",
          PID: pid,
          taxYear: $fx.currentTaxYear(),
          searchSequenceNo: i,
        });

        if (searchResult.status === "OK") {
          /// 处理本地查询结果
          console.log(searchResult.msg);
          console.log(searchResult.data); /// assessInfo
          self.table[unTaxed][10] = true; /// 设置查询完成标记
          self.updateAssess(searchResult.data);
          continue;
        }
      } catch (err) {
        console.log(err);
      }

      // 远地查询: 向远程BCA数据库发出查询要求
      try {
        searchResult = await chrome.runtime.promise.sendMessage({
          from: "SpreadSheet",
          todo: "searchTaxFromRemoteDB",
          PID: pid,
          taxYear: $fx.currentTaxYear(),
          searchSequenceNo: i,
        });

        if (searchResult.status === "OK") {
          /// 处理远地查询结果
          console.log(searchResult.msg);
          console.log(searchResult.data); /// assessInfo
          self.table[unTaxed][10] = true; /// 设置查询完成标记
          self.updateAssess(searchResult.data);
          continue;
        } else {
          /// 查询失败 failed or timeout
          console.log(searchResult.msg);
          self.table[unTaxed][10] = true; /// 设置查询完成标记
          self.updateAssessWhenTaxSearchFailed(searchResult.data);
          continue;
        }
      } catch (err) {
        console.log(err);
      }

      /// 查询没有地税记录
      self.table[unTaxed][10] = true; /// 设置查询完成标记
      console.log("Could not find the tax information");

      // break;
    }
    self.updateSpreadsheet();
  },

  updateAssess: async function (assessInfo, searchMode) {
    /// 功能说明: 把地税查询的数据, 缓存到table中
    /// 更新地址单元, 增加**, 显示地税查询的进度
    /// searchMode 分为local 和 remote
    /// ON TAX.SEARCH EVENT, CHROME.STORAGE GET A NEW.VALUE CONTAINS 'assess' AND 'ForSpreadSheet'
    var self = this;
    var aInfo = null;

    if (!assessInfo) {
      assessInfo = await chrome.storage.promise.local.get([
        "PID",
        "totalValue",
        "improvementValue",
        "landValue",
        "lotSize",
        "address",
        "bcaDataUpdateDate",
        "bcaDescription",
        "planNum",
        "taxYear",
        "taxRollNumber",
        "legal",
        "grossTaxes",
        "dataFromDB",
      ]);
    }

    var pid = assessInfo.PID;
    var totalValue = assessInfo.totalValue;
    var improvementValue = assessInfo.improvementValue;
    var landValue = assessInfo.landValue;
    var lotSize = assessInfo.lotSize;
    var planNum = assessInfo.planNum;
    let taxYear = assessInfo.taxYear;
    let bcaDataUpdateDate = assessInfo.bcaDataUpdateDate;
    let bcaDescription = assessInfo.bcaDescription;
    let taxRollNumber = assessInfo.taxRollNumber;
    let grossTaxes = assessInfo.grossTaxes;
    let legal = assessInfo.legal;
    let floorArea = null;
    var formalAddress = "";
    var isFormalAddress = false;
    if (
      typeof assessInfo.address == "string" &&
      assessInfo.address.trim().length > 0
    ) {
      formalAddress = assessInfo.address.trim();
    } else {
      formalAddress = "";
    }

    var houseType = null;
    var intTotalValue = $fx.convertStringToDecimal(totalValue);

    var i = 0;
    var price = 0;
    var rowNumbers = self.rowNumbers;

    for (i = 0; i < self.table.length; i++) {
      var checkPID = self.table[i][4];
      var c = "";
      var newPID = "";
      // create assess object
      let assessInfo = {
        landValue: null,
        improvementValue: null,
        assessID: null,
        totalValue: null,
        pid: null,
        taxYear: null,
        address: null,
        legal: null,
        taxRollNumber: null,
        grossTaxes: null,
        planNum: null,
        houseType: null,
        lotSize: null,
        bcaDataUpdateDate: null,
        bcaDescription: null,
        floorArea: null,
        bcaFloorArea: null,
      };

      //only keep numbers and dash character
      for (var n = 0; n < checkPID.length; n++) {
        c = checkPID[n];
        if (c == "-") {
          newPID += c;
          continue;
        }
        if (parseInt(c) >= 0 && parseInt(c) <= 9) {
          newPID += c;
        }
      }
      if (pid == newPID) {
        self.table[i][5] = landValue;
        self.table[i][6] = improvementValue;
        self.table[i][7] = totalValue;
        self.table[i][9] = planNum;
        self.table[i][10] = true; ///TOGGLE THE ROW'S TAX.SEARCH.SING TO TRUE: TAX.SEARCH.DONE
        if (
          typeof formalAddress == "string" &&
          formalAddress.trim().length > 0
        ) {
          self.table[i][13] = formalAddress; ///SET FORMAL ADDRESS TO THE ONE FROM TAX SEARCH
          isFormalAddress = true;
        } else {
          self.table[i][13] = self.table[i][13].trim();
          isFormalAddress = false;
        }
        var tempAddress = self.table[i][13]; ///SET TEMP ADDRESS FOR FUNCTION BELOW:
        houseType = self.table[i][14]; //fetch houseType
        aInfo = new AddressInfo(tempAddress, houseType, isFormalAddress);
        self.table[i][14] = aInfo.houseType;
        houseType = aInfo.houseType;
        self.table[i][17] = aInfo.streetAddress;
        self.table[i][18] = aInfo.UnitNo;
        self.table[i][16] = planNum + aInfo.addressID; //complexID
        price = parseInt(self.table[i][1]); ///COL 1: PRICE
        floorArea = self.table[i][2]; ///COL 2: FLOOR.AREA
        rowNumbers.push(self.table[i][0]);
        if (totalValue != 0) {
          //calculate the price change percentage
          var changeValue = price - intTotalValue;
          var changeValuePercent = (
            (changeValue / intTotalValue) *
            100
          ).toFixed(0);
          self.table[i][8] = changeValuePercent;
        }

        // fill in assessInfo
        assessInfo.landValue = landValue;
        assessInfo.improvementValue = improvementValue;
        assessInfo.totalValue = totalValue;
        assessInfo.planNum = planNum;
        assessInfo.address = formalAddress;
        assessInfo.houseType = houseType;
        assessInfo.lotSize = lotSize;
        assessInfo.assessID = pid + "-" + taxYear;
        assessInfo.pid = pid;
        assessInfo.taxYear = taxYear;
        assessInfo.bcaDataUpdateDate = bcaDataUpdateDate;
        assessInfo.bcaDescription = bcaDescription;
        assessInfo.taxRollNumber = taxRollNumber;
        assessInfo.legal = legal;
        assessInfo.grossTaxes = grossTaxes;
        assessInfo.update = true;
        assessInfo.floorArea = floorArea;
        self.assessInfos.push(assessInfo);
        console.log(assessInfo);
      }
    }

    console.log(
      "SpreadSheet - ASSESS SEARCHing LandValue: ",
      /*self.table,*/
      landValue,
      rowNumbers.length,
      "/",
      i
    );

    /// 更新地址单元, 增加**, 以表示该记录的地税查询操作已经完成
    var x = $("table#grid tbody");
    var rows = x.children("tr");
    var rowNo = self.rowNumbers[self.rowNumbers.length - 1];
    let searchModeSign = searchMode === "local" ? "*" : '"';
    $($(rows[rowNo]).children("td")[self.cols.Address]).text(
      self.table[rowNo - 1][13] + searchModeSign
    );
  },

  updateAssessWhenTaxSearchFailed: async function (assessInfo) {
    ///FOR NO BC.TAX.RECORD
    ///BC.TAX.RECORD SHOWS TAX.VALUE = 0
    var self = this;

    if (!assessInfo) {
      assessInfo = await chrome.storage.promise.local.get([
        "PID",
        "totalValue",
        "improvementValue",
        "landValue",
        "planNum",
      ]);
    }

    var pid = assessInfo.PID;
    var totalValue = assessInfo.totalValue;
    var improvementValue = assessInfo.improvementValue;
    var landValue = assessInfo.landValue;
    var planNum = assessInfo.planNum.trim();
    var formalAddress;
    var houseType = "";
    var aInfo = null;

    var i = 0;
    var price = 0;
    var rowNumbers = self.rowNumbers;
    for (i = 0; i < self.table.length; i++) {
      if (pid == self.table[i][4]) {
        assessInfo.address = self.table[i][13]; // 使用原有的地址
        formalAddress = assessInfo.address.trim(); // 整理地址
        self.table[i][5] = landValue;
        self.table[i][6] = improvementValue;
        self.table[i][7] = totalValue;
        self.table[i][9] = planNum;
        self.table[i][10] = true; // tax done
        houseType = self.table[i][14]; //fetch houseType

        if (planNum) {
          aInfo = new AddressInfo(formalAddress, houseType, true);
          self.table[i][16] = planNum + aInfo.addressID; ////complexID
        } else {
          //format the address of table col 13:
          aInfo = new AddressInfo(
            /*address col 13 */
            self.table[i][13],
            /*houseType col 14*/
            self.table[i][14]
          );
          formalAddress = aInfo.formalAddress;
          planNum = "NPN"; ///NPN STANDS FOR NO.PLAN.NUMBER
          self.table[i][9] = "NPN"; ///UPDATE THE TABLE CELL FOR PLAN.NUMBER
          self.table[i][16] =
            /*planNum need to get from legalDescription */
            planNum + aInfo.addressID; //complexID
        }

        self.table[i][14] = aInfo.houseType;
        self.table[i][17] = aInfo.streetAddress;
        self.table[i][18] = aInfo.UnitNo;

        self.table[i][13] = formalAddress; // formal address from tax search
        price = parseInt(self.table[i][1]);

        rowNumbers.push(self.table[i][0]);

        var changeValue = 0;
        var changeValuePercent = 0;
        self.table[i][8] = changeValuePercent;
      }
    }

    var x = $("table#grid tbody");
    var rows = x.children("tr");
    var rowNo = self.rowNumbers[self.rowNumbers.length - 1];
    $($(rows[rowNo]).children("td")[self.cols.Address]).text(
      self.table[rowNo - 1][13] + "^"
    );
  },

  //////////////////////////////////////////////////////////////////////////////
  /// 小区查询程序模块  Complex Search Code
  //////////////////////////////////////////////////////////////////////////////
  onComplexSearch: function () {
    (function onEvents(self) {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (self.$spreadSheet.css("display") == "none") {
          return;
        }
        if (area == "local" && "from" in changes) {
          if (
            changes.from.newValue.indexOf("complexInfo") > -1 &&
            changes.from.newValue.indexOf("spreadSheetCompletion") > -1
          ) {
            console.log("====>Spreadsheet : COMPLEX SEARCH EVENT", changes);
            self.updateComplex();

            setTimeout(
              function () {
                //go to next listing for assess date
                this.searchComplex();
              }.bind(self),
              50
            );
          }
        }
      });
    })(this);
  },

  searchComplex: function () {
    var self = this;
    var i = 0;
    var unSearchComplex = 0;
    var planNum = "";
    var address = "";
    var complexName = "";
    var houseType = "";
    var complexID = "";
    var x = $("table#grid tbody");
    var rows = x.children("tr");
    for (i = 0; i < self.table.length; i++) {
      try {
        if (!self.table[i][15]) {
          ///IF NOT YET DONE COMPLEX SEARCH BY CHECKING COMPLEX SEARCH TAG
          unSearchComplex = i;
          complexID = self.table[i][16];
          ////planNum, address, complex, houseType
          planNum = self.table[i][9];
          address = self.table[i][13];
          complexName = $fx.normalizeComplexName(self.table[i][12]);
          $($(rows[i + 1]).children("td")[self.cols.ComplexName]).text(
            "**" + self.table[i][12]
          );

          houseType = self.table[i][14].toUpperCase();
          if (houseType == "HOUSE" || houseType == "DETACHED") {
            ///DETACHED PROPERTY NO NEED TO DO COMPLEX SEARCH
            self.table[i][12] = self.table[i][9];
            self.table[i][15] = true;
            if (i == self.table.length - 1) {
              console.log("Single House ComplexSearch Done!");
              self.updateSpreadsheet();
              // self.postAssessInfo(); // post assess to mySQL for detached properties
              let assess = new Assessment();
              assess.postAssessInfos(self.assessInfos, $fx);
            }
            continue;
          }
          if (!complexID) {
            // re do complexID
            var isFormal = true; // this is formal address from tax search
            var aInfo = new AddressInfo(address, houseType, isFormal); //todo list...
            complexID = planNum + aInfo.addressID;
          }
          ////////////////////////////////////////////
          var complexInfo = {
            _id: complexID,
            name: complexName,
            todo: "searchComplexInfo",
            from: "spreadSheetCompletion",
          };

          chrome.runtime.sendMessage(complexInfo, function (response) {});
          ////////////////////////////////////////
          break;
        }
      } catch (error) {
        console.error(error);
        continue;
      }

      if (i == self.table.length - 1) {
        self.updateSpreadsheet();
        self.complexInfos.length = 0;
        for (var j = 1; j <= self.table.length; j++) {
          let fields = $(rows[j]).children("td");
          let strataPlanID =
            fields[self.cols.StrataPlan].textContent.trim() +
            " " +
            fields[self.cols.StreetAddress].textContent.trim();
          strataPlanID = strataPlanID.trim().split(" ").join("-");
          complexInfo = {
            ComplexName: fields[self.cols.ComplexName].textContent,
            Address: fields[self.cols.StreetAddress].textContent,
            City: fields[self.cols.City].textContent,
            Postcode: fields[self.cols.Postcode].textContent,
            DwellingType: fields[self.cols.HouseType].textContent,
            StrataPlan: fields[self.cols.StrataPlan].textContent,
            StrataPlanID: strataPlanID,
            Neighborhood: fields[self.cols.Neighborhood].textContent,
            CityDistrict: fields[self.cols.SubArea].textContent,
            YearBuilt: fields[self.cols.YearBuilt].textContent,
            PropertyType: fields[self.cols.PropertyType].textContent,
            TitleToLand: fields[self.cols.TitleToLand].textContent,
            Units: fields[self.cols.Units].textContent,
            Storeys: fields[self.cols.Storeys].textContent,
            BylawRentalRestriction:
              fields[self.cols.BylawRentalRestriction].textContent,
            FloodPlain: fields[self.cols.FloodPlain].textContent,
            Zoning: fields[self.cols.Zoning].textContent,
            BylawRestriction: fields[self.cols.BylawRestriction].textContent,
            Parking: fields[self.cols.Parking].textContent,
            ManagementCoName: fields[self.cols.ManagementCoName].textContent,
            ManagementCoPhone: fields[self.cols.ManagementCoPhone].textContent,
            BylawPetRestriction:
              fields[self.cols.BylawPetRestriction].textContent,
            BylawAgeRestriction:
              fields[self.cols.BylawAgeRestriction].textContent,
            NeighborhoodCode: fields[self.cols.NeighborhoodCode].textContent,
            Region: fields[self.cols.Region].textContent,
            Province: fields[self.cols.Province].textContent,
            RainScreen: fields[self.cols.RainScreen].textContent,
            Construction: fields[self.cols.Construction].textContent,
            Amenities: fields[self.cols.Amenities].textContent,
            SiteInfluences: fields[self.cols.SiteInfluences].textContent,
            StrataFeePSF: fields[self.cols.StrataFeePSF].textContent,
            MaintenanceFeeInclude:
              fields[self.cols.MaintenanceFeeInclude].textContent,
            AddedDate: $fx.formatDate_Y_m_d(new Date()),
          };
          self.complexInfos.push(complexInfo);
        }

        // console.log("complexSearch done::", self.complexInfos);
        // self.postComplexInfo();
        let complex = new Complex();
        complex.postComplexInfos(this.complexInfos, $fx);
        // send strata property assess infos to mySql Table
        // self.postAssessInfo();
        let assess = new Assessment();
        assess.postAssessInfos(self.assessInfos, $fx);
      }
    }
  },

  updateComplex: function () {
    var self = this;

    chrome.storage.local.get(["_id", "name"], function (result) {
      var complexID = result._id;
      var complexName = result.name;
      complexName = $fx.normalizeComplexName(complexName);
      var i = 0;
      for (i = 0; i < self.table.length; i++) {
        if (complexID == self.table[i][16]) {
          console.log("====>Spreadsheet-Complex Updated: ", i);
          self.table[i][12] = complexName;
          self.table[i][15] = true; ////SETUP THE ROW'S COMPLEX SEARCH SIGN
        }
      }
    });
  },

  /////////////////////////////////////////////////////////
  /// 更新搜索结果表格
  /////////////////////////////////////////////////////////

  updateSpreadsheet: function () {
    var self = this;

    var x = $("table#grid tbody");
    var rows = x.children("tr");
    var rowNumbers = self.rowNumbers;
    var assessSold = [];
    var assessChangeSold = [];
    var assessActive = [];
    var assessChangeActive = [];
    var countActiveListing = 0;
    var countSoldListing = 0;
    var aInfo = null;
    var addressLink = $(
      '<a id="addressLink" target="_blank" href="https://www.google.com/search?q=Google+tutorial+create+link">' +
        "Google tutorial create link" +
        "</a> "
    );
    var addressText = "";
    var i;
    for (i = 0; i < rowNumbers.length; i++) {
      var j = rowNumbers[i];
      var t = $fx.convertStringToDecimal(self.table[j - 1][7]);
      const status = self.table[j - 1][20];
      if (t > 0) {
        $($(rows[j]).children("td")[self.cols.LandValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][5])
        );
        $($(rows[j]).children("td")[self.cols.ImprovementValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][6])
        );
        $($(rows[j]).children("td")[self.cols.TotalValue]).text(
          $fx.removeDecimalFraction(self.table[j - 1][7])
        );
        $($(rows[j]).children("td")[self.cols.ChangeValuePercent]).text(
          self.table[j - 1][8] + "%"
        );

        switch (status) {
          case "A":
            assessActive.push($fx.convertStringToDecimal(self.table[j - 1][7]));
            assessChangeActive.push(
              $fx.convertStringToDecimal(self.table[j - 1][8])
            );
            countActiveListing++;
            break;
          case "S":
            assessSold.push($fx.convertStringToDecimal(self.table[j - 1][7]));
            assessChangeSold.push(
              $fx.convertStringToDecimal(self.table[j - 1][8])
            );
            countSoldListing++;
            break;
        }
      } else {
        ////IF TOTAL.VALUE == 0, THEN DO NOT SHOW ANY NUMBER
        $($(rows[j]).children("td")[self.cols.LandValue]).text("");
        $($(rows[j]).children("td")[self.cols.ImprovementValue]).text("");
        $($(rows[j]).children("td")[self.cols.TotalValue]).text("");
        $($(rows[j]).children("td")[self.cols.ChangeValuePercent]).text("");
        switch (status) {
          case "A":
            // assessActive.push(null);
            // assessChangeActive.push(null);
            countActiveListing++;
            break;
          case "S":
            // assessSold.push(null);
            // assessChangeSold.push(null);
            countSoldListing++;
            break;
        }
      }

      $($(rows[j]).children("td")[self.cols.StrataPlan]).text(
        self.table[j - 1][9]
      ); //Show Plan Num in the table
      $($(rows[j]).children("td")[self.cols.Address]).text("");
      addressText = self.table[j - 1][13];
      aInfo = new AddressInfo(
        addressText,
        $($(rows[j]).children("td")[self.cols.HouseType]).text(),
        true
      );
      var addressLink = $(
        '<a id="addressLink" target="_blank" href="https://www.google.com/search?q=Google+tutorial+create+link">' +
          "Google tutorial create link" +
          "</a> "
      );
      addressLink.attr("href", aInfo.googleSearchLink);
      addressLink.text(aInfo.formalAddress);
      addressLink.appendTo($($(rows[j]).children("td")[self.cols.Address])); ////ADD A GOOGLE ADDRESS SEARCH ANCHOR
      $($(rows[j]).children("td")[self.cols.StreetAddress]).text(
        self.table[j - 1][17]
      ); ////SHOW THE STREET ADDRESS WITHOUT UNIT#
      $($(rows[j]).children("td")[self.cols.UnitNo]).text(
        "#" + self.table[j - 1][18]
      ); ////SHOW THE UNIT NO SEPARATELY
      if (self.table[j - 1][12].trim()) {
        $($(rows[j]).children("td")[self.cols.ComplexName]).text(
          self.table[j - 1][12]
        ); ////SHOW NORMALIZED COMPLEX NAME
      }
      $($(rows[j]).children("td")[self.cols.StrataFeePSF]).text(
        self.table[j - 1][21]
      );
    }
    var maxChange = Math.max(...assessChangeActive);
    var minChange = Math.min(...assessChangeActive);
    for (var i = 0; i < self.table.length; i++) {
      if (self.table[i][8] == maxChange) {
        $(rows[i + 1]).css("color", "red");
      }
      if (self.table[i][8] == minChange) {
        $(rows[i + 1]).css("color", "blue");
      }
    }

    maxChange = Math.max(...assessChangeSold);
    minChange = Math.min(...assessChangeSold);
    for (var i = 0; i < self.table.length; i++) {
      if (self.table[i][8] == maxChange) {
        $(rows[i + 1]).css("color", "red");
      }
      if (self.table[i][8] == minChange) {
        $(rows[i + 1]).css("color", "blue");
      }
    }

    /// 缓存统计数据
    self.sumValues[2] = [1, assessChangeActive, countActiveListing, "%"];
    self.sumValues[3] = [2, assessChangeSold, countSoldListing, "%"];
    self.sumValues[4] = [1, assessActive, countActiveListing, "$"];
    self.sumValues[5] = [2, assessSold, countSoldListing, "$"];

    /// 将统计数据包, 通过postMessage发送到上一级的iFrame
    let sumValuesJSON = JSON.stringify({
      action: "showSummaryStats",
      sumInfo: {
        sumValues: self.sumValues,
        countAdtiveListing: countActiveListing,
        countSoldListing: countSoldListing,
      },
    });
    let parentFrame = parent.window.frameElement;
    parentFrame.contentWindow.postMessage(sumValuesJSON);

    //table data to background
    // let btnSendTable = self.uiTable.$UITable[0].querySelector(
    //   "#mls-send-table-to-background"
    // );
    // btnSendTable.click();
  },

  /////////////////////////////////////////////////////////////////////////////
  // 对象方法: 辅助程序模块
  /////////////////////////////////////////////////////////////////////////////

  cacheTable: function (self) {
    /// 功能说明: 提取搜索结果表单里面的挂牌数据, 缓存到table属性
    /// 搜索结果已经传输完毕, 执行本函数

    var x = $("table#grid tbody"); //Spreadsheet table body
    var y = $("table.ui-jqgrid-htable thead"); //Spreadsheet Table header
    var rows = x.children("tr");
    var tableHeaderRow = y.children("tr");
    self.table.length = 0; ///INIT THIS.table
    self.rowNumbers.length = 0; ///INIT THIS.rowNumbers
    self.assessInfos.length = 0; // clear the assessInfo container

    if (
      x.children("tr").length - 1 !== self.recordCount &&
      x.children("tr").length - 1 !== 250
    ) {
      throw "错误: 数据记录的数量不匹配";
    }

    if (
      x.children("tr").length - 1 === self.recordCount ||
      x.children("tr").length - 1 === 250
    ) {
      console.log("数据记录的数量相匹配");
    }
    ///THE TABLE #grid HAS BEEN FULLY LOADED TO THE FRONT.ENT

    self.recordCount = parseInt(self.$searchCount.text());
    console.log(
      "Table Rows currently is: ",
      x.children("tr").length,
      "RecordCount: ",
      self.recordCount
    );
    var x0 = $("div#dialogStats", parent.document); ///LOOK FOR THE SUMMARY.SECTION FOR ADDING EXTRA THIS.uiTable
    // self.uiTable.showUI(x0);

    var i;
    var row = []; //current row
    // var complexInfo = {}; //complex info json object
    var col14_Price = []; //List Price
    var col22_FloorArea = []; //FloorArea
    var col23_ActivePricePSF = []; //Listed / asking Price per SqFt
    var col24_SoldPricePSF = []; //Sold Price Per SqFt
    var col31_PID = []; //PID Column
    var col32_LandValue = []; //Land Value Colum
    var col33_ImprovementValue = []; // Improvement Value
    var col34_TotalAssess = []; // Total Assessment Value
    var col35_ValueChange = []; // Computed column for total value change percentage
    var col36_PlanNum = []; // Strata Plan Number
    var col_LotSize = []; // lot size in square feet
    var listPricePSF = []; //for listPrice Per Square Feet
    var sumPSFListedPrice = 0;
    var sumPSFActivePrice = 0; //keep the sum of listing price per sf
    var sumPSFSoldPrice = 0; //keep the sum of sold price per sf
    var countSoldListing = 0; //keep the count of sold listings
    var countActiveListing = 0; ////KEEP THE COUNT OF ACTIVE LISTINGS
    var soldPricePSF; //keep the sold price per square feet
    var listingPricePSF; //keep the listing price per square feet
    var strataFeePSF; ///KEEP THE CALCULATED STRATA FEE PER SQUARE FEET
    var status; ///KEEP THE LISTING STATUS
    i = 0;
    /// 修正表头字段的名称 modify the table header
    var headerCells = $(tableHeaderRow[0]).children("th");
    for (var j = 0; j <= headerCells.length; j++) {
      switch (j) {
        case self.cols.LandValue:
          $(headerCells[j]).children("div").text("landValue");
          break;
        case self.cols.ImprovementValue:
          $(headerCells[j]).children("div").text("imprvValue");
          break;
        case self.cols.TotalValue:
          $(headerCells[j]).children("div").text("totalValue");
          break;
        case self.cols.ChangeValuePercent:
          $(headerCells[j]).children("div").text("change%");
          break;
        case self.cols.StrataPlan:
          $(headerCells[j]).children("div").text("strataPlan");
          break;
        case self.cols.StreetAddress:
          $(headerCells[j]).children("div").text("streetAddress");
          break;
        case self.cols.UnitNo:
          $(headerCells[j]).children("div").text("Unit#");
          break;
        case self.cols.StrataFeePSF:
          $(headerCells[j]).children("div").text("StrFeePSF");
          break;
      }
    }
    /// 逐行处理表单数据
    for (i = 1; i < rows.length; i++) {
      row.push(i); ///COL 0: ROW.NO
      status = $(rows[i]).children("td")[self.cols.Status].textContent;
      var price = $fx.convertStringToDecimal(
        $(rows[i]).children("td")[self.cols.Price].textContent
      );
      col14_Price.push(price);
      row.push(price); ////COL 1: PRICE
      var floorArea = $fx.convertStringToDecimal(
        $(rows[i]).children("td")[self.cols.TotalFloorArea].textContent
      );
      col22_FloorArea.push(floorArea);
      row.push(floorArea); ////COL 2: FLOOR.AREA
      if (self.tabTitle == "Residential Attached") {
        var lotSize = $fx.convertStringToDecimal(
          $(rows[i]).children("td")[self.cols.LotSize].textContent
        );
      } else {
        var lotSize = $fx.convertStringToDecimal(
          $(rows[i]).children("td")[self.cols.LotSize].textContent
        );
      }
      col_LotSize.push(lotSize);
      listingPricePSF = Number(
        Number(
          col14_Price[col14_Price.length - 1] /
            col22_FloorArea[col22_FloorArea.length - 1]
        ).toFixed(2)
      );
      sumPSFListedPrice += listingPricePSF;
      listPricePSF.push(listingPricePSF);
      row.push(listingPricePSF); ///COL 3: LISTING.ASKING.PRICE.PER.SQUARE.FEET?????????????????????
      ///ACTIVE LISTING VS SOLD LISTING
      switch (status) {
        case "A":
          ////Added Status Control: Only Select Active Listing for ListingPrice
          var activePricePSF = $fx.convertStringToDecimal(
            $(rows[i]).children("td")[self.cols.PricePSF].textContent,
            true
          );
          if (activePricePSF > 0) {
            countActiveListing++;
            col23_ActivePricePSF.push(activePricePSF);
            sumPSFActivePrice += activePricePSF;
          }
          break;
        case "S":
          soldPricePSF = $fx.convertStringToDecimal(
            $(rows[i]).children("td")[self.cols.SoldPricePSF].textContent
          );
          if (soldPricePSF > 0) {
            countSoldListing++;
            col24_SoldPricePSF.push(soldPricePSF); ///SOLD.PRICE.PER.SQUARE.FEET
            sumPSFSoldPrice += soldPricePSF; ///TOTAL.SOLD.PRICE.PER.SQUARE.FEET
          }
          break;
      }

      ///LOOK FOR PID FOR TAX.SEARCH
      var pid = $(rows[i]).children("td")[self.cols.PID].textContent;
      var complexName = $(rows[i]).children("td")[self.cols.ComplexName]
        .textContent;
      var address = $(rows[i]).children("td")[self.cols.Address].textContent;
      var houseType = $(rows[i]).children("td")[self.cols.HouseType]
        .textContent;
      var streetAddress = $(rows[i]).children("td")[self.cols.Address]
        .textContent;
      var unitNo = "";
      var city = "";
      col31_PID.push(pid);
      row.push(pid); ///COL 4: PID
      col32_LandValue.push(0);
      row.push(0); ///COL 5: LAND.VALUE
      col33_ImprovementValue.push(0);
      row.push(0); ///COL 6: IMPROVEMENT.VALUE
      col34_TotalAssess.push(0);
      row.push(0); ///COL 7: TOTAL.ASSESS
      col35_ValueChange.push(0);
      row.push(0); ///COL8: VALUE.CHANGE
      col36_PlanNum.push("");
      row.push(""); ///COL9: PLAN.NUM
      row.push(false); //col 10 : taxSearch Sign
      row.push(lotSize); // col 11 : add lotSize for single house or land
      row.push(complexName); //col 12: for complex Name
      row.push(address); //col 13: for address
      row.push(houseType); //col 14: for houseType
      row.push(false); //col 15: complexSearch Sign
      row.push(""); //col 16: placeholder for complexID
      row.push(streetAddress); ///COL 17: STREET ADDRESS
      row.push(unitNo); ///  COL 18: UNIT NO FOR STRATA UNIT
      city = $(rows[i]).children("td")[self.cols.City].textContent;
      row.push(city); /// COL 19: CITY OF GREAT VANCOUVER
      row.push(status); ///COL 20: LISTING STATUS
      var strataFee = $(rows[i]).children("td")[self.cols.StrataFee]
        .textContent;
      strataFee = $fx.convertStringToDecimal(strataFee, true);
      try {
        strataFeePSF = Number(strataFee / floorArea).toFixed(2);
      } catch (e) {
        strataFeePSF = 0;
      }
      row.push(strataFeePSF); ///COL 21: STRATA FEE PER SQUARE FEET
      console.log(`缓存row#${i}`, row);
      /// 挂牌数据提取后, 存入内层表格中
      self.table.push(row); ////ADD THE ROW TO THE TABLE
      // self.rowNumbers.push(i); /// 保存记录序号
      row = []; ///INIT THE ROW
    }

    /// 缓存平均尺价的统计数据
    self.sumValues[0] = [1, col23_ActivePricePSF, countActiveListing, "$"];
    self.sumValues[1] = [2, col24_SoldPricePSF, countSoldListing, "$"];

    for (var i = 0; i < self.table.length; i++) {
      if (!$fx.inGreatVanArea(self.table[i][19])) {
        ///IF IS NOT GREAT VAN CITIES, PASSED TAX SEARCH
        /// 如果挂牌物业不属于大温地区, 则跳过地税查询
        console.log("[SP]==>BYPASS THE NON GV CITIES!", i);
        $(rows[i + 1]).children("td")[self.cols.Address].textContent += "^";
        self.table[i][10] = true; // 地税搜索标记
        self.table[i][15] = true; // 小区搜索标记
        continue;
      }
    }
  },

  addLock: function (tabID) {
    /// 功能说明: 锁定搜索结果页面, 隐藏远程地税搜索的界面
    chrome.runtime.sendMessage(
      {
        from: "SpreadSheet",
        todo: "addLock",
        tabID,
        tabID,
      },
      function (response) {
        console.log("SpreadSheet got tax response:", response);
      }
    );
  },

  getVisibility() {
    /// 功能说明: 计算本搜索结果/表格的可见性
    if (this.elementContainerLevel1.classList.contains("ui-tabs-hide")) {
      /// 如果第一级tab容器不可见, 则本表格也不可见
      return false;
    }
    if (this.elementContainerLevel2.classList.contains("ui-tabs-hide")) {
      /// 如果第二级tab容器不可见, 则本表格也不可见
      return false;
    } else {
      /// 如果第二级tab容器可见, 则本表格自己来决定可见性
      return !this.elementContainerLevel3.classList.contains("ui-tabs-hide");
    }
  },
};

/// 程序入口 entry point:
/// 模块对应的网页地址/网页ID: ifSpreadsheet
$(function () {
  console.log("Spreadsheet Document State:", document.readyState);
  var $loadingNotice = document.querySelector("#load_grid");
  // Define Debug Status::
  var DEBUG = true;
  if (!DEBUG) {
    if (!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for (var i = 0; i < methods.length; i++) {
      console[methods[i]] = function () {};
    }
  }
  console.log($loadingNotice);

  /// 程序入口
  computeSFPrices.init();
});
