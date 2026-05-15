import dayjs from "dayjs";
import type { Customer, Product } from "../App";
import { companyDetails } from "./companyDetails";

interface PrintProductBillArgs {
  customer: Customer;
  product: Product;
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatCurrency = (value: number) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const printProductBill = ({ customer, product }: PrintProductBillArgs) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    return false;
  }

  const invoiceNumber = `JM-${customer.id.slice(-5)}-${product.id.slice(-5)}`.toUpperCase();
  const invoiceDate = dayjs().format("DD MMM YYYY");
  const purchaseDate = product.purchaseDate
    ? dayjs(product.purchaseDate).format("DD MMM YYYY")
    : "-";

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Bill ${escapeHtml(invoiceNumber)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
            background: #ffffff;
          }
          .bill {
            max-width: 820px;
            margin: 0 auto;
            border: 1px solid #d1d5db;
            padding: 28px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 2px solid #111827;
            padding-bottom: 18px;
          }
          .company h1 {
            margin: 0 0 8px;
            font-size: 28px;
            letter-spacing: 0;
            text-transform: uppercase;
          }
          .muted {
            color: #4b5563;
            font-size: 13px;
            line-height: 1.55;
          }
          .invoice-title {
            text-align: right;
            min-width: 220px;
          }
          .invoice-title h2 {
            margin: 0 0 10px;
            font-size: 24px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-top: 24px;
          }
          .box {
            border: 1px solid #e5e7eb;
            padding: 14px;
            min-height: 128px;
          }
          .box h3 {
            margin: 0 0 10px;
            font-size: 14px;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
          }
          th,
          td {
            border: 1px solid #d1d5db;
            padding: 11px;
            text-align: left;
            vertical-align: top;
            font-size: 14px;
          }
          th {
            background: #f3f4f6;
            font-size: 12px;
            text-transform: uppercase;
          }
          .amount {
            text-align: right;
            white-space: nowrap;
          }
          .totals {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
          .totals table {
            width: 360px;
            margin-top: 0;
          }
          .totals td:first-child {
            font-weight: 700;
          }
          .grand-total td {
            background: #111827;
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-top: 48px;
            color: #374151;
            font-size: 13px;
          }
          .signature {
            min-width: 220px;
            border-top: 1px solid #111827;
            padding-top: 8px;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .bill { border: 0; }
          }
        </style>
      </head>
      <body>
        <main class="bill">
          <section class="header">
            <div class="company">
              <h1>${escapeHtml(companyDetails.name)}</h1>
              <div class="muted">
                <div>${escapeHtml(companyDetails.address)}</div>
                <div>GSTIN: ${escapeHtml(companyDetails.gstin)}</div>
                ${
                  companyDetails.phone
                    ? `<div>Phone: ${escapeHtml(companyDetails.phone)}</div>`
                    : ""
                }
                ${
                  companyDetails.email
                    ? `<div>Email: ${escapeHtml(companyDetails.email)}</div>`
                    : ""
                }
              </div>
            </div>
            <div class="invoice-title">
              <h2>TAX INVOICE</h2>
              <div class="muted">
                <div><strong>Invoice No:</strong> ${escapeHtml(invoiceNumber)}</div>
                <div><strong>Invoice Date:</strong> ${escapeHtml(invoiceDate)}</div>
              </div>
            </div>
          </section>

          <section class="grid">
            <div class="box">
              <h3>Bill To</h3>
              <div class="muted">
                <div><strong>${escapeHtml(customer.name)}</strong></div>
                <div>${escapeHtml(customer.company)}</div>
                <div>${escapeHtml(customer.phone)}</div>
                <div>${escapeHtml(customer.email)}</div>
              </div>
            </div>
            <div class="box">
              <h3>Payment Summary</h3>
              <div class="muted">
                <div><strong>Purchase Date:</strong> ${escapeHtml(purchaseDate)}</div>
                <div><strong>Status:</strong> ${escapeHtml(customer.status)}</div>
                <div><strong>Paid:</strong> ${escapeHtml(formatCurrency(product.paid))}</div>
                <div><strong>Pending:</strong> ${escapeHtml(formatCurrency(product.pending))}</div>
              </div>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${escapeHtml(product.name)}</td>
                <td>N/A</td>
                <td>1</td>
                <td class="amount">${escapeHtml(formatCurrency(product.value))}</td>
              </tr>
            </tbody>
          </table>

          <section class="totals">
            <table>
              <tbody>
                <tr>
                  <td>Total Amount</td>
                  <td class="amount">${escapeHtml(formatCurrency(product.value))}</td>
                </tr>
                <tr>
                  <td>Paid Amount</td>
                  <td class="amount">${escapeHtml(formatCurrency(product.paid))}</td>
                </tr>
                <tr class="grand-total">
                  <td>Balance Due</td>
                  <td class="amount">${escapeHtml(formatCurrency(product.pending))}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="footer">
            <div>
              <strong>Terms:</strong>
              <div class="muted">This is a computer-generated invoice for the product purchased.</div>
            </div>
            <div class="signature">Authorised Signatory</div>
          </section>
        </main>
        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();

  return true;
};
