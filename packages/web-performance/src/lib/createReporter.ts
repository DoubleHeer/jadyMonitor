import { IMetrics, IReportHandler, IReportData, IMetricsObj } from '../types'
import { analyseReoprtData,encodeURIParams} from '../../../utils/src/index'
/**
 * @param {string} sessionId
 * @param {string} pid
 * @param {string} appId
 * @param {string} version
 * @param {Function} beforeReportHCall
 * @returns {IReportHandler}
 */
const createReporter =
  (sessionId: string, pid: string, appId: string, dsn: string, beforeReportHCall: Function): IReportHandler =>
  (data: IMetrics | IMetricsObj) => {
    const reportData: IReportData = {
      sessionId,
      pid,
      appId,
      data,
      timestamp: +new Date()
    }
    if(!beforeReportHCall)return

    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(
        () => {
          var backData= beforeReportHCall(reportData,dsn)
          if(!backData)return
          const repData = analyseReoprtData(reportData,backData);
          const repDataString = encodeURIParams(repData);
          imgRequest(repDataString, dsn) 
        },
        { timeout: 3000 }
      )
    } else {
      var backData= beforeReportHCall(reportData,dsn)
      if(!backData)return
      const repData = analyseReoprtData(reportData,backData);
      const repDataString = encodeURIParams(repData);
      imgRequest(repDataString, dsn) 
      
    }
  }

 function imgRequest(data: string, url: string): void {
      let img = new Image()
      img.src = `${url}${data}`
      img = null
}
export default createReporter
