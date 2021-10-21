/**
 * Saves file to disk. Data is passed as string
 * @param {string} filename
 * @param {string}data
 */
export function saveFile(filename, data) {
  const blob = new Blob([data], {type: 'text/csv'});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigator: any = window.navigator;
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}
