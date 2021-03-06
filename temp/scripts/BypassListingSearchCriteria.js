//Targe Tab3//4/5_1_2 ML Default Spreadsheet View

//https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/2/?savedSearchID=1781753&searchID=tab3_1
window.g_urlCountAction = '/ParagonLS/Search/Property.mvc/Count/0';

(function (elementExample, Object, window) {

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
  for (var i = 0, len = ownProps.length | 0, key; i < len; i = i + 1 | 0) {
    key = ownProps[i];
    if (/^HTMLInputElement$/.test(key) && window.hasOwnProperty(key) && !window.propertyIsEnumerable(key) && typeof window[key] === "function")(function () {
      var oldDescriptors = Object.getOwnPropertyDescriptors(window[key].prototype);
      var keys = Object.keys(oldDescriptors);
      var newDescriptors = {};
      console.log(keys);

      for (var i = 0, len = keys.length | 0, prop, description; i < len; i = i + 1 | 0) {
        prop = keys[i];
        description = oldDescriptors[prop];
        if (
          prop !== "nonce" && // supposed to be secret and hidden from CSS
          (!prop.startsWith("on") || elementExample[prop] !== null) && // screen out event listeners
          typeof description.set === "function" && // ensure that this property has a descriptor
          description.set.toString().indexOf("[native code]") !== -1 // ensure that we have not already processed to this element
        ) newDescriptors[prop] = {
          configurable: true,
          enumerable: true,
          get: description.get, // do not modify the original getter
          set: createIDLSetWrapper(prop, description.set, description.get)
        };
      }

      // Finally apply the wrappers
      Object.defineProperties(window[key].prototype, newDescriptors);
    })();
  }

})(document.firstElementChild, Object, window);

$(function () {
  //console.log("Search Bypass Criteria iFrame");

  var btnSearch = $("#Search");
  var btnCount = $("#Count");
  var inputCountResult = $("#CountResult");
  var divCountSearch = $("#CountSearch");

  var curve = {
    priceRange: [0],
    listingCount: [0],
    testControlCount: []
  };
  var priceRange;
  var listingCount;
  var priceRangePointer = 0;

  var lastCount = false;
  var nextLowPrice = 0;

  //remove inputCountResult ReadOnly Attr
  inputCountResult.removeAttr('readonly');
  //inputCountResult.attr('value', 'Counting...');
  btnCount.click();

  var btnSaveCriteria = $(
    `<button id="mls_helper_save_criteria">Save</button>`
  );
  var btnNextCriteria = $(
    `<button id="mls_helper_next_criteria">Next</button>`
  );
  var btnPrevCriteria = $(
    `<button id="mls_helper_prev_criteria">Prev</button>`
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
  var divContainer = $("div.f-cs-link")[0];
  $(divContainer).append(btnSaveCriteria);
  $(divContainer).append(btnFirstCriteria);
  $(divContainer).append(btnPrevCriteria);
  $(divContainer).append(btnNextCriteria);
  $(divContainer).append(btnPriceDistributionCurve);

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
    console.log("clicked");
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
    let cmaIDStartPosition = cmaID.indexOf("[") + 1;
    let cmaIDEndPosition = cmaID.indexOf("]");
    let cmaIDNumber = parseInt(
      cmaID.substring(cmaIDStartPosition, cmaIDEndPosition)
    );

    if (!cmaIDNumber) {
      alert('Select a CMA Number!');
      return;
    }

    let urlLocationOptionLocal = $("#pid_local", top.document);
    let urlLocation = urlLocationOptionLocal.prop("checked");
    let ajax_url = "";

    if (urlLocation) {
      // ajax_url =
      //   "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/dbAddCMACriteria.php";
      ajax_url =
        "https://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/dbAddCMACriteria.php";
    } else {
      ajax_url =
        "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dbAddCMACriteria.php";
    }

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        criteria_rules: JSON.stringify(criteriaRules),
        cma_id: cmaIDNumber,
      },
      success: function (res) {
        console.log("res::", JSON.stringify(res));
      },
    });
  });

  $("#mls_helper_first_criteria").on("click", async (e) => {
    console.log(e);
    console.log('first clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
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
    highPrice.val('');
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
      highPriceInitial = parseInt(lowPrice.val() || 0) + 500 * (highPriceInitial / 500);
      while (iCountTotal > 1500 && (iCount < 1000 || iCount > 1500)) {
        highPriceInitial = Math.floor(highPriceInitial / 10) * 10;
        highPrice.val(highPriceInitial);
        iCount = await $.focusFx.searchFormCount();
        iCount = parseInt(iCount);
        points.push({
          x: highPriceInitial,
          y: iCount
        });
        console.log(`LowPrice: ${lowPrice.val()} - HighPrice: ${highPriceInitial}`, " | Count: ", iCount);
        // if (points.length === 2) {
        //   let y_for_1500 = 1500.00;
        //   let x_for_1500 = (y_for_1500 - points[1].y) * (points[0].x - points[1].x) / (points[0].y - points[1].y) + points[1].x;
        //   console.log(x_for_1500);
        //   highPriceInitial = Math.floor(x_for_1500 / 10) * 10;
        //   continue;
        // }
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

    $(".CountBtn").removeAttr('disable');
    $('.SearchBtn').removeAttr('disable');
    console.log(inputCountResult.val());
    console.log(iCount);

    nextLowPrice = highPrice.val();
    priceRange = parseInt(highPrice.val() || 0);
    listingCount = iCount;

    console.log(curve);

  }); //mls_helper_first_criteria

  $("#mls_helper_price_curve").on("click", async (e) => {
    console.log('curve clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    let highPriceInitial = 600;
    let lastCount = false;
    let iCount = 0,
      iCountTotal = 0;
    let iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    console.group();

    lowPrice.val('');
    highPrice.val('');
    nextLowPrice = 0;

    do {
      /* get total listing Count base on the lowPrice:
        lowPrice is set manually
        highPrice is indefinite
      */
      highPrice.val('');
      lowPrice.val(nextLowPrice);
      iCountTotal = parseInt(await $.focusFx.searchFormCount());
      iCount = iCountTotal;
      if (iCountTotal <= 1500) {
        lastCount = true;
        $(".CountBtn").removeAttr('disable');
        $('.SearchBtn').removeAttr('disable');
        console.log(inputCountResult.val());
        console.log(iCount);

        priceRange = 99999;
        listingCount = iCount;
        curve.priceRange.push(priceRange);
        curve.listingCount.push(listingCount);
        console.log(curve);
        break;
      } else {
        console.group();
        iTestControl = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        highPriceInitial = parseInt(lowPrice.val() || 0) + 500 * (highPriceInitial / 500);
        lowPrice2.val('001');
        while (iCountTotal > 1500 && (iCount < 1000 || iCount > 1500)) {
          highPriceInitial = Math.floor(highPriceInitial / 10) * 10;
          highPrice.val(highPriceInitial);
          iCount = await $.focusFx.searchFormCount();
          iCount = parseInt(iCount);
          console.log(`LowPrice: ${lowPrice.val()} - HighPrice: ${highPriceInitial}`, " | Count: ", iCount);
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
              $(".CountBtn").removeAttr('disable');
              $('.SearchBtn').removeAttr('disable');
              console.log(inputCountResult.val());
              console.log(iCount);

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

    } while (!lastCount)

  });


  $("#mls_helper_next_criteria").on("click", async (e) => {
    console.log(e);
    console.log('next clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    let iCount = 0;

    if (priceRangePointer === curve.priceRange.length - 1) {
      priceRangePointer = 0;
    }

    let lowPriceRange = curve.priceRange[priceRangePointer++];
    let highPriceRange = curve.priceRange[priceRangePointer];


    lowPrice.val(lowPriceRange);
    lowPrice2.val('001');
    highPrice.val(highPriceRange);
    iCount = await $.focusFx.searchFormCount();
    iCount = parseInt(iCount);
  }); //id: mls_helper_next_criteria

  // $("#mls_helper_price_curve").on("click", async (e) => {
  //   console.log('curve clicked');
  //   let highPrice = $("#f_5_High__1-2-3-4-5");
  //   let lowPrice = $("#f_5_Low__1-2-3-4-5");
  //   let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
  //   lowPrice2.val('001');
  //   let newHighPrice, oldHighPrice, oldLowPrice;
  //   let countAccumulate, countTotal;
  //   let lastCount = false;
  //   let iCount = 0;
  //   let iLoop = 0;
  //   console.group();
  //   // Scatter Curve
  //   // do {
  //   //   iLoop++;
  //   //   newHighPrice = parseInt(parseInt(highPrice.val()) + 200);
  //   //   highPrice.val(newHighPrice);
  //   //   iCount = await $.focusFx.searchFormCount();
  //   //   iCount = parseInt(iCount);
  //   //   curve.priceRange.push(newHighPrice);
  //   //   curve.listingCount.push(iCount);
  //   //   console.log("Price Point: ", newHighPrice);
  //   //   console.log("Listing Count: ", iCount);
  //   // } while (iLoop <= 100)
  //   // Distribution Curve
  //   lowPrice.val(0);
  //   highPrice.val(0);

  //   let priceIncrements = [140, 160, 180, 200, 220, 500, 1500, 2000, 2500];
  //   let priceIncrementRegularPointer = 3; // try 200
  //   let priceIncrementPointer = priceIncrementRegularPointer;
  //   lowPrice.val();
  //   highPrice.val();
  //   // get the total listing Count:
  //   countTotal = parseInt(await $.focusFx.searchFormCount());

  //   do {
  //     try {
  //       oldLowPrice = lowPrice.val(); // save the old low price
  //       lowPrice.val(highPrice.val());
  //       oldHighPrice = highPrice.val(); // save the old high price
  //       if (priceIncrementPointer >= 0 && priceIncrementPointer < priceIncrements.length) {
  //         newHighPrice = parseInt(highPrice.val()) + priceIncrements[priceIncrementPointer]; // try 200
  //       } else if (priceIncrementPointer >= priceIncrements.length) {
  //         newHighPrice = null;
  //         lastCount = true;
  //       } else {
  //         newHighPrice -= 20;
  //       }
  //       highPrice.val(newHighPrice);
  //       iCount = await $.focusFx.searchFormCount();
  //       iCount = parseInt(iCount);
  //       if (iCount >= 1200 && iCount <= 1500) {
  //         iLoop++;
  //         curve.priceRange.push(newHighPrice);
  //         curve.listingCount.push(iCount);
  //         console.log("Price Point: ", newHighPrice);
  //         console.log("Listing Count: ", iCount);
  //         // sum up the accumulated count:
  //         countAccumulate = curve.listingCount.reduce((sum, a) => sum + a, 0);
  //         if (countTotal - countAccumulate <= 1500) {
  //           lastCount = true;
  //         }
  //         priceIncrementPointer = priceIncrementRegularPointer; // reset the Pointer
  //       } else {
  //         throw iCount;
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       iCount = parseInt(e);
  //       lowPrice.val(oldLowPrice); // restore the old low price;
  //       highPrice.val(oldHighPrice); // restore the old high price;
  //       switch (true) {
  //         case iCount < 200:
  //           priceIncrementPointer += 4;
  //           break;
  //         case iCount >= 200 && iCount < 500:
  //           priceIncrementPointer += 3;
  //           break;
  //         case iCount >= 500 && iCount < 1000:
  //           priceIncrementPointer += 2;
  //           break;
  //         case iCount >= 1000 && iCount < 1200:
  //           priceIncrementPointer += 1;
  //           break;
  //         case iCount > 1500:
  //           // priceIncrement is too big, try a smaller increment
  //           priceIncrementPointer--;
  //           break;
  //       }
  //     }
  //   } while (iLoop <= 100 && !lastCount)
  //   console.groupEnd();
  //   $(".CountBtn").removeAttr('disable');
  //   $('.SearchBtn').removeAttr('disable');
  //   console.log('Price Distribution Curve: ', curve);
  // }); //id: mls_helper_next_criteria


  // $(".CountResultText").bind("input propertychange", (e) => {
  //   console.log('CountResult Changed');
  // });

  // $("#CountResult").on("change", () => {
  //   console.log('input result changed');
  // });

  // divCountSearch.on("change", () => {
  //   console.log("count search changed!");
  // });

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
    attributeOldValue: true
  };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
      } else if (mutation.type === 'attributes') {
        console.log('The ' + mutation.attributeName + ' attribute was modified.');
        console.log('The oldValue is ' + mutation.oldValue);
        console.log($('#CountResult').val());
        let iCount = parseInt($('#CountResult').val());

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
});