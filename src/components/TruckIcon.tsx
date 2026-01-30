import { TruckStatus, TruckType } from "@/data/fleetData";

interface TruckIconProps {
  status: TruckStatus;
  type: TruckType;
  size?: number;
  className?: string;
}

const statusColors: Record<TruckStatus, string> = {
  moving: "#22c55e",
  idle: "#f59e0b",
  dumping: "#3b82f6",
  offline: "#6b7280",
  breakdown: "#ef4444",
};

export const TruckIcon = ({ status, type, size = 32, className = "" }: TruckIconProps) => {
  const color = statusColors[status];
  const isPrimary = type === "primary";
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Truck body */}
      <rect x="2" y="12" width="20" height="12" rx="2" fill={color} />
      {/* Cabin */}
      <rect x="18" y="8" width="10" height="16" rx="2" fill={color} />
      {/* Window */}
      <rect x="20" y="10" width="6" height="5" rx="1" fill="white" fillOpacity="0.8" />
      {/* Wheels */}
      <circle cx="8" cy="26" r="3" fill="#374151" stroke="white" strokeWidth="1" />
      <circle cx="24" cy="26" r="3" fill="#374151" stroke="white" strokeWidth="1" />
      {/* Type indicator */}
      {isPrimary ? (
        <text x="11" y="20" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">P</text>
      ) : (
        <text x="11" y="20" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">S</text>
      )}
      {/* Status indicator dot */}
      <circle cx="28" cy="6" r="4" fill={color} stroke="white" strokeWidth="2">
        {status === "moving" && (
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
    </svg>
  );
};

// SVG data URL for Google Maps marker - Realistic garbage truck
export const createTruckMarkerIcon = (status: TruckStatus, type: TruckType): string => {
  const color = statusColors[status];
  const typeLabel = type === "primary" ? "P" : "S";
  const typeBgColor = type === "primary" ? "#1e40af" : "#7c3aed";
  
  const svg = `
    <svg width="48" height="56" viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="54" rx="10" ry="2.5" fill="rgba(0,0,0,0.25)"/>
      
      <!-- Main pin background -->
      <path d="M24 0C14.059 0 6 8.059 6 18c0 12.5 18 36 18 36s18-23.5 18-36C42 8.059 33.941 0 24 0z" fill="${color}" stroke="white" stroke-width="2.5"/>
      
      <!-- Garbage truck body - compactor style -->
      <g transform="translate(9, 6)">
        <!-- Truck bed/compactor -->
        <rect x="0" y="8" width="18" height="12" rx="1.5" fill="white" opacity="0.95"/>
        <rect x="1" y="9" width="16" height="10" rx="1" fill="${color}" opacity="0.3"/>
        
        <!-- Hydraulic lines on compactor -->
        <line x1="3" y1="11" x2="3" y2="17" stroke="white" stroke-width="0.8" opacity="0.7"/>
        <line x1="15" y1="11" x2="15" y2="17" stroke="white" stroke-width="0.8" opacity="0.7"/>
        
        <!-- Cab -->
        <rect x="18" y="6" width="10" height="14" rx="2" fill="white" opacity="0.95"/>
        
        <!-- Windshield -->
        <rect x="20" y="8" width="6" height="5" rx="1" fill="${color}" opacity="0.4"/>
        <rect x="20.5" y="8.5" width="5" height="4" rx="0.5" fill="white" opacity="0.3"/>
        
        <!-- Door -->
        <rect x="20" y="14" width="6" height="5" rx="0.5" fill="white" opacity="0.6" stroke="${color}" stroke-width="0.3" stroke-opacity="0.5"/>
        
        <!-- Side mirror -->
        <rect x="18" y="10" width="1.5" height="2" rx="0.3" fill="white" opacity="0.8"/>
        
        <!-- Wheels -->
        <circle cx="5" cy="22" r="3.5" fill="#1f2937"/>
        <circle cx="5" cy="22" r="2" fill="#4b5563"/>
        <circle cx="5" cy="22" r="0.8" fill="#1f2937"/>
        
        <circle cx="23" cy="22" r="3.5" fill="#1f2937"/>
        <circle cx="23" cy="22" r="2" fill="#4b5563"/>
        <circle cx="23" cy="22" r="0.8" fill="#1f2937"/>
        
        <!-- Headlight -->
        <circle cx="27" y="16" r="1.2" fill="#fbbf24" opacity="0.9"/>
      </g>
      
      <!-- Type badge -->
      <circle cx="38" cy="8" r="7" fill="${typeBgColor}" stroke="white" stroke-width="2"/>
      <text x="38" y="11" font-size="8" fill="white" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${typeLabel}</text>
      
      <!-- Status pulse for moving trucks -->
      ${status === "moving" ? `<circle cx="38" cy="8" r="7" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.6"><animate attributeName="r" values="7;12;7" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/></circle>` : ''}
    </svg>
  `;
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default TruckIcon;
