import { useEffect, useState, type FormEvent } from 'react';
import type { CommunityComment, SubmissionCommunity } from '../data/types';
import { ValueState } from './ValueState';

interface SubmissionCommunityPanelProps {
  community: SubmissionCommunity;
  submissionId: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function SubmissionCommunityPanel({ community, submissionId }: SubmissionCommunityPanelProps) {
  const storageKey = `opportunity-discussion:${submissionId}`;
  const [saved] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (value && Array.isArray(value.comments) && value.comments.every((c: CommunityComment) => typeof c.id === 'string' && typeof c.body === 'string' && typeof c.author === 'string' && Number.isFinite(c.likes) && Number.isFinite(Date.parse(c.createdAt)) && Array.isArray(c.replies) && c.replies.every(r => typeof r.body === 'string' && typeof r.author === 'string' && Number.isFinite(Date.parse(r.createdAt))))) return value as { comments: CommunityComment[]; liked: Record<string, boolean> };
    } catch { /* Use source discussion when local data cannot be read. */ }
    return { comments: community.comments, liked: {} as Record<string, boolean> };
  });
  const [comments, setComments] = useState<CommunityComment[]>(saved.comments);
  const [liked, setLiked] = useState<Record<string, boolean>>(saved.liked ?? {});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ comments, liked })); }
    catch { setAnnouncement('Storage unavailable. Your discussion changes will last for this session.'); }
  }, [comments, liked, storageKey]);
  const commentCount = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);

  const toggleLike = (comment: CommunityComment) => {
    const isLiked = Boolean(liked[comment.id]);
    setLiked((current) => ({ ...current, [comment.id]: !isLiked }));
    setComments((current) =>
      current.map((item) => item.id === comment.id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item),
    );
    setAnnouncement(isLiked ? 'Like removed.' : 'Comment liked.');
  };

  const submitReply = (event: FormEvent, commentId: string) => {
    event.preventDefault();
    const body = replyText.trim();
    if (!body) return;
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: `${commentId}-reply-${comment.replies.length + 2}`,
                  author: 'Current reviewer',
                  body,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : comment,
      ),
    );
    setReplyText('');
    setReplyingTo(null);
    setAnnouncement('Reply added to the discussion.');
  };

  const submitComment = (event: FormEvent) => {
    event.preventDefault();
    const body = commentText.trim();
    if (!body) return;
    setComments((current) => [
      {
        id: `local-comment-${crypto.randomUUID()}`,
        author: 'Current reviewer',
        body,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      },
      ...current,
    ]);
    setCommentText('');
    setAnnouncement('Comment added to the discussion.');
  };

  return (
    <section className="submission-community" aria-labelledby="submission-community-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Community</p>
          <h3 id="submission-community-title">Proposal discussion</h3>
        </div>
        <span className="review-count-chip">{commentCount} comments</span>
      </div>
      <p>Comments, replies and likes are private notes saved on this device. They are not published to Seer.</p>
      <form className="comment-composer" onSubmit={submitComment}>
        <label htmlFor="new-submission-comment">Add comment</label>
        <textarea
          id="new-submission-comment"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          rows={3}
        />
        <button type="submit" className="primary-action" disabled={!commentText.trim()} title="Write a comment first.">Add comment</button>
      </form>
      {!comments.length ? (
        <div className="review-empty-state">
          <ValueState state="not-recorded" label="No verified discussion content" />
          <p>The current evidence set does not include proposal comments or replies for this verified submission.</p>
        </div>
      ) : (
        <ol className="comment-thread">
          {comments.map((comment) => (
            <li key={comment.id}>
              <article className="comment-card">
                <header>
                  <span className="comment-avatar" aria-hidden="true">{comment.author.slice(0, 2).toUpperCase()}</span>
                  <div><strong>{comment.author}</strong><time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time></div>
                  <button
                    type="button"
                    className={`like-action ${liked[comment.id] ? 'is-liked' : ''}`}
                    aria-pressed={Boolean(liked[comment.id])}
                    onClick={() => toggleLike(comment)}
                  >
                    Like {comment.likes}
                  </button>
                </header>
                <p>{comment.body}</p>
                <footer>
                  <button type="button" className="text-action" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                    Reply
                  </button>
                </footer>
              </article>
              {comment.replies.length > 0 && (
                <ol className="reply-thread">
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>
                      <article className="comment-card comment-card--reply">
                        <header>
                          <span className="comment-avatar" aria-hidden="true">{reply.author.slice(0, 2).toUpperCase()}</span>
                          <div><strong>{reply.author}</strong><time dateTime={reply.createdAt}>{formatDate(reply.createdAt)}</time></div>
                        </header>
                        <p>{reply.body}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              )}
              {replyingTo === comment.id && (
                <form className="reply-form" onSubmit={(event) => submitReply(event, comment.id)}>
                  <label htmlFor={`reply-${comment.id}`}>Reply to {comment.author}</label>
                  <textarea
                    id={`reply-${comment.id}`}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div>
                    <button type="button" className="secondary-action" onClick={() => setReplyingTo(null)}>Cancel</button>
                    <button type="submit" className="primary-action" disabled={!replyText.trim()} title="Write a reply first.">Add reply</button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ol>
      )}
      <p className="record-action-status" role="status">{announcement}</p>
    </section>
  );
}
