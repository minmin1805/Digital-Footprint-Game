import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Captures a React/HTML element and downloads it as a PDF.
 * @param {HTMLElement} element - The DOM element to capture (e.g. the PdfChecklist wrapper)
 */
export async function captureElementAsPdf(element) {
  if (!element) return
  const target = element.firstElementChild || element
  const canvas = await html2canvas(target, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: 'rgb(250, 248, 240)',
    onclone: (_clonedDoc, clonedNode) => {
      // Fix html2canvas text spacing
      const root = clonedNode.querySelector('.pdf-checklist-root') || clonedNode
      if (root?.style) {
        root.style.letterSpacing = '0.03em'
        root.style.fontFamily = 'Helvetica, Arial, sans-serif'
        root.style.wordSpacing = '0.05em'
      }
    },
  })
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const pdfW = pdf.internal.pageSize.getWidth()
  const pdfH = pdf.internal.pageSize.getHeight()

  const imgW = pdfW
  const imgH = pdfW * (canvas.height / canvas.width)
  const pageCount = Math.ceil(imgH / pdfH)

  const pageHeightPx = (pdfH / pdfW) * canvas.width
  for (let i = 0; i < pageCount; i++) {
    if (i > 0) pdf.addPage()
    const sy = i * pageHeightPx
    const sh = Math.min(pageHeightPx, canvas.height - sy)
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = sh
    const ctx = pageCanvas.getContext('2d')
    ctx.fillStyle = 'rgb(250, 248, 240)'
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh)
    const pageImgData = pageCanvas.toDataURL('image/png')
    const pageImgH = pdfH * (sh / pageHeightPx)
    pdf.addImage(pageImgData, 'PNG', 0, 0, imgW, pageImgH)
  }

  pdf.save('digital-footprint-detective-checklist.pdf')
}
