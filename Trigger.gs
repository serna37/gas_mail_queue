/**
 * ★トリガーの呼ばれ方
 * 「ignite」関数をスプシで呼ぶと
 * 引数セルが更新されたタイミングで
 * 「exe」関数が実行される。
 * 
 * ★機能実装の方法
 * 「exe」関数にて機能を実装する。
 * exe関数冒頭でdelTrig関数を実行すること
 */
/** トリガー設定 */
const TRIGGER_FUNCTION = 'exe'
const TRIGGER_KEY = 'mail_trigger_key'
const RETRY_DELAY = 10 * 1000
/** トリガーセット */
const setTrig = () => ScriptApp.newTrigger(TRIGGER_FUNCTION).timeBased().after(RETRY_DELAY).create().getUniqueId()
/** トリガー削除 */
const delTrig = () => {
  let triggers = ScriptApp.getProjectTriggers()
  if (triggers.length === 0) {
    Logger.log(`削除対象のトリガーidがない`)
    return
  }
  triggers.forEach(v => {
    Logger.log(`トリガーを削除 id: ${v.getUniqueId()}`)
    ScriptApp.deleteTrigger(v)
  })
}
/** キック処理 シート編集で起動 */
function ignite(flg) {
  if (flg === 'ok') setTrig()
  // SpreadsheetApp.getActiveSheet().getRange('F1').setValue('done') 本当はこうしたいが、
  // Exception: You do not have permission to call setValue（行 32）が発生しました。
  // になる
  return 'regist'
}

