import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

export default function DetailPengaduan({
    title,
    description,
    bidang,
    className = '',
}: {
    title: string;
    description?: string;
    bidang: string;
    className?: string;
}) {
    return (
        <div className={cn('space-y-0.5', className)}>
            <div className="flex items-center justify-between w-full">
                <h2 className="max-w-xl text-xl font-semibold tracking-tight">{title}</h2>
                <Badge variant={'outline'}>{bidang}</Badge>
            </div>
            {description && <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
        </div>
    );
}
