/** //add 模块说明 | 针对的网页元素 TOP MENU BAR
 * 定义顶层菜单按键功能和选项
 * | //ADD 针对的网页元素是 TOP MENU BAR
 * define the paragon mls Main Menu Class
 * store the frequently used menu function links in the class
 */

(async function () {
  /// 设定调试输出模式
  let debugSettingInfo = await chrome.runtime.promise.sendMessage({
    debugID: "debug_main_menu",
    from: "MainMenu.js",
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
  };

  console.currentPage.logDebug("Debug", "MainMenu.js");
})();

class MainMenu {
  constructor() {
    this.appBanner = $("#app_banner");
    this.appLeftBanner = $("#app_banner_links_left");
    this.appRightBanner = $("#app_banner_links_right");
    this.appMidBanner = $('<div id = "app_banner_mid"></div>');
    this.appMainMenu = $("#app_banner_menu");

    //Add Subject Loading form
    this.formLoadSubject = $(
      `<form class="languagebox" name='pid_load_subjects' style="display:block" title="Main Menu Functions Panel"></form>`
    );

    //Add Subject Load Button
    this.btnSubjectProperty = $(`<div class="languagebox"> 
                  <input type = "button" id="SubjectPropertySubmit" value="LoadSubj" title="Load Subjects">
                  </div>`);
    this.formLoadSubject.append(this.btnSubjectProperty);

    //Add Subject Set Button
    this.btnSetSubjectProperty = $(`<div class="languagebox"> 
                  <input type = "button" id="SetSubjectProperty" value="SetSubj" title="Set Subject">
                  </div>`);
    this.formLoadSubject.append(this.btnSetSubjectProperty);

    //Add remote/local radio
    this.radioSubjectLoadingLink = $(`<div class = "languagebox">
        <span class="mls-vertial-divider">|</span>
        <input type="radio" class = "pid_subject_property_options" id='pid_local' name="LoadSubjects" value="local" />
        <label for='pid_local'>Local&nbsp</label>
        <input type="radio" class = "pid_subject_property_options" id='pid_synology' name="LoadSubjects" value="synology" checked='checked' />
        <label for='pid_synology'>Synology&nbsp</label>
        <input type="radio" class = "pid_subject_property_options" id='pid_remote' name="LoadSubjects" value="remote" />
        <label for='pid_remote'>Remote&nbsp</label>
      </div>`);
    this.formLoadSubject.append(this.radioSubjectLoadingLink);

    //Add Subject Select Box
    this.selectSubjectProperty = $(`<div class="languagebox">
                                <select id="SubjectProperty" name="SubjectProperty" >
                                <option value = "205">205<option>
                                <option value = "805">805<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectSubjectProperty);
    this.txtSubjectAddress = document.getElementById("SubjectProperty");

    //Add update current subject checkbox
    this.chkUpdateSubject = $(`<div class="languagebox">
                                <div id="checkUpdateSubjectInfoWrapper">
                                    <label>Update Sub</label>
                                    <input id="checkUpdateSubjectInfo" name="buttonUpdate" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`);
    this.formLoadSubject.append(this.chkUpdateSubject);

    //Add CMA/VPR options
    this.selectCMAType = $(`<div class="languagebox">
                                <select id="SelectCMAType" name="SelectCMAType" >
                                <option value = "CMA">CMA<option>
                                <option value = "VPR">VPR<option>
                                <option value = "CMA4Exl">CMA4Exl<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectCMAType);

    //Add Client Select Box
    this.selectClients = $(`<div class="languagebox">
                                <select id="RealtyClients" name="RealtyClients" title="Select Clients">
                                <option value = "client1">client1<option>
                                <option value = "client2">client2<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectClients);

    //Add Client Showing / Tour Box
    this.selectShowingLists = $(`<div class="languagebox">
                                <select id="RealtyClientShowingLists" name="RealtyClientShowingLists" title="Client Showing/CMA Listings">
                                <option value = "list1">list1<option>
                                <option value = "list2">list2<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectShowingLists);

    //Add Load Debug Settings Button
    this.btnLoadDebugSettings = $(`<div class="languagebox"> 
                  <input type = "button" id="LoadDebugSettings" value="<D>" title="Load Debug Settings">
                  </div>`);
    this.formLoadSubject.append(this.btnLoadDebugSettings);

    //Add Debug Settings Selector
    this.selectDebugSettings = $(`<div class="languagebox">
                                <select id="DebugSettings" name="DebugSettings" >
                                <option value = "1">HomePage<option>
                                <option value = "1">MainMenu<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectDebugSettings);

    //insert form to the banner
    this.formLoadSubject.insertAfter(this.appLeftBanner);
    this.subjectPropertyOptions = document.getElementsByClassName(
      "pid_subject_property_options"
    );

    //Add 必须读取DOM元素, 才能触发click事件
    this.btnLoadSubject = document.getElementById("SubjectPropertySubmit");
    this.btnSetSubjectProperty = document.getElementById("SetSubjectProperty");
    this.btnLoadDebugSettings = document.getElementById("LoadDebugSettings");

    //Add Checkbox lock the map size
    (this.chkShowSmallMap = $(`<div class="languagebox">
                                <div id="checkShowSmallMapWrapper">
                                <span class="mls-vertial-divider">|</span>
                                <label>Lock Map Size</label>
                                    <input id="checkShowSmallMap" name="buttonShowPic" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`)),
      this.chkShowSmallMap.insertAfter(this.appLeftBanner);

    //Add checkBox lock the map type
    (this.chkLockRoadMapType = $(`<div class="languagebox">
                                <div id="checkLockMapTypeWrapper">
                                    <label>Lock Road Map Type</label>
                                    <input id="checkLockRoadMap" name="buttonShowMaptype" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`)),
      this.chkLockRoadMapType.insertAfter(this.appLeftBanner);

    (this.txtResponse = $(`<div class="languagebox">
                                <div id="textResponse">
                                    <label>res</label>
                                    <input id="inputListingInfo" type="text" name="textbox" style="width: 150px!important" />
                                </div>
                            </div>`)),
      this.txtResponse.insertAfter(this.appLeftBanner);

    (this.chkLanguage = $(`<div class="languagebox">
                                <div id="reportlanguage">
                                <span class="mls-vertial-divider">|</span>
                                <label>cn</label>
                                    <input type="checkbox" name="checkbox" style="width: 14px!important" />
                                </div>
                            </div>`)),
      this.chkLanguage.insertAfter(this.appLeftBanner);
    (this.chkStopSearch = $(`<div class="languagebox">
                                <div id="stopsearch">
                                    <label>stopsearch</label>
                                    <input id="inputstopsearch" type="checkbox" name="checkbox" style="width: 14px!important" />
                                </div>
                            </div>`)),
      this.chkStopSearch.insertAfter(this.appLeftBanner);
    this.taxSearch = $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]');
    this.savedSearches = $(
      'a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]'
    );
    this.listingCarts = $(
      'a[url="/ParagonLS/Search/Property.mvc/ListingCarts/0?searchType=4"]'
    );

    /// 加载调试参数
    this.LoadDebugSettings();

    /// 添加事件句柄
    this.events();
  }

  /// 添加事件句柄
  events() {
    //todo::
    this.btnLoadSubject.addEventListener("click", () =>
      this.loadSubjectProperties()
    );
    this.btnSetSubjectProperty.addEventListener("click", () => {
      console.currentPage.log("click set subject button");
    });
    this.btnLoadDebugSettings.addEventListener("click", () => {
      console.log("load debug settings");
      this.LoadDebugSettings();
    });
    var rad = this.subjectPropertyOptions;
    for (var i = 0; i < rad.length; i++) {
      rad[i].addEventListener("change", (e) => {
        $('input[name="textbox"]').val("remote change OK!");
      });
    }
  }

  /// 方法

  showLargeMap() {
    console.currentPage.log("large map clicked");
    var x = $("iframe");
    console.currentPage.log(x);
    var y = x.contents();
    var z = y.find("#divMap");

    console.currentPage.log(z);
  }

  openTaxSearch() {
    this.taxSearch[0].click();
  }

  openSavedSearches() {
    this.savedSearches[0].click();
  }

  openListingCarts() {
    this.listingCarts[0].click();
  }

  loadSubjectProperties() {
    /// 功能说明: 加载Subject物业列表
    var address = "TEST";
    var id = "1234";
    var urlOption = document.getElementById("pid_local").checked;
    var ajax_url = "";

    ajax_url = L$().getPIDAjaxUrl() + "loadSubjectData.php";

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        address: address,
        postID: id,
      },
      dataType: "json",
      success: function (res) {
        console.currentPage.log("res", res);
        var subjectProperties = res;
        var htmlSelect = document.getElementById("SubjectProperty");
        //clear old optionis in the htmlSelect
        htmlSelect.length = 0;
        let defaultOption = document.createElement("option");
        defaultOption.text = "Choose Subject Property";

        htmlSelect.add(defaultOption);
        htmlSelect.selectedIndex = 0;
        let option;
        let subjectAddress;
        let unitNo;

        /// 向选择框内装载数据
        /// 设定当前的选项为最新的记录
        for (var i = 0; i < subjectProperties.length; i++) {
          let tempUnitNo = subjectProperties[i].Unit_No;
          tempUnitNo = tempUnitNo ? tempUnitNo : "";
          tempUnitNo = tempUnitNo.replace("#", "").trim();
          unitNo = tempUnitNo == "" ? "" : "#" + tempUnitNo + " ";

          subjectAddress =
            "<" +
            subjectProperties[i].ID +
            ">" +
            unitNo +
            subjectProperties[i].Subject_Address.trim();
          option = document.createElement("option");
          option.text = subjectAddress;
          option.value = subjectAddress;
          option.setAttribute("cmaID", subjectProperties[i].ID);
          option.setAttribute(
            "address",
            subjectProperties[i].Subject_Address.trim()
          );
          option.setAttribute("unitno", unitNo.trim());
          option.setAttribute("city", subjectProperties[i].City.trim());
          option.setAttribute(
            "district",
            subjectProperties[i].Neighborhood.trim()
          );
          htmlSelect.add(option);
        }

        /// 设定当前的记录
        document
          .getElementById("SubjectProperty")
          .getElementsByTagName("option")[1].selected = "selected";
      },
    });
  }

  async LoadDebugSettings() {
    /// 功能说明: 从CouchDB中读取debug设定参数
    /// 加载到选择框里面

    let debugOptions = {
      from: "MainMenu",
      todo: "loadDebugSettings",
    };

    let debugInfos = await chrome.runtime.promise.sendMessage(debugOptions);
    let debugSettings = debugInfos.data;

    console.log(debugSettings);

    let htmlSelect = document.getElementById("DebugSettings");
    htmlSelect.length = 0; // 清除旧的元素
    let defaultOption = document.createElement("option");
    defaultOption.text = "All Debug Settings";

    htmlSelect.add(defaultOption);
    htmlSelect.selectedIndex = 0;
    let option;

    debugSettings.map((setting) => {
      option = document.createElement("option");
      option.text = `<${setting.value}>${setting._id}`;
      option.value = setting.value;
      htmlSelect.add(option);
    });
  }
}
