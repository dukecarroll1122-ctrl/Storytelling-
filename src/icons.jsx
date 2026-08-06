const icon = (path) => (props) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {path}
  </svg>
)

export const BookIcon = icon(<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />)
export const BurstIcon = icon(<path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z" />)
export const TvIcon = icon(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="m17 2-5 5-5-5" /></>)
export const FilmIcon = icon(<><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5" /></>)
export const GamepadIcon = icon(<><path d="M6 12h4m-2-2v4M15 13h.01M18 11h.01" /><rect x="2" y="6" width="20" height="12" rx="6" /></>)
export const PenIcon = icon(<path d="m17 3 4 4L7 21H3v-4L17 3Z" />)
export const CloudIcon = icon(<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4 1.5A4 4 0 0 0 6.5 19h11Z" />)
export const SparkleIcon = icon(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />)
export const PackageIcon = icon(<><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>)
export const CheckIcon = icon(<path d="M20 6 9 17l-5-5" />)
export const UploadIcon = icon(<><path d="M12 16V4M5 11l7-7 7 7" /><path d="M4 20h16" /></>)
export const XIcon = icon(<path d="M18 6 6 18M6 6l12 12" />)
export const FileIcon = icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>)
export const FileTextIcon = icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>)
export const SearchIcon = icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>)
export const PaletteIcon = icon(<><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4a2 2 0 0 1 2-2h1.5a3.5 3.5 0 0 0 3.5-3.5C20 6.9 16.4 2 12 2Z" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="10" cy="7" r="1" fill="currentColor" /><circle cx="15" cy="7.5" r="1" fill="currentColor" /></>)
export const MoonIcon = icon(<path d="M21 12.5A9 9 0 1 1 11.5 3 7 7 0 0 0 21 12.5Z" />)
export const SunIcon = icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)
export const ScrollIcon = icon(<><path d="M8 21h10a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" /><path d="M19 17V5a2 2 0 0 0-2-2H8" /></>)
export const FolderIcon = icon(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />)
export const ClockIcon = icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>)
export const FlameIcon = icon(<path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c1.5 1.5 2 3.5 2 5a6 6 0 1 1-12 0c0-4 2-6 3-8 1-1.5 2-2.5 3-4Z" />)
export const QuoteIcon = icon(<><path d="M7 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v-5H6a1 1 0 0 1 1-1V8Z" fill="currentColor" stroke="none" /><path d="M17 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v-5h-2a1 1 0 0 1 1-1V8Z" fill="currentColor" stroke="none" /></>)

export const PROJECT_TYPE_ICONS = {
  novel: BookIcon,
  comic: BurstIcon,
  tv: TvIcon,
  movie: FilmIcon,
  game: GamepadIcon,
}
