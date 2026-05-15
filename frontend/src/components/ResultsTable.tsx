import { useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { ProcessedPart } from '@/lib/types';

const h = createColumnHelper<ProcessedPart>();

export const ResultsTable = ({ data }: { data: ProcessedPart[] }) => {
  const columns = useMemo(() => [
    h.accessor('partNumber', { header: 'Part Number' }),
    h.accessor('manufacturer', { header: 'Manufacturer' }),
    h.accessor('aecStatus', { header: 'AEC Status' }),
    h.accessor('aecStandard', { header: 'AEC Standard' }),
    h.accessor('grade', { header: 'Grade' }),
    h.accessor('source', { header: 'Source', cell: info => <a className="text-wine underline" href={info.getValue()} target="_blank">Reference</a> }),
    h.accessor('notes', { header: 'Notes' })
  ], []);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return <div className="glass rounded-luxury p-4 overflow-auto"><table className="w-full text-sm">
    <thead className="text-plum"><tr>{table.getHeaderGroups()[0].headers.map(header => (
      <th key={header.id} className="text-left p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
    ))}</tr></thead>
    <tbody>{table.getRowModel().rows.map(row => <tr key={row.id} className="border-t border-rose">{row.getVisibleCells().map(cell => (
      <td className="p-2" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
    ))}</tr>)}</tbody>
  </table></div>;
};
