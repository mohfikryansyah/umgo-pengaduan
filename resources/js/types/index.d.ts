import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    roles?: string[];
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username: string;
    nim: string;
    email: string;
    roles: string[];
    avatar: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    size: string;
    roles_list: string[];
    [key: string]: unknown;
}

export interface Pengaduan {
    id: number | string;
    judul: string;
    isi: string;
    bidang: string;
    validasi_rektor: boolean | number;
    created_at: string;
    updated_at: string;
    berkas: Berkas[];
    status: Status[];
    latest_status: Status;
    tanggapans: Tanggapan[];
    user: User;
}

export interface Berkas {
    id: number | string;
    path_berkas: string;
    created_at: string;
    updated_at: string;
}

export interface Status {
    id: number | string;
    status: string;
    tindakan: string;
    created_at: string;
    updated_at: string;
}

export interface Tanggapan {
    id: number | string;
    user: User;
    tanggapan: string;
    created_at: string;
    updated_at: string;
}