<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Pengaduan;
use App\Models\PengaduanKhusus;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class ExportPengaduanController extends Controller
{
    public function export(Request $request)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $role = $user->getRoleNames()->first();
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

        $roleBidangMap = [
            'warek_1' => 'Akademik',
            'warek_2' => 'Umum dan Keuangan',
            'warek_3' => 'Kemahasiswaan',
        ];

        // Kalau admin, tidak ada filter bidang, bisa akses semua
        if ($role !== 'admin' && isset($roleBidangMap[$role])) {
            // Kalau bukan admin, filter berdasarkan role ke bidang
            $query->where('bidang', $roleBidangMap[$role]);
        }

        $pengaduan = $query->get();

        $pdf = Pdf::loadView('pdf.pengaduan-pdf', compact('pengaduan', 'range'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('laporan-pengaduan-' . now()->translatedFormat('d-F-Y-H-i-s') . '.pdf');
    }
    

    public function exportPengaduanKhusus(Request $request)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $role = $user->getRoleNames()->first();
        $start = $request->start ? Carbon::parse($request->start)->startOfDay() : null;
        $end = $request->end ? Carbon::parse($request->end)->endOfDay() : null;

        $query = PengaduanKhusus::query();

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

        $pdf = Pdf::loadView('pdf.pengaduan-khusus-pdf', compact('pengaduan', 'range'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('laporan-pengaduan-khusus-' . now()->translatedFormat('d-F-Y-H-i-s') . '.pdf');
    }
}
