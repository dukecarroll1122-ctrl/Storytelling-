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

export const PROJECT_TYPE_ICONS = {
  novel: BookIcon,
  comic: BurstIcon,
  tv: TvIcon,
  movie: FilmIcon,
  game: GamepadIcon,
}
