import { DataTable } from '@/components/datatable/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Pengaduan, PengaduanKhusus, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from '../columns';
import Chart, { ChartData } from './chart';
import { columnsKhusus } from '../columns-khusus';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    countAllPengaduan: number;
    countPengaduanDiajukan: number;
    countPengaduanDiproses: number;
    countPengaduanSelesai: number;
    chartData: ChartData[];
    pengaduanTervalidasi: Pengaduan[];

    countAllPengaduanKhusus: number;
    countPengaduanKhususDiajukan: number;
    countPengaduanKhususDiproses: number;
    countPengaduanKhususSelesai: number;
    pengaduanKhususTervalidasi: PengaduanKhusus[];
}

export default function Dashboard({
    countAllPengaduan,
    countPengaduanDiajukan,
    countPengaduanDiproses,
    countPengaduanSelesai,
    chartData,
    pengaduanTervalidasi,
    countAllPengaduanKhusus,
    countPengaduanKhususDiajukan,
    countPengaduanKhususDiproses,
    countPengaduanKhususSelesai,
    pengaduanKhususTervalidasi,
}: Props) {

    const DataPengaduanForChart = chartData.map((data) => ({
        month: data.month,
        khusus: Number(data.khusus),
        tidak_khusus: Number(data.tidak_khusus),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Umum</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan umum</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countAllPengaduan}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Umum Diajukan</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan umum yang diajukan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanDiajukan}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Umum Diproses</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan umum yang diproses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanDiproses}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Umum Selesai</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan umum yang telah selesai</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanSelesai}</h1>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Khusus</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan khusus</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countAllPengaduanKhusus}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Khusus Diajukan</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan khusus yang diajukan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanKhususDiajukan}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Khusus Diproses</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan khusus yang diproses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanKhususDiproses}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Khusus Selesai</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan khusus yang telah selesai</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanKhususSelesai}</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex gap-4">
                    <div className="w-full max-w-lg">
                        <Chart chartData={DataPengaduanForChart}></Chart>
                    </div>
                    <div className="w-full space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pengaduan Umum Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable data={pengaduanTervalidasi} columns={columns}></DataTable>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pengaduan Khusus Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable data={pengaduanKhususTervalidasi} columns={columnsKhusus}></DataTable>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
