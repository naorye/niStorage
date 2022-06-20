document.addEventListener('niStorage:ready', async function (event) {
    // Ready to use niStorage
    const storage = event.detail;
    console.log("before get")
    let history = await storage.getItem("ni-history") || [];
    console.log("after get")
    const verticalId = window?.eventTrackerAttributes?.userParams?.verticalId || '5aba2aae309d88000126ff9f';
    history.push({
        host: window.location.host,
        href: window.location.href,
        title: window?.naturalint_tag_data?.['dom.title'],
        verticalId,
        date: new Date(),
        ni_platform: window.ni_platform,
        ni_channel_type: window.ni_channel_type,
        ni_server_side_impression_id: window.ni_server_side_impression_id,
        ni_server_side_user_id: window.ni_server_side_user_id,
        ni_source: window.ni_source,
        naturalint_tag_data: window.naturalint_tag_data
    })
    storage.setItem("ni-history", history);
    console.log("event", event)
    const historyVerticalsIds = [];
    for (const {verticalId: historyVerticalId} of history) {
        if (!historyVerticalsIds.includes(historyVerticalId) && historyVerticalId) {
            historyVerticalsIds.push(historyVerticalId)
        }
    }

    const response = fetch('http://localhost/rts_recommend', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vertical_id: verticalId,
            history_verticals_ids: historyVerticalsIds
        })
    })
    // response.then(response => response.json())
    //     .then(data => {
    //         console.log('Success:', data);
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error);
    //     })
    const responseJson = await (await response).json();
    let html = "<div style=\'position: fixed; bottom: 0; right: 0; z-index: 9999999; width: 331px; background: #FFFFFF; border-radius: 5px;\'>\n    " +
        "<h3 style='font-style: normal;font-weight: 600;font-size: 24px;line-height: 29px;color: #000000; text-align: center;'>You may also like</h3>"
    for (const description of responseJson.vertical_names) {
        const link = 'http://ni.com'
        html += "<div style='margin: 10px'>" +
            description +
            "<a href='" + link +
            "' style='text-decoration: none; color: white; width: 156px;height: 40px;background: #FF4A64;border-radius: 5px;display: block;text-align: center;line-height: 40px;'>Visit Site</a>" +
            "</div>"
    }

    /*+ "<div style=\'font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    border-top: 1px solid;\n    border-color: #E2E2E2;\n    padding: 20px 0;\n    font-weight: normal;\'><a href=\"/dating/10-safety-tips-for-lgbtq-online-dating\"\n                             style=\'font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    text-decoration: none;\n    cursor: pointer;\n    font-weight: normal;\'>\n        <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    display: flex;\n    margin-bottom: 10px;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: wrap;\'><h4 style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #2D2D2D;\n    font-weight: inherit;\n    transition: all 0.3s;\n    font-size: 18px;\'>10 Safety Tips for LGBTQ+ Online\n            Dating</h4></div>\n        <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: nowrap;\'>\n            <svg width=\"19\" height=\"19\" viewBox=\"0 0 19 19\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"\n                 style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    fill: none;\n    margin-top: 2px;\n    width: 19px;\n    height: 19px;\n    margin-right: 7px;\'>\n                <circle cx=\"9.5\" cy=\"9.5\" r=\"9.5\" fill=\"#969696\"></circle>\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\n                      d=\"M10.819 12.0221C11.4109 12.6287 12.1403 13.0062 13.0073 13.1547C13.9763 13.3206 14.7197 13.1783 15.2375 12.728C15.7553 12.2776 16.0195 11.694 16.0299 10.9771C16.0397 10.3051 15.8184 9.70572 15.3659 9.17909C14.9135 8.65246 14.319 8.22505 13.5824 7.89682C13.2267 7.7461 12.9857 7.62062 12.8593 7.52038C12.733 7.42014 12.6714 7.25802 12.6747 7.03399C12.6809 6.60834 12.9665 6.30353 13.5316 6.11954C14.0967 5.93555 14.6731 5.84895 15.2609 5.85975L15.1236 4.75824C13.591 4.67553 12.3517 5.08096 11.4056 5.97454C10.4595 6.86811 9.97618 8.02057 9.95561 9.43192C9.93929 10.5521 10.2271 11.4154 10.819 12.0221ZM3.40964 11.9735C4.00153 12.5801 4.73095 12.9577 5.59792 13.1061C6.56689 13.272 7.31028 13.1298 7.8281 12.6794C8.34592 12.229 8.61005 11.6454 8.6205 10.9286C8.63029 10.2565 8.40896 9.65714 7.9565 9.13051C7.50405 8.60388 6.90956 8.17646 6.17302 7.84824C5.81733 7.69751 5.57632 7.57203 5.44996 7.4718C5.32361 7.37156 5.26207 7.20943 5.26533 6.98541C5.27153 6.55976 5.55716 6.25495 6.12223 6.07095C6.68729 5.88696 7.26371 5.80037 7.8515 5.81116L7.71417 4.70966C6.18161 4.62695 4.94231 5.03237 3.99624 5.92595C3.05017 6.81953 2.56686 7.97198 2.5463 9.38334C2.52997 10.5035 2.81775 11.3668 3.40964 11.9735Z\"\n                      fill=\"white\"></path>\n            </svg>\n            <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: wrap;\'><p style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #999999;\n    font-size: 14px;\n    font-weight: 400;\' color=\"secondary\">Larry Armstead.</p>\n                <svg width=\"4\" height=\"4\" viewBox=\"0 0 4 4\" fill=\"inherit\" xmlns=\"http://www.w3.org/2000/svg\"\n                     style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    width: 4;\n    fill: #969696;\n    height: 4px;\n    margin-top: 4px;\n    margin-left: 8px;\n    margin-right: 8px;\'>\n                    <circle cx=\"2\" cy=\"2\" r=\"2\" fill=\"inherit\"></circle>\n                </svg>\n                <p style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #999999;\n    font-size: 14px;\n    font-weight: 400;\' color=\"secondary\">June, 2022</p></div>\n        </div>\n    </a></div>\n    "
    + "<div style=\'font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    border-top: 1px solid;\n    border-color: #E2E2E2;\n    padding: 20px 0;\n    font-weight: normal;\'><a href=\"/dating/10-safety-tips-for-lgbtq-online-dating\"\n                             style=\'font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    text-decoration: none;\n    cursor: pointer;\n    font-weight: normal;\'>\n        <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    display: flex;\n    margin-bottom: 10px;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: wrap;\'><h4 style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #2D2D2D;\n    font-weight: inherit;\n    transition: all 0.3s;\n    font-size: 18px;\'>10 Safety Tips for LGBTQ+ Online\n            Dating</h4></div>\n        <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: nowrap;\'>\n            <svg width=\"19\" height=\"19\" viewBox=\"0 0 19 19\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"\n                 style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    fill: none;\n    margin-top: 2px;\n    width: 19px;\n    height: 19px;\n    margin-right: 7px;\'>\n                <circle cx=\"9.5\" cy=\"9.5\" r=\"9.5\" fill=\"#969696\"></circle>\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\n                      d=\"M10.819 12.0221C11.4109 12.6287 12.1403 13.0062 13.0073 13.1547C13.9763 13.3206 14.7197 13.1783 15.2375 12.728C15.7553 12.2776 16.0195 11.694 16.0299 10.9771C16.0397 10.3051 15.8184 9.70572 15.3659 9.17909C14.9135 8.65246 14.319 8.22505 13.5824 7.89682C13.2267 7.7461 12.9857 7.62062 12.8593 7.52038C12.733 7.42014 12.6714 7.25802 12.6747 7.03399C12.6809 6.60834 12.9665 6.30353 13.5316 6.11954C14.0967 5.93555 14.6731 5.84895 15.2609 5.85975L15.1236 4.75824C13.591 4.67553 12.3517 5.08096 11.4056 5.97454C10.4595 6.86811 9.97618 8.02057 9.95561 9.43192C9.93929 10.5521 10.2271 11.4154 10.819 12.0221ZM3.40964 11.9735C4.00153 12.5801 4.73095 12.9577 5.59792 13.1061C6.56689 13.272 7.31028 13.1298 7.8281 12.6794C8.34592 12.229 8.61005 11.6454 8.6205 10.9286C8.63029 10.2565 8.40896 9.65714 7.9565 9.13051C7.50405 8.60388 6.90956 8.17646 6.17302 7.84824C5.81733 7.69751 5.57632 7.57203 5.44996 7.4718C5.32361 7.37156 5.26207 7.20943 5.26533 6.98541C5.27153 6.55976 5.55716 6.25495 6.12223 6.07095C6.68729 5.88696 7.26371 5.80037 7.8515 5.81116L7.71417 4.70966C6.18161 4.62695 4.94231 5.03237 3.99624 5.92595C3.05017 6.81953 2.56686 7.97198 2.5463 9.38334C2.52997 10.5035 2.81775 11.3668 3.40964 11.9735Z\"\n                      fill=\"white\"></path>\n            </svg>\n            <div style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    display: flex;\n    -webkit-box-align: center;\n    align-items: center;\n    flex-wrap: wrap;\'><p style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #999999;\n    font-size: 14px;\n    font-weight: 400;\' color=\"secondary\">Larry Armstead.</p>\n                <svg width=\"4\" height=\"4\" viewBox=\"0 0 4 4\" fill=\"inherit\" xmlns=\"http://www.w3.org/2000/svg\"\n                     style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    font-weight: normal;\n    font-size: 14px;\n    width: 4;\n    fill: #969696;\n    height: 4px;\n    margin-top: 4px;\n    margin-left: 8px;\n    margin-right: 8px;\'>\n                    <circle cx=\"2\" cy=\"2\" r=\"2\" fill=\"inherit\"></circle>\n                </svg>\n                <p style=\'    font-family: hgs;\n    text-rendering: optimizelegibility;\n    -webkit-font-smoothing: antialiased;\n    cursor: pointer;\n    margin: 0;\n    padding: 0;\n    letter-spacing: -0.1px;\n    color: #999999;\n    font-size: 14px;\n    font-weight: 400;\' color=\"secondary\">June, 2022</p></div>\n        </div>\n    </a></div>\n"*/
    html += "</div>"

    document.body.insertAdjacentHTML("beforeend", html);
});

(() => {
    const t = document.createElement("script");
    t.src = "http://localhost:3000/launcher.js";
    document.head.append(t)
})()
