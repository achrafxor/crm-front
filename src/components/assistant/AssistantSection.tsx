import React from 'react';
import { Box, Paper, Typography, Avatar, Button, Stack, IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import SnoozeIcon from '@mui/icons-material/Snooze';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type TaskStatus = 'OVERDUE' | 'TODAY' | 'UPCOMING';

export type AssistantTask = {
  id: string;
  title: string;
  clientName: string;
  propertyRef?: string;
  dueDate: string; // ISO
  assignee?: string;
  status: TaskStatus;
};

const formatDue = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const TaskCard: React.FC<{ task: AssistantTask; onDone?: (id: string) => void; onReschedule?: (id: string) => void; onNext?: (id: string) => void }> = ({ task, onDone, onReschedule, onNext }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 1,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        maxHeight: 72,
        overflow: 'hidden',
      }}
    >
      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
        {task.clientName ? task.clientName.charAt(0).toUpperCase() : '?'}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} noWrap>
          {task.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {task.clientName} {task.propertyRef ? `• ${task.propertyRef}` : ''} — {formatDue(task.dueDate)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton size="small" color="primary" onClick={() => onDone?.(task.id)} aria-label="done">
          <CallIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="inherit" onClick={() => onReschedule?.(task.id)} aria-label="reschedule">
          <SnoozeIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onNext?.(task.id)} aria-label="next">
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export const AssistantSection: React.FC<{
  tasks?: AssistantTask[];
  onDone?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onNext?: (id: string) => void;
}> = ({ tasks = [], onDone, onReschedule, onNext }) => {
  const overdue = tasks.filter(t => t.status === 'OVERDUE');
  const today = tasks.filter(t => t.status === 'TODAY');
  const upcoming = tasks.filter(t => t.status === 'UPCOMING');

  const Section = ({ title, items, color }: { title: string; items: AssistantTask[]; color?: string }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: color || 'text.primary' }}>
        {title} <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>({items.length})</Typography>
      </Typography>
      <Box>
        {items.length === 0 ? (
          <Paper elevation={0} sx={{ p: 1, color: 'text.secondary' }}>
            No tasks
          </Paper>
        ) : (
          items.map(i => <TaskCard key={i.id} task={i} onDone={onDone} onReschedule={onReschedule} onNext={onNext} />)
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assistant — Daily Focus
      </Typography>

      <Section title="Overdue" items={overdue} color="error.main" />
      <Section title="Today" items={today} color="primary.main" />
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Upcoming <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>({upcoming.length})</Typography>
        </Typography>
        <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
          {upcoming.length === 0 ? (
            <Paper elevation={0} sx={{ p: 1, color: 'text.secondary' }}>No upcoming tasks</Paper>
          ) : (
            upcoming.map(i => <TaskCard key={i.id} task={i} onDone={onDone} onReschedule={onReschedule} onNext={onNext} />)
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={() => alert('Start my day: focus top tasks')}>
          Start my day
        </Button>
        <Button variant="outlined" onClick={() => alert('Quick add task')}>
          Quick add
        </Button>
      </Box>
    </Box>
  );
};

export default AssistantSection;
