<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pengaduan extends Model
{
    /** @use HasFactory<\Database\Factories\PengaduanFactory> */
    use HasFactory, HasUuids;

    protected $guarded = ['id'];
    protected $with = ['berkas', 'status', 'user', 'latestStatus', 'tanggapans.user'];

    public function scopeDenganStatus($query, $status)
    {
        return $query->whereHas('latestStatus', function ($q) use ($status) {
            $q->where('status', $status);
        });
    }

    public function scopeChartData($query)
    {
        return $query
            ->selectRaw('
            DATE_FORMAT(created_at, "%M") as month,
            MONTH(created_at) as month_number,
            SUM(CASE WHEN bidang = "Khusus" THEN 1 ELSE 0 END) as khusus,
            SUM(CASE WHEN bidang != "Khusus" THEN 1 ELSE 0 END) as tidak_khusus
        ')
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month', 'month_number')
            ->orderBy('month_number');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function berkas(): HasMany
    {
        return $this->hasMany(BerkasPengaduan::class);
    }

    public function tanggapans(): HasMany
    {
        return $this->hasMany(TanggapanPengaduan::class)->latest();
    }

    public function latestStatus(): HasOne
    {
        return $this->hasOne(StatusPengaduan::class)->latestOfMany();
    }

    public function status(): HasMany
    {
        return $this->hasMany(StatusPengaduan::class);
    }
}
