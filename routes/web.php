<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Pengaduan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Services\Dashboard\DashboardService;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\ExportPengaduanController;
use App\Http\Controllers\PengaduanKhususController;
use App\Http\Controllers\TanggapanPengaduanController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::resource('umum/pengaduan', PengaduanController::class)
        ->middlewareFor(['create', 'store'], 'role:mahasiswa')
        ->middlewareFor(['destroy', 'update'], 'role:admin');
    Route::put('pengaduan/update-validasi-rektor/{pengaduan}', [PengaduanController::class, 'updateValidasi'])->name('pengaduan.update.validasi')->middleware('role:rektor');
    Route::resource('tanggapan', TanggapanPengaduanController::class);
    Route::get('/export-pdf', [ExportPengaduanController::class, 'export'])->middleware('role:admin|warek_1|warek_2|warek_3|rektor');
    Route::get('/export-pdf-pengaduan-khusus', [ExportPengaduanController::class, 'exportPengaduanKhusus'])->middleware('role:admin|warek_1|warek_2|warek_3|rektor');

    Route::get('/users', [UserController::class, 'index'])->name('daftar.user')->middleware('role:admin');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('delete.user')->middleware('role:admin');

    Route::resource('khusus/pengaduan-khusus', PengaduanKhususController::class)
        ->parameters(['pengaduan-khusus' => 'pengaduanKhusus'])
        ->middlewareFor(['create', 'store'], 'role:mahasiswa')
        ->middlewareFor(['destroy', 'update'], 'role:admin');
    Route::put('pengaduan-khusus/update-validasi-rektor/{pengaduanKhusus}', [PengaduanKhususController::class, 'updateValidasi'])->name('pengaduan.khusus.update.validasi')->middleware('role:rektor');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (DashboardService $dashboardService) {
        /** @var \App\Models\User */
        $user = Auth::user();
        $role = $user->getRoleNames()->first();

        $viewMahasiswa = 'menu/dashboard/mahasiswa/index';
        $viewAdmin = 'menu/dashboard/admin/dashboard';

        if ($role === 'mahasiswa') {
            return Inertia::render($viewAdmin, $dashboardService->getDashboardData(userId: $user->id));
        }

        $bidangMapping = [
            'warek_1' => 'Akademik',
            'warek_2' => 'Keuangan dan Umum',
            'warek_3' => 'Kemahasiswaan',
        ];

        $bidang = $bidangMapping[$role] ?? null;

        if (in_array($role, ['admin', 'rektor'])) {
            return Inertia::render($viewAdmin, $dashboardService->getDashboardData());
        }

        if ($bidang) {
            return Inertia::render($viewAdmin, $dashboardService->getDashboardData(bidang: $bidang));
        }

        abort(403);
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
