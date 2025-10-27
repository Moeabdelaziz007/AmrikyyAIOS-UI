import React from 'react';
import { ViralPost } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ViralFeedWidgetProps {
    posts: ViralPost[];
}

const ViralFeedWidget: React.FC<ViralFeedWidgetProps> = ({ posts }) => {
    const { t } = useLanguage();

    return (
        <div className="glass-effect rounded-xl">
             <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-pink-400 text-lg">celebration</span>
                    <h2 className="font-medium text-sm">{t('viral_feed.title')}</h2>
                </div>
            </div>
            <div className="space-y-4 p-4 max-h-96 overflow-y-auto">
                {posts.length === 0 && <p className="text-xs text-center text-text-muted py-4">The feed is quiet... Share something to get started!</p>}
                {posts.map(post => (
                    <div key={post.id} className="bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">{post.author.charAt(0)}</div>
                            <p className="text-xs font-semibold">{post.author}</p>
                        </div>
                        <p className="text-xs text-text-secondary mb-2 italic">"{post.socialPost.caption}"</p>
                        <p className="text-[10px] text-cyan-400">{post.socialPost.hashtags.join(' ')}</p>
                        <div className="flex items-center gap-4 text-xs text-text-muted mt-3 pt-2 border-t border-white/5">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">thumb_up</span> {post.likes}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">visibility</span> {post.views}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViralFeedWidget;
