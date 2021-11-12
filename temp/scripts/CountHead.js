(function () {
  var container = document.querySelector('#_tcx-gz83vxa29wp');
  if (!container) {
    return;
  }

  function addToContainer(url, text) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-tcx-url', url);
    wrapper.innerText = text;
    container.appendChild(wrapper);
  }

  const fetch = window.fetch
  window.fetch = function () {
    return Promise.resolve(fetch.apply(window, arguments))
      .then(async response => {
        if (response.ok) {
          try {
            const clone = response.clone();
            const json = await clone.json();
            addToContainer(clone.url, JSON.stringify(json));
          } catch (err) {}
        }
        return response;
      });
  };

  var XHR = XMLHttpRequest.prototype;
  var send = XHR.send;
  var open = XHR.open;
  XHR.open = function (method, url) {
    this.url = url;
    return open.apply(this, arguments);
  };
  XHR.send = function () {
    this.addEventListener('load', function () {
      try {
        const response = this.response;
        if (response && response.length) {
          const firstChar = response[0];
          if (firstChar === '[' || firstChar === '{') {
            addToContainer(this.url, response);
          }
        }
      } catch (err) {
        // No-op.
      }
    });
    return send.apply(this, arguments);
  };
})();