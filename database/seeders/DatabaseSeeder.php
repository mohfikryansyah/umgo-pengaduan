<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $mahasiswaRole = Role::create(['name' => 'mahasiswa']);
        $rektorRole = Role::create(['name' => 'rektor']);
        $adminRole = Role::create(['name' => 'admin']);
        $warek1Role = Role::create(['name' => 'warek_1']);
        $warek2Role = Role::create(['name' => 'warek_2']);
        $warek3Role = Role::create(['name' => 'warek_3']);

        User::factory()->create([
            'name' => 'Mohamad Fiqriansyah Panu',
            'username' => 'fiqriansyah',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'moh.fikryansyah@gmail.com',
        ])->assignRole($adminRole);

        User::factory()->create([
            'name' => 'Mahasiswa',
            'username' => 'mahasiswa',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'mahasiswa@gmail.com',
            'nim' => '531420047',
        ])->assignRole($mahasiswaRole);
        
        User::factory()->create([
            'name' => 'Mahasiswa2',
            'username' => 'mahasiswa2',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'mahasiswa2@gmail.com',
            'nim' => '531420042',
        ])->assignRole($mahasiswaRole);

        User::factory()->create([
            'name' => 'Warek 1',
            'username' => 'warek1',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'warek1@gmail.com',
        ])->assignRole($warek1Role);

        User::factory()->create([
            'name' => 'Warek 2',
            'username' => 'warek2',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'warek2@gmail.com',
        ])->assignRole($warek2Role);

        User::factory()->create([
            'name' => 'Warek 3',
            'username' => 'warek3',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'warek3@gmail.com',
        ])->assignRole($warek3Role);

        User::factory()->create([
            'name' => 'Rektor',
            'username' => 'rektor',
            'avatar' => 'avatars/fiqriansyah.jpg',
            'email' => 'rektor@gmail.com',
        ])->assignRole($rektorRole);
    }
}
