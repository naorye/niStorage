document.addEventListener('niStorage:ready', async function (event) {
    // Ready to use niStorage
    const storage = event.detail;
    console.log("before get")
    let history = await storage.getItem("ni-history") || [];
    console.log("after get")
    let verticalId = window?.eventTrackerAttributes?.userParams?.verticalId || '';
    console.log('verticalId', verticalId)

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
        if (verticalId === '') {
            verticalId = historyVerticalId;
        }
    }
    const value = {
        vertical_id: verticalId,
        history_verticals_ids: historyVerticalsIds
    };
    console.log('send ', value);
    const response = fetch('http://localhost/rts_recommend', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })
    const responseJson = await (await response).json();
    if(responseJson.vertical_names && responseJson.vertical_names.length > 0) {
        let html = "<div style=\'position: fixed; bottom: 0; right: 0; z-index: 9999999; width: 331px; background: #FFFFFF; border-radius: 5px;border: 1px solid #d5d5d5;\'>\n    " +
            "<h3 style='font-style: normal;font-weight: 600;font-size: 24px;line-height: 29px;color: #000000; text-align: center;'>You may also like</h3>"

        for (const description of responseJson.vertical_names) {
            const link = 'http://ni.com'
            html += "<div style='margin: 10px'>" +
                description +
                "<a href='" + link +
                "' style='text-decoration: none; color: white; width: 156px;height: 40px;background: #FF4A64;border-radius: 5px;display: block;text-align: center;line-height: 40px;'>Visit Site</a>" +
                "</div>"
        }

        html += "</div>"

        document.body.insertAdjacentHTML("beforeend", html);
    }
});

(() => {
    const t = document.createElement("script");
    t.src = "http://localhost:3000/launcher.js";
    document.head.append(t)
})()
