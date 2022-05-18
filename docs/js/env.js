// 当用户返回的时候刷新页面
window.location.host.split(":")[0] === "127.0.0.1" &&
    document.addEventListener("visibilitychange", function () {
        console.log(document.visibilityState);
        if (document.visibilityState === "visible") {
            globalThis.location.reload();
        }
    });
