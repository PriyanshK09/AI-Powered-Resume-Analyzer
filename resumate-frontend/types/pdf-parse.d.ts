declare module 'pdf-parse' {
  interface PDFInfo {
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }
  function pdf(dataBuffer: Buffer, options?: any): Promise<PDFInfo>
  export default pdf
}