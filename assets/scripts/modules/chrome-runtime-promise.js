"use strict";

/// 增加promise的外包层
chrome.runtime.promise = {
  sendMessage: (messages) => {
    return new Promise((resolve, reject) => {
      /// 原API程序
      chrome.runtime.sendMessage(messages, (result) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // onMessage
  onMessage: {
    addListener: () => {
      let promise = new Promise((resolve, reject) => {
        chrome.runtime.onMessage.addListener((messages, sender, response) => {
          let err = chrome.runtime.lastError;
          if (err) {
            reject(err);
          } else {
            resolve(messages, sender, response);
          }
        });
      });
      return promise;
    },
  },
};
