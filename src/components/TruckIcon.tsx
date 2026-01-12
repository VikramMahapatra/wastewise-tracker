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

// SVG data URL for Google Maps marker
export const createTruckMarkerIcon = (status: TruckStatus, type: TruckType): string => {
  const color = statusColors[status];
  const typeLabel = type === "primary" ? "P" : "S";
  
  const svg = `
    <svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="20" cy="46" rx="8" ry="2" fill="rgba(0,0,0,0.2)"/>
      <!-- Marker pin -->
      <path d="M20 0C11.716 0 5 6.716 5 15c0 10.5 15 31 15 31s15-20.5 15-31C35 6.716 28.284 0 20 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <!-- Truck icon inside -->
      <rect x="11" y="9" width="12" height="8" rx="1" fill="white"/>
      <rect x="19" y="7" width="6" height="10" rx="1" fill="white"/>
      <circle cx="14" cy="19" r="2" fill="white"/>
      <circle cx="22" cy="19" r="2" fill="white"/>
      <!-- Type label -->
      <text x="17" y="15" font-size="6" fill="${color}" font-weight="bold">${typeLabel}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default TruckIcon;
