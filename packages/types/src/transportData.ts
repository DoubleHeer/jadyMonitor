import { ERRORTYPES } from '../../shared/src/index'
import { BreadcrumbPushData } from './breadcrumb'
import { DeviceInfo, EActionType } from './track'

export interface AuthInfo {
  pid?: string
  sessionId?: string
  trackKey?: string
  sdkVersion: string
  sdkName: string
  trackerId: string
}

export interface TransportDataType {
  authInfo: AuthInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: FinalReportType
  record?: any[]
  deviceInfo?: DeviceInfo
}

export type FinalReportType = ReportDataType | TrackReportData

interface ICommonDataType {
  // 是否是埋点数据
  isTrackData?: boolean
}

export interface ReportDataType extends ICommonDataType {
  name?: string
  message?: string
  url: string
  errorName?: string
  stack?: any
  creationDate?: number
  errorId?: number
  level: string
  // ajax
  elapsedTime?: number
  request?: {
    httpType?: string
    traceId?: string
    method: string
    reqUrl: string
    reqData: any
  }
  response?: {
    status: number
    repData: string
  }
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 MITO.log
  customTag?: string
}

export interface TrackReportData extends ICommonDataType {
  // uuid
  id?: string
  // 埋点code 一般由人为传进来，可以自定义规范
  trackId?: string
  // 埋点类型
  actionType: EActionType
  // 埋点开始时间
  startTime?: number
  // 埋点停留时间
  durationTime?: number
  // 上报时间
  trackTime?: number
}

export interface PageViewReportData extends ICommonDataType {
  //唯一标识
  name?:string
  // 页面名称
  pagePathName?: string
  // 页面停留时长 ms（最大计算10s）
  pageTime?: number
  // 持续时长
  time?: number
  //记录时间
  creationDate?: number
}

export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (<TrackReportData>data).actionType === undefined && !data.isTrackData
}
