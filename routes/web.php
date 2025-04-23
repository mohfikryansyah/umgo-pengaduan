<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Pengaduan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\ExportPengaduanController;
use App\Http\Controllers\TanggapanPengaduanController;
use App\Http\Controllers\UserController;
use App\Http\Resources\AuthUserResource;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('auth')->group(function () {
    Route::resource('pengaduan', PengaduanController::class);
    Route::put('pengaduan/update-validasi-rektor/{pengaduan}', [PengaduanController::class, 'updateValidasi'])->name('pengaduan.update.validasi');
    Route::resource('tanggapan', TanggapanPengaduanController::class);
    Route::get('/export-pdf', [ExportPengaduanController::class, 'export']);
    Route::get('/users', [UserController::class, 'index'])->name('daftar.user');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('delete.user');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        /** @var \App\Models\User */
        $user = Auth::user();

        if ($user->hasRole(['admin', 'rektor'])) {
            $countAllPengaduan = Pengaduan::count();
            $countPengaduanDiajukan = Pengaduan::denganStatus('Diajukan')->count();
            $countPengaduanDiproses = Pengaduan::denganStatus('Diproses')->count();
            $countPengaduanSelesai = Pengaduan::denganStatus('Selesai')->count();
            $chartData = Pengaduan::chartData()->get();

            $pengaduanTervalidasi = Pengaduan::latest()->take(5)->get();

            return Inertia::render('menu/dashboard/admin/dashboard', compact('countAllPengaduan', 'countPengaduanDiajukan', 'countPengaduanDiproses', 'countPengaduanSelesai', 'chartData', 'pengaduanTervalidasi'));
        } elseif ($user->hasRole('mahasiswa')) {
            $countAllPengaduan = Pengaduan::where('user_id', $user->id)->count();
            $countPengaduanDiajukan = Pengaduan::where('user_id', $user->id)->denganStatus('Diajukan')->count();
            $countPengaduanDiproses = Pengaduan::where('user_id', $user->id)->denganStatus('Diproses')->count();
            $countPengaduanSelesai = Pengaduan::where('user_id', $user->id)->denganStatus('Selesai')->count();

            return Inertia::render('menu/dashboard/mahasiswa/index', compact('countAllPengaduan', 'countPengaduanDiajukan', 'countPengaduanDiproses', 'countPengaduanSelesai'));
        }

        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
