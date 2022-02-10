"use strict";

/// 增加promise的外包层
chrome.tabs.promise = {
  query: async (keys) => {
    let w = await chrome.windows.promise.getCurrent();
    keys.windowId = w.id;

    return new Promise((resolve, reject) => {
      /// 原API程序
      chrome.tabs.query(keys, (tabs) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(tabs);
        }
      });
    });
  },
};

/// 增加promise外包层, 把callback函数分离出来
chrome.windows.promise = {
  getCurrent: () => {
    // 原API程序
    return new Promise((resolve, reject) => {
      chrome.windows.getCurrent((w) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        }
        resolve(w);
      });
    });
  },
};
