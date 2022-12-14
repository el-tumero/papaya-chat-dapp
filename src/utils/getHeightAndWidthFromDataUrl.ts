// https://stackoverflow.com/a/64268847/18337551
const getHeightAndWidthFromDataUrl = (dataURL:string) => new Promise<{height:number, width:number}>(resolve=> {
    const img = new Image()
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      })
    }
    img.src = dataURL
  })

export default getHeightAndWidthFromDataUrl