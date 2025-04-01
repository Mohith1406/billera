
import React from "react";
import { InvoiceData } from "@/contexts/InvoiceContext";

type TemplateProps = {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number) => string;
  innerRef?: React.RefObject<HTMLDivElement>;
};

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ invoiceData, formatCurrency, innerRef }) => {
  return (
    <div 
      ref={innerRef} 
      className="bg-white p-8 shadow-md rounded-md"
    >
      <div className="flex justify-between mb-8">
        <div>
          {invoiceData.businessInfo.logo ? (
            <img 
              src={invoiceData.businessInfo.logo} 
              alt="Business Logo" 
              className="h-16 mb-4 object-contain"
            />
          ) : (
            <div className="h-16 mb-4 font-bold text-xl text-primary">
              {invoiceData.businessInfo.name || "Your Business Name"}
            </div>
          )}
          <div className="text-sm space-y-1">
            <p className="font-semibold">{invoiceData.businessInfo.name || "Your Business Name"}</p>
            <p>{invoiceData.businessInfo.address || "Business Address"}</p>
            <p>
              {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
              {invoiceData.businessInfo.state || ""}
              {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
            </p>
            <p>{invoiceData.businessInfo.country || ""}</p>
            <p>{invoiceData.businessInfo.phone || ""}</p>
            <p>{invoiceData.businessInfo.email || ""}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary mb-4">INVOICE</div>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
            <p><span className="font-semibold">Date:</span> {invoiceData.invoiceDate}</p>
            <p><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="font-semibold mb-2">Bill To:</div>
        <div className="text-sm space-y-1">
          <p className="font-semibold">{invoiceData.clientInfo.name || "Client Name"}</p>
          <p>{invoiceData.clientInfo.address || "Client Address"}</p>
          <p>
            {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
            {invoiceData.clientInfo.state || ""}
            {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
          </p>
          <p>{invoiceData.clientInfo.country || ""}</p>
          <p>{invoiceData.clientInfo.phone || ""}</p>
          <p>{invoiceData.clientInfo.email || ""}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="bg-muted/30 border-t border-b">
            {invoiceData.columnVisibility.description && <th className="text-left py-2 px-2">Description</th>}
            {invoiceData.columnVisibility.quantity && <th className="text-right py-2 px-2">Qty</th>}
            {invoiceData.columnVisibility.unitPrice && <th className="text-right py-2 px-2">Price</th>}
            {invoiceData.columnVisibility.taxRate && <th className="text-right py-2 px-2">Tax %</th>}
            {invoiceData.columnVisibility.discount && <th className="text-right py-2 px-2">Disc %</th>}
            {invoiceData.columnVisibility.category && <th className="text-left py-2 px-2">Category</th>}
            {invoiceData.columnVisibility.total && <th className="text-right py-2 px-2">Total</th>}
          </tr>
        </thead>
        <tbody>
          {invoiceData.lineItems.length > 0 ? (
            invoiceData.lineItems.map((item) => (
              <tr key={item.id} className="border-b">
                {invoiceData.columnVisibility.description && <td className="py-2 px-2">{item.description}</td>}
                {invoiceData.columnVisibility.quantity && <td className="py-2 px-2 text-right">{item.quantity}</td>}
                {invoiceData.columnVisibility.unitPrice && <td className="py-2 px-2 text-right">{formatCurrency(item.unitPrice)}</td>}
                {invoiceData.columnVisibility.taxRate && <td className="py-2 px-2 text-right">{item.taxRate}%</td>}
                {invoiceData.columnVisibility.discount && <td className="py-2 px-2 text-right">{item.discount}%</td>}
                {invoiceData.columnVisibility.category && <td className="py-2 px-2">{item.category || "-"}</td>}
                {invoiceData.columnVisibility.total && <td className="py-2 px-2 text-right">{formatCurrency(item.total)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                className="py-4 text-center text-muted-foreground"
              >
                No items to display
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discountTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Discount:</span>
              <span>-{formatCurrency(invoiceData.discountTotal)}</span>
            </div>
          )}
          {invoiceData.taxTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>{formatCurrency(invoiceData.taxTotal)}</span>
            </div>
          )}
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total:</span>
            <span>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-4 mt-8 text-sm">
          {invoiceData.notes && (
            <div>
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-muted-foreground">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <h3 className="font-semibold mb-1">Terms & Conditions</h3>
              <p className="text-muted-foreground">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ModernTemplate: React.FC<TemplateProps> = ({ invoiceData, formatCurrency, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-white p-8 shadow-md rounded-md"
    >
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          {invoiceData.businessInfo.logo ? (
            <img 
              src={invoiceData.businessInfo.logo} 
              alt="Business Logo" 
              className="h-16 mb-4 object-contain"
            />
          ) : (
            <div className="h-16 mb-4 font-bold text-xl text-primary">
              {invoiceData.businessInfo.name || "Your Business Name"}
            </div>
          )}
          <div className="text-sm space-y-1">
            <p className="font-semibold">{invoiceData.businessInfo.name || "Your Business Name"}</p>
            <p>{invoiceData.businessInfo.address || "Business Address"}</p>
            <p>
              {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
              {invoiceData.businessInfo.state || ""}
              {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
            </p>
            <p>{invoiceData.businessInfo.country || ""}</p>
            <p>{invoiceData.businessInfo.phone || ""}</p>
            <p>{invoiceData.businessInfo.email || ""}</p>
          </div>
        </div>
        <div className="bg-primary/10 p-4 rounded-md">
          <div className="text-2xl font-bold text-primary mb-4">INVOICE</div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Invoice Number:</span>
              <span>{invoiceData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{invoiceData.invoiceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Due Date:</span>
              <span>{invoiceData.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="font-semibold mb-2 text-primary">Bill To:</div>
          <div className="text-sm space-y-1">
            <p className="font-semibold">{invoiceData.clientInfo.name || "Client Name"}</p>
            <p>{invoiceData.clientInfo.address || "Client Address"}</p>
            <p>
              {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
              {invoiceData.clientInfo.state || ""}
              {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
            </p>
            <p>{invoiceData.clientInfo.country || ""}</p>
            <p>{invoiceData.clientInfo.phone || ""}</p>
            <p>{invoiceData.clientInfo.email || ""}</p>
          </div>
        </div>
        <div></div>
      </div>

      <div className="overflow-hidden rounded-md mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              {invoiceData.columnVisibility.description && <th className="text-left py-3 px-4 font-medium">Description</th>}
              {invoiceData.columnVisibility.quantity && <th className="text-right py-3 px-4 font-medium">Qty</th>}
              {invoiceData.columnVisibility.unitPrice && <th className="text-right py-3 px-4 font-medium">Price</th>}
              {invoiceData.columnVisibility.taxRate && <th className="text-right py-3 px-4 font-medium">Tax %</th>}
              {invoiceData.columnVisibility.discount && <th className="text-right py-3 px-4 font-medium">Disc %</th>}
              {invoiceData.columnVisibility.category && <th className="text-left py-3 px-4 font-medium">Category</th>}
              {invoiceData.columnVisibility.total && <th className="text-right py-3 px-4 font-medium">Total</th>}
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.length > 0 ? (
              invoiceData.lineItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {invoiceData.columnVisibility.description && <td className="py-3 px-4">{item.description}</td>}
                  {invoiceData.columnVisibility.quantity && <td className="py-3 px-4 text-right">{item.quantity}</td>}
                  {invoiceData.columnVisibility.unitPrice && <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>}
                  {invoiceData.columnVisibility.taxRate && <td className="py-3 px-4 text-right">{item.taxRate}%</td>}
                  {invoiceData.columnVisibility.discount && <td className="py-3 px-4 text-right">{item.discount}%</td>}
                  {invoiceData.columnVisibility.category && <td className="py-3 px-4">{item.category || "-"}</td>}
                  {invoiceData.columnVisibility.total && <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.total)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                  className="py-4 text-center text-muted-foreground"
                >
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-72 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discountTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Discount:</span>
              <span>-{formatCurrency(invoiceData.discountTotal)}</span>
            </div>
          )}
          {invoiceData.taxTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>{formatCurrency(invoiceData.taxTotal)}</span>
            </div>
          )}
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between py-2 font-bold text-primary">
            <span>Total:</span>
            <span>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="grid grid-cols-2 gap-6 mt-8 text-sm">
          {invoiceData.notes && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-1 text-primary">Notes</h3>
              <p className="text-muted-foreground">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-1 text-primary">Terms & Conditions</h3>
              <p className="text-muted-foreground">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8 text-sm text-gray-500">
        Thank you for your business!
      </div>
    </div>
  );
};

export const ClassicTemplate: React.FC<TemplateProps> = ({ invoiceData, formatCurrency, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-white p-8 shadow-md border border-gray-300"
    >
      <div className="text-center mb-8 border-b border-gray-300 pb-4">
        <div className="text-3xl font-bold mb-4">INVOICE</div>
        
        {invoiceData.businessInfo.logo ? (
          <img 
            src={invoiceData.businessInfo.logo} 
            alt="Business Logo" 
            className="h-16 mb-4 mx-auto object-contain"
          />
        ) : (
          <div className="h-16 mb-4 font-bold text-xl">
            {invoiceData.businessInfo.name || "Your Business Name"}
          </div>
        )}
        
        <div className="text-sm">
          <p className="font-semibold">{invoiceData.businessInfo.name || "Your Business Name"}</p>
          <p>{invoiceData.businessInfo.address || "Business Address"}</p>
          <p>
            {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
            {invoiceData.businessInfo.state || ""}
            {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
          </p>
          <p>{invoiceData.businessInfo.country || ""}</p>
          <p>{invoiceData.businessInfo.phone || ""}</p>
          <p>{invoiceData.businessInfo.email || ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-8">
        <div>
          <h3 className="font-bold mb-2 uppercase text-sm">Bill To:</h3>
          <div className="text-sm space-y-1">
            <p className="font-semibold">{invoiceData.clientInfo.name || "Client Name"}</p>
            <p>{invoiceData.clientInfo.address || "Client Address"}</p>
            <p>
              {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
              {invoiceData.clientInfo.state || ""}
              {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
            </p>
            <p>{invoiceData.clientInfo.country || ""}</p>
            <p>{invoiceData.clientInfo.phone || ""}</p>
            <p>{invoiceData.clientInfo.email || ""}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm space-y-1">
            <p><span className="font-bold">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
            <p><span className="font-bold">Date:</span> {invoiceData.invoiceDate}</p>
            <p><span className="font-bold">Due Date:</span> {invoiceData.dueDate}</p>
          </div>
        </div>
      </div>

      <table className="w-full text-sm mb-8 border border-gray-300">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100">
            {invoiceData.columnVisibility.description && <th className="text-left py-2 px-4 border-r border-gray-300">Description</th>}
            {invoiceData.columnVisibility.quantity && <th className="text-right py-2 px-4 border-r border-gray-300">Qty</th>}
            {invoiceData.columnVisibility.unitPrice && <th className="text-right py-2 px-4 border-r border-gray-300">Price</th>}
            {invoiceData.columnVisibility.taxRate && <th className="text-right py-2 px-4 border-r border-gray-300">Tax %</th>}
            {invoiceData.columnVisibility.discount && <th className="text-right py-2 px-4 border-r border-gray-300">Disc %</th>}
            {invoiceData.columnVisibility.category && <th className="text-left py-2 px-4 border-r border-gray-300">Category</th>}
            {invoiceData.columnVisibility.total && <th className="text-right py-2 px-4">Total</th>}
          </tr>
        </thead>
        <tbody>
          {invoiceData.lineItems.length > 0 ? (
            invoiceData.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                {invoiceData.columnVisibility.description && <td className="py-2 px-4 border-r border-gray-300">{item.description}</td>}
                {invoiceData.columnVisibility.quantity && <td className="py-2 px-4 text-right border-r border-gray-300">{item.quantity}</td>}
                {invoiceData.columnVisibility.unitPrice && <td className="py-2 px-4 text-right border-r border-gray-300">{formatCurrency(item.unitPrice)}</td>}
                {invoiceData.columnVisibility.taxRate && <td className="py-2 px-4 text-right border-r border-gray-300">{item.taxRate}%</td>}
                {invoiceData.columnVisibility.discount && <td className="py-2 px-4 text-right border-r border-gray-300">{item.discount}%</td>}
                {invoiceData.columnVisibility.category && <td className="py-2 px-4 border-r border-gray-300">{item.category || "-"}</td>}
                {invoiceData.columnVisibility.total && <td className="py-2 px-4 text-right">{formatCurrency(item.total)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                className="py-4 text-center text-muted-foreground"
              >
                No items to display
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64 border border-gray-300">
          <div className="flex justify-between py-2 px-4 border-b border-gray-300">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discountTotal > 0 && (
            <div className="flex justify-between py-2 px-4 border-b border-gray-300">
              <span>Discount:</span>
              <span>-{formatCurrency(invoiceData.discountTotal)}</span>
            </div>
          )}
          {invoiceData.taxTotal > 0 && (
            <div className="flex justify-between py-2 px-4 border-b border-gray-300">
              <span>Tax:</span>
              <span>{formatCurrency(invoiceData.taxTotal)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 px-4 bg-gray-100 font-bold">
            <span>Total:</span>
            <span>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-4 mt-8 text-sm border-t border-gray-300 pt-4">
          {invoiceData.notes && (
            <div>
              <h3 className="font-bold mb-1 uppercase">Notes</h3>
              <p className="text-muted-foreground">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <h3 className="font-bold mb-1 uppercase">Terms & Conditions</h3>
              <p className="text-muted-foreground">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8 text-sm">
        <p>Thank you for your business</p>
      </div>
    </div>
  );
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ invoiceData, formatCurrency, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-white p-8 shadow-sm"
    >
      <div className="flex justify-between items-start mb-12">
        <div>
          {invoiceData.businessInfo.logo ? (
            <img 
              src={invoiceData.businessInfo.logo} 
              alt="Business Logo" 
              className="h-12 mb-4 object-contain"
            />
          ) : (
            <div className="h-12 mb-4 font-bold text-xl text-gray-800">
              {invoiceData.businessInfo.name || "Your Business Name"}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl mb-2 text-gray-800">Invoice</div>
          <div className="text-sm text-gray-500"># {invoiceData.invoiceNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">From</div>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-800">{invoiceData.businessInfo.name || "Your Business Name"}</p>
            <p className="text-gray-600">{invoiceData.businessInfo.address || "Business Address"}</p>
            <p className="text-gray-600">
              {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
              {invoiceData.businessInfo.state || ""}
              {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
            </p>
            <p className="text-gray-600">{invoiceData.businessInfo.email || ""}</p>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Bill To</div>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-800">{invoiceData.clientInfo.name || "Client Name"}</p>
            <p className="text-gray-600">{invoiceData.clientInfo.address || "Client Address"}</p>
            <p className="text-gray-600">
              {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
              {invoiceData.clientInfo.state || ""}
              {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
            </p>
            <p className="text-gray-600">{invoiceData.clientInfo.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Issue Date</div>
          <div className="text-gray-800">{invoiceData.invoiceDate}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Due Date</div>
          <div className="text-gray-800">{invoiceData.dueDate}</div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {invoiceData.columnVisibility.description && <th className="text-left py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Description</th>}
              {invoiceData.columnVisibility.quantity && <th className="text-right py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Qty</th>}
              {invoiceData.columnVisibility.unitPrice && <th className="text-right py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Price</th>}
              {invoiceData.columnVisibility.taxRate && <th className="text-right py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Tax %</th>}
              {invoiceData.columnVisibility.discount && <th className="text-right py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Disc %</th>}
              {invoiceData.columnVisibility.category && <th className="text-left py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Category</th>}
              {invoiceData.columnVisibility.total && <th className="text-right py-3 text-xs uppercase text-gray-500 font-medium tracking-wider">Total</th>}
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.length > 0 ? (
              invoiceData.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  {invoiceData.columnVisibility.description && <td className="py-4">{item.description}</td>}
                  {invoiceData.columnVisibility.quantity && <td className="py-4 text-right">{item.quantity}</td>}
                  {invoiceData.columnVisibility.unitPrice && <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>}
                  {invoiceData.columnVisibility.taxRate && <td className="py-4 text-right">{item.taxRate}%</td>}
                  {invoiceData.columnVisibility.discount && <td className="py-4 text-right">{item.discount}%</td>}
                  {invoiceData.columnVisibility.category && <td className="py-4">{item.category || "-"}</td>}
                  {invoiceData.columnVisibility.total && <td className="py-4 text-right font-medium">{formatCurrency(item.total)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                  className="py-4 text-center text-gray-500"
                >
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discountTotal > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-gray-800">-{formatCurrency(invoiceData.discountTotal)}</span>
            </div>
          )}
          {invoiceData.taxTotal > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">{formatCurrency(invoiceData.taxTotal)}</span>
            </div>
          )}
          <div className="h-px bg-gray-200 my-2"></div>
          <div className="flex justify-between py-2 font-medium">
            <span>Total</span>
            <span>{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="text-sm text-gray-600 space-y-4 border-t border-gray-100 pt-8">
          {invoiceData.notes && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Notes</div>
              <p>{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Terms & Conditions</div>
              <p>{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CreativeTemplate: React.FC<TemplateProps> = ({ invoiceData, formatCurrency, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-white p-8 shadow-md relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-tr-full -z-10"></div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
        <div>
          <div className="inline-block bg-primary text-white px-6 py-3 rounded-lg mb-6">
            <div className="text-2xl font-bold">INVOICE</div>
          </div>
          <div>
            {invoiceData.businessInfo.logo ? (
              <img 
                src={invoiceData.businessInfo.logo} 
                alt="Business Logo" 
                className="h-16 mb-4 object-contain"
              />
            ) : (
              <div className="h-16 mb-4 font-bold text-xl text-primary">
                {invoiceData.businessInfo.name || "Your Business Name"}
              </div>
            )}
            <div className="text-sm space-y-1">
              <p className="font-semibold">{invoiceData.businessInfo.name || "Your Business Name"}</p>
              <p>{invoiceData.businessInfo.address || "Business Address"}</p>
              <p>
                {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
                {invoiceData.businessInfo.state || ""}
                {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
              </p>
              <p>{invoiceData.businessInfo.country || ""}</p>
              <p>{invoiceData.businessInfo.phone || ""}</p>
              <p>{invoiceData.businessInfo.email || ""}</p>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-primary pl-6 space-y-3">
          <div className="flex">
            <div className="w-32 font-semibold">Invoice Number:</div>
            <div>{invoiceData.invoiceNumber}</div>
          </div>
          <div className="flex">
            <div className="w-32 font-semibold">Issue Date:</div>
            <div>{invoiceData.invoiceDate}</div>
          </div>
          <div className="flex">
            <div className="w-32 font-semibold">Due Date:</div>
            <div>{invoiceData.dueDate}</div>
          </div>
          <div className="flex">
            <div className="w-32 font-semibold">Currency:</div>
            <div>{invoiceData.currency}</div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-6 bg-gray-50 rounded-xl">
        <div className="text-lg font-bold text-primary mb-4">Bill To:</div>
        <div className="text-sm space-y-1">
          <p className="font-semibold text-lg">{invoiceData.clientInfo.name || "Client Name"}</p>
          <p>{invoiceData.clientInfo.address || "Client Address"}</p>
          <p>
            {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
            {invoiceData.clientInfo.state || ""}
            {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
          </p>
          <p>{invoiceData.clientInfo.country || ""}</p>
          <p>{invoiceData.clientInfo.phone || ""}</p>
          <p>{invoiceData.clientInfo.email || ""}</p>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary/80 to-primary text-white">
              {invoiceData.columnVisibility.description && <th className="text-left py-3 px-4">Description</th>}
              {invoiceData.columnVisibility.quantity && <th className="text-right py-3 px-4">Qty</th>}
              {invoiceData.columnVisibility.unitPrice && <th className="text-right py-3 px-4">Price</th>}
              {invoiceData.columnVisibility.taxRate && <th className="text-right py-3 px-4">Tax %</th>}
              {invoiceData.columnVisibility.discount && <th className="text-right py-3 px-4">Disc %</th>}
              {invoiceData.columnVisibility.category && <th className="text-left py-3 px-4">Category</th>}
              {invoiceData.columnVisibility.total && <th className="text-right py-3 px-4">Total</th>}
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.length > 0 ? (
              invoiceData.lineItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {invoiceData.columnVisibility.description && <td className="py-3 px-4">{item.description}</td>}
                  {invoiceData.columnVisibility.quantity && <td className="py-3 px-4 text-right">{item.quantity}</td>}
                  {invoiceData.columnVisibility.unitPrice && <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>}
                  {invoiceData.columnVisibility.taxRate && <td className="py-3 px-4 text-right">{item.taxRate}%</td>}
                  {invoiceData.columnVisibility.discount && <td className="py-3 px-4 text-right">{item.discount}%</td>}
                  {invoiceData.columnVisibility.category && <td className="py-3 px-4">{item.category || "-"}</td>}
                  {invoiceData.columnVisibility.total && <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.total)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                  className="py-4 text-center text-muted-foreground"
                >
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-grow"></div>
        <div className="w-full md:w-80 p-6 bg-gray-50 rounded-xl">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discountTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Discount:</span>
              <span className="text-red-500">-{formatCurrency(invoiceData.discountTotal)}</span>
            </div>
          )}
          {invoiceData.taxTotal > 0 && (
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span>{formatCurrency(invoiceData.taxTotal)}</span>
            </div>
          )}
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">{formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {invoiceData.notes && (
            <div className="text-sm p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-primary">Notes</h3>
              <p className="text-gray-600">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="text-sm p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2 text-primary">Terms & Conditions</h3>
              <p className="text-gray-600">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-12 text-sm text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};
