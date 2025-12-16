import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    Alert,
    Stack
} from '@mui/material';
import type { SeniorityLevel } from '../types';
import { suggestSeniority, generateMonthlyGoals } from '../services/goalsService';
import { useGoals } from '../context/GoalsContext';
import { useNavigate } from 'react-router-dom';

const SENIORITY_LEVELS: SeniorityLevel[] = [
    'Débutant', 'Junior', 'Confirmé', 'Senior', 'Leader', 'Expert'
];

const GoalSetup = () => {
    const { setGoal } = useGoals();
    const navigate = useNavigate();

    const [year, setYear] = useState(new Date().getFullYear() + 1);
    const [revenue, setRevenue] = useState<string>('');
    const [seniority, setSeniority] = useState<SeniorityLevel>('Débutant');
    const [suggested, setSuggested] = useState<SeniorityLevel | null>(null);

    useEffect(() => {
        const revVal = parseFloat(revenue);
        if (!isNaN(revVal) && revVal > 0) {
            const suggestion = suggestSeniority(revVal);
            setSuggested(suggestion);
            // Auto-select seniority if not manually changed? 
            // For now just show suggestion or auto-select if user hasn't intereacted?
            // Let's just update the local state if it's the first time or simply suggest.
            setSeniority(suggestion);
        }
    }, [revenue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const revVal = parseFloat(revenue);
        if (!year || isNaN(revVal) || revVal <= 0) return;

        const newGoal = generateMonthlyGoals(year, revVal, seniority);
        setGoal(newGoal);
        navigate('/goals'); // Redirect to dashboard view
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Setup Annual Goals
                </Typography>
                <Typography color="text.secondary" paragraph>
                    Define your targets for the upcoming year to generate your monthly roadmap.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Target Year"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Annual Revenue Target (TND/EUR)"
                            type="number"
                            value={revenue}
                            onChange={(e) => setRevenue(e.target.value)}
                            fullWidth
                            required
                            helperText={suggested ? `Suggested Level: ${suggested}` : 'Enter revenue to see suggestion'}
                        />

                        <TextField
                            select
                            label="Seniority Level"
                            value={seniority}
                            onChange={(e) => setSeniority(e.target.value as SeniorityLevel)}
                            fullWidth
                            required
                        >
                            {SENIORITY_LEVELS.map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </TextField>

                        {suggested && suggested !== seniority && (
                            <Alert severity="info">
                                Based on your revenue, we recommend <strong>{suggested}</strong> level.
                            </Alert>
                        )}

                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Generate Goals
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default GoalSetup;
