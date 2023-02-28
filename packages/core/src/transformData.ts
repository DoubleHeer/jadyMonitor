import { BREADCRUMBTYPES, ERRORTYPES, globalVar } from '../../shared/src/index'
import { getLocationHref, getTimestamp, Severity, fromHttpStatus, SpanStatus, interceptStr } from '../../utils/src/index'
import { ReportDataType, MITOHttp, Replace, ResourceErrorTarget } from '../../types/src/index'
import { getRealPath } from './errorId'
import { breadcrumb } from './breadcrumb'

export function httpTransform(data: MITOHttp): ReportDataType {
  let message = ''
  const { elapsedTime, timestamp, method, traceId, type, status } = data
  const errorName = `${type}--${method}`
  if (status === 0) {
    message =
      elapsedTime <= globalVar.crossOriginThreshold ? 'http请求失败，失败原因：跨域限制或域名不存在' : 'http请求失败，失败原因：超时'
  } else {
    message = fromHttpStatus(status)
  }
  message = message === SpanStatus.Ok ? message : `${message} ${getRealPath(data.url)}`
  return {
    name: ERRORTYPES.FETCH_ERROR,
    url: getLocationHref(),
    timestamp,
    elapsedTime,
    level: Severity.Low,
    message,
    errorName,
    request: {
      httpType: type,
      traceId,
      method,
      reqUrl: data.url,
      reqData: data.reqData || ''
    },
    response: {
      status,
      repData: data.responseText
    }
  }
}

const resourceMap = {
  img: '图片',
  script: 'js脚本'
}

export function resourceTransform(target: ResourceErrorTarget): ReportDataType {
  return {
    name: ERRORTYPES.RESOURCE_ERROR,
    url: getLocationHref(),
    message: '资源地址: ' + (interceptStr(target.src, 120) || interceptStr(target.href, 120)),
    level: Severity.Low,
    timestamp: getTimestamp(),
    errorName: `${resourceMap[target.localName] || target.localName}加载失败`
  }
}

export function handleConsole(data: Replace.TriggerConsole): void {
  if (globalVar.isLogAddBreadcrumb) {
    breadcrumb.push({
      type: BREADCRUMBTYPES.CONSOLE,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.CONSOLE),
      data,
      level: Severity.fromString(data.level)
    })
  }
}
