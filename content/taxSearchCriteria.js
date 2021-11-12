//Query tax information

//console.log("MLS tax search iframe");

// chrome.storage.local.get("PID",function(result){

// 	var inputPID = $('#f_22');
// 	inputPID.focus().val(result.PID).blur();

// 	var btnSearch = $('#Search');

// 	btnSearch.click();

// })

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if (String(msg.todo).indexOf("taxSearchFor") > -1) {
    //console.log("I am in mls-tax.js");
    //console.log("mls-tax got msg: ", msg);
    response("mls-tax got a message");

    chrome.storage.local.get(["PID", "taxYear"], function(result) {
      var inputPID = $("#f_22");
      var liPID = $('div[rel="f_22"] ul li.acfb-data');
      var inputHidenPID = $("#hdnf_22");
      liPID.remove();
      inputHidenPID.val("");
      //inputHidenPID.val("['" + result.PID + "']");
      var $count = $("#CountResult");

      inputPID
        .focus()
        .val(result.PID)
        .blur();
      var keydown = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: 13
      });
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
            taxSearchRequester: msg.todo
          });
          btnSearch.click();
        } else if (parseInt($count.val()) == 0 || monitorCounter++ > 100) {
          clearInterval(checkTimer);
          console.log("Tax Search Failed!");
          //inform background the tax search does not work
          let assess = {
            _id: result.PID + "-" + result.taxYear,
            landValue: 0,
            improvementValue: 0,
            totalValue: 0,
            planNum: "",
            PID: result.PID,
            taxYear: result.taxYear,
            bcaSearch: "failed",
            from:
              "assess-" +
              msg.todo +
              "-TaxSearchFailed" +
              Math.random().toFixed(8),
            dataFromDB: false
          };
          chrome.storage.local.set(assess, function() {
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
              taxData: assess
            },
            function(response) {
              console.log("tax Data has been save to the database!");
            }
          );
        }
        console.log("Waiting for tax Search result...", checkTimer);
      }
    });
  }
});
