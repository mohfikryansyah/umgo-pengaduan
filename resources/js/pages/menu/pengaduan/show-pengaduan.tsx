import DetailPengaduan from '@/components/detail-pengaduan';
import InputError from '@/components/input-error';
import Timeline from '@/components/timeline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { hasRole } from '@/helpers';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Pengaduan, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FormEventHandler } from 'react';
import toast from 'react-hot-toast';
import FormTanggapan from './form-tanggapan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaduan',
        href: route('pengaduan.index'),
    },
    {
        title: 'Detail Pengaduan',
        href: '#',
    },
];

interface Props {
    pengaduan: Pengaduan;
}

const statusColorMap: Record<string, string> = {
    Diajukan: 'bg-yellow-500 text-yellow-100',
    Diproses: 'bg-blue-500 text-blue-100',
    Selesai: 'bg-green-500 text-green-100',
    Ditolak: 'bg-red-500 text-red-100',
};

export default function ShowPengaduan({ pengaduan }: Props) {
    const formatCreatedAtPengaduan = format(pengaduan.created_at, 'EEEE, d MMMM y', { locale: id });
    const formatCreatedAtStatusPengaduan = format(pengaduan.latest_status.created_at, 'EEEE, d MMMM y', { locale: id });
    const user = pengaduan.user;
    const getInitials = useInitials();

    const badgeClass = statusColorMap[pengaduan.latest_status.status] ?? 'bg-gray-500 text-white';

    const { data, setData, put, processing, errors, reset } = useForm({
        status: '',
        tindakan: '',
    });

    const { auth } = usePage<SharedData>().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('pengaduan.update', { pengaduan }), {
            onSuccess: () => {
                toast.success('Berhasil memperbarui status'), reset();
            },
            onError: () => toast.error('Gagal memperbarui status'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex w-full gap-x-3 not-lg:flex-col not-lg:gap-y-3">
                    <div className="w-full max-w-4xl not-lg:order-2">
                        {pengaduan.validasi_rektor === 1 ? (
                            <Alert className="mb-3 border-green-500 bg-green-100">
                                <AlertDescription className="justify-center text-gray-800">
                                    <span className="font-bold">Telah divalidasi rektor</span>
                                </AlertDescription>
                            </Alert>
                        ) : pengaduan.validasi_rektor === 0 ? (
                            <Alert className="mb-3 border-red-500 bg-red-100">
                                <AlertDescription className="justify-center text-gray-800">
                                    <span className="font-bold">Telah ditolak rektor</span>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="mb-3 border-yellow-500 bg-yellow-100">
                                <AlertDescription className="justify-center text-gray-800">
                                    <span className="font-bold">Menunggu validasi rektor</span>
                                </AlertDescription>
                            </Alert>
                        )}

                        <DetailPengaduan pengaduan={pengaduan} className="border-b pb-3" />
                       
                        {hasRole(auth.user, ['admin', 'warek_1', 'warek_2', 'warek_3', 'rektor']) && <FormTanggapan pengaduan={pengaduan} />}

                        <Timeline items={pengaduan.tanggapans} />
                    </div>
                    <div className="w-full space-y-5 lg:max-w-sm">
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>Info Pengaduan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex gap-x-2">
                                        <p className="text-sm font-medium text-gray-600">Status:</p>
                                        <Badge className={cn(badgeClass)}>{pengaduan.latest_status.status}</Badge>
                                    </div>
                                    {pengaduan.latest_status.tindakan && (
                                        <div className="flex gap-x-2">
                                            <p className="text-sm font-medium text-gray-600">Tindakan:</p>
                                            <p className="text-sm font-medium text-gray-800">{pengaduan.latest_status.tindakan}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-x-2">
                                        <p className="text-sm font-medium text-gray-600">Diajukan:</p>
                                        <p className="text-sm font-medium text-gray-800">{formatCreatedAtPengaduan}</p>
                                    </div>
                                    <div className="flex gap-x-2">
                                        <p className="text-sm font-medium text-gray-600">Pembaruan Terakhir:</p>
                                        <p className="text-sm font-medium text-gray-800">{formatCreatedAtStatusPengaduan}</p>
                                    </div>
                                </div>
                                {hasRole(auth.user, ['admin', 'warek_1', 'warek_2', 'warek_3']) && (
                                    <div className="mt-5 space-y-2">
                                        <p className="text-sm font-medium text-gray-800">Pengaduan dari:</p>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage src={'/storage/' + user.avatar} alt={user.name} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold text-blue-500">{user.name}</span>
                                                <span className="text-muted-foreground truncate text-xs">{user.nim}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {hasRole(auth.user, ['admin']) && (
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Perbarui Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label>Status</Label>
                                            <Select onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih status baru" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="Diajukan">Diajukan</SelectItem>
                                                        <SelectItem value="Diproses">Diproses</SelectItem>
                                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                                <InputError message={errors.status} />
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tindakan">Tindakan</Label>
                                            <Textarea id="tindakan" value={data.tindakan} onChange={(e) => setData('tindakan', e.target.value)} />
                                            <InputError message={errors.tindakan} />
                                        </div>

                                        <Button disabled={processing}>Simpan</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
