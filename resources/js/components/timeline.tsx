import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Tanggapan } from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';

type Props = {
    items: Tanggapan[];
};

export default function Timeline({ items }: Props) {
    const getInitials = useInitials();

    const [processing, setProccesing] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);

    const [openDialogId, setOpenDialogId] = useState<number | string |null>(null);

    const handleDeleteTanggapan = (tanggapan: Tanggapan) => {
        router.delete(route('tanggapan.destroy', { tanggapan }), {
            preserveState: true,
            onSuccess: () => {
                toast.success('Berhasil menghapus tanggapan');
                setProccesing(false);
                setOpenDialogId(null)
            },
            onError: (errors) => {
                toast.error(errors[0]);
                setOpenDialogId(null)
                setProccesing(false);
            },
        });
    };

    return (
        <div className="relative space-y-6 border-l-2 border-dashed border-blue-500 pl-6">
            {items.map((item, idx) => {
                const formatTanggal = format(item.created_at, 'EEEE, d MMMM y', { locale: id });
                const formatWaktu = format(item.created_at, 'HH:mm', { locale: id });

                return (
                    <div key={item.id} className="relative">
                        <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full border-2 border-white bg-blue-500" />

                        <div className="mb-2 flex items-center gap-3">
                            <div className="text-sm font-semibold text-blue-600">{formatTanggal}</div>
                            <div className="text-xs text-gray-500">{formatWaktu}</div>
                        </div>

                        {/* Chat bubble */}
                        <Card>
                            <CardContent className="flex gap-4">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage src={'/storage/' + item.user.avatar} alt={item.user.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(item.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">{item.user.name}</p>
                                            <p className="text-xs text-gray-500">{item.user.roles}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm">{item.tanggapan}</p>

                                    {/* {item.attachment && (
                                    <div className="mt-2 rounded border bg-white p-2 text-xs text-blue-600 underline hover:bg-gray-50">
                                        📎 Attachment
                                    </div>
                                )} */}
                                </div>
                                <Dialog open={openDialogId  === item.id} onOpenChange={(open) => setOpenDialogId(open ? item.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-200">
                                                <TriangleAlert className="h-8 w-8 text-red-500" />
                                            </div>
                                            <h1 className="mt-4 text-lg font-bold">Hapus Tanggapan</h1>
                                            <p className="mt-2 text-gray-400">Apakah Anda yakin ingin menghapus ini?</p>
                                            <div className="mt-4 grid w-full grid-cols-2 gap-x-2">
                                                <DialogClose asChild>
                                                    <Button variant={'outline'}>Batal</Button>
                                                </DialogClose>
                                                <Button
                                                    variant={'default'}
                                                    className="bg-red-500 transition-all duration-300 hover:bg-red-600 active:scale-90"
                                                    disabled={processing}
                                                    onClick={() => {
                                                        setProccesing(true);
                                                        handleDeleteTanggapan(item);
                                                    }}
                                                    aria-label="Delete row"
                                                >
                                                    Ya, saya yakin!
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}
