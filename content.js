chrome.runtime.onMessage.addListener(function (req, sender, cb) {
    if (req.type === "getProjectId") {
        const projectId = document.body.innerHTML.match(/Project ID: (\d+)/)[1] || 0;
        cb(projectId);
    }
});
