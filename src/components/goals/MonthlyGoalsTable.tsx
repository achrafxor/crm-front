import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';
import type { MonthlyGoal } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
    goals: MonthlyGoal[];
}

const MonthlyGoalsTable = ({ goals }: Props) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Monthly Roadmap
            </Typography>
            <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            <TableCell>Month</TableCell>
                            <TableCell align="right">Contacts</TableCell>
                            <TableCell align="right">Prospects</TableCell>
                            <TableCell align="right">Mandates</TableCell>
                            <TableCell align="right">Requests</TableCell>
                            <TableCell align="right">Active</TableCell>
                            <TableCell align="right">Offers</TableCell>
                            <TableCell align="right">Accepted</TableCell>
                            <TableCell align="right">Transac.</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {goals.map((goal) => (
                            <TableRow key={goal.month} hover>
                                <TableCell component="th" scope="row">
                                    {MONTHS[goal.month - 1]}
                                </TableCell>
                                <TableCell align="right">{goal.contacts}</TableCell>
                                <TableCell align="right">{goal.prospects}</TableCell>
                                <TableCell align="right">{goal.newMandates}</TableCell>
                                <TableCell align="right">{goal.newBuyerRequests}</TableCell>
                                <TableCell align="right">{goal.activeProperties}</TableCell>
                                <TableCell align="right">{goal.offers}</TableCell>
                                <TableCell align="right">{goal.acceptedOffers}</TableCell>
                                <TableCell align="right">{goal.transactions}</TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(goal.revenue)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MonthlyGoalsTable;
