/**
 * Sales Table Component
 */

import { Copy } from 'lucide-react';
import { Sale } from '../types';
import { formatDate } from '../utils/format';
import { useState } from 'react';

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setCopiedText(text);
      setShowToast(true);
      setTimeout(() => setCopiedId(null), 2000);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-primary-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-200">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Customer ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Customer name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Product Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Customer region
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Product ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600">
                Employee name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-200 bg-white">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-primary-50 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.id.replace(/[^0-9]/g, '').slice(0, 7) || sale.id.slice(0, 7)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {formatDate(sale.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.customerId}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.customerName}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  <div className="flex items-center gap-2">
                    <span>{sale.phoneNumber}</span>
                    <button
                      onClick={() => copyToClipboard(sale.phoneNumber, sale.id.toString())}
                      className="p-1 hover:bg-primary-100 rounded transition-colors"
                      title="Copy phone number"
                    >
                      <Copy
                        className={`h-3.5 w-3.5 ${
                          copiedId === sale.id.toString()
                            ? 'text-accent-600'
                            : 'text-primary-400'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.gender}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.age}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.productCategory}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.quantity.toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  ₹ {sale.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.customerRegion}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.productId}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-primary-900">
                  {sale.employeeName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Copy Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Copied: {copiedText}</span>
          </div>
        </div>
      )}
    </>
  );
}
