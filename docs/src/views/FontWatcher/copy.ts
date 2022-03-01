export /** 复制文本函数 */
const copy = (Info: string) => {
    const el = document.createElement("textarea");
    el.value = Info;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
        document.getSelection()!.rangeCount > 0
            ? document.getSelection()!.getRangeAt(0)
            : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
        document.getSelection()!.removeAllRanges();
        document.getSelection()!.addRange(selected);
    }
};
