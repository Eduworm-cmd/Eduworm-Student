import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';

export const VideoPlayer = ({ videoUrl, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [player, setPlayer] = useState(null);

  const playerContainerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);


  useEffect(() => {
    // Initialize YouTube Player
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      const ytPlayer = new window.YT.Player('youtube-player', {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          rel: 0,
          showinfo: 0,
          fs: 0,
          disablekb: 1,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startProgressTracking(event.target);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              clearInterval(progressIntervalRef.current);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setProgress(100);
              setCurrentTime(duration);
              clearInterval(progressIntervalRef.current);
            }
          },
        },
      });
    }

    return () => {
      clearInterval(progressIntervalRef.current);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [youtubeId]);

  const startProgressTracking = (playerInstance) => {
    clearInterval(progressIntervalRef.current);

    // Update progress immediately
    updateProgress(playerInstance);

    // Then set up regular updates
    progressIntervalRef.current = setInterval(() => {
      updateProgress(playerInstance);
    }, 200); // Update every 200ms for smooth progress
  };

  const updateProgress = (playerInstance) => {
    try {
      const currentTime = playerInstance.getCurrentTime();
      const duration = playerInstance.getDuration();

      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    } catch (error) {
      console.error('Error updating progress:', error);
      clearInterval(progressIntervalRef.current);
    }
  };

  const handlePlay = () => {
    if (player) {
      player.playVideo();
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const handleMute = () => {
    if (player) {
      if (player.isMuted()) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    }
  };

  const handleReplay = () => {
    if (player) {
      player.seekTo(0);
      player.playVideo();
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSeek = (e) => {
    const seekPercentage = e.target.value;
    const seekTo = (seekPercentage / 100) * duration;
    if (player) {
      player.seekTo(seekTo, true);
      setCurrentTime(seekTo);
      setProgress(seekPercentage);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center ${
        isFullscreen ? '' : 'p-4'
      }`}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={playerContainerRef}
        className={`relative ${
          isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl aspect-video'
        }`}
      >
        {/* YouTube Player */}
        <div id="youtube-player" className="w-full h-full"></div>

        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {/* Clickable area for play/pause */}
          <div
            className="flex-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? handlePause() : handlePlay();
            }}
          ></div>

          {/* Controls bar */}
          <div
            className={`bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            } pointer-events-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f00 0%, #f00 ${progress}%, #4d4d4d ${progress}%, #4d4d4d 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="text-white hover:text-red-400"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={handleMute}
                  className="text-white hover:text-red-400"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleReplay}
                  className="text-white hover:text-red-400"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-red-400"
                >
                  {isFullscreen ? (
                    <Minimize size={20} />
                  ) : (
                    <Maximize size={20} />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Eduworm branding */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-full pointer-events-none">
          <span className="text-white text-sm font-medium">EDUWORM PLAYER</span>
        </div>
      </div>
    </div>
  );
};
