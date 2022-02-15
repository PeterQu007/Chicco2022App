"use strict";

(async function () {
  /// 设定调试输出模式
  let debugSettingInfo = await chrome.runtime.promise.sendMessage({
    debugID: "debug_sumbox_panel",
    from: "sumBoxPanel.js",
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
    warn: debugSetting ? console.warn : () => {},
  };

  console.currentPage.logDebug("Debug", "sumBoxPanel.js");
})();

class SumBoxPanel extends React.Component {
  constructor(props) {
    super(props);

    console.currentPage.log(props);
  }
  // handleClick(e) {
  //   console.currentPage.log("test click", e);
  //   //return false;
  // }
  componentDidUpdate(oldProps) {
    // const newProps = this.props
    // if(oldProps.field !== newProps.field) {
    //   this.setState({ ...something based on newProps.field... })
    // }
    console.currentPage.warn("REACT UPDATED");
  }
  render() {
    const { panel } = this.props;
    const boxClass = "f-summary-data-box";
    const labelPanel = "sumBoxPanel0";

    return (
      <React.Fragment>
        <tr>
          <td>
            <span>{panel.labels.name}</span>
          </td>
          <td>
            {panel.id == labelPanel ? (
              <span onClick={this.props.onClick}>{panel.labels.high}</span>
            ) : (
              <div id={panel.labels.high} className={boxClass}>
                {panel.values.high}
              </div>
            )}
          </td>
          <td>
            {panel.id == labelPanel ? (
              <span>{panel.labels.low}</span>
            ) : (
              <div id={panel.labels.low} className={boxClass}>
                {panel.values.low}
              </div>
            )}
          </td>
          <td>
            {panel.id == labelPanel ? (
              <span>{panel.labels.ave}</span>
            ) : (
              <div id={panel.labels.ave} className={boxClass}>
                {panel.values.ave}
              </div>
            )}
          </td>
          <td>
            {panel.id == labelPanel ? (
              <span>{panel.labels.med}</span>
            ) : (
              <div id={panel.labels.med} className={boxClass}>
                {panel.values.med}
              </div>
            )}
          </td>
          <td>
            {panel.id == labelPanel ? (
              <span>{panel.labels.count}</span>
            ) : (
              <div id={panel.labels.count} className={boxClass}>
                {panel.values.count}
              </div>
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default SumBoxPanel;
