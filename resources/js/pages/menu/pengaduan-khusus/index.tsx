import { DataTable } from '@/components/datatable/data-table';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { hasRole } from '@/helpers';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PengaduanKhusus, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { columns } from './columns';
import ExportPengaduan from './export-pengaduan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function IndexPengaduanKhusus({ pengaduans }: { pengaduans: PengaduanKhusus[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaduan Khusus" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <HeadingSmall title="Halaman Pengaduan" />
                <DataTable columns={columns} data={pengaduans}>
                    {hasRole(auth.user, ['mahasiswa']) && (
                        <Link href={route('pengaduan-khusus.create')}>
                            <Button className="h-8 bg-emerald-600 transition-colors duration-300 hover:bg-emerald-700">Buat Pengaduan</Button>
                        </Link>
                    )}

                    {hasRole(auth.user, ['admin', 'warek_1', 'warek_2', 'warek_3', 'rektor']) && <ExportPengaduan />}
                </DataTable>
            </div>
        </AppLayout>
    );
}
