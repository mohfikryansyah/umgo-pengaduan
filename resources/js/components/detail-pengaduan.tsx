import { cn, formatBytes } from '@/lib/utils';
import { Pengaduan } from '@/types';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface Props {
    pengaduan: Pengaduan;
    className?: string;
}

export default function DetailPengaduan({ pengaduan, className }: Props) {
    console.log(pengaduan);
    return (
        <div className={cn('space-y-0.5', className)}>
            <div className="flex w-full items-center justify-between">
                <h2 className="max-w-xl text-xl font-semibold tracking-tight">{pengaduan.judul}</h2>
                <Badge variant={'outline'}>{pengaduan.bidang}</Badge>
            </div>
            {pengaduan.isi && <p className="mt-2 text-sm leading-6 text-gray-600">{pengaduan.isi}</p>}
            <div className="mt-5 flex max-w-xl">
                {pengaduan.berkas.map((berkas, idx) => (
                    <Dialog>
                        <DialogTrigger>
                            <div className="flex max-w-fit gap-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100">
                                <div className="h-11 w-8 overflow-hidden">
                                    <img src={'/storage/' + berkas.path_berkas} alt="Berkas" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="text-sm font-medium text-gray-800">Berkas {idx + 1}</span>
                                    <span className="text-sm text-gray-600">{formatBytes(berkas.size)}</span>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="overflow-hidden">
                            <img src={'/storage/' + berkas.path_berkas} alt="Berkas" />
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
}
