import { BookOpen, Target, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ContentPage = () => {
    const location = useLocation();
    const assignment = location.state.assignment;
    if (!assignment?.content?.length) return null;
    const navigate = useNavigate();
    const content = assignment.content[0];


    const getYouTubeId = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const getEmbedUrl = (url) => {
        const videoId = getYouTubeId(url);
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-1 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button className="p-2 hover:bg-gray-300 rounded-xl transition-colors cursor-pointer" onClick={()=>navigate('/main/assignment')}>
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    {content.title}
                                </h1>
                                <p className="text-gray-600">Study Material • Assignment: {assignment.title}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(assignment.notificationTime).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Video/Media Section */}
                        {content.assetUrl && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="bg-black rounded-2xl overflow-hidden aspect-video">
                                    {getEmbedUrl(content.assetUrl) ? (
                                        <iframe
                                            src={getEmbedUrl(content.assetUrl)}
                                            title={content.title}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={content.thumbnail || 'https://via.placeholder.com/800x450/1f2937/9ca3af?text=Content+Preview'}
                                                alt={content.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/800x450/1f2937/9ca3af?text=Content+Preview';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content Description */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this material</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {content.description}
                                </p>
                            </div>

                            {/* Tags */}
                            {content.tags && content.tags.length > 0 && (
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics covered:</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {content.tags.map((tag, index) => (
                                            <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-200 transition-colors">
                                                {typeof tag === 'string' ? tag.replace(/[\[\]"\\]/g, '') : tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Assignment Instructions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-yellow-600" />
                                Assignment Instructions
                            </h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Review the study material thoroughly</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Take notes on key concepts and important points</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Complete any practice exercises or questions</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Prepare for discussion or assessment</p>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Assignment Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Assignment ID</p>
                                    <p className="text-gray-800 font-mono text-sm">{content._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Start Time</p>
                                    <p className="text-gray-800">{assignment.startTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${assignment.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {assignment.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Ready to start?</h3>
                            <p className="text-blue-100 mb-4">Begin your assignment and track your progress.</p>
                            <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                                Start Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContentPage;