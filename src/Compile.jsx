import jsPDF from 'jspdf'
import { Document, Paragraph, TextRun, HeadingLevel, Packer, PageBreak, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

function Compile({ folders, projectName, projectId }) {

  const getAllDocs = () => {
    const docs = []
    folders.forEach(folder => {
      folder.docs.forEach(doc => {
        const storageKey = projectId && doc.id ? `${projectId}-${doc.id}` : doc.id
        const content = localStorage.getItem(storageKey) || ''
        docs.push({
          id: doc.id,
          name: doc.name,
          folder: folder.name,
          content: content,
        })
      })
    })
    return docs
  }

  const stripHTML = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const compilePDF = () => {
    const docs = getAllDocs()
    const doc = new jsPDF()
    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2
    let y = 20

    // Title page
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.text(projectName || 'Untitled', pageWidth / 2, pageHeight / 2 - 10, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(new Date().getFullYear().toString(), pageWidth / 2, pageHeight / 2 + 10, { align: 'center' })

    docs.forEach((d, i) => {
      doc.addPage()
      y = 20

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      if (y > 260) { doc.addPage(); y = 20 }
      doc.text(d.name, margin, y)
      y += 12

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)

      const plainText = stripHTML(d.content)
      if (plainText.trim()) {
        const lines = doc.splitTextToSize(plainText, maxWidth)
        lines.forEach(line => {
          if (y > 280) { doc.addPage(); y = 20 }
          doc.text(line, margin, y)
          y += 7
        })
      }
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 2; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(`${i - 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      doc.setTextColor(0)
    }

    doc.save(`${projectName || 'Untitled'}.pdf`)
  }

  const compileDOCX = async () => {
    const docs = getAllDocs()
    const children = []

    // Title page
    children.push(
      new Paragraph({
        text: projectName || 'Untitled',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 3000, after: 200 },
      })
    )
    children.push(
      new Paragraph({
        text: new Date().getFullYear().toString(),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    )

    docs.forEach((d, i) => {
      if (i > 0) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        )
      }

      children.push(
        new Paragraph({
          text: d.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      )

      const plainText = stripHTML(d.content)
      if (plainText.trim()) {
        plainText.split('\n').filter(p => p.trim()).forEach(text => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text, size: 24 })],
              spacing: { after: 200 },
            })
          )
        })
      }
    })

    const document = new Document({
      sections: [{ properties: {}, children }],
    })

    const blob = await Packer.toBlob(document)
    saveAs(blob, `${projectName || 'Untitled'}.docx`)
  }

  const compileEPUB = async () => {
    const docs = getAllDocs()
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const docTitle = projectName || 'Untitled'

    zip.file('mimetype', 'application/epub+zip')
    zip.folder('META-INF').file('container.xml',
      `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

    const oebps = zip.folder('OEBPS')

    const manifestItems = docs.map((d, i) =>
      `<item id="chapter${i}" href="chapter${i}.html" media-type="application/xhtml+xml"/>`
    ).join('\n    ')

    const spineItems = docs.map((d, i) =>
      `<itemref idref="chapter${i}"/>`
    ).join('\n    ')

    const navPoints = docs.map((d, i) =>
      `<navPoint id="chapter${i}" playOrder="${i + 2}">
      <navLabel><text>${d.name}</text></navLabel>
      <content src="chapter${i}.html"/>
    </navPoint>`
    ).join('\n    ')

    oebps.file('content.opf',
      `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${docTitle}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="uid">storytelling-${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="titlepage" href="titlepage.html" media-type="application/xhtml+xml"/>
    ${manifestItems}
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="titlepage"/>
    ${spineItems}
  </spine>
</package>`)

    oebps.file('toc.ncx',
      `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="storytelling-${Date.now()}"/>
  </head>
  <docTitle><text>${docTitle}</text></docTitle>
  <navMap>
    <navPoint id="titlepage" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="titlepage.html"/>
    </navPoint>
    ${navPoints}
  </navMap>
</ncx>`)

    oebps.file('titlepage.html',
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${docTitle}</title>
  <style>
    body { font-family: Georgia, serif; text-align: center; margin-top: 40%; }
    h1 { font-size: 2em; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>${docTitle}</h1>
  <p>${new Date().getFullYear()}</p>
</body>
</html>`)

    docs.forEach((d, i) => {
      oebps.file(`chapter${i}.html`,
        `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${d.name}</title>
  <style>
    body { font-family: Georgia, serif; font-size: 1em; line-height: 1.8; margin: 2em; }
    h1 { font-size: 1.8em; margin-bottom: 0.5em; }
    h2 { font-size: 1.4em; margin-bottom: 0.4em; }
    p { margin-bottom: 0.8em; }
  </style>
</head>
<body>
  <h1>${d.name}</h1>
  ${d.content || '<p>No content yet.</p>'}
</body>
</html>`)
    })

    const blob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip',
    })
    saveAs(blob, `${docTitle}.epub`)
  }

  return { compilePDF, compileDOCX, compileEPUB }
}

export default Compile