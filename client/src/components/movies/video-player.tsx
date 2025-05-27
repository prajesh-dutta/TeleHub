import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { moviesService } from "@/lib/moviesApi";
import { useAuth } from "@/lib/auth";

interface VideoPlayerProps {
  movieId: string;
  title: string;
  posterUrl?: string;
  className?: string;
  onProgressUpdate?: (progress: number) => void;
}

type VideoQuality = '360p' | '480p' | '720p' | '1080p';

export default function VideoPlayer({ movieId, title, posterUrl, className, onProgressUpdate }: VideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>('720p');
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>(['720p']);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadVideo();
    loadAvailableQualities();
  }, [movieId]);

  useEffect(() => {
    if (currentQuality) {
      loadVideoForQuality(currentQuality);
    }
  }, [currentQuality]);

  const loadAvailableQualities = async () => {
    try {
      const response = await fetch(`/api/streaming/qualities/${movieId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableQualities(data.qualities || ['720p']);
      }
    } catch (err) {
      console.error("Error loading qualities:", err);
      setAvailableQualities(['720p']);
    }
  };

  const loadVideoForQuality = async (quality: VideoQuality) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/streaming/secure-url/${movieId}/${quality}`);
      if (response.ok) {
        const data = await response.json();
        setVideoUrl(data.streamingUrl);
      } else {
        throw new Error('Failed to get streaming URL');
      }
    } catch (err) {
      setError("Failed to load video. Please try again.");
      console.error("Error loading video:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideo = async () => {
    return loadVideoForQuality(currentQuality);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      setCurrentTime(newTime);
      
      // Update progress every 10 seconds
      if (user && duration > 0 && Math.floor(newTime) % 10 === 0) {
        const progress = (newTime / duration) * 100;
        updateProgress(progress);
        onProgressUpdate?.(progress);
      }
    }
  };

  const updateProgress = async (progress: number) => {
    try {
      await moviesService.updateWatchProgress(movieId, progress);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={cn("relative bg-gray-900 overflow-hidden flex items-center justify-center", className)}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("relative bg-gray-900 overflow-hidden flex items-center justify-center", className)}>
        <div className="text-white text-center">
          <p className="mb-4">{error}</p>
          <Button onClick={loadVideo} className="bg-white text-black hover:bg-gray-100">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className={cn("relative bg-gray-900 overflow-hidden flex items-center justify-center", className)}>
        <div className="text-white text-center">
          <p>Video not available</p>
        </div>
      </div>
    );
  }  return (
    <div 
      className={cn("relative bg-gray-900 overflow-hidden group", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain relative z-0"
        poster={posterUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 z-20",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="h-20 w-20 rounded-full bg-black/50 border border-white/50 hover:border-white text-white hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 bg-black/50">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer [&>span]:bg-white [&>span>span]:bg-gray-300"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => skip(10)}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-24 [&>span]:bg-white [&>span>span]:bg-gray-300"
                />
              </div>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Quality Settings */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg p-3 min-w-[120px]">
                    <div className="text-white text-sm mb-2">Quality</div>
                    <Select value={currentQuality} onValueChange={(value: VideoQuality) => setCurrentQuality(value)}>
                      <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {availableQualities.map((quality) => (
                          <SelectItem key={quality} value={quality} className="text-white hover:bg-gray-700">
                            {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}