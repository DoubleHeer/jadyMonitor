import { IMetrics, IReportHandler, IReportData, IMetricsObj } from '../types'

/**
 * @param {string} sessionId
 * @param {string} pid
 * @param {string} appId
 * @param {string} version
 * @param {Function} callback
 * @returns {IReportHandler}
 */
const createReporter =
  (sessionId: string, pid: string, appId: string, version: string, callback: Function): IReportHandler =>
  (data: IMetrics | IMetricsObj) => {
    const reportData: IReportData = {
      sessionId,
      pid,
      appId,
      version,
      data,
      timestamp: +new Date()
    }

    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(
        () => {
          callback(reportData)
        },
        { timeout: 3000 }
      )
    } else {
      callback(reportData)
    }
  }

export default createReporter
