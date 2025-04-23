import { DataTable } from '@/components/datatable/data-table';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { hasRole } from '@/helpers';
import AppLayout from '@/layouts/app-layout';
import { SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { columns } from './columns';

export default function Index({ users }: { users: User[] }) {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout>
            <Head title='Pengguna'/>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <HeadingSmall title="Daftar Pengguna" />
                <DataTable columns={columns} data={users}>
                    {hasRole(auth.user, ['mahasiswa']) && (
                        <Link href={route('pengaduan.create')}>
                            <Button className="h-8 bg-emerald-600 transition-colors duration-300 hover:bg-emerald-700">Buat Pengaduan</Button>
                        </Link>
                    )}

                </DataTable>
            </div>
        </AppLayout>
    );
}
