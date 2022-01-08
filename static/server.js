const reloadInterval = 1000;
const maxFailCount = 5;

async function startReloadInterval() {
    const fetchVersion = () => fetch("./version").then(response => response.text());
    const version = await fetchVersion();
    let failedCount = 0;
    let intervalToken;

    function reloadIfChanged() {
        fetchVersion()
            .then(newVersion => {
                if (version != newVersion) {
                    window.location.reload();
                }
            })
            .catch(e => {
                failedCount += 1;
                if (failedCount >= maxFailCount) {
                    clearInterval(intervalToken);
                    console.warn("Server disconnected");
                }
            });
    }

    intervalToken = setInterval(reloadIfChanged, reloadInterval)
}

export async function initializeWasmServer() {
    await startReloadInterval();
    console.info("Ready to reload on change");
}

