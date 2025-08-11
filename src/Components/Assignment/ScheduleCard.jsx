import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Calendar,
  Clock,
  Clock3,
  Gamepad2,
  List,
  Play,
  User,
  Video,
} from 'lucide-react';
import { VideoPlayer } from '../Video/VideoPlayer';
import axios from 'axios';
import { apiService } from '../../api/apiService';

export const ScheduleCard = ({ schedule }) => {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContents, setShowContents] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const hasContent = schedule.content && schedule.content.length > 0;
  const hasPlaylist = schedule.playlistIds && schedule.playlistIds.length > 0;

  const getScheduleContentInfo = (schedule) => {
    const hasDirectContent = schedule.content && schedule.content.length > 0;
    const hasPlaylistContent =
      schedule.playlistIds && schedule.playlistIds.length > 0;

    if (hasPlaylistContent) {
      const allContents = schedule.playlistIds.reduce((acc, playlist) => {
        if (playlist.contents && playlist.contents.length > 0) {
          return [...acc, ...playlist.contents.flat()];
        }
        return acc;
      }, []);

      return {
        type: 'playlist',
        contentCount: allContents.length,
        contents: allContents,
        playlistInfo: schedule.playlistIds,
      };
    } else if (hasDirectContent) {
      return {
        type: 'content',
        contentCount: schedule.content.length,
        contents: schedule.content,
        playlistInfo: null,
      };
    }

    return {
      type: 'empty',
      contentCount: 0,
      contents: [],
      playlistInfo: null,
    };
  };

  const contentInfo = getScheduleContentInfo(schedule);

  useEffect(() => {
    const fetchAllContent = async () => {
      if (!hasContent || !schedule.content || schedule.content.length === 0)
        return;

      try {
        setLoading(true);
        const contentPromises = schedule.content.map((id) =>
          apiService.get(`/videos/video/${id}`),
        );

        const responses = await Promise.all(contentPromises);
        const contentData = responses.map((response) => response.data);
        setContentData(contentData);

        console.log('Content Data:', contentData);
      } catch (error) {
        console.log('Error fetching content:', error);
        setContentData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, [hasContent, schedule.content]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'GAME':
        return <Gamepad2 className="w-4 h-4 text-green-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = () => {
    switch (contentInfo.type) {
      case 'playlist':
        return <List className="w-5 h-5 text-blue-500" />;
      case 'content':
        return <Play className="w-5 h-5 text-green-500" />;
      default:
        return <Clock3 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: 'bg-blue-100 text-blue-800 border-blue-200',
      Science: 'bg-green-100 text-green-800 border-green-200',
      English: 'bg-purple-100 text-purple-800 border-purple-200',
      History: 'bg-orange-100 text-orange-800 border-orange-200',
      General: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getThumbnail = () => {
    if (contentInfo.type === 'playlist' && schedule.playlistIds[0]?.thumbnail) {
      return schedule.playlistIds[0].thumbnail;
    } else if (contentInfo.type === 'content' && contentData[0]?.thumbnail) {
      return contentData[0].thumbnail;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const handlePlayVideo = (url) => {
    setCurrentVideoUrl(url);
    setShowVideoPlayer(true);
  };

  const renderActionButton = () => {
    if (contentInfo.type === 'playlist') {
      return (
        <button
          onClick={() => setShowContents(!showContents)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          {showContents ? 'Hide Videos' : 'View Videos'}
        </button>
      );
    } else if (contentInfo.type === 'content') {
      return (
        <button
          onClick={() => setShowContents(!showContents)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {showContents ? 'Hide Videos' : 'View Videos'}
        </button>
      );
    } else {
      return (
        <button
          disabled
          className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          No Content
        </button>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 p-4 border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Thumbnail */}
        <div className="lg:w-48 flex-shrink-0">
          {loading ? (
            <div className="w-full h-32 lg:h-28 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <img
              src={getThumbnail()}
              alt={schedule.title}
              className="w-full h-32 lg:h-28 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSubjectColor(
                schedule.subject,
              )}`}
            >
              {schedule.subject || 'General'}
            </span>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs font-medium capitalize">
                {contentInfo.type === 'playlist'
                  ? 'Playlist'
                  : contentInfo.type === 'content'
                    ? 'Direct Content'
                    : 'No Content'}
              </span>
            </div>
            {schedule.isActive && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {schedule.title}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(schedule.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Start Time: {schedule.startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{schedule.instructor || 'No instructor assigned'}</span>
            </div>
            <div className="flex items-center gap-2">
              {contentInfo.type === 'playlist' ? (
                <List className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>
                {contentInfo.type === 'playlist'
                  ? `${contentInfo.contentCount} items in playlists`
                  : contentInfo.type === 'content'

                    ? `${contentInfo.contentCount} direct content(s)`
                    : 'No content'}
              </span>
              <div className=''>
                {renderActionButton()}
              </div>
            </div>
          </div>


          {/* Content List - Show when button is clicked for playlists or direct content */}
          {showContents &&
            contentInfo.type === 'playlist' &&
            contentInfo.playlistInfo?.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Playlist Contents ({contentInfo.contentCount})
                </h4>

                {contentInfo.playlistInfo.map((playlist) => (
                  <div key={playlist._id} className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <List className="w-4 h-4" />
                      {playlist.Title}
                    </h5>

                    {playlist.contents && playlist.contents.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {playlist.contents.flat().map((content, index) => (
                          <div
                            key={content._id || index}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() =>
                              content.assetUrl &&
                              handlePlayVideo(content.assetUrl)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${content.type === 'GAME'
                                    ? 'bg-green-100'
                                    : 'bg-blue-100'
                                  }`}
                              >
                                {getContentTypeIcon(content.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-gray-900 truncate text-sm">
                                  {content.title ||
                                    `${content.type} ${index + 1}`}
                                </h6>
                                <p className="text-xs text-gray-500">
                                  {content.type || 'CONTENT'} •{' '}
                                  {content.domain || 'General'} •{' '}
                                  {content.subdomain || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {content.shortDescription}
                                </p>
                              </div>
                              <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* Direct content list */}
          {showContents && contentInfo.type === 'content' && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Content Items ({contentInfo.contentCount})
              </h4>

              {loading ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-gray-600">
                      Loading content details...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {contentData.map((content, index) => (
                    <div
                      key={content._id || index}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        content.assetUrl && handlePlayVideo(content.assetUrl)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Video className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-gray-900 truncate text-sm">
                            {content.title || `Video ${index + 1}`}
                          </h6>
                          <p className="text-xs text-gray-500">
                            VIDEO • {content.domain || 'General'} •{' '}
                            {content.subdomain || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {content.description || 'No description available'}
                          </p>
                        </div>
                        <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showVideoPlayer && (
        <VideoPlayer
          videoUrl={currentVideoUrl}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};
