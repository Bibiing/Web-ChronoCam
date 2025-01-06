# Web-ChronoCam
 ## Link Web

Frontend : https://chronocam-web.vercel.app/

Backend : https://chronocam-web-backend.vercel.app/

## Kelompok 9

|         Nama          |    NRP     |
| :-------------------: | :--------: |
|   Nabil Julian Syah   | 5025231023 |
|    Kasyiful Kurob     | 5025231026 |
| Razky Ageng Syahputra | 5025231056 |

## Langkah - langkah installasi

> Backend

- ubah file .env.example menjadi .env
- pada terminal, lakukan `npm install`
- untuk menjalankan backend, pada teriminal promp `npm run dev`

> Frontend

- pada terminal, lakukan `npm install`
- untuk menjalankan froned, pada teriminal promp `npm run dev`

## Langkah - Langkah Deployment Vercel

> Frontend

- Login vercel, sambungkan akun github
- add new project
- <img src="https://github.com/user-attachments/assets/e0896576-5d18-42e5-acdf-6956a70bcb4b" alt="Deskripsi Gambar" width="300">
- pilih repository Web-Chronocam
- <img src="https://github.com/user-attachments/assets/648d1e08-0db1-44f5-9f7c-d1b3d6dc74b1" alt="Deskripsi Gambar" width="300">
- pada root directory pilih `frontend`
- lalu deploy

> Backend

- Add new project
- pilih repository Web-Chronocam
- pada document root pilih `backend`
- tekan Environtment Variables
- <img src="https://github.com/user-attachments/assets/511963b9-880d-417e-8976-c53e5030b7ba" alt="Deskripsi Gambar" width="300">
- copas env.example
- lalu deploy

> tambahan

- tambahkan link frontend pada middleware CORS dalam file ./backend/server.js
- <img src="https://github.com/user-attachments/assets/5492fb86-d01e-4e77-8fdd-968eef80ded8" alt="Deskripsi Gambar" width="300">
- tambahkan juga pada Authorized redirect URIs
- <img src="https://github.com/user-attachments/assets/c7608463-17e0-4ed2-a4b1-5825ef2af65c" alt="Deskripsi Gambar" width="300">
