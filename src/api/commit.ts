import { DataNotify } from "."
import { github } from "./GithubNotify"

export const addFontRequest = (props: {
    nickName: string,
    fontName: string
    detail: string
    url: string
}) => {
    const head = [props.nickName, props.fontName].join(' | ')
    return DataNotify({
        title: "【添加字体】" + props.fontName,
        body: `${head} \n${props.detail}`,
        labels: ['添加字体']
    }, github)
}
export const addShowCaseRequest = (props: {
    nickName: string,
    showCaseName: string
    detail: string
    url: string
}) => {
    const head = [props.nickName, props.showCaseName].join(' | ')
    return DataNotify({
        title: "【添加灵感网站】" + props.showCaseName,
        body: `${head} \n${props.detail}`,
        labels: ['添加灵感网站']
    }, github)
}
