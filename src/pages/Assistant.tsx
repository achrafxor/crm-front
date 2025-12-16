import { Typography, Box, Paper, Avatar, Chip, Button, IconButton } from '@mui/material';
import { CheckCircle, Schedule, Warning, MoreVert, PlayArrow } from '@mui/icons-material';

interface AssistantTask {
    id: string;
    title: string;
    clientName: string;
    propertyRef: string;
    dueDate: string;
    assignee: string;
    status: 'OVERDUE' | 'TODAY' | 'UPCOMING';
}

const sampleTasks: AssistantTask[] = [
    {
        id: 't1',
        title: 'Appel découverte',
        clientName: 'Jean Dupont',
        propertyRef: 'REF-123',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        assignee: 'Moi',
        status: 'OVERDUE',
    },
    {
        id: 't2',
        title: 'Planifier visite',
        clientName: 'Marie Martin',
        propertyRef: 'REF-456',
        dueDate: new Date().toISOString(),
        assignee: 'Moi',
        status: 'TODAY',
    },
    {
        id: 't3',
        title: 'Confirmer renouvellement mandat',
        clientName: 'Sarl Agency',
        propertyRef: 'REF-789',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        assignee: 'Moi',
        status: 'UPCOMING',
    },
];

const statusConfig = {
    OVERDUE: { label: 'En retard', color: '#ef4444', bgColor: '#fef2f2', icon: Warning },
    TODAY: { label: "Aujourd'hui", color: '#f59e0b', bgColor: '#fffbeb', icon: Schedule },
    UPCOMING: { label: 'À venir', color: '#3b82f6', bgColor: '#eff6ff', icon: PlayArrow },
};

const TaskCard = ({ task, onDone, onReschedule }: { task: AssistantTask; onDone: () => void; onReschedule: () => void }) => {
    const config = statusConfig[task.status];
    const StatusIcon = config.icon;

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                mb: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: config.bgColor,
                            color: config.color,
                            width: 40,
                            height: 40,
                        }}
                    >
                        <StatusIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9375rem' }}>
                            {task.title}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                            {task.clientName} - {task.propertyRef}
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={config.label}
                    size="small"
                    sx={{
                        bgcolor: config.bgColor,
                        color: config.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                    })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onReschedule}
                        sx={{
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                            '&:hover': {
                                borderColor: '#cbd5e1',
                                bgcolor: '#f8fafc',
                            },
                        }}
                    >
                        Reporter
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircle sx={{ fontSize: 14 }} />}
                        onClick={onDone}
                        sx={{
                            bgcolor: '#10b981',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#059669',
                            },
                        }}
                    >
                        Terminé
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

const AssistantPage = () => {
    const handleDone = (id: string) => {
        alert(`Tâche terminée: ${id}`);
    };

    const handleReschedule = (id: string) => {
        alert(`Reporter la tâche: ${id}`);
    };

    const overdueCount = sampleTasks.filter(t => t.status === 'OVERDUE').length;
    const todayCount = sampleTasks.filter(t => t.status === 'TODAY').length;
    const upcomingCount = sampleTasks.filter(t => t.status === 'UPCOMING').length;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                    }}
                >
                    Assistant
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Vos tâches et actions à effectuer
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Paper
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444' }}>
                        <Warning />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.5rem' }}>
                            {overdueCount}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>En retard</Typography>
                    </Box>
                </Paper>
                <Paper
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Avatar sx={{ bgcolor: '#fffbeb', color: '#f59e0b' }}>
                        <Schedule />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.5rem' }}>
                            {todayCount}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>Aujourd'hui</Typography>
                    </Box>
                </Paper>
                <Paper
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>
                        <PlayArrow />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.5rem' }}>
                            {upcomingCount}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>À venir</Typography>
                    </Box>
                </Paper>
            </Box>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                    Tâches Prioritaires
                </Typography>

                {sampleTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDone={() => handleDone(task.id)}
                        onReschedule={() => handleReschedule(task.id)}
                    />
                ))}
            </Paper>
        </Box>
    );
};

export default AssistantPage;
