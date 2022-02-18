/***
 * Targe Tab3//4/5_1_2 ML Default Spreadsheet View
 * https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/2/?savedSearchID=1781753&searchID=tab3_1
 * 本程序已经具备新的功能, 也不会再bypass ListingSearchCriteria页面,所以改名为ListingSearchCreteria [2022/02/15]
 * 模块功能说明:
 * #1: 将搜索条件设定保存到相应的CMA报告数据库中
 * #2: 测试第一个价格区间, 里面有接近1500个记录
 * #3: 查找洗一个价格区间, 里面有接近1500个记录
 * #4: 查找前一个价格区间, 里面有接近1500个记录
 * #5: 查找价格分布区间
 */

window.g_urlCountAction = "/ParagonLS/Search/Property.mvc/Count/0";

async function setDebugMode() {
  /// 设定调试输出模式
  let debugSettingInfo = await chrome.runtime.promise.sendMessage({
    debugID: "debug_listing_Search_criteria",
    from: "BypassListingSearchCriteria.js",
    todo: "readDebugSetting",
  });
  let debugSetting = debugSettingInfo.data.value;
  window.console.currentPage = {
    log: debugSetting ? console.log : () => {},
    logAlways: console.log,
    logDebug: (tag, pageName) => {
      if (!debugSetting) {
        console.log(`(${tag} DISABLED: ) ${pageName} ()`);
      }
    },
  };

  console.currentPage.logDebug("Debug", "ListingSearchCriteria.js");
}

$(function () {
  /// 程序入口
  let $fx = L$();
  /// 设定调试模式
  $fx.setDebugMode("debug_listing_Search_criteria", "ListingSearchCriteria.js");

  setWrapper(document.firstElementChild, Object, window);
  searchCriteria($fx);
});

function setWrapper(elementExample, Object, window) {
  function createIDLSetWrapper(key, nativeSet, nativeGet) {
    return function (newValue) {
      var oldValue = this.getAttribute(key);
      nativeSet.call(this, newValue); // natively update the value

      if (this.getAttribute(key) === oldValue) {
        // ensure that an attribute is updated so that mutation observers are fired
        this.setAttribute(key, nativeGet.call(this));
      }
    };
  }

  var ownProps = Object.getOwnPropertyNames(window);
  for (var i = 0, len = ownProps.length | 0, key; i < len; i = (i + 1) | 0) {
    key = ownProps[i];
    if (
      /^HTMLInputElement$/.test(key) &&
      window.hasOwnProperty(key) &&
      !window.propertyIsEnumerable(key) &&
      typeof window[key] === "function"
    )
      (function () {
        var oldDescriptors = Object.getOwnPropertyDescriptors(
          window[key].prototype
        );

        var keys = Object.keys(oldDescriptors);
        var newDescriptors = {};
        console.currentPage.log(keys);

        for (
          var i = 0, len = keys.length | 0, prop, description;
          i < len;
          i = (i + 1) | 0
        ) {
          prop = keys[i];
          description = oldDescriptors[prop];
          if (
            prop !== "nonce" && // supposed to be secret and hidden from CSS
            (!prop.startsWith("on") || elementExample[prop] !== null) && // screen out event listeners
            typeof description.set === "function" && // ensure that this property has a descriptor
            description.set.toString().indexOf("[native code]") !== -1 // ensure that we have not already processed to this element
          )
            newDescriptors[prop] = {
              configurable: true,
              enumerable: true,
              get: description.get, // do not modify the original getter
              set: createIDLSetWrapper(prop, description.set, description.get),
            };
        }

        // Finally apply the wrappers
        Object.defineProperties(window[key].prototype, newDescriptors);
      })();
  }
}

function searchCriteria($fx) {
  /// 功能说明: 增加该页面的附加功能
  var divCountSearch = $("#CountSearch");
  var btnSearch = $("#Search");
  var btnCount = $("#Count");
  var inputCountResult = $("#CountResult");
  let dsn, pPnt, pricePoint, pInt, priceInterval, lCnt, lastCount;
  /// 设定显示板模板
  dsn = 1;
  pPnt = pricePoint = 1;
  pInt = priceInterval = 200;
  lCnt = lastCount = 50;

  /// 在容器中增加参数面板
  addParameterPanel();

  /// 在DOM增加显示板
  initPriceDistPanel(dsn, pPnt);

  /// 在DOM增加3个价格分布框
  initPriceDistributionRows(3, dsn, pPnt);

  /// 根据元素id, 获取价格区间元素, 不过ID的序号可能是变化的
  // let highPrice = $("#f_5_High__1-2-3-4-5");
  // let lowPrice = $("#f_5_Low__1-2-3-4-5");
  // let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
  // f_5_Low__1
  // f_5_Low_1__1
  // f_5_High__1
  // f_5_High_1__1
  // let highPrice = $("#f_5_High__1");
  // let lowPrice = $("#f_5_Low__1");
  // let lowPrice2 = $("#f_5_Low_1__1");

  /// 获取价格区间元素
  let inputContainer =
    document.getElementsByClassName("f-form-price-range")[0].children;
  let elementsInContainer = Array.from(inputContainer);
  let inputElements = elementsInContainer.filter(
    (element) => element.tagName.toLowerCase() === "input"
  );
  let highPrice = $(inputElements[2]);
  let lowPrice = $(inputElements[0]);
  let lowPrice2 = $(inputElements[1]);

  var curve = {
    priceRange: [0],
    listingCount: [0],
    testControlCount: [],
  };
  var priceRange;
  var listingCount;
  var priceRangePointer = 0;

  var nextLowPrice = 0;

  /// remove inputCountResult ReadOnly Attr
  inputCountResult.removeAttr("readonly");
  inputCountResult.attr("value", "Counting***");
  /// 搜索数量, 目前已经不起作用
  btnCount.trigger("click"); // 不起作用, 人工点击按钮是可以的
  let initCountTotal = $.focusFx.searchFormCount();
  console.currentPage.log(initCountTotal);

  /// 创建附加功能键
  var btnSaveCriteria = $(
    `<button id="mls_helper_save_criteria">Save</button>`
  );
  var btnNextCriteria = $(
    `<button id="mls_helper_next_criteria">Next</button>`
  );
  // var btnPrevCriteria = $(
  //   `<button id="mls_helper_prev_criteria">Prev</button>`
  // );
  // mls_helper_price_distribution
  var btnPrevCriteria = $(
    `<button id="mls_helper_price_distribution" title="Equal Interval Price Curve">Distr</button>`
  );
  var btnFirstCriteria = $(
    `<button id="mls_helper_first_criteria">Test</button>`
  );
  var btnPriceDistributionCurve = $(
    `<button id="mls_helper_price_curve">Curve</button>`
  );
  var keyword = $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  );
  var divContainer = $("div.f-cs-link")[0]; // 保存新增功能键的容器元素
  /// 增加附加功能键
  $(divContainer).append(btnSaveCriteria); // 保存搜索条件
  $(divContainer).append(btnFirstCriteria); // 获取第一个价格区间
  $(divContainer).append(btnPrevCriteria); // 获取前一个价格区间
  $(divContainer).append(btnNextCriteria); // 获取后一个价格区间
  $(divContainer).append(btnPriceDistributionCurve); // 获取价格分布数列

  var publicRemarkKeywords = $("ul.f_551")
    .children("li")
    .children(0)
    .children("span");
  var i = 0;
  var powerSearchString = "";
  for (i = 0; i < publicRemarkKeywords.length; i++) {
    powerSearchString =
      powerSearchString +
      (i == 0 ? "" : ",") +
      publicRemarkKeywords[i].textContent;
  }
  // keyword.val(powerSearchString);
  $("#mls_helper_save_criteria").click((e) => {
    /// 设定调试模式
    $fx.setDebugMode(
      "debug_save_criteria",
      "ListingSearchCriteria.SaveCriteria"
    );
    console.currentPage.log("save criteria button clicked");
    let criteriaTable = $("table.f-cs-items")[0];
    let criteriaRows = criteriaTable.querySelectorAll("tr");
    let criteriaRules = [];
    let criteriaRule = {};
    // Loop criteria rules, save to array criteriaRules
    criteriaRows.forEach((row) => {
      let criteriaCells = row.querySelectorAll("td");
      criteriaRule.item = criteriaCells[0].innerText;
      criteriaRule.value = criteriaCells[1].innerText;
      criteriaRules.push({
        ...criteriaRule,
      });
      criteriaRule = {};
    });

    let elementCMAID = $("#SubjectProperty option:selected", top.document);
    let cmaID = elementCMAID.text();
    let cmaIDStartPosition = cmaID.indexOf("<") + 1;
    let cmaIDEndPosition = cmaID.indexOf(">");
    let cmaIDNumber = parseInt(
      cmaID.substring(cmaIDStartPosition, cmaIDEndPosition)
    );

    if (!cmaIDNumber) {
      alert("Select a CMA Number!");
      return;
    }

    let ajax_url = "";

    ajax_url = $fx.getPIDAjaxUrl() + "dbAddCMACriteria.php";

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        criteria_rules: JSON.stringify(criteriaRules),
        cma_id: cmaIDNumber,
      },
      success: function (res) {
        console.currentPage.log("res::", JSON.stringify(res));
      },
    });
  });

  $("#mls_helper_first_criteria").on("click", async (e) => {
    /// 功能说明

    /// 设定调试模式
    $fx.setDebugMode(
      "debug_first_criteria",
      "ListingSearchCriteria.FirstCriteria"
    );

    console.currentPage.log(e);
    console.currentPage.log("first clicked");
    // let highPrice = $("#f_5_High__1-2-3-4-5");
    // let lowPrice = $("#f_5_Low__1-2-3-4-5");
    // let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");

    // f_5_Low__1
    // f_5_Low_1__1
    // f_5_High__1
    // f_5_High_1__1

    // let highPrice = $("#f_5_High__1");
    // let lowPrice = $("#f_5_Low__1");
    // let lowPrice2 = $("#f_5_Low_1__1");

    let highPriceInitial = 600;
    let points = [];

    lowPrice2.val(1);
    let iCount = 0,
      iCountTotal = 0;
    let iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    /* get total listing Count base on the lowPrice:
      lowPrice is set manually
      highPrice is indefinite
    */
    highPrice.val("");
    iCountTotal = await $.focusFx.searchFormCount();
    iCount = iCountTotal;
    if (iCountTotal <= 1500) {
      lastCount = true;
      curve.priceRange.push(999999);
      curve.listingCount.push(iCount);
      curve.testControlCount.push(iTestControl);
    } else {
      console.group();
      iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      highPriceInitial =
        parseInt(lowPrice.val() || 0) + 500 * (highPriceInitial / 500);
      while (iCountTotal > 1500 && (iCount < 1000 || iCount > 1500)) {
        highPriceInitial = Math.floor(highPriceInitial / 10) * 10;
        highPrice.val(highPriceInitial);
        iCount = await $.focusFx.searchFormCount();
        iCount = parseInt(iCount);
        points.push({
          x: highPriceInitial,
          y: iCount,
        });
        console.currentPage.log(
          `LowPrice: ${lowPrice.val()} - HighPrice: ${highPriceInitial}`,
          " | Count: ",
          iCount
        );
        switch (true) {
          case iCount < 200:
            iTestControl[0]++;
            highPriceInitial *= 1.33;
            break;
          case iCount < 500:
            iTestControl[1]++;
            highPriceInitial *= 1.33;
            break;
          case iCount < 800:
            iTestControl[1]++;
            highPriceInitial *= 1.33;
            break;
          case iCount < 1000:
            iTestControl[2]++;
            highPriceInitial *= 1.33;
            break;
          case iCount > 8000:
            iTestControl[4]++;
            highPriceInitial *= 0.85;
            break;
          case iCount > 4000:
            iTestControl[5]++;
            highPriceInitial *= 0.85;
            break;
          case iCount > 3000:
            iTestControl[6]++;
            highPriceInitial *= 0.85;
            break;
          case iCount > 2000:
            iTestControl[7]++;
            highPriceInitial *= 0.85;
            break;
          case iCount > 1500:
            iTestControl[8]++;
            highPriceInitial *= 0.85;
            break;
          default:
            curve.priceRange.push(highPriceInitial);
            curve.listingCount.push(iCount);
            curve.testControlCount.push(iTestControl);
        }
      }
      console.groupEnd();
    }

    $(".CountBtn").removeAttr("disable");
    $(".SearchBtn").removeAttr("disable");
    console.currentPage.log(inputCountResult.val());
    console.currentPage.log(iCount);

    nextLowPrice = highPrice.val();
    priceRange = parseInt(highPrice.val() || 0);
    listingCount = iCount;

    console.currentPage.log(curve);
  }); //mls_helper_first_criteria

  $("#mls_helper_price_curve").on("click", async (e) => {
    /// 设定调试模式
    $fx.setDebugMode(
      "debug_curve_criteria",
      "ListingSearchCriteria.CurveCriteria"
    );

    console.currentPage.log("curve clicked");
    // let highPrice = $("#f_5_High__1-2-3-4-5");
    // let lowPrice = $("#f_5_Low__1-2-3-4-5");
    // let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    let highPriceInitial = 600;
    let lastCount = false;
    let iCount = 0,
      iCountTotal = 0;
    let iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    console.group();

    lowPrice.val("");
    highPrice.val("");
    nextLowPrice = 0;

    do {
      /* get total listing Count base on the lowPrice:
        lowPrice is set manually
        highPrice is indefinite
      */
      highPrice.val("");
      lowPrice.val(nextLowPrice);
      iCountTotal = parseInt(await $.focusFx.searchFormCount());
      iCount = iCountTotal;
      if (iCountTotal <= 1500) {
        lastCount = true;
        $(".CountBtn").removeAttr("disable");
        $(".SearchBtn").removeAttr("disable");
        console.currentPage.log(inputCountResult.val());
        console.currentPage.log(iCount);

        priceRange = 99999;
        listingCount = iCount;
        curve.priceRange.push(priceRange);
        curve.listingCount.push(listingCount);
        console.currentPage.log(curve);
        break;
      } else {
        console.group();
        iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        highPriceInitial =
          parseInt(lowPrice.val() || 0) + 500 * (highPriceInitial / 500);
        lowPrice2.val("001");
        while (iCountTotal > 1500 && (iCount < 1000 || iCount > 1500)) {
          highPriceInitial = Math.floor(highPriceInitial / 10) * 10;
          highPrice.val(highPriceInitial);
          iCount = await $.focusFx.searchFormCount();
          iCount = parseInt(iCount);
          console.currentPage.log(
            `LowPrice: ${lowPrice.val()} - HighPrice: ${highPriceInitial}`,
            " | Count: ",
            iCount
          );
          nextLowPrice = highPrice.val();
          switch (true) {
            case iCount < 200:
              iTestControl[0]++;
              highPriceInitial *= 1.33;
              break;
            case iCount < 500:
              iTestControl[1]++;
              highPriceInitial *= 1.33;
              break;
            case iCount < 800:
              iTestControl[1]++;
              highPriceInitial *= 1.33;
              break;
            case iCount < 1000:
              iTestControl[2]++;
              highPriceInitial *= 1.33;
              break;
            case iCount > 8000:
              iTestControl[4]++;
              highPriceInitial *= 0.85;
              break;
            case iCount > 4000:
              iTestControl[5]++;
              highPriceInitial *= 0.85;
              break;
            case iCount > 3000:
              iTestControl[6]++;
              highPriceInitial *= 0.85;
              break;
            case iCount > 2000:
              iTestControl[7]++;
              highPriceInitial *= 0.85;
              break;
            case iCount > 1500:
              iTestControl[8]++;
              highPriceInitial *= 0.85;
              break;
            default:
              $(".CountBtn").removeAttr("disable");
              $(".SearchBtn").removeAttr("disable");
              console.currentPage.log(inputCountResult.val());
              console.currentPage.log(iCount);

              priceRange = parseInt(highPrice.val() || 0);
              listingCount = iCount;
              curve.priceRange.push(priceRange);
              curve.listingCount.push(listingCount);
              curve.testControlCount.push(iTestControl);
              break;
          }
        }
        console.groupEnd();
      }
    } while (!lastCount);
  });

  $("#mls_helper_next_criteria").on("click", async (e) => {
    console.currentPage.log(e);
    console.currentPage.log("next clicked");
    // let highPrice = $("#f_5_High__1-2-3-4-5");
    // let lowPrice = $("#f_5_Low__1-2-3-4-5");
    // let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    let iCount = 0;

    if (priceRangePointer === curve.priceRange.length - 1) {
      priceRangePointer = 0;
    }

    let lowPriceRange = curve.priceRange[priceRangePointer++];
    let highPriceRange = curve.priceRange[priceRangePointer];

    lowPrice.val(lowPriceRange);
    lowPrice2.val("001");
    highPrice.val(highPriceRange);
    iCount = await $.focusFx.searchFormCount();
    iCount = parseInt(iCount);
  }); //id: mls_helper_next_criteria

  $("#mls_helper_price_distribution").on("click", async (e) => {
    /// 功能说明: 生成价格分布数据
    /// 设定调试模式
    $fx.setDebugMode(
      "debug_curve_equal_price_interval_criteria",
      "ListingSearchCriteria.CurveEqualPriceInterval"
    );

    console.currentPage.log("Price Distribution Clicked");

    let lowPriceInitial = "";
    let highPricePoint = "";
    let lastCount = false,
      lastLoop = false;
    let iCurrentCount = 0;
    let iCount = 0,
      iCountTotal = 0,
      iCountDiff = 0,
      iCountDiffPerc = 0;
    let panelNo, rowNo, pricePoint, countTotal, maxCount;
    let divPriceAndCount;
    let lastPanel;

    /// 获取当前参数设定值
    let { priceInterval, lastCountRemainder, lastCountPercRemainder } =
      getParameters(); // 读取价格间隔和统计余数

    /// 设定新的价格分布数据显示板
    dsn = document.getElementsByClassName("ui-extra-display").length; // 当前面板数量
    lastPanel = document.getElementsByClassName("ui-extra-display")[dsn - 1]; // 最后添加的面板
    panelNo = parseInt($(lastPanel).attr("panelNo")); // 获取面板号码

    if (panelNo === 1) {
      /// 如果只有一个显示板, 而且未使用, 使用该显示板
      elemCheckPriceResult = $($(`#priceResultCheckBox_${panelNo}`)[0]);
      divPriceAndCount = $(`#ui-price-and-listingcount_${panelNo}`); // 获取价格分布容器
      if (elemCheckPriceResult.is(":not(:checked)")) {
        /// 清除里面的价格分布数据框
        divPriceAndCount.children().remove(); // 清除价格框
        elemCheckPriceResult.prop("checked", false); // 复位标记
        panelNo = 1;
      } else {
        /// 如果1号显示板已经被使用, 则增加新的显示板
        panelNo = 2;
        addPriceDistPanel(panelNo);
      }
    } else {
      /// 如果有多个显示板, 则增加新的显示板
      panelNo++;
      addPriceDistPanel(panelNo);
    }

    /// 获取总共的挂牌数量
    lowPrice2.val("000");
    lowPrice.val("");
    highPrice.val("");
    iCountTotal = parseInt(await $.focusFx.searchFormCount());
    countTotal = iCountTotal;
    /// 显示总的挂牌数量
    addSummaryPanel(panelNo, countTotal, 0);

    lowPriceInitial = 0;
    highPricePoint = lowPriceInitial + priceInterval;
    lastCount = false;
    highPrice.val(highPricePoint);
    lowPrice.val(lowPriceInitial);
    lowPrice2.val(1); // 低端价格的后半部分, 设定为1

    nextLowPrice = lowPriceInitial;

    curve.priceRange.length = 0;
    curve.listingCount.length = 0;
    rowNo = 0;
    /// 开始循环查询分布数据
    do {
      $(".CountBtn").removeAttr("disable");
      $(".SearchBtn").removeAttr("disable");
      /// 设定查询价格区间
      highPrice.val(highPricePoint);
      lowPrice.val(nextLowPrice);
      lowPrice2.val("001");
      /// 发出查询请求, 获取查询结果
      iCount = parseInt(await $.focusFx.searchFormCount());

      console.currentPage.log(inputCountResult.val());
      console.currentPage.log(iCount);

      pricePoint = parseInt(highPrice.val() || 0);
      listingCount = iCount;
      curve.priceRange.push(nextLowPrice);
      curve.listingCount.push(listingCount);
      // 测试已经测试到的总共的挂牌数量
      iCurrentCount = curve.listingCount.reduce(
        (partialSum, count) => partialSum + count
      );
      iCountDiff = iCountTotal - iCurrentCount;
      if (iCountDiff === 0) lastLoop = true; // 全部查询完毕, 退出循环
      iCountDiffPerc = (iCountDiff / iCountTotal) * 100;
      if (iCountDiffPerc < lastCountPercRemainder) lastCount = true; // 剩下30个未查询的挂牌, 标记查询完毕
      /// 显示查询结果
      addPriceDistRow(
        panelNo,
        rowNo,
        nextLowPrice,
        priceInterval,
        lastLoop,
        listingCount,
        iCountDiffPerc
      );

      // 如果没有记录, 退出循环, 上端价格区间大于3千万, 退出循环
      if (iCount === 0 && highPricePoint > 30000) break;

      // 准备下一次循环
      if (lastCount) {
        /// 最后一次循环
        nextLowPrice = highPricePoint;
        highPricePoint = "";
        lastCount = false; /// 暂时不要退出循环
      } else {
        nextLowPrice = highPricePoint;
        highPricePoint += priceInterval;
      }
      rowNo++;
    } while (!lastLoop);
    console.currentPage.log(curve);

    /// 增加显示统计行
    maxCount = Math.max(...curve.listingCount);
    addSummaryPanel(panelNo, countTotal, maxCount);
  });

  function addParameterPanel() {
    /// 增加参数面板
    let containerToBeAppended = $("#MainContent");
    let containerDistParameterPanels = $(
      `<div class="container-parameter-panels" id="container_parameter_panels" title ="Distribution Parameters"></div>`
    );
    containerDistParameterPanels.appendTo(containerToBeAppended);

    containerToBeAppended = $("#container_parameter_panels"); // 主内容框
    let containerParameter;
    /// 在DOM添加N个参数面板
    containerParameter = $(`
        <div class="ui-parameter-display" id="ui-param-display" style="display:flex; align-items: center">
          <div style="margin:5px">
            <span><strong>Params | </strong></span>
          </div>
          <div id="ui-param-main-display" style="display:flex">
            <div style="margin:5px; display:flex">
              <label for="priceInterval">Price Interval</label>
              <div id="ui-param-price-interval-display" style="display:flex; justify-content:flex-start">
                <input type="radio" class="" id="priceInterval1" name="priceInterval" value="100">
                <lable for="priceInterval1">100K</lable>
                <input type="radio" class="" id="priceInterval2" name="priceInterval" value="200" checked='checked'>
                <lable for="priceInterval2">200K</lable>
                <input type="radio" class="" id="priceInterval3" name="priceInterval" value="300">
                <lable for="priceInterval3">300K</lable>
              </div>
              <div class="vertical-line"></div>
            </div>

            <div style="margin:5px; display:flex">
              <label for="lastCount">Last Count</label>
              <div id="ui-param-last-count-display" style="display:flex; justify-content:flex-start">
                <input type="radio" class="" id="lastCount1" name="lastCount" value="10">
                <lable for="lastCount1">10</lable>
                <input type="radio" class="" id="lastCount2" name="lastCount" value="20">
                <lable for="lastCount2">20</lable>
                <input type="radio" class="" id="lastCount3" name="lastCount" value="30">
                <lable for="lastCount3">30</lable>
                <input type="radio" class="" id="lastCount4" name="lastCount" value="40">
                <lable for="lastCount4">40</lable>
                <input type="radio" class="" id="lastCount5" name="lastCount" value="50" checked='checked'>
                <lable for="lastCount5">50</lable>
              </div>
              <div class="vertical-line"></div>
            </div>

            <div style="margin:5px; display:flex">
              <label for="lastCountPerc">Last Count %</label>
              <div id="ui-param-last-count-percenrage-display" style="display:flex; justify-content:flex-start">
                <input type="radio" class="" id="lastCountPerc1" name="lastCountPerc" value="5">
                <lable for="lastCountPerc1">5%</lable>
                <input type="radio" class="" id="lastCountPerc2" name="lastCountPerc" value="10" checked='checked'>
                <lable for="lastCountPerc2">10%</lable>
                <input type="radio" class="" id="lastCountPerc3" name="lastCountPerc" value="15">
                <lable for="lastCountPerc3">15%</lable>
                <input type="radio" class="" id="lastCountPerc4" name="lastCountPerc" value="20">
                <lable for="lastCountPerc4">20%</lable>
                <input type="radio" class="" id="lastCountPerc5" name="lastCountPerc" value="25" >
                <lable for="lastCountPerc5">25%</lable>
              </div>
            </div>

          </div>
        </div>
        `);
    containerParameter.appendTo(containerToBeAppended);
  }

  function getParameters() {
    /// 功能说明: 读取参数
    /// 读取价格间隔
    let pricePanel = $("#ui-param-price-interval-display");
    let currentPriceInterval = pricePanel
      .children("input[name='priceInterval']:checked")
      .val();

    /// 读取余数设定
    let lastCountPanel = $("#ui-param-last-count-display");
    let currentLastCount = lastCountPanel
      .children("input[name='lastCount']:checked")
      .val();

    /// 读取余数百分比设定
    let lastCountPercPanle = $("#ui-param-last-count-percenrage-display");
    let currentLastCountPerc = lastCountPercPanle
      .children("input[name='lastCountPerc']:checked")
      .val();

    let resInfo = {
      priceInterval: parseInt(currentPriceInterval),
      lastCountRemainder: parseInt(currentLastCount),
      lastCountPercRemainder: parseInt(currentLastCountPerc),
    };
    return resInfo;
  }

  function initPriceDistPanel(dsn) {
    /// 功能说明: 增加一个价格分布显示框
    ///
    /// 在DOM中添加面板容器
    let containerToBeAppended = $("#MainContent");
    let containerPriceDistPanels = $(
      `<div class="container-price-dist-panels" id="container_price_dist_panels" title ="Price Distributions"></div>`
    );
    containerPriceDistPanels.appendTo(containerToBeAppended);
    containerToBeAppended = $("#container_price_dist_panels"); // 主内容框

    let containerDisplay = $(`
    <div class="ui-extra-display" id="ui-extra-display_${dsn}" panelNo="${dsn}">
      <span><strong>Price Distribution Panel ${dsn}</strong></span>
      <span>
        <label>Done</label>
        <input type="checkbox" name="checkbox1${dsn}" id="priceResultCheckBox_${dsn}" style="width: 14px!important" />
      </span>
      <button id="btnClose${dsn}" style="width: 20px!important" title="Close the Panel">X</button>
      <input class="price-point" style="width:30px!importang" title="AREA">
      <hr>
      <div id="ui-price-and-listingcount_${dsn}">
      </div>
      <hr>
      <div id="ui-price-and-listing-summary_${dsn}">
        <label>Total Count</label>
        <input class="summary-point" id="totallistingcount_${dsn}">
        <label>Max/Total Ratio</label>
        <input class="summary-point" id="maxtototalratio_${dsn}">
        <label>Progress</label>
        <input class="summary-point" id="progressDistribution_${dsn}">
      </div>
    </div>
  `);
    /// 在DOM添加显示板
    containerDisplay.appendTo(containerToBeAppended);
    /// 添加关闭按键事件句柄
    $(`#btnClose${dsn}`).on("click", function (e) {
      console.currentPage.log("close clicked");
      containerDisplay.remove();
    });
  }

  function addPriceDistPanel(dsn) {
    /// 增加一个价格分布显示框
    let containerToBeAppended = $("#container_price_dist_panels"); // 主内容框
    let containerDisplay = $(`
    <div class="ui-extra-display" id="ui-extra-display_${dsn}" panelNo="${dsn}">
      <span><strong>Price Distribution Panel ${dsn}</strong></span>
      <span>
        <label>Done</label>
        <input type="checkbox" name="checkbox1${dsn}" id="priceResultCheckBox_${dsn}" style="width: 14px!important" />
      </span>
      <button id="btnClose${dsn}" style="width: 14px!important" title="Close the Panel">X</button>
      <input class="price-point" style="width:30px!importang" title="AREA">
      <hr>
      <div id="ui-price-and-listingcount_${dsn}">
      </div>
      <hr>
      <div id="ui-price-and-listing-summary_${dsn}">
        <label>Total Count</label>
        <input class="summary-point" id="totallistingcount_${dsn}">
        <label>Max/Total Ratio</label>
        <input class="summary-point" id="maxtototalratio_${dsn}">
        <label>Progress</label>
        <input class="summary-point" id="progressDistribution_${dsn}">
      </div>
    </div>
  `);
    /// 在DOM添加显示板
    containerDisplay.appendTo(containerToBeAppended);
    /// 添加关闭按键事件句柄
    $(`#btnClose${dsn}`).on("click", function (e) {
      console.currentPage.log("close clicked");
      containerDisplay.remove();
    });
  }

  function initPriceDistributionRows(rowQuan, panelNo, rowNo) {
    /// 增加N个数量的价格分布框
    ///
    let divPriceAndCount = $(`#ui-price-and-listingcount_${panelNo}`); // 获取价格分布容器
    /// 在DOM添加三个空的价格分布行
    for (i = 1; i <= rowQuan; i++) {
      rowNo = i;
      let newPriceAndResult = $(`
      <div id="ui-display-curve_${panelNo}_${rowNo}">
        <button id="pricePoint${panelNo}_${rowNo}">$ Range</button>
        <input class="price-point" id="pricePoint_${panelNo}_${rowNo}" name="pricePoint${panelNo}_${rowNo}">
        <button idr="countResult${panelNo}_${rowNo}">Count </button>
        <input class="price-point" id="countResult_${panelNo}_${rowNo}" name="countResult${panelNo}_${rowNo} panelNo="${panelNo}" rowNO="${rowNo}">
      </div>
    `);

      divPriceAndCount.append(newPriceAndResult);
      $(`#pricePoint${panelNo}_${rowNo}`).on("click", searchPriceRange);
      $(`#countResult${panelNo}_${rowNo}`).on("click", countForPriceRange);
    }
  }

  function searchPriceRange(e) {
    console.currentPage.log("price range clicked");
  }

  function countForPriceRange(e) {
    console.currentPage.log("price range clicked", e.target);
    let btn = $(e.target)[0];
    /// 获取价格区间
    let lowPricePoint = $(btn).attr("lowPrice");
    let highPricePoint = $(btn).attr("highPrice");
    console.currentPage.log(
      `low price ${lowPricePoint} | high price ${highPricePoint}`
    );
    /// 填写价格区间
    lowPrice.val(lowPricePoint);
    highPrice.val(highPricePoint);
    /// 开始搜索
    $.focusFx.searchFormCount();
  }

  function addPriceDistRow(
    panelNo,
    rowNo,
    pricePoint,
    priceInterval,
    lastLoop,
    listingCount,
    progress
  ) {
    /// 功能说明: 增加一对{价格区间 - 区间内的统计挂牌数}显示行
    ///
    let progressInput = $(`#progressDistribution_${panelNo}`)[0];
    $(progressInput).val(`${progress}%`);
    let divPriceAndCountPanel = $(`#ui-price-and-listingcount_${panelNo}`); // 获取价格分布容器
    let secondPricePoint;
    if (lastLoop) {
      secondPricePoint = "";
    } else {
      secondPricePoint = pricePoint + priceInterval;
    }
    let newPriceAndCountRow = $(`
    <div id="ui-display-curve_${panelNo}_${rowNo}">
      <button id="pricePoint${panelNo}_${rowNo}">$ Range</button>
      <input class="price-point" id="pricePoint_${panelNo}_${rowNo}" name="pricePoint${panelNo}_${rowNo}" value="${pricePoint} - ${secondPricePoint}">
      <button id="countResult${panelNo}_${rowNo}" panelNo="${panelNo}" rowNO="${rowNo}" lowPrice="${pricePoint}" highPrice="${secondPricePoint}">Count </button>
      <input class="price-point" id="countResult_${panelNo}_${rowNo}" name="countResult${panelNo}_${rowNo}" value="${listingCount}" >
    </div>
  `);
    newPriceAndCountRow.appendTo(divPriceAndCountPanel);
    $(`#pricePoint${panelNo}_${rowNo}`).on("click", searchPriceRange);
    $(`#countResult${panelNo}_${rowNo}`).on("click", countForPriceRange);
  }

  function addSummaryPanel(panelNo, countTotal, maxCount) {
    /// 功能说明: 添加统计行, 总的数量, 最大数量的价格区间的比例
    ///
    let elemTotalListingCount = $(`#totallistingcount_${panelNo}`);
    let elemMaxToTotalRatio = $(`#maxtototalratio_${panelNo}`);
    let elemCheckPriceResult = $($(`#priceResultCheckBox_${panelNo}`)[0]);

    elemTotalListingCount.val(countTotal);
    elemCheckPriceResult.prop("checked", true);
    elemMaxToTotalRatio.val((maxCount / countTotal).toFixed(2));
  }

  // Select the node that will be observed for mutations
  // const targetNode = document.getElementById('CountResult');
  const targetNode = document.querySelector(".CountResultText");

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
  };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        console.currentPage.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.currentPage.log(
          "The " + mutation.attributeName + " attribute was modified."
        );
        console.currentPage.log("The oldValue is " + mutation.oldValue);
        console.currentPage.log($("#CountResult").val());
        let iCount = parseInt($("#CountResult").val());
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  // observer.disconnect();

  // inputCountResult.val('Counting...');

  // Click Search Button, jump to search results
  // btnSearch.click();
}
