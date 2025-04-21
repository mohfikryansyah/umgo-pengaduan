import { DataTable } from '@/components/datatable/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Pengaduan, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from '../columns';
import Chart, { ChartData } from './chart';

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
}

export default function Dashboard({
    countAllPengaduan,
    countPengaduanDiajukan,
    countPengaduanDiproses,
    countPengaduanSelesai,
    chartData,
    pengaduanTervalidasi,
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
                            <CardTitle>Total Pengaduan</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countAllPengaduan}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Diajukan</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan yang diajukan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanDiajukan}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Diproses</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan yang diproses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanDiproses}</h1>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengaduan Selesai</CardTitle>
                            <CardDescription>Jumlah keseluruhan pengaduan yang telah selesai</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-xl font-bold tracking-tight">{countPengaduanSelesai}</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex gap-4">
                    <div className="w-full max-w-lg">
                        <Chart chartData={DataPengaduanForChart}></Chart>
                    </div>
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pengaduan Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable data={pengaduanTervalidasi} columns={columns}></DataTable>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
