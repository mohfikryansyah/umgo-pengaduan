<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PengaduanResource;

class PengaduanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if ($user->hasRole('admin') || $user->hasRole('rektor')) {
            $pengaduans = Pengaduan::latest()->get();
        } elseif ($user->hasRole('warek_1')) {
            $pengaduans = Pengaduan::where('bidang', 'Akademik')->latest()->get();
        } elseif ($user->hasRole('warek_2')) {
            $pengaduans = Pengaduan::where('bidang', 'Keuangan dan Umum')->latest()->get();
        } elseif ($user->hasRole('warek_3')) {
            $pengaduans = Pengaduan::where('bidang', 'Kemahasiswaan')->latest()->get();
        } elseif ($user->hasRole('mahasiswa')) {
            $pengaduans = Pengaduan::where('user_id', $user->id)->latest()->get();
        }

        return Inertia::render('menu/pengaduan/index', compact('pengaduans'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('menu/pengaduan/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'judul' => 'required|max:100',
            'isi' => 'required',
            'bidang' => 'required|in:Akademik,Kemahasiswaan,Keuangan dan Umum,Khusus',
            'berkas' => 'required|array|min:1',
            'berkas.*' => 'required|mimes:jpg,jpeg,png|file|max:1024',
        ]);

        DB::beginTransaction();

        try {
            $pengaduan = Pengaduan::create([
                'user_id' => Auth::user()->id,
                'judul' => $validatedData['judul'],
                'isi' => $validatedData['isi'],
                'bidang' => $validatedData['bidang'],
            ]);

            $pengaduan->status()->create([
                'pengaduan_id' => $pengaduan->id,
                'tindakan' => 'pengaduan masih dalam proses peninjauan',
            ]);

            if ($request->hasFile('berkas')) {
                foreach ($validatedData['berkas'] as $berkas) {
                    $path = $berkas->store('berkas_pengaduan', 'public');

                    $pengaduan->berkas()->create([
                        'path_berkas' => $path,
                        'pengaduan_id' => $pengaduan->id
                    ]);
                }
            }

            DB::commit();

            return to_route('pengaduan.index');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Gagal mengirim pengaduan.' . $e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengaduan $pengaduan)
    {

        return Inertia::render('menu/pengaduan/show-pengaduan', [
            'pengaduan' => new PengaduanResource($pengaduan)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pengaduan $pengaduan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pengaduan $pengaduan)
    {
        $validatedData = $request->validate([
            'status' => 'required|in:Diajukan,Diproses,Selesai,Ditolak',
            'tindakan' => 'required',
        ]);


        $pengaduan->status()->update($validatedData);

        return back();
    }

    public function updateValidasi(Request $request, Pengaduan $pengaduan)
    {
        $validatedData = $request->validate([
            'validasi_rektor' => 'required|boolean'
        ]);

        $pengaduan->update([
            'validasi_rektor' => $validatedData['validasi_rektor']
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengaduan $pengaduan)
    {
        foreach ($pengaduan->berkas as $berkas) {
            if ($berkas->path && Storage::disk('public')->exists($berkas->path)) {
                Storage::disk('public')->delete($berkas->path);
            }
            $berkas->delete();
        }

        $pengaduan->delete();

        return back()->with('success', 'Pengaduan dan semua berkas berhasil dihapus.');
    }
}
