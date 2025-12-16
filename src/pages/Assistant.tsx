import React from 'react';
import AssistantSection, { type AssistantTask } from '../components/assistant/AssistantSection';

const sampleTasks: AssistantTask[] = [
  {
    id: 't1',
    title: 'Intro call',
    clientName: 'Jean Dupont',
    propertyRef: 'REF-123',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    assignee: 'Me',
    status: 'OVERDUE',
  },
  {
    id: 't2',
    title: 'Schedule visit',
    clientName: 'Marie Martin',
    propertyRef: 'REF-456',
    dueDate: new Date().toISOString(),
    assignee: 'Me',
    status: 'TODAY',
  },
  {
    id: 't3',
    title: 'Confirm mandate renewal',
    clientName: 'Sarl Agency',
    propertyRef: 'REF-789',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    assignee: 'Me',
    status: 'UPCOMING',
  },
];

const AssistantPage: React.FC = () => {
  const handleDone = (id: string) => {
    alert(`Marked done: ${id}`);
  };
  const handleReschedule = (id: string) => {
    alert(`Reschedule: ${id}`);
  };
  const handleNext = (id: string) => {
    alert(`Show next actions for: ${id}`);
  };

  return <AssistantSection tasks={sampleTasks} onDone={handleDone} onReschedule={handleReschedule} onNext={handleNext} />;
};

export default AssistantPage;
