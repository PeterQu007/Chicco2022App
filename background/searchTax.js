// 地税Tax和政府评估Assess查询服务子程序
// 改为async/await语法

class QueryTaxAndAssess {
  // 向CouchDB或者前端地税查询网页查询物业的地税和评估信息
  constructor(request, db) {
    this.request = request;
    this.dbAssess = db;
  }

  // 读取Chrome数据存储库中的PID和taxYear信息
  // chrome storage local api 没有使用promise wrapper
  // 在CouchDB数据库中查询地税数据
  getAssessInfoPromise() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["PID", "taxYear"], async (result) => {
        taxYear = result.taxYear;
        let taxID = result.PID + "-" + taxYear;
        let requester = this.request.from;

        try {
          // 查询CouchDB中的bcassessment数据库
          let assessDoc = await this.dbAssess.readAssessPromise(taxID);
          if (assessDoc._id) {
            assessDoc.from += "-taxSearchFor" + requester;
          }
          resolve(assessDoc); // 返回数据包
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  // 用promise写入CouchDB数据库
  setAssessInfoPromise(assessInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        let writeRes = await this.dbAssess.writeAssessPromise(assessInfo);
        resolve(writeRes);
      } catch (err) {
        reject(err);
      }
    });
  }

  // 用promise读取Chrome数据存储库中的PID和taxYear
  // chrome storage local api 使用promise wrapper
  // 在CouchDB数据库中查询地税数据
  async getAssessInfoPromise_SAMPLECODE() {
    // chrome api wrapper 位于程序文件 chrome-storage-promise.js
    let result = await chrome.storage.promise.local.get(["PID", "taxYear"]);
    taxYear = result.taxYear;
    let taxID = result.PID + "-" + taxYear;
    let requester = this.request.from;

    try {
      // 查询CouchDB中的bcassessment数据库
      let assessDoc = await this.dbAssess.readAssessPromise(taxID);
      if (assessDoc._id) {
        assessDoc.from += "-taxSearchFor" + requester;
      }
      return Promise.resolve(assessDoc);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
