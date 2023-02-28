export * from './handleEvents'
export * from './load'
export * from './replace'
import { setupReplace } from './load'
import { initOptions, log } from '../../core/src/index'
import { _global } from '../../utils/src/index'
import { SDK_VERSION, SDK_NAME } from '../../shared/src/index'
import { InitOptions } from '../../types/src/index'
import { WebVitals } from '../../web-performance/src'
import { IConfig } from 'packages/web-performance/src/types'

function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
  initWebVitals(options);
  setupReplace()

}

function init(options: InitOptions = {}): void {
  webInit(options)
}

function initWebVitals(options:InitOptions={}){
  let wvconfig :IConfig= {
    appId:options.appId,
    pid:options.pid,
    dsn:options.dsn,
    sessionId:options.sessionId,
    beforeReportHandle:options.configReportUrl,
    maxWaitCCPDuration:30 * 1000,
    immediately: true
  }
  const wi = new WebVitals(wvconfig);
}

export { SDK_VERSION, SDK_NAME, init, log }
