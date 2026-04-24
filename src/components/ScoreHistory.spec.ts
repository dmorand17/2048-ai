import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { LeaderboardEntry } from '../types/leaderboard';
import ScoreHistory from './ScoreHistory.vue';

const entries: LeaderboardEntry[] = [
  { score: 5000, date: '2026-01-15T10:00:00.000Z' },
  { score: 3200, date: '2026-01-10T08:30:00.000Z' },
  { score: 1100, date: '2026-01-05T14:00:00.000Z' },
];

describe('ScoreHistory', () => {
  it('renders a row for each entry', () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(3);
  });

  it('displays scores with rank numbers', () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    const rows = wrapper.findAll('tbody tr');
    expect(rows[0].find('.col-rank').text()).toBe('1');
    expect(rows[1].find('.col-rank').text()).toBe('2');
    expect(rows[2].find('.col-rank').text()).toBe('3');
  });

  it('formats score with locale number formatting', () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    const firstScore = wrapper.findAll('tbody tr')[0].find('.col-score').text();
    expect(firstScore).toBe((5000).toLocaleString());
  });

  it('applies top-entry class only to the first row', () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    const rows = wrapper.findAll('tbody tr');
    expect(rows[0].classes()).toContain('top-entry');
    expect(rows[1].classes()).not.toContain('top-entry');
    expect(rows[2].classes()).not.toContain('top-entry');
  });

  it('shows empty state message when there are no entries', () => {
    const wrapper = mount(ScoreHistory, { props: { entries: [] } });
    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('table').exists()).toBe(false);
  });

  it('hides the clear button when entries list is empty', () => {
    const wrapper = mount(ScoreHistory, { props: { entries: [] } });
    expect(wrapper.find('.clear-btn').exists()).toBe(false);
  });

  it('shows the clear button when entries exist', () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    expect(wrapper.find('.clear-btn').exists()).toBe(true);
  });

  it('emits clear event when clear button is clicked', async () => {
    const wrapper = mount(ScoreHistory, { props: { entries } });
    await wrapper.find('.clear-btn').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });
});
