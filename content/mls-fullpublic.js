//custom full public report

import legalDescription from "../assets/scripts/modules/LegalDescription";
import addressInfo from "../assets/scripts/modules/AddressInfo";

//console.log("full public script activated now: ");
var $fx = L$();

var fullpublic = {
  init: function () {
    console.log("full public script loaded!");
    console.log(this.lp, this.sp);
    this.events();
    this.getMorePropertyInfo();
    this.bcAssess.addClass(this.lp.attr("class"));
    var thisYear = new Date().getFullYear().toString().substr(-2);
    var divBC = $(
      '<div style="top:111px;left:703px;width:53px;height:14px;text-align: left;">(BCA\'' +
        thisYear +
        ")</div>"
    );
    var banner = $(
      '<div id="peterqu" style="z-index: 999; height:88px; position:absolute; top: 2px; padding-right:0px; padding-left:0px; padding-top:0px; padding-bottom:0px; left:0px; width: 766px"></div>'
    );
    divBC.addClass(this.lpSuffix.attr("class"));
    divBC.insertAfter(this.bcAssess);
    this.bcAssess
      .animate({ left: "575px", width: "127px" })
      .css("text-align", "left");
    this.addBanner(banner);
    if (this.language.is(":checked")) {
      this.translate();
    }
    this.calculateSFPrice();
    this.addComplexInfo();
    this.searchTax();
  },

  calculateSFPrice: function () {
    console.log(this.lp.text(), this.sp.text(), this.finishedFloorArea.text());
    var listPrice = $fx.convertStringToDecimal(this.lp.text());
    var soldPrice = $fx.convertStringToDecimal(this.sp.text());
    var FinishedFloorArea = $fx.convertStringToDecimal(
      this.finishedFloorArea.text()
    );
    var sfPriceList = listPrice / FinishedFloorArea;
    var sfPriceSold = soldPrice / FinishedFloorArea;

    this.lp
      .animate({ left: "575px", width: "127px" })
      .css("text-align", "left");
    this.lp.text(this.lp.text() + " [$" + sfPriceList.toFixed(0) + "/sf]");
    if (sfPriceSold > 0) {
      this.sp
        .animate({ left: "575px", width: "127px" })
        .css("text-align", "left");
      this.sp.text(this.sp.text() + " [$" + sfPriceSold.toFixed(0) + "/sf]");
    }
  },

  getMorePropertyInfo: function () {
    var self = this;
    var listingHouseType = (self.listingHouseType = self.houseType
      .text()
      .replace(" ", ""));
    switch (listingHouseType) {
      case "ResidentialAttached":
        self.pid = $(
          'div[style="top:283px;left:637px;width:82px;height:15px;"]'
        );
        self.lotArea = $(
          'div[style="top:214px;left:376px;width:67px;height:13px;"]'
        );
        self.complex = $(
          'div[style="top:341px;left:393px;width:369px;height:13px;"]'
        );
        self.devUnits = $(
          'div[style="top:432px;left:470px;width:76px;height:14px;"]'
        );
        self.totalUnits = $(
          'div[style="top:432px;left:658px;width:103px;height:15px;"]'
        );
        break;
      case "ResidentialDetached":
        self.pid = $(
          'div[style="top:283px;left:636px;width:82px;height:15px;"]'
        );
        self.address = $(
          'div[style="top:110px;left:134px;width:483px;height:17px;"]'
        );
        self.lp = $(
          'div[style="top:129px;left:555px;width:143px;height:13px;"]'
        );
        self.sp = $(
          'div[style="top:147px;left:555px;width:143px;height:13px;"]'
        );
        self.lotArea = $(
          'div[style="top:219px;left:376px;width:79px;height:14px;"]'
        );
        self.complex = $(
          'div[style="top:335px;left:393px;width:369px;height:13px;"]'
        );
        self.devUnits = $("<div>1</div>");
        self.totalUnits = $("<div>1</div>");
        self.cnSoldDate = $(
          'div[style="top:171px;left:290px;width:57px;height:15px;"]'
        );
        self.cnMeasType = $(
          'div[style="top:187px;left:290px;width:73px;height:13px;"]'
        );
        self.cnLotArea = $(
          'div[style="top:219px;left:290px;width:88px;height:17px;"]'
        );
        self.cnDepth = $(
          'div[style="top:203px;left:290px;width:89px;height:13px;"]'
        );
        self.cnFloodPlain = $(
          'div[style="top:235px;left:290px;width:79px;height:13px;"]'
        );
        self.cnExposure = $(
          'div[style="top:251px;left:290px;width:79px;height:15px;"]'
        );
        self.cnApprovalReq = $(
          'div[style="top:267px;left:290px;width:80px;height:16px;"]'
        );
        self.cnNewGST = $(
          'div[style="top:283px;left:290px;width:110px;height:17px;"]'
        );
        self.cnView = $(
          'div[style="top:319px;left:290px;width:77px;height:13px;"]'
        );
        self.cnComplex = $(
          'div[style="top:335px;left:289px;width:93px;height:14px;"]'
        );
        self.cnServiceConnected = $(
          'div[style="top:352px;left:289px;width:100px;height:15px;"]'
        );
        self.cnFrontageFeet = $(
          'div[style="top:171px;left:459px;width:87px;height:13px;"]'
        );
        self.cnBedrooms = $(
          'div[style="top:187px;left:459px;width:91px;height:13px;"]'
        );
        self.cnBathrooms = $(
          'div[style="top:203px;left:459px;width:87px;height:15px;"]'
        );
        self.cnFullBaths = $(
          'div[style="top:219px;left:459px;width:55px;height:15px;"]'
        );
        self.cnHalfBaths = $(
          'div[style="top:235px;left:459px;width:55px;height:13px;"]'
        );
        self.cnOriginalPrice = $(
          'div[style="top:171px;left:603px;width:75px;height:14px;"]'
        );
        self.cnYearBuilt = $(
          'div[style="top:187px;left:603px;width:103px;height:13px;"]'
        );
        self.cnGrossTaxes = $(
          'div[style="top:235px;left:603px;width:68px;height:13px;"]'
        );
        self.cnRenoYear = $(
          'div[style="top:432px;left:220px;width:60px;height:12px;"]'
        );
        self.cnRIPlumbing = $(
          'div[style="top:444px;left:220px;width:65px;height:12px;"]'
        );
        self.cnRIFireplaces = $(
          'div[style="top:456px;left:220px;width:71px;height:13px;"]'
        );
        self.cnWaterSupply = $(
          'div[style="top:480px;left:3px;width:72px;height:14px;"]'
        );
        self.cnNumOfFirePlaces = $(
          'div[style="top:456px;left:3px;width:73px;height:13px;"]'
        );
        self.cnFuelHeating = $(
          'div[style="top:492px;left:3px;width:61px;height:12px;"]'
        );
        self.cnOutdoorArea = $(
          'div[style="top:504px;left:3px;width:70px;height:13px;"]'
        );
        self.cnTypeOfRoof = $(
          'div[style="top:516px;left:3px;width:64px;height:12px;"]'
        );
        self.cnTitleToLand = $(
          'div[style="top:432px;left:367px;width:63px;height:13px;"]'
        );
        self.cnPropertyDisc = $(
          'div[style="top:456px;left:367px;width:70px;height:15px;"]'
        );
        self.cnFixturesRmvd = $(
          'div[style="top:492px;left:367px;width:70px;height:15px;"]'
        );
        self.cnPADRental = $(
          'div[style="top:468px;left:367px;width:62px;height:16px;"]'
        );
        self.cnFeatures = $(
          'div[style="top:592px;left:3px;width:46px;height:12px;"]'
        );
        self.cnKitchens = $(
          'div[style="top:768px;left:210px;width:66px;height:16px;"]'
        );
        self.cnLevels = $(
          'div[style="top:780px;left:210px;width:56px;height:12px;"]'
        );
        self.cnCrawlHeight = $(
          'div[style="top:804px;left:210px;width:92px;height:15px;"]'
        );
        self.cnSuite = $(
          'div[style="top:792px;left:210px;width:60px;height:14px;"]'
        );
        self.cnBasement = $(
          'div[style="top:828px;left:210px;width:52px;height:13px;"]'
        );
        self.cnBedsInBasement = $(
          'div[style="top:816px;left:210px;width:87px;height:14px;"]'
        );
        self.cnBedNotInBasement = $(
          'div[style="top:816px;left:330px;width:102px;height:13px;"]'
        );
        self.cnDimensions = $(
          'div[style="top:616px;left:182px;width:60px;height:15px;"]'
        );
        self.cnDimensions3 = $(
          'div[style="top:616px;left:695px;width:59px;height:14px;"]'
        );
        self.cnFinishedFloor = $(
          'div[style="top:804px;left:3px;width:113px;height:16px;"]'
        );
        self.cnGrandTotalFloorArea = $(
          'div[style="top:840px;left:3px;width:113px;height:12px;"]'
        );
        break;
    }
  },

  searchTax: function () {
    var PID = this.pid.text();
    if (!PID) {
      return;
    }
    chrome.storage.local.set({ PID: PID });
    chrome.storage.local.get("PID", function (result) {
      console.log(result.PID);
      chrome.runtime.sendMessage(
        { from: "ListingReport", todo: "taxSearch" },

        function (response) {
          console.log("mls-fullpublic got response:", response);
        }
      );
    });
  },

  addComplexInfo: function () {
    var self = this;
    var legal = self.legal.text(); //get legal description from the Report
    var legalDesc = (self.legalDesc = new legalDescription(legal));
    var complexName = self.complex.text().trim();

    var subArea = self.subArea.text();
    var neighborhood = self.neighborhood.text();
    var postcode = self.postcode.text();
    var dwellingType = self.dwellingType.text();
    var address = new addressInfo(self.address.text()); //todo list...
    var strataPlan = legalDesc.strataPlan1;
    var totalUnits = self.totalUnits.text();
    var devUnits = self.devUnits.text();

    var complexInfo = {
      _id:
        strataPlan +
        "-" +
        address.streetNumber +
        "-" +
        address.streetName +
        "-" +
        address.streetType,
      name: complexName,
      strataPlan: strataPlan,
      addDate: $fx.getToday(),
      subArea: subArea,
      neighborhood: neighborhood,
      postcode: postcode,
      streetNumber: address.streetNumber,
      streetName: address.streetName + address.streetType,
      dwellingType: dwellingType,
      totalUnits: totalUnits,
      devUnits: devUnits,
      todo: "searchComplex",
    };
    if (complexName.length > 0) {
      complexInfo.todo = "saveComplex";
      chrome.runtime.send;
    }
    chrome.runtime.sendMessage(complexInfo, function (response) {
      if (response) {
        self.complex.text(response);
        self.complexSummary.text(response);
      }
    });
  },

  addBanner: function (banner) {
    var img = $(
      '<img src="http://localhost/chromex/mlshelper/app/assets/images/banner4.jpg">'
    );
    img.appendTo(banner);
    banner.appendTo($("div#divHtmlReport"));
  },

  events: function () {
    (function onEvents(self) {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (area == "local" && "from" in changes) {
          if (changes.from.newValue.indexOf("assess") > -1) {
            self.updateAssess();
          }

          if (changes.from.newValue.indexOf("complex") > -1) {
            self.updateComplexInfo();
          }
          console.log("this: ", self);
        }

        if (area == "local" && "curTabID" in changes) {
          if (changes.curTabID.newValue) {
            if (changes.curTabID.oldValue) {
              //remove the old style of the div
              var oldTabID = changes.curTabID.oldValue;
              console.log("mls-fullrealtor: my old tab ID is: ", oldTabID);

              var oldDivTab = $("div" + oldTabID, top.document);

              oldDivTab.removeAttr("style");
            }

            curTabID = changes.curTabID.newValue;
            console.log("mls-fullrealtor: my tab ID is: ", curTabID);

            var divTab = $("div" + curTabID, top.document);
            var divTab1 = $("div#tab1", top.document);
            console.log(divTab);

            divTab.attr("style", "display: block!important");
            divTab1.attr("style", "display: none!important");
          }
        }
      });
    })(this);
  },

  updateAssess: function () {
    var self = this;
    var listPrice = $fx.convertStringToDecimal(self.lp.text());
    var soldPrice = $fx.convertStringToDecimal(self.sp.text());

    chrome.storage.local.get(
      ["totalValue", "improvementValue", "landValue", "lotSize"],
      function (result) {
        var totalValue = result.totalValue;
        var improvementValue = result.improvementValue;
        var landValue = result.landValue;
        var lotArea = result.lotSize;
        console.log(
          "mls-fullpublic got total bc assessment: ",
          landValue,
          improvementValue,
          totalValue
        );
        self.bcAssess.text(totalValue);
        if (totalValue != 0) {
          if (soldPrice > 0) {
            var intTotalValue = $fx.convertStringToDecimal(totalValue);
            var changeValue = soldPrice - intTotalValue;
            var changeValuePercent = (changeValue / intTotalValue) * 100;
          } else {
            var intTotalValue = $fx.convertStringToDecimal(totalValue);
            var changeValue = listPrice - intTotalValue;
            var changeValuePercent = (changeValue / intTotalValue) * 100;
          }
        }
        self.bcAssess.text(
          $fx.removeDecimalFraction(self.bcAssess.text()) +
            " [ " +
            changeValuePercent.toFixed(0).toString() +
            "% ]   "
        );
        self.lotArea.text(
          $fx.numberWithCommas($fx.convertStringToDecimal(lotArea))
        );
      }
    );
  },

  updateComplexInfo: function () {
    var self = this;
    console.log("update Complex info:");
    chrome.storage.local.get(["complexName", "count"], function (result) {
      self.complex.text(
        result.complexName + "[ " + result.count.toString() + " ]"
      );
    });
  },

  houseType: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
  listingHouseType: null,
  lp: $('div[style="top:129px;left:555px;width:146px;height:13px;"]'),
  sp: $('div[style="top:147px;left:555px;width:146px;height:13px;"]'),
  lpSuffix: $('div[style="top:129px;left:703px;width:23px;height:14px;"]'),
  bcAssess: $('div[style="top:111px;left:578px;width:147px;height:16px;"]'),
  finishedFloorArea: $(
    'div[style="top:804px;left:120px;width:50px;height:16px;"]'
  ),
  grandTotalFloorArea: $(
    'div[style="top:840px;left:120px;width:50px;height:12px;"]'
  ),
  pid: null,
  complex: null,
  lotArea: null,
  devUnits: null,
  totalUnits: null,
  strataFee: $('div[style="top:267px;left:530px;width:67px;height:13px;"]'),
  exposure: $('div[style="top:261px;left:376px;width:68px;height:13px;"]'),
  age: $('div[style="top:203px;left:698px;width:65px;height:13px;"]'),
  year: $('div[style="top:187px;left:698px;width:39px;height:13px;"]'),
  tax: $('div[style="top:235px;left:698px;width:65px;height:13px;"]'),
  title: $('div[style="top:444px;left:440px;width:321px;height:13px;"]'),
  keyword: $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  ),
  language: $("div#reportlanguage input", top.document),

  //complex info:
  legal: $('div[style="top:532px;left:75px;width:688px;height:24px;"'),
  address: $('div[style="top:110px;left:134px;width:482px;height:17px;"]'),
  subArea: $('div[style="top:126px;left:134px;width:480px;height:13px;"]'),
  neighborhood: $('div[style="top:139px;left:134px;width:479px;height:13px;"]'),
  postcode: $('div[style="top:152px;left:132px;width:484px;height:13px;"]'),
  dwellingType: $('div[style="top:151px;left:4px;width:137px;height:15px;"]'),
  totalUnits: $('div[style="top:432px;left:658px;width:103px;height:15px;"'),
  devUnits: $('div[style="top:432px;left:470px;width:76px;height:14px;"'),

  cnSoldDate: $('div[style="top:170px;left:289px;width:59px;height:16px;"]'),
  cnFrontageFeet: $(
    'div[style="top:171px;left:451px;width:87px;height:13px;"]'
  ),
  cnFrontageMeters: $(
    'div[style="top:187px;left:451px;width:98px;height:16px;"]'
  ),
  cnDepth: $('div[style="top:199px;left:289px;width:89px;height:13px;"]'),
  cnLotArea: $('div[style="top:214px;left:289px;width:88px;height:17px;"]'),
  cnFloodPlain: $('div[style="top:230px;left:289px;width:79px;height:13px;"]'),
  cnApprovalReq: $('div[style="top:246px;left:289px;width:77px;height:16px;"]'),
  cnNewGST: $('div[style="top:277px;left:289px;width:110px;height:14px;"]'),
  cnTaxIncUtilities: $(
    'div[style="top:267px;left:603px;width:90px;height:14px;"]'
  ),
  cnZoning: $('div[style="top:219px;left:603px;width:43px;height:15px;"]'),
  cnServiceConnected: $(
    'div[style="top:357px;left:289px;width:105px;height:15px;"]'
  ),
  cnMeasType: $('div[style="top:184px;left:289px;width:76px;height:15px;"]'),
  cnStrataFee: $('div[style="top:267px;left:451px;width:61px;height:14px;"]'),
  cnGrossTaxes: $('div[style="top:235px;left:603px;width:71px;height:13px;"]'),
  cnFinishedFloor: $(
    'div[style="top:804px;left:3px;width:111px;height:16px;"]'
  ),
  cnGrandTotalFloorArea: $(
    'div[style="top:840px;left:3px;width:112px;height:12px;"]'
  ),
  cnRestrictedAge: $(
    'div[style="top:780px;left:210px;width:74px;height:12px;"]'
  ),
  cnForTaxYear: $('div[style="top:251px;left:603px;width:81px;height:15px;"]'), //$('div[style=""]'),
  cnAge: $('div[style="top:203px;left:603px;width:27px;height:14px;"]'),
  cnYearBuilt: $('div[style="top:187px;left:603px;width:97px;height:15px;"]'),
  cnOriginalPrice: $(
    'div[style="top:171px;left:603px;width:76px;height:15px;"]'
  ),
  cnBedrooms: $('div[style="top:203px;left:451px;width:75px;height:16px;"]'),
  cnBathrooms: $('div[style="top:219px;left:451px;width:77px;height:15px;"]'),
  cnFullBaths: $('div[style="top:235px;left:451px;width:55px;height:15px;"]'),
  cnHalfBaths: $('div[style="top:251px;left:451px;width:55px;height:13px;"]'),
  cnExposure: $('div[style="top:261px;left:289px;width:79px;height:15px;"]'),
  cnComplex: $('div[style="top:341px;left:289px;width:93px;height:14px;"]'),
  cnMgmtName: $('div[style="top:293px;left:289px;width:96px;height:17px;"]'),
  cnMgmtPhone: $('div[style="top:309px;left:289px;width:95px;height:17px;"]'),
  cnView: $('div[style="top:325px;left:289px;width:77px;height:13px;"]'),

  cnTotalParking: $(
    'div[style="top:384px;left:367px;width:73px;height:13px;"]'
  ),
  cnParking: $('div[style="top:396px;left:367px;width:43px;height:12px;"]'),
  cnCoveredParking: $(
    'div[style="top:384px;left:458px;width:82px;height:16px;"]'
  ),
  cnParkingAccess: $(
    'div[style="top:384px;left:565px;width:73px;height:16px;"]'
  ),
  cnDistToPublicTransit: $(
    'div[style="top:420px;left:367px;width:99px;height:12px;"]'
  ),
  cnDistToSchoolBus: $(
    'div[style="top:420px;left:565px;width:89px;height:14px;"]'
  ),
  cnUnitInDevelopment: $(
    'div[style="top:432px;left:367px;width:101px;height:15px;"]'
  ),
  cnTotalUnitsInStrata: $(
    'div[style="top:432px;left:565px;width:96px;height:15px;"]'
  ),
  cnLocker: $('div[style="top:408px;left:565px;width:40px;height:12px;"]'),
  cnTitleToLand: $('div[style="top:444px;left:367px;width:63px;height:12px;"]'),
  cnPropertyDisc: $(
    'div[style="top:468px;left:367px;width:72px;height:14px;"]'
  ),
  cnFixturesLeased: $(
    'div[style="top:480px;left:367px;width:74px;height:15px;"]'
  ),
  cnFixturesRmvd: $(
    'div[style="top:492px;left:367px;width:72px;height:13px;"]'
  ),
  cnFloorFinish: $('div[style="top:504px;left:367px;width:61px;height:14px;"]'),

  cnRooms: $('div[style="top:756px;left:210px;width:60px;height:12px;"]'),
  cnKitchens: $('div[style="top:756px;left:293px;width:66px;height:16px;"]'),
  cnLevels: $('div[style="top:756px;left:386px;width:56px;height:12px;"]'),
  cnPets: $('div[style="top:792px;left:210px;width:51px;height:14px;"]'),
  cnCats: $('div[style="top:792px;left:299px;width:30px;height:13px;"]'),
  cnDogs: $('div[style="top:792px;left:366px;width:42px;height:13px;"]'),
  cnBylawRestric: $(
    'div[style="top:816px;left:210px;width:65px;height:13px;"]'
  ),
  cnRentalsAllowed: $(
    'div[style="top:804px;left:210px;width:125px;height:14px;"]'
  ),
  cnCrawlHeight: $('div[style="top:768px;left:210px;width:92px;height:15px;"]'),
  cnBasement: $('div[style="top:840px;left:210px;width:57px;height:14px;"]'),

  cnMaintFeeInc: $('div[style="top:520px;left:3px;width:74px;height:14px;"]'),
  cnLegal: $('div[style="top:532px;left:3px;width:33px;height:16px;"]'),
  cnAmenities: $('div[style="top:556px;left:3px;width:53px;height:15px;"]'),
  cnSiteInfluences: $(
    'div[style="top:580px;left:3px;width:71px;height:14px;"]'
  ),
  cnFeatures: $('div[style="top:591px;left:3px;width:46px;height:12px;"]'),

  cnStyleOfHome: $('div[style="top:384px;left:3px;width:69px;height:13px;"]'),
  cnConstruction: $('div[style="top:396px;left:3px;width:62px;height:12px;"]'),
  cnExterior: $('div[style="top:408px;left:3px;width:43px;height:12px;"]'),
  cnFoundation: $('div[style="top:420px;left:3px;width:64px;height:14px;"]'),
  cnRainScreen: $('div[style="top:432px;left:3px;width:59px;height:12px;"]'),
  cnRenovation: $('div[style="top:444px;left:3px;width:60px;height:12px;"]'),
  cnWaterSupply: $('div[style="top:456px;left:3px;width:72px;height:14px;"]'),
  cnFirePlaceFuel: $('div[style="top:468px;left:3px;width:69px;height:13px;"]'),
  cnFuelHeating: $('div[style="top:480px;left:3px;width:61px;height:12px;"]'),
  cnOutdoorArea: $('div[style="top:492px;left:3px;width:70px;height:13px;"]'),
  cnTypeOfRoof: $('div[style="top:504px;left:3px;width:64px;height:12px;"]'),
  cnRenoYear: $('div[style="top:420px;left:259px;width:60px;height:12px;"]'),
  cnRIPlumbing: $('div[style="top:432px;left:259px;width:65px;height:12px;"]'),
  cnRIFireplaces: $(
    'div[style="top:444px;left:259px;width:71px;height:12px;"]'
  ),
  cnNumOfFirePlaces: $(
    'div[style="top:456px;left:259px;width:70px;height:13px;"]'
  ),

  cnFloor: $('div[style="top:616px;left:3px;width:28px;height:15px;"]'),
  cnType: $('div[style="top:616px;left:65px;width:32px;height:15px;"]'),
  cnDimensions: $('div[style="top:616px;left:182px;width:58px;height:16px;"]'),
  cnFloor2: $('div[style="top:616px;left:250px;width:39px;height:15px;"]'),
  cnType2: $('div[style="top:616px;left:328px;width:28px;height:15px;"]'),
  cnDimensions2: $('div[style="top:616px;left:435px;width:64px;height:17px;"]'),
  cnFloor3: $('div[style="top:616px;left:510px;width:37px;height:16px;"]'),
  cnType3: $('div[style="top:616px;left:577px;width:40px;height:19px;"]'),
  cnDimensions3: $('div[style="top:616px;left:695px;width:58px;height:17px;"]'),
  cnBath: $('div[style="top:754px;left:470px;width:30px;height:15px;"]'),
  cnFloor4: $('div[style="top:754px;left:509px;width:25px;height:15px;"]'),
  cnNumOfPieces: $('div[style="top:754px;left:543px;width:54px;height:13px;"]'),
  cnEnsuite: $('div[style="top:754px;left:603px;width:40px;height:16px;"]'),
  cnFinishedFloorMain: $(
    'div[style="top:756px;left:3px;width:105px;height:13px;"]'
  ),
  cnFinishedFloorAbove: $(
    'div[style="top:768px;left:3px;width:115px;height:13px;"]'
  ),
  cnFinishedFloorBelow: $(
    'div[style="top:780px;left:3px;width:113px;height:16px;"]'
  ),
  cnFinishedFloorTotal: $(
    'div[style="top:804px;left:3px;width:113px;height:16px;"]'
  ),
  cnFinishedFloorBasement: $(
    'div[style="top:792px;left:3px;width:125px;height:16px;"]'
  ),
  cnUnfinishedFloor: $(
    'div[style="top:828px;left:3px;width:109px;height:13px;"]'
  ),
  //$('div[style=""]'),
  cnBCAssess: $(
    '<div id="lblBCAssess" style="top: 111px; left: 525px; width: 50px; height: 16px; text-align: left;">????????????:</div>'
  ),
  cnListingPrice: $(
    '<div id="lblBCAssess" style="top: 129px; left: 525px; width: 50px; height: 16px; text-align: left;">????????????:</div>'
  ),
  cnSoldPrice: $(
    '<div id="lblBCAssess" style="top: 147px; left: 525px; width: 50px; height: 16px; text-align: left;">????????????:</div>'
  ),

  translate: function () {
    this.cnStrataFee.css("text-decoration", "underline").text("????????????:");
    this.cnGrossTaxes.css("text-decoration", "underline").text("????????????:");
    var squareMeters = $fx.convertUnit(this.finishedFloorArea.text());
    var totalSquareMeters = $fx.convertUnit(this.grandTotalFloorArea.text());

    this.cnFinishedFloor
      .text("????????????:(" + squareMeters.toString() + " ??????)")
      .css("text-decoration: underline");
    this.cnGrandTotalFloorArea
      .text("?????????:(" + totalSquareMeters.toString() + " ??????)")
      .css("text-decoration: underline");

    this.cnFinishedFloor.addClass(this.finishedFloorArea.attr("class"));
    this.cnGrandTotalFloorArea.addClass(this.grandTotalFloorArea.attr("class"));

    this.cnRestrictedAge.css("text-decoration", "underline").text("????????????:");
    this.cnSoldDate.text("????????????:");
    this.cnFrontageFeet.text("??????(??????):");
    this.cnFrontageMeters.text("??????(???):");
    this.cnDepth.text("??????:");
    this.cnLotArea.text("????????????:");
    this.cnFloodPlain.text("???????????????:");
    this.cnApprovalReq.text("????????????:");
    this.cnNewGST.text("????????????:");
    this.cnTaxIncUtilities.text("????????????????????????:");
    this.cnZoning.text("????????????:");
    this.cnServiceConnected.text("????????????:");
    this.cnMeasType.text("????????????:");
    this.cnForTaxYear.text("????????????");
    this.cnAge.css("text-decoration", "underline").text("??????: ");
    this.cnYearBuilt.text("???????????????");
    this.cnOriginalPrice.text("???????????????");
    this.cnBedrooms.css("text-decoration", "underline").text("???????????????");
    this.cnBathrooms.text("??????????????????");
    this.cnFullBaths.css("text-decoration", "underline").text("???????????????");
    this.cnHalfBaths.text("???????????????");
    this.cnExposure.css("text-decoration", "underline").text("?????????");
    this.cnComplex.text("???????????????");
    this.cnMgmtName.text("?????????????????????");
    this.cnMgmtPhone.text("?????????????????????");
    this.cnView.text("??????????????????");

    this.cnTotalParking
      .css("text-decoration", "underline")
      .text("????????????:")
      .css("text-decoration", "underline!important");
    this.cnParking.text("?????????:").css("text-decoration: underline");
    this.cnCoveredParking
      .css("text-decoration", "underline")
      .text("???????????????:");
    this.cnParkingAccess.text("???????????????:");
    this.cnDistToPublicTransit.text("????????????:");
    this.cnDistToSchoolBus.text("???????????????:");
    this.cnUnitInDevelopment.text("??????????????????:");
    this.cnTotalUnitsInStrata.text("??????????????????:");
    this.cnPropertyDisc.text("???????????????:");
    this.cnFixturesLeased.text("????????????:");
    this.cnFixturesRmvd.text("????????????:");
    this.cnFloorFinish.text("????????????:");
    this.cnLocker.text("?????????:").css("text-decoration: underline");
    this.cnTitleToLand
      .css("text-decoration", "underline")
      .text("????????????:")
      .css("text-decoration: underline");

    this.cnRooms.text("????????????:");
    this.cnKitchens.text("????????????:");
    this.cnLevels.text("??????:");
    this.cnCrawlHeight.text("???????????????:");
    this.cnPets.text("?????????:");
    this.cnCats.text("???:");
    this.cnDogs.text("???:");
    this.cnBylawRestric.text("??????????????????:");
    this.cnRentalsAllowed.text("?????????????????????:");
    this.cnBasement.text("?????????: ");

    this.cnMaintFeeInc.text("??????????????????");
    this.cnLegal.text("??????: ");
    this.cnAmenities.text("????????????: ");
    this.cnSiteInfluences.text("????????????: ");
    this.cnFeatures.text("????????????: ");

    this.cnStyleOfHome.text("????????????:");
    this.cnConstruction.text("????????????:");
    this.cnExterior.text("??????: ");
    this.cnFoundation.text("??????: ");
    this.cnRainScreen.text("?????????:");
    this.cnRenovation.text("???????????????:");
    this.cnWaterSupply.text("????????????:");
    this.cnFirePlaceFuel.text("????????????:");
    this.cnFuelHeating.text("????????????:");
    this.cnOutdoorArea.text("????????????:");
    this.cnTypeOfRoof.text("????????????:");
    this.cnRenoYear.text("????????????:");
    this.cnRIFireplaces.text("????????????:");
    this.cnRIPlumbing.text("????????????:");
    this.cnNumOfFirePlaces.text("????????????:");

    this.cnFloor.text("??????");
    this.cnFloor2.text("??????");
    this.cnFloor3.text("??????");
    this.cnFloor4.text("??????");
    this.cnType.animate({ width: "60px" }).text("????????????");
    this.cnType2.animate({ width: "60px" }).text("????????????");
    this.cnType3.animate({ width: "60px" }).text("????????????");
    this.cnDimensions.text("????????????");
    this.cnDimensions2.text("????????????");
    this.cnDimensions3.text("????????????");
    this.cnBath.text("?????????");
    this.cnNumOfPieces.text("????????????");
    this.cnEnsuite.text("???????????????");

    this.cnFinishedFloorMain.text("??????????????????: ");
    this.cnFinishedFloorAbove.text("??????????????????:");
    this.cnFinishedFloorBelow.text("??????????????????:");
    //this.cnFinishedFloorTotal.text("???????????????:");
    this.cnFinishedFloorBasement.text("?????????????????????:");
    this.cnUnfinishedFloor.text("???????????????: ");

    if (this.listingHouseType == "ResidentialDetached") {
      this.cnSuite.text("??????:");
      this.cnBedNotInBasement.text("??????????????????:");
      this.cnBedsInBasement.text("?????????????????????:");
    }

    this.cnBCAssess
      .addClass(this.bcAssess.attr("class"))
      .insertBefore(this.bcAssess);
    this.cnListingPrice.addClass(this.lp.attr("class")).insertBefore(this.lp);
    this.cnSoldPrice.addClass(this.sp.attr("class")).insertBefore(this.sp);
  },

  translate2TraditionalCN: function () {
    this.cnStrataFee.css("text-decoration", "underline").text("???????????????");
    this.cnGrossTaxes.css("text-decoration", "underline").text("???????????????");
    var squareMeters = $fx.convertUnit(this.finishedFloorArea.text());
    var totalSquareMeters = $fx.convertUnit(this.grandTotalFloorArea.text());

    this.cnFinishedFloor
      .text("???????????????(" + squareMeters.toString() + " M2)")
      .css("text-decoration: underline");
    this.cnGrandTotalFloorArea
      .text("????????????(" + totalSquareMeters.toString() + " M2)")
      .css("text-decoration: underline");

    this.cnFinishedFloor.addClass(this.finishedFloorArea.attr("class"));
    this.cnGrandTotalFloorArea.addClass(this.grandTotalFloorArea.attr("class"));

    this.cnRestrictedAge.css("text-decoration", "underline").text("???????????????");
    this.cnSoldDate.text("????????????:");
    this.cnFrontageFeet.text("??????(???):");
    this.cnFrontageMeters.text("??????(???):");
    this.cnDepth.text("??????:");
    this.cnLotArea.text("????????????:");
    this.cnFloodPlain.text("???????????????:");
    this.cnApprovalReq.text("????????????:");
    this.cnNewGST.text("????????????:");
    this.cnTaxIncUtilities.text("?????????????????????:");
    this.cnZoning.text("?????????:");
    this.cnServiceConnected.text("????????????:");
    this.cnMeasType.text("????????????:");
    this.cnForTaxYear.text("???????????????");
    this.cnAge.css("text-decoration", "underline").text("??????: ");
    this.cnYearBuilt.text("???????????????");
    this.cnOriginalPrice.text("???????????????");
    this.cnBedrooms.css("text-decoration", "underline").text("????????????");
    this.cnBathrooms.text("????????????");
    this.cnFullBaths.css("text-decoration", "underline").text("?????????");
    this.cnHalfBaths.text("?????????");
    this.cnExposure.css("text-decoration", "underline").text("?????????");
    this.cnComplex.text("???????????????");
    this.cnMgmtName.text("?????????????????????");
    this.cnMgmtPhone.text("?????????????????????");
    this.cnView.text("??????????????????");

    this.cnTotalParking
      .css("text-decoration", "underline")
      .text("?????????:")
      .css("text-decoration", "underline!important");
    this.cnParking.text("?????????:").css("text-decoration: underline");
    this.cnCoveredParking
      .css("text-decoration", "underline")
      .text("???????????????:");
    this.cnParkingAccess.text("???????????????:");
    this.cnDistToPublicTransit.text("????????????:");
    this.cnDistToSchoolBus.text("????????????:");
    this.cnUnitInDevelopment.text("??????????????????:");
    this.cnTotalUnitsInStrata.text("??????????????????:");
    this.cnPropertyDisc.text("???????????????:");
    this.cnFixturesLeased.text("????????????:");
    this.cnFixturesRmvd.text("????????????:");
    this.cnFloorFinish.text("????????????:");
    this.cnLocker.text("?????????:").css("text-decoration: underline");
    this.cnTitleToLand
      .css("text-decoration", "underline")
      .text("????????????:")
      .css("text-decoration: underline");

    this.cnRooms.text("?????????:");
    this.cnKitchens.text("?????????:");
    this.cnLevels.text("?????????:");
    this.cnCrawlHeight.text("???????????????:");
    this.cnPets.text("?????????:");
    this.cnCats.text("???:");
    this.cnDogs.text("???:");
    this.cnBylawRestric.text("????????????:");
    this.cnRentalsAllowed.text("??????????????????/??????:");
    this.cnBasement.text("?????????: ");

    this.cnMaintFeeInc.text("??????????????????");
    this.cnLegal.text("??????: ");
    this.cnAmenities.text("????????????: ");
    this.cnSiteInfluences.text("????????????: ");
    this.cnFeatures.text("????????????: ");

    this.cnStyleOfHome.text("????????????:");
    this.cnConstruction.text("????????????:");
    this.cnExterior.text("??????: ");
    this.cnFoundation.text("??????: ");
    this.cnRainScreen.text("?????????:");
    this.cnRenovation.text("???????????????:");
    this.cnWaterSupply.text("????????????:");
    this.cnFirePlaceFuel.text("????????????:");
    this.cnFuelHeating.text("????????????:");
    this.cnOutdoorArea.text("????????????:");
    this.cnTypeOfRoof.text("????????????:");
    this.cnRenoYear.text("????????????:");
    this.cnRIFireplaces.text("????????????:");
    this.cnRIPlumbing.text("????????????:");
    this.cnNumOfFirePlaces.text("????????????:");

    this.cnFloor.text("??????");
    this.cnFloor2.text("??????");
    this.cnFloor3.text("??????");
    this.cnFloor4.text("??????");
    this.cnType.animate({ width: "60px" }).text("????????????");
    this.cnType2.animate({ width: "60px" }).text("????????????");
    this.cnType3.animate({ width: "60px" }).text("????????????");
    this.cnDimensions.text("????????????");
    this.cnDimensions2.text("????????????");
    this.cnDimensions3.text("????????????");
    this.cnBath.text("?????????");
    this.cnNumOfPieces.text("?????????");
    this.cnEnsuite.text("?????????");

    this.cnFinishedFloorMain.text("????????????????????????: ");
    this.cnFinishedFloorAbove.text("????????????????????????:");
    this.cnFinishedFloorBelow.text("????????????????????????:");
    this.cnFinishedFloorBasement.text("???????????????????????????:");
    this.cnUnfinishedFloor.text("???????????????: ");

    if (this.listingHouseType == "ResidentialDetached") {
      this.cnSuite.text("??????:");
      this.cnBedNotInBasement.text("???????????????:");
      this.cnBedsInBasement.text("??????????????????:");
    }

    this.cnBCAssess
      .addClass(this.bcAssess.attr("class"))
      .insertBefore(this.bcAssess);
    this.cnListingPrice.addClass(this.lp.attr("class")).insertBefore(this.lp);
    this.cnSoldPrice.addClass(this.sp.attr("class")).insertBefore(this.sp);
  },
};

//fullpublic startpoint
$(function () {
  fullpublic.init();
});
