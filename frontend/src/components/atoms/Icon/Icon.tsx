import React from 'react';

// Mapeo de nombres de iconos a paths SVG
const iconPaths: { [key: string]: React.ReactNode } = {
  // --- Íconos de la Barra Superior y Acciones ---
  search: <path d="M10 17c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zM21 21l-6-6" />,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  user: <> <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /> </>,
  
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  trash: <> <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /> </>,
  
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  document: <> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /> </>,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  git: <> <path d="M18 18A3 3 0 0 0 21 15c0-1.66-1.34-3-3-3s-3 1.34-3 3c0 1.66 1.34 3 3 3zM6 6c0-1.66-1.34-3-3-3s-3 1.34-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3zM18 15c0 3.87-3.13 7-7 7s-7-3.13-7-7M6 15c0 3.87-3.13 7-7 7s-7-3.13-7-7" /> </>,
  
  // --- Íconos del Sidebar y Carpetas ---
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  home: <> <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /> </>,
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  project: <> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M6 10v4" /><path d="M10 12v2" /><path d="M2 16h20" /> </>,
  
  // 🛑 CORRECCIÓN DEL CALENDARIO: Envuelto en fragmento <> </>
  calendar: <> <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /> </>,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  users: <> <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /> </>,
  
  repository: <path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M4 11v10M20 11v10M4 21h16" />,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  robot: <> <path d="M12 18H5M19 18h-7M6 10h.01M18 10h.01M19 7h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M10 7h2v2h-2z" /> </>,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  chart: <> <path d="M3 3v18h18" /><path d="M18 17V9M13 17v-5M8 17v-2" /> </>,
  
  // 🛑 CORRECCIÓN: Envuelto en fragmento <> </>
  settings: <> <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 0-.74 2.82l.46.61a2 2 0 0 1-.72 2.76l-1.4 1a2 2 0 0 0-.32 3.58l.1.07a2 2 0 0 1 .49 2.08v.21a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 0 .74-2.82l-.46-.61a2 2 0 0 1 .72-2.76l1.4-1a2 2 0 0 0 .32-3.58l-.1-.07a2 2 0 0 1-.49-2.08V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /> </>,
  
  folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
  
  chevronRight: <path d="M9 18l6-6-6-6" />,
  
  logo: <text x="0" y="20" fontSize="24" fontWeight="bold">F</text>
};

interface IconProps {
  name: keyof typeof iconPaths | string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', onClick }) => {
  const SvgContent = iconPaths[name];
  
  if (!SvgContent) {
    // 🛑 CORRECCIÓN: Añadimos (name as string) para asegurar el tipado.
    return <span className={className} style={{ fontSize: size, color: 'red' }}>[{(name as string).toUpperCase()}]</span>;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onClick={onClick}
    >
      {SvgContent}
    </svg>
  );
};