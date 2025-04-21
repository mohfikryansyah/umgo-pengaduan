<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportPengaduanController extends Controller
{
    public function export(Request $request)
    {
        $start = $request->start ? Carbon::parse($request->start)->startOfDay() : null;
        $end = $request->end ? Carbon::parse($request->end)->endOfDay() : null;

        $query = Pengaduan::query();

        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
            $range = "Periode: " . date('d M Y', strtotime($start)) . " - " . date('d M Y', strtotime($end));
        } elseif ($start) {
            $query->where('created_at', '>=', $start);
            $range = "Dari: " . date('d M Y', strtotime($start));
        } elseif ($end) {
            $query->where('created_at', '<=', $end);
            $range = "Sampai: " . date('d M Y', strtotime($end));
        } else {
            $range = "Semua Data";
        }

        $pengaduan = $query->get();


        $pdf = Pdf::loadView('pdf.pengaduan-pdf', compact('pengaduan', 'range'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('laporan-pengaduan-' . now()->translatedFormat('d-F-Y-H-i-s') . '.pdf');
    }
}
