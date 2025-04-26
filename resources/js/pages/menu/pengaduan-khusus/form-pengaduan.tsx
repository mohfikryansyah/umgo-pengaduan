import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Required } from '@/components/ui/required';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format, formatISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, Info } from 'lucide-react';
import { FormEventHandler } from 'react';
import toast from 'react-hot-toast';

type FormPengaduan = {
    judul: string;
    kronologi: string;
    waktu_kejadian: string;
    tempat_kejadian: string;
    anonim: boolean;
    berkas: File | File[];
};

export default function FormPengaduan() {
    const { data, setData, post, errors, processing, reset } = useForm<Required<FormPengaduan>>({
        judul: '',
        kronologi: '',
        waktu_kejadian: formatISO(new Date(), { representation: 'date' }),
        tempat_kejadian: '',
        anonim: false,
        berkas: [],
    });

    const handleFileUpload = (berkas: File[]) => {
        setData('berkas', berkas);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('pengaduan-khusus.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Berhasil mengirim pengaduan');
                reset();
            },
            onError: (e) => {
                console.log(e);
                toast.error('Gagal mengirim pengaduan!');
            },
        });
    };

    const formatDateForLaravel = (date: Date): string => {
        return formatISO(date, { representation: 'date' });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Form Pengaduan Khusus</CardTitle>
                    <Dialog>
                        <DialogTrigger>
                            <Info className="text-muted-foreground size-4" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Informasi</DialogTitle>
                            <DialogDescription>
                                Formulir ini dirancang untuk mengumpulkan laporan terkait insiden khusus seperti pelecehan, kekerasan, diskriminasi,
                                atau tindakan tidak etis lainnya. Semua laporan akan dirahasiakan dan hanya digunakan untuk keperluan penanganan dan
                                penyelesaian kasus.
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </div>
                <CardDescription>Lengkapi form dibawah ini untuk memberikan pengaduan.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="judul">
                            Judul
                            <Required />
                        </Label>
                        <Input id="judul" onChange={(e) => setData('judul', e.target.value)} value={data.judul} />
                        <InputError message={errors.judul} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="kronologi">
                            Kronologi Kejadian
                            <Required />
                        </Label>
                        <Textarea id="kronologi" value={data.kronologi} onChange={(e) => setData('kronologi', e.target.value)} />
                        <InputError message={errors.kronologi} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="waktu_kejadian">
                            Waktu Kejadian
                            <Required />
                        </Label>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn('w-full pl-3 text-left font-normal', !data.waktu_kejadian && 'text-muted-foreground')}
                                >
                                    {data.waktu_kejadian ? format(new Date(data.waktu_kejadian), 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    required
                                    selected={new Date(data.waktu_kejadian)}
                                    onSelect={(date) => {
                                        if (date) {
                                            setData('waktu_kejadian', formatDateForLaravel(date));
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.waktu_kejadian} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tempat_kejadian">
                            Tempat Kejadian
                            <Required />
                        </Label>
                        <Input id="tempat_kejadian" onChange={(e) => setData('tempat_kejadian', e.target.value)} value={data.tempat_kejadian} />
                        <InputError message={errors.tempat_kejadian} />
                    </div>
                    <div className="grid gap-2">
                        <Label>
                            Lampiran
                            <Required />
                        </Label>
                        <div className="mx-auto min-h-96 w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                            <FileUpload isMultiple={true} onChange={handleFileUpload} />
                        </div>
                        <InputError message={errors.berkas} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                            <Switch id="anonim" onCheckedChange={(checked) => setData('anonim', checked)} />
                            <Label htmlFor="anonim">Anonim</Label>
                        </div>
                        <p className="text-muted-foreground text-xs">Perhatian: jika diaktifkan, pengaduan ini tidak akan tampil di landing page.</p>
                        {/* <InputError message={errors.anonim} /> */}
                    </div>

                    <Button disabled={processing}>Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}
