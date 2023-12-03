const { PDFDocument, rgb} = require('pdf-lib');
const fs = require('fs');
async function createGridPDF(ord,pg,date){
  // Create a new PDF document
  a=0;
  const pdfDoc = await PDFDocument.create();
  console.log(ord.length);
  while(a<ord.length){
  const page = pdfDoc.addPage();

  // Define grid properties
  const columns = 4;
  const rows = 6;
  const cellWidth = page.getWidth() / columns;
  const cellHeight = page.getHeight() / rows;

  // Add content to each cell in the grid
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < columns; ++j) {
      const cellX = j * cellWidth;
      const cellY = page.getHeight() - (i + 1) * cellHeight;
      if(a==ord.length){
        break;
      }
      page.drawRectangle({
        x: cellX + 2, // Adjusting for border width
        y: cellY + 2, // Adjusting for border width
        width: cellWidth - 4, // Adjusting for border width
        height: cellHeight - 4, // Adjusting for border width
        borderColor: rgb(0, 0, 0), // Black color for border
        borderWidth: 2, // Border width
        color: rgb(1,1,1), // Cell color
      });

      // Add text to the cell
      console.log(ord[a],'j');
      console.log(a);
      const text =`${ord[a]['id']}`;
      var yx=cellY + cellHeight - 40;
      page.drawText(text, {
        x: cellX + 10,
        y: yx,
        size: 12,
        color: rgb(0, 0, 0),
      });
      const detail =`\nName:${ord[a]['n']}\nMob No: ${ord[a]['ph']}\nPg :${pg[a]['pg']}`;
      page.drawText(detail, {
        x: cellX + 12,
        y: yx,
        size: 10,
        color: rgb(0, 0, 0),
      });
      a++;
    }
    if(a==ord.length){
        break;
      }
  }
}

  // Save the PDF to a file
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('labels/'+date+'.pdf', pdfBytes);
};

// Generate the PDF
//createGridPDF().catch((err) => console.log(err)) createGridPDF;

module.exports={
    label:createGridPDF
}