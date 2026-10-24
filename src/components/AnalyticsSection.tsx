'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  type DatePreset,
  type RangePreset,
  formatReadTime,
  rangeForPreset,
} from '@/lib/analytics-client';
import { DateRangeFilter, StatCard, ViewsChart, formatNumber } from './AnalyticsUI';
import styles from './AnalyticsUI.module.css';

interface RangeState {
  preset: RangePreset;
  fromDay: string;
  toDay: string;
}

export default function AnalyticsSection() {
  const router = useRouter();
  const [range, setRange] = useState<RangeState>(() => ({
    preset: '30d',
    ...rangeForPreset('30d'),
  }));

  const stats = useQuery(api.analytics.overview, {
    fromDay: range.fromDay,
    toDay: range.toDay,
  });

  const applyPreset = (preset: DatePreset) => {
    setRange({ preset, ...rangeForPreset(preset) });
  };

  const applyCustom = (fromDay: string, toDay: string) => {
    if (!fromDay || !toDay || fromDay > toDay) return;
    setRange({ preset: 'custom', fromDay, toDay });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Analytics</h2>
          <p className={styles.sectionSubtitle}>
            How readers are interacting with your published articles.
          </p>
        </div>
        <DateRangeFilter
          preset={range.preset}
          fromDay={range.fromDay}
          toDay={range.toDay}
          onPresetChange={applyPreset}
          onCustomChange={applyCustom}
        />
      </div>

      {stats === undefined ? (
        <p className={styles.loading}>Loading analytics…</p>
      ) : (
        <>
          <div className={styles.cards}>
            <StatCard
              label="Total views"
              value={formatNumber(stats.totals.views)}
              hint={`${stats.totals.posts} published article${stats.totals.posts === 1 ? '' : 's'}`}
            />
            <StatCard
              label="Unique readers"
              value={formatNumber(stats.totals.uniqueReaders)}
              hint="First-time readers in range"
            />
            <StatCard
              label="Downloads"
              value={formatNumber(stats.totals.downloads)}
              hint="File attachments"
            />
            <StatCard
              label="Avg. read time"
              value={formatReadTime(stats.totals.avgReadMs)}
              hint="Time on article"
            />
          </div>

          {stats.topPost && (
            <div className={styles.topPost}>
              <span className={styles.topPostLabel}>Most viewed article</span>
              <Link
                href={`/dashboard/analytics/${stats.topPost.postId}`}
                className={styles.topPostTitle}
              >
                {stats.topPost.title}
              </Link>
              <span className={styles.topPostViews}>
                {formatNumber(stats.topPost.views)} views
              </span>
            </div>
          )}

          {stats.totals.views > 0 ? (
            <ViewsChart data={stats.daily} />
          ) : (
            <p className={styles.empty}>
              No views in this period yet. Analytics appear as soon as readers open an article.
            </p>
          )}

          {stats.posts.length === 0 ? (
            <p className={styles.empty}>
              You haven&apos;t published any articles yet. Use the editor above to write your first one.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Views</th>
                    <th>Unique</th>
                    <th>Downloads</th>
                    <th>Avg. read</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {stats.posts.map((post) => (
                    <tr
                      key={post.postId}
                      className={styles.clickableRow}
                      onClick={() => router.push(`/dashboard/analytics/${post.postId}`)}
                    >
                      <td>
                        <Link
                          href={`/dashboard/analytics/${post.postId}`}
                          className={styles.postTitle}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.title}
                        </Link>
                        <span className={styles.postDate}>
                          {new Date(post.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className={styles.numberCell}>{formatNumber(post.views)}</td>
                      <td className={styles.numberCell}>{formatNumber(post.uniqueReaders)}</td>
                      <td className={styles.numberCell}>{formatNumber(post.downloads)}</td>
                      <td className={styles.numberCell}>{formatReadTime(post.avgReadMs)}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            href={`/dashboard/analytics/${post.postId}`}
                            className={`${styles.actionLink} ${styles.primaryLink}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Analytics
                          </Link>
                          <Link
                            href={`/dashboard?edit=${post.postId}`}
                            className={styles.actionLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/insights/${post.postId}`}
                            className={styles.actionLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
