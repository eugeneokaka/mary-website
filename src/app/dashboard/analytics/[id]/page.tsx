'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import {
  type DatePreset,
  type RangePreset,
  formatReadTime,
  rangeForPreset,
} from '@/lib/analytics-client';
import {
  DateRangeFilter,
  StatCard,
  ViewsChart,
  formatNumber,
} from '@/components/AnalyticsUI';
import styles from '@/components/AnalyticsUI.module.css';

interface RangeState {
  preset: RangePreset;
  fromDay: string;
  toDay: string;
}

export default function PostAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = id as Id<'blogs'>;
  const router = useRouter();
  const viewer = useQuery(api.auth.viewer);

  const [range, setRange] = useState<RangeState>(() => ({
    preset: '30d',
    ...rangeForPreset('30d'),
  }));

  const stats = useQuery(
    api.analytics.postStats,
    viewer?.authorized
      ? { postId, fromDay: range.fromDay, toDay: range.toDay }
      : 'skip',
  );

  useEffect(() => {
    if (viewer === null) {
      router.push('/login');
    } else if (viewer && !viewer.authorized) {
      router.push('/');
    }
  }, [viewer, router]);

  const applyPreset = (preset: DatePreset) => {
    setRange({ preset, ...rangeForPreset(preset) });
  };

  const applyCustom = (fromDay: string, toDay: string) => {
    if (!fromDay || !toDay || fromDay > toDay) return;
    setRange({ preset: 'custom', fromDay, toDay });
  };

  if (!viewer?.authorized) {
    return <div className={styles.detailPage} />;
  }

  return (
    <div className={styles.detailPage}>
      <Link href="/dashboard" className={styles.backLink}>
        &larr; Back to dashboard
      </Link>

      {stats === undefined ? (
        <p className={styles.loading}>Loading analytics…</p>
      ) : stats === null ? (
        <>
          <h1 className={styles.detailTitle}>Article not found</h1>
          <p className={styles.loading}>
            This article may have been removed or moved.
          </p>
        </>
      ) : (
        <>
          <div className={styles.detailHeader}>
            <div>
              <h1 className={styles.detailTitle}>{stats.title}</h1>
              <div className={styles.detailMeta}>
                <span>
                  Published{' '}
                  {new Date(stats.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <Link href={`/insights/${stats.postId}`} className={styles.backLink}>
                  View live article &rarr;
                </Link>
              </div>
            </div>
            <DateRangeFilter
              preset={range.preset}
              fromDay={range.fromDay}
              toDay={range.toDay}
              onPresetChange={applyPreset}
              onCustomChange={applyCustom}
            />
          </div>

          <div className={styles.cards}>
            <StatCard label="Views" value={formatNumber(stats.views)} hint="Article opens" />
            <StatCard
              label="Unique readers"
              value={formatNumber(stats.uniqueReaders)}
              hint="First-time readers in range"
            />
            <StatCard
              label="Downloads"
              value={formatNumber(stats.downloads)}
              hint="File attachments"
            />
            <StatCard
              label="Avg. read time"
              value={formatReadTime(stats.avgReadMs)}
              hint="Time on article"
            />
          </div>

          {stats.views > 0 ? (
            <ViewsChart data={stats.daily} height={280} />
          ) : (
            <p className={styles.empty}>
              No views in this period yet. Analytics appear as soon as readers open this article.
            </p>
          )}
        </>
      )}
    </div>
  );
}
