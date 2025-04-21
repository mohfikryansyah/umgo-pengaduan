import { cn } from '@/lib/utils';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ props, className }: { props?: ImgHTMLAttributes<HTMLImageElement>; className?: string }) {
    return <img src="/assets/images/logouniv.png" className={cn(className)} alt="Logo Univ" />;
}
