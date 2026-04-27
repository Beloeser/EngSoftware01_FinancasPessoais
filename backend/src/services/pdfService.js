import PDFDocument from "pdfkit";

export const pdfService = {
  generateTransactionReport(transactions) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Cabeçalho do Documento
        doc.fontSize(20).text("Relatório de Transações", { align: "center" });
        doc.moveDown();
        doc
          .fontSize(10)
          .text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, {
            align: "center",
          });
        doc.moveDown(2);

        // Lista de Transações
        if (transactions.length === 0) {
          doc
            .fontSize(12)
            .text("Nenhuma transação encontrada para os filtros aplicados.", {
              align: "center",
            });
        } else {
          transactions.forEach((t) => {
            // Formatação
            const typeLabel = t.type === "income" ? "Ganho" : "Despesa";
            const dateStr = new Date(t.date).toLocaleDateString("pt-BR");
            const amountStr = parseFloat(t.amount).toFixed(2).replace(".", ",");

            doc
              .fontSize(12)
              .font("Helvetica-Bold")
              .text(`${dateStr} - ${t.description}`);
            doc
              .font("Helvetica")
              .text(`Tipo: ${typeLabel} | Valor: R$ ${amountStr}`);
            doc.moveDown();
          });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },
};
