<?php

namespace App\Services\Dashboard;


use App\Models\Pengaduan;
use App\Models\PengaduanKhusus;

class DashboardService
{
    public function getDashboardData(?int $userId = null, ?string $bidang = null): array
    {
        $queryPengaduanUmum = Pengaduan::query();
        $queryPengaduanKhusus = PengaduanKhusus::query();

        if ($userId) {
            $queryPengaduanUmum->where('user_id', $userId);
            $queryPengaduanKhusus->where('user_id', $userId);
        }

        if ($bidang) {
            $queryPengaduanUmum->where('bidang', $bidang);
            $queryPengaduanKhusus->where('bidang', $bidang);
        }

        // Generate Chart Data Gabungan
        $chartData = $this->getCombinedChartData($queryPengaduanUmum, $queryPengaduanKhusus);

        return [
            'countAllPengaduan' => $queryPengaduanUmum->count(),
            'countPengaduanDiajukan' => (clone $queryPengaduanUmum)->denganStatus('Diajukan')->count(),
            'countPengaduanDiproses' => (clone $queryPengaduanUmum)->denganStatus('Diproses')->count(),
            'countPengaduanSelesai' => (clone $queryPengaduanUmum)->denganStatus('Selesai')->count(),
            'pengaduanTervalidasi' => (clone $queryPengaduanUmum)->latest()->take(5)->get(),

            'countAllPengaduanKhusus' => $queryPengaduanKhusus->count(),
            'countPengaduanKhususDiajukan' => (clone $queryPengaduanKhusus)->denganStatus('Diajukan')->count(),
            'countPengaduanKhususDiproses' => (clone $queryPengaduanKhusus)->denganStatus('Diproses')->count(),
            'countPengaduanKhususSelesai' => (clone $queryPengaduanKhusus)->denganStatus('Selesai')->count(),
            'pengaduanKhususTervalidasi' => (clone $queryPengaduanKhusus)->latest()->take(5)->get(),
            
            'chartData' => $chartData,
        ];
    }

    /**
     * Gabungin chart data dari Pengaduan Umum + Pengaduan Khusus.
     */
    protected function getCombinedChartData($queryPengaduanUmum, $queryPengaduanKhusus): \Illuminate\Support\Collection
    {
        $dataUmum = (clone $queryPengaduanUmum)
            ->selectRaw('
            DATE_FORMAT(created_at, "%M") as month,
            MONTH(created_at) as month_number,
            COUNT(*) as tidak_khusus
        ')
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month', 'month_number')
            ->orderBy('month_number')
            ->get();

        $dataKhusus = (clone $queryPengaduanKhusus)
            ->selectRaw('
            DATE_FORMAT(created_at, "%M") as month,
            MONTH(created_at) as month_number,
            COUNT(*) as khusus
        ')
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month', 'month_number')
            ->orderBy('month_number')
            ->get();

        $result = collect();
        $allMonths = $dataUmum->pluck('month')->merge($dataKhusus->pluck('month'))->unique();

        foreach ($allMonths as $month) {
            $umum = $dataUmum->firstWhere('month', $month);
            $khusus = $dataKhusus->firstWhere('month', $month);

            $result->push([
                'month' => $month,
                'month_number' => $umum->month_number ?? $khusus->month_number,
                'khusus' => $khusus->khusus ?? 0,
                'tidak_khusus' => $umum->tidak_khusus ?? 0,
            ]);
        }

        return $result->sortBy('month_number')->values();
    }
}
