'use client';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import Tasks from '@/components/modules/Tasks';
import Habits from '@/components/modules/Habits';
import Calendar from '@/components/modules/Calendar';
import Goals from '@/components/modules/Goals';
import Notes from '@/components/modules/Notes';
import Focus from '@/components/modules/Focus';
import Stats from '@/components/modules/Stats';
import Settings from '@/components/modules/Settings';

const M: Record<string, ComponentType> = { tasks: Tasks, habits: Habits, calendar: Calendar, goals: Goals, notes: Notes, focus: Focus, stats: Stats, settings: Settings };
export default function Page({ params }: { params: { module: string } }) {
  const C = M[params.module]; if (!C) return notFound(); return <C />;
}
