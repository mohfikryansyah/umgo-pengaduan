<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h2 { text-align: center; margin-bottom: 10px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 6px;
            text-align: left;
        }
        .range {
            text-align: center;
            margin-top: 5px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h2>Laporan Pengaduan</h2>
    <p class="range">{{ $range }}</p>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pelapor</th>
                <th>NIM</th>
                <th>Judul</th>
                <th>Isi</th>
                <th>Status Terakhir</th>
                <th>Tindakan</th>
                <th>Bidang</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pengaduan as $i => $item)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $item->user->name }}</td>
                <td>{{ $item->user->nim }}</td>
                <td>{{ $item->judul }}</td>
                <td>{{ $item->isi }}</td>
                <td>{{ $item->latestStatus->status }}</td>
                <td>{{ $item->latestStatus->tindakan }}</td>
                <td>{{ $item->bidang }}</td>
                <td>{{ $item->created_at->format('d M Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
