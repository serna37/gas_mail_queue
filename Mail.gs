function exe() {
  delTrig()
  const SHEET_ID = 'XXXXXXXXXXXXXXX'
  let sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('xxxxx')
  let getVal = cell => sheet.getRange(cell).getValue()

  let lastRow = sheet.getLastRow()
  // キューなし
  if (lastRow === 1) {
    Logger.log('no queue')
    return
  }
  // 2行目から下のキューを送信
  [...Array(lastRow - 1)].map((_, i) => i + 2).map(r => {

    // 1. セルから値を取得
    let to = getVal(`A${r}`)
    let cc = getVal(`B${r}`)
    let subject = getVal(`C${r}`)
    let body = getVal(`D${r}`)
    let attNm = getVal(`E${r}`)

    // 2. 指定されている場合、添付ファイルを取得する
    let attF = ""
    let attFId = ""
    if (attNm !== "") {
      const files = DriveApp.getFolderById('XXXXXXXXXXXXXXXX').getFiles()
      while (files.hasNext()) {
        let file = files.next()
        if (file.getName() === attNm) { // ファイル名で最初に一致したものを添付. ファイル名称は一意でないので、命名に注意
          attF = DriveApp.getFileById(attFId = file.getId()).getBlob()
          break
        }
      }
    }

    // 3. 送信
    let options = {cc: cc, name: 'おしらせbot'}
    if (attF !== "") { options.attachments = attF }
    if (attF !== "" && attNm.endsWith("png") || attNm.endsWith("jpg")) {
      body = body.replaceAll('\n', '<br>')
      body += `<br><img src='cid:inlineImg' style="width: 100%;">`
      options["htmlBody"] = body
      options["inlineImages"] = { inlineImg: attF }
    }

    GmailApp.sendEmail(to, subject, body, options)
    Logger.log(`send queue row#${r}`)

    // 4. 添付ファイル、キューを削除
    if (attFId !== "") {
      DriveApp.getFileById(attFId).setTrashed(true)
    }
    sheet.getRange(`A${r}:E${r}`).clearContent()
  })
}

