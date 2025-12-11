import { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, FastForward, Rewind, MapPin, Clock } from "lucide-react";
import { TruckData, generateHistoricalPath, KHARADI_CENTER } from "@/data/fleetData";
import { createTruckMarkerIcon } from "@/components/TruckIcon";

interface TruckJourneyReplayModalProps {
  truck: TruckData | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const containerStyle = { width: '100%', height: '400px' };

export function TruckJourneyReplayModal({ 
  truck, 
  isOpen, 
  onClose, 
  selectedDate 
}: TruckJourneyReplayModalProps) {
  const [pathData, setPathData] = useState<{ lat: number; lng: number; timestamp: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load path data when truck or date changes
  useEffect(() => {
    if (truck && isOpen) {
      const history = generateHistoricalPath(truck.id, selectedDate);
      setPathData(history.path);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  }, [truck, selectedDate, isOpen]);

  // Handle playback
  useEffect(() => {
    if (isPlaying && pathData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= pathData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, pathData.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0]);
    setIsPlaying(false);
  };

  const handleSpeedChange = () => {
    setPlaybackSpeed((prev) => (prev >= 4 ? 0.5 : prev * 2));
  };

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    onClose();
  };

  if (!truck) return null;

  const currentPosition = pathData[currentIndex] || truck.position;
  const traveledPath = pathData.slice(0, currentIndex + 1).map(p => ({ lat: p.lat, lng: p.lng }));
  const remainingPath = pathData.slice(currentIndex).map(p => ({ lat: p.lat, lng: p.lng }));

  const progress = pathData.length > 0 ? ((currentIndex / (pathData.length - 1)) * 100).toFixed(0) : 0;
  const currentTime = pathData[currentIndex]?.timestamp?.split(' ')[1] || '--:--';
  const startTime = pathData[0]?.timestamp?.split(' ')[1] || '--:--';
  const endTime = pathData[pathData.length - 1]?.timestamp?.split(' ')[1] || '--:--';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            Journey Replay - {truck.truckNumber}
            <Badge variant="outline" className="capitalize ml-2">{truck.truckType}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Map Container */}
          <div className="rounded-lg overflow-hidden border border-border">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentPosition}
              zoom={15}
              onLoad={onMapLoad}
              options={{
                styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {isMapLoaded && (
                <>
                  {/* Start Marker */}
                  {pathData.length > 0 && (
                    <Marker
                      position={pathData[0]}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#22c55e" stroke="white" stroke-width="2"/>
                            <text x="12" y="16" text-anchor="middle" font-size="10" fill="white" font-weight="bold">S</text>
                          </svg>
                        `)}`,
                        scaledSize: new google.maps.Size(24, 24),
                      }}
                      title="Start Point"
                    />
                  )}

                  {/* End Marker (if completed) */}
                  {currentIndex === pathData.length - 1 && pathData.length > 0 && (
                    <Marker
                      position={pathData[pathData.length - 1]}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                            <text x="12" y="16" text-anchor="middle" font-size="10" fill="white" font-weight="bold">E</text>
                          </svg>
                        `)}`,
                        scaledSize: new google.maps.Size(24, 24),
                      }}
                      title="End Point"
                    />
                  )}

                  {/* Traveled Path (solid green) */}
                  {traveledPath.length > 1 && (
                    <Polyline
                      path={traveledPath}
                      options={{
                        strokeColor: "#22c55e",
                        strokeOpacity: 1,
                        strokeWeight: 4,
                      }}
                    />
                  )}

                  {/* Remaining Path (dashed gray) */}
                  {remainingPath.length > 1 && (
                    <Polyline
                      path={remainingPath}
                      options={{
                        strokeColor: "#9ca3af",
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        icons: [{
                          icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
                          offset: '0',
                          repeat: '15px'
                        }],
                      }}
                    />
                  )}

                  {/* Current Truck Position */}
                  <Marker
                    position={currentPosition}
                    icon={{
                      url: createTruckMarkerIcon("moving", truck.truckType),
                      scaledSize: new google.maps.Size(48, 56),
                      anchor: new google.maps.Point(24, 56),
                    }}
                  />
                </>
              )}
            </GoogleMap>
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Start: {startTime}</span>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {currentTime}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>End: {endTime}</span>
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Progress Slider */}
          <div className="px-2">
            <Slider
              value={[currentIndex]}
              max={Math.max(pathData.length - 1, 1)}
              step={1}
              onValueChange={handleSliderChange}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>{progress}% completed</span>
              <span>100%</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              title="Restart"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 5))}
              title="Rewind"
            >
              <Rewind className="h-4 w-4" />
            </Button>

            {isPlaying ? (
              <Button
                size="lg"
                onClick={handlePause}
                className="w-16 h-16 rounded-full"
              >
                <Pause className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handlePlay}
                className="w-16 h-16 rounded-full"
                disabled={currentIndex >= pathData.length - 1}
              >
                <Play className="h-6 w-6 ml-1" />
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.min(pathData.length - 1, currentIndex + 5))}
              title="Fast Forward"
            >
              <FastForward className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={handleSpeedChange}
              className="min-w-[60px]"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </Button>
          </div>

          {/* Truck Info */}
          <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg text-sm">
            <div>
              <p className="text-muted-foreground">Driver</p>
              <p className="font-medium">{truck.driver}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Route</p>
              <p className="font-medium">{truck.route}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{selectedDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Points</p>
              <p className="font-medium">{pathData.length} GPS Updates</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
