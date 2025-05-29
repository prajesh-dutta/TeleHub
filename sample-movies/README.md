# TeleHub Sample Movies

This folder contains sample public domain movies for TeleHub streaming platform.

## Folder Structure

Each movie should have this structure:
```
movie-folder/
├── video.mp4           (Main movie file)
├── poster.jpg          (Movie poster - 300x450px recommended)
├── backdrop.jpg        (Background image - 1920x1080px recommended)
└── metadata.json       (Movie information)
```

## Recommended Public Domain Movies

1. **Nosferatu (1922)** - Classic horror film
2. **The Cabinet of Dr. Caligari (1920)** - German expressionist film
3. **A Trip to the Moon (1902)** - Early sci-fi film
4. **The Great Train Robbery (1903)** - Early western
5. **Metropolis (1927)** - Science fiction masterpiece
6. **Charlie Chaplin films** - Many are public domain
7. **Night of the Living Dead (1968)** - Horror classic

## Where to Download Public Domain Movies

- Archive.org (Internet Archive)
- Wikimedia Commons
- Public Domain Torrents
- Classic Cinema Online

## File Requirements

- **Video**: MP4 format, H.264 codec recommended
- **Poster**: JPG format, 300x450px (2:3 aspect ratio)
- **Backdrop**: JPG format, 1920x1080px (16:9 aspect ratio)
- **Metadata**: JSON format with movie information

## Upload Process

1. Add your movie files to the appropriate folders
2. Run: `node scripts/upload-movies.js`
3. The script will upload to GCP and add to MongoDB
