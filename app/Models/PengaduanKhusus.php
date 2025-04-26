<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PengaduanKhusus extends Model
{
    /** @use HasFactory<\Database\Factories\PengaduanKhususFactory> */
    use HasFactory, HasUuids;

    protected $table = 'pengaduan_khusus';
    protected $guarded = ['id'];
    protected $with = ['berkas', 'status', 'user', 'latestStatus'];

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
            COUNT(*) as khusus
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

    public function latestStatus(): HasOne
    {
        return $this->hasOne(StatusPengaduan::class)->latestOfMany();
    }

    public function status(): HasMany
    {
        return $this->hasMany(StatusPengaduan::class);
    }
}
