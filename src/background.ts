chrome.webNavigation.onHistoryStateUpdated.addListener(
    async (details) => {
        await chrome.tabs.sendMessage(details.tabId, {
            message: 'urlChanged',
            newUrl: details.url,
        });
    },
    {
        url: [
            {
                hostEquals: 'www.youtube.com',
            },
        ],
    },
);
