import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Required } from '@/components/ui/required';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import toast from 'react-hot-toast';

type FormPengaduan = {
    judul: string;
    isi: string;
    bidang: 'Akademik' | 'Kemahasiswaan' | 'Keuangan dan Umum' | 'Khusus';
    berkas: File | File[] | null;
};

export default function FormPengaduan() {
    const { data, setData, post, errors, processing, reset } = useForm<Required<FormPengaduan>>({
        judul: '',
        isi: '',
        bidang: 'Akademik',
        berkas: null,
    });

    const handleFileUpload = (berkas: File[]) => {
        setData('berkas', berkas);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('pengaduan.store'), {
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Form Pengaduan</CardTitle>
                <CardDescription>Lengkapi form dibawah ini untuk memberikan pengaduan.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label>Bidang</Label>
                        <RadioGroup
                            value={data.bidang}
                            onValueChange={(value) => setData('bidang', value as FormPengaduan['bidang'])}
                            className="flex max-w-full"
                        >
                            <Label
                                htmlFor="Akademik"
                                className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex flex-1 flex-col rounded-lg border p-3 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Akademik" id="Akademik" />
                                    <Label htmlFor="Akademik">Akademik</Label>
                                </div>
                                <p className="text-muted-foreground mt-1 ml-6 text-xs">
                                    {' '}
                                    Menangani pengaduan terkait proses pembelajaran, kurikulum, jadwal kuliah, dosen, dan layanan akademik lainnya.
                                </p>
                            </Label>
                            <Label
                                htmlFor="Kemahasiswaan"
                                className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex flex-1 flex-col rounded-lg border p-3 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Kemahasiswaan" id="Kemahasiswaan" />
                                    <Label htmlFor="Kemahasiswaan">Kemahasiswaan</Label>
                                </div>
                                <p className="text-muted-foreground mt-1 ml-6 text-xs">
                                    Mengurusi hal-hal seputar kegiatan mahasiswa, organisasi, beasiswa, pembinaan karakter, serta layanan konseling.
                                </p>
                            </Label>
                            <Label
                                htmlFor="Keuangan dan Umum"
                                className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex flex-1 flex-col rounded-lg border p-3 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Keuangan dan Umum" id="Keuangan dan Umum" />
                                    <Label htmlFor="Keuangan dan Umum">Keuangan dan Umum</Label>
                                </div>
                                <p className="text-muted-foreground mt-1 ml-6 text-xs">
                                    Mencakup pengaduan terkait biaya kuliah, administrasi keuangan, sarana prasarana kampus, serta layanan umum
                                    lainnya.
                                </p>
                            </Label>
                            <Label
                                htmlFor="Khusus"
                                className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/30 flex flex-1 flex-col rounded-lg border p-3 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Khusus" id="Khusus" />
                                    <Label htmlFor="Khusus">Khusus</Label>
                                </div>
                                <p className="text-muted-foreground mt-1 ml-6 text-xs">
                                    Pengaduan sensitif, rahasia, atau tidak bisa dikategorikan secara umum. Misalnya: tindakan kekerasan, pelecehan
                                </p>
                            </Label>
                        </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="judul">
                            Judul
                            <Required />
                        </Label>
                        <Input id="judul" onChange={(e) => setData('judul', e.target.value)} value={data.judul} />
                        <InputError message={errors.judul} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="isi">
                            Isi Pengaduan
                            <Required />
                        </Label>
                        <Textarea id="isi" value={data.isi} onChange={(e) => setData('isi', e.target.value)} />
                        <InputError message={errors.isi} />
                    </div>
                    <div className="grid gap-2">
                        <Label>
                            Lampiran
                            <Required />
                        </Label>
                        <div className="mx-auto min-h-96 w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                            <FileUpload isMultiple={true} onChange={handleFileUpload} />
                        </div>
                    </div>

                    <Button disabled={processing}>Submit</Button>
                </form>
            </CardContent>
        </Card>
    );
}
